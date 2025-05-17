package com.hotels.searcher.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.hotels.searcher.model.Hotel
import com.hotels.searcher.model.UserEvent
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.opensearch._types.query_dsl.KnnQuery
import org.opensearch.client.opensearch._types.query_dsl.Query
import org.opensearch.client.opensearch._types.query_dsl.QueryBuilders
import org.opensearch.client.opensearch.core.GetRequest
import org.opensearch.client.opensearch.core.SearchRequest
import org.springframework.data.redis.connection.stream.ReadOffset
import org.springframework.data.redis.connection.stream.StreamOffset
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@Service
class CollaborativeFilteringService(
    private val openSearchClient: OpenSearchClient,
    private val redisTemplate: StringRedisTemplate
) {
    private val objectMapper = ObjectMapper()

    fun updateUserVector(userId: String) {
        val userInteractions = getUserRecentInteractions(userId)
        val preferenceVector = calculateUserPreferenceVector(userInteractions)
    }

    fun getPersonalizedRecommendations(uid: String, limit: Int = 10): List<Hotel> {
        val userVector = getUserPreferenceVector(uid)

        return findSimilarHotels(userVector, limit)
    }

    fun getSimilarHotels(hotelId: String, limit: Int = 5): List<Hotel> {
        val hotelVector = getHotelFeatureVector(hotelId) ?: return emptyList()

        return findSimilarHotels(hotelVector, limit)
    }

    private fun getUserRecentInteractions(uid: String): List<UserEvent> {
        val streamKey = "metrics:events"
        val userKey = "uid"

        val events = mutableListOf<UserEvent>()

        val messages = redisTemplate.opsForStream<Any, Any>()
            .read(
                StreamOffset.create(streamKey, ReadOffset.from("0"))
            )
            .filter { msg ->
                val values = msg.value as Map<Any, Any>
                values[userKey] == uid
            }
            .take(100)

        messages.forEach { message ->
            val values = message.value as Map<Any, Any>

            val event = UserEvent(
                eventType = values["eventType"] as String,
                itemId = values["itemId"] as String,
                timestamp = values["timestamp"] as String,
                uid = values["uid"] as String,
                metadata = objectMapper.readValue(
                    values["metadata"] as String,
                    object : TypeReference<Map<String, Any>>() {}
                )
            )

            events.add(event)
        }

        return events
    }

    private fun calculateUserPreferenceVector(interactions: List<UserEvent>): FloatArray {
        val vectorSize = 128
        val resultVector = FloatArray(vectorSize) { 0f }
        var totalWeight = 0f

        interactions.forEach { event ->
            val hotelId = event.itemId
            val vector = getHotelFeatureVector(hotelId) ?: return@forEach

            val weight = when (event.eventType) {
                "hotel_click" -> 1.0f
                "hotel_like" -> 2.0f
                "hotel_booking" -> 5.0f
                "hotel_view_duration" -> {
                    val duration = (event.metadata["duration"] as? Number)?.toFloat() ?: 0f
                    if (duration > 30) 1.5f else 0.5f
                }
                else -> 0.5f
            }

            for (i in vector.indices) {
                resultVector[i] += vector[i] * weight
            }

            totalWeight += weight
        }

        if (totalWeight > 0) {
            for (i in resultVector.indices) {
                resultVector[i] /= totalWeight
            }
        }

        return resultVector
    }

    private fun getHotelFeatureVector(hotelId: String): FloatArray? {
        try {
            val getRequest = GetRequest.Builder().id(hotelId).index("hotels").build()
            val response = openSearchClient.get(getRequest, Hotel::class.java)
            return response.source()?.vector
        } catch (e: Exception) {
            return null
        }
    }

    private fun findSimilarHotels(vector: FloatArray, limit: Int): List<Hotel> {
        val knnQuery = KnnQuery.Builder().field("hotel_vector").vector(vector).k(limit).build()
        val searchRequest = SearchRequest.Builder().index("hotels").query(Query.of { q -> q.knn(knnQuery).build() }).build()
        val response = openSearchClient.search(searchRequest, Hotel::class.java)
        return response.hits().hits().map { it.source()!! }
    }
}
