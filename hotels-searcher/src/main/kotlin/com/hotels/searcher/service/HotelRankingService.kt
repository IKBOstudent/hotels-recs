package com.hotels.searcher.service

import com.hotels.searcher.model.Hotel
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@Service
class HotelRankingService(
    private val redisTemplate: StringRedisTemplate,
) {
    private val weights =
        mapOf(
            "relevance" to 0.6,
            "popularity" to 0.2,
            "userPreference" to 0.2,
        )

    fun rerankResults(
        hotels: List<Hotel>,
        uid: String?,
    ): List<Hotel> =
        hotels
            .map { hotel ->
                val popularityScore = calculatePopularityScore(hotel.id.toString())
                val userPreferenceScore = calculateUserPreferenceScore(hotel.id.toString(), uid)

                val combinedScore =
                    (0.7 * hotel.relevance) +
                        (0.1 * popularityScore) +
                        (0.2 * userPreferenceScore)

                hotel.relevance = combinedScore
                hotel
            }.sortedByDescending { it.relevance }

    private fun calculatePopularityScore(hotelId: String): Double {
        val clicks = redisTemplate.opsForValue().get("hotel:$hotelId:clicks")?.toDoubleOrNull() ?: 0.0
        val likes = redisTemplate.opsForValue().get("hotel:$hotelId:likes")?.toDoubleOrNull() ?: 0.0
        val longViews = redisTemplate.opsForValue().get("hotel:$hotelId:long_views")?.toDoubleOrNull() ?: 0.0

        val trendingScore = redisTemplate.opsForZSet().score("trending:hotels", hotelId) ?: 0.0

        return normalizeScore((clicks * 1.0 + likes * 2.0 + longViews * 1.5 + trendingScore * 3.0) / 7.5)
    }

    private fun calculateUserPreferenceScore(
        hotelId: String,
        uid: String?,
    ): Double {
        if (uid == null) return 0.5

        val preferenceScore = redisTemplate.opsForZSet().score("user:$uid:preferences", hotelId) ?: 0.0
        return normalizeScore(preferenceScore)
    }

    private fun normalizeScore(score: Double): Double = minOf(1.0, score / 10.0)
}
