package com.hotels.searcher.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.hotels.searcher.model.UserEvent
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Service

@Service
class UserMetricsStreamService(
    private val redisTemplate: StringRedisTemplate,
) {
    private val objectMapper = ObjectMapper()

    fun recordEvent(event: UserEvent) {
        val streamKey = "metrics:events"

        val eventMap =
            mapOf(
                "eventType" to event.eventType,
                "itemId" to event.itemId,
                "timestamp" to event.timestamp,
                "uid" to event.uid,
                "metadata" to objectMapper.writeValueAsString(event.metadata),
            )

        redisTemplate
            .opsForStream<String, Any>()
            .add(streamKey, eventMap)

        redisTemplate
            .opsForStream<String, Any>()
            .trim(streamKey, 10000)
    }

    fun recordEvents(events: List<UserEvent>) {
        events.forEach { recordEvent(it) }
    }
}
