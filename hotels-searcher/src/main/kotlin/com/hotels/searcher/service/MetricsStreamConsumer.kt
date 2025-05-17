package com.hotels.searcher.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.annotation.PostConstruct
import org.springframework.data.redis.connection.stream.Consumer
import org.springframework.data.redis.connection.stream.MapRecord
import org.springframework.data.redis.connection.stream.ReadOffset
import org.springframework.data.redis.connection.stream.StreamOffset
import org.springframework.data.redis.connection.stream.StreamReadOptions
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Component
import java.time.Duration
import java.util.UUID

@Component
class MetricsStreamConsumer(
    private val redisTemplate: StringRedisTemplate,
) {
    private val objectMapper = ObjectMapper()
    private val streamKey = "metrics:events"
    private val consumerGroup = "metrics-processors"
    private val consumerName = "metrics-processor-${UUID.randomUUID()}"

    @PostConstruct
    fun init() {
        try {
            redisTemplate.opsForStream<String, Any>()
                .createGroup(streamKey, consumerGroup)
        } catch (_: Exception) {
            println("stream already exists")
        }
        Thread { processStreamEvents() }.start()
    }

    private fun processStreamEvents() {
        while (true) {
            try {
                val messages = redisTemplate.opsForStream<Any, Any>()
                    .read(
                        Consumer.from(consumerGroup, consumerName),
                        StreamReadOptions.empty().block(Duration.ofMillis(2000)),
                        StreamOffset.create(streamKey, ReadOffset.lastConsumed())
                    )

                if (messages != null) {
                    if (messages.isNotEmpty()) {
                        messages.forEach { message ->
                            processMessage(message)

                            redisTemplate.opsForStream<String, Any>()
                                .acknowledge(consumerGroup, message)
                        }
                    }
                }
            } catch (e: Exception) {

                println("Error processing stream: ${e.message}")
                Thread.sleep(1000)
            }
        }
    }

    private fun processMessage(message: MapRecord<String, Any, in Any>) {
        val values = message.value as Map<Any, Any>

        val eventType = values["eventType"] as String
        val itemId = values["itemId"] as String
        val uid = values["uid"] as String
        val metadata = objectMapper.readValue(
            values["metadata"] as String,
            object : TypeReference<Map<String, Any>>() {}
        )

        updateRankingFactors(eventType, itemId, uid, metadata)
        updateMetricCounters(eventType, itemId, uid)
    }

    private fun updateRankingFactors(eventType: String, itemId: String, uid: String, metadata: Map<String, Any>) {
        when (eventType) {
            "hotel_click" -> {
                redisTemplate.opsForValue().increment("hotel:$itemId:clicks")

                metadata["position"]?.let { position ->
                    redisTemplate.opsForValue().increment("hotel:$itemId:position:$position:clicks")
                }
                redisTemplate.opsForZSet().incrementScore("trending:hotels", itemId, 1.0)
            }
            "hotel_like" -> {
                redisTemplate.opsForValue().increment("hotel:$itemId:likes")
                redisTemplate.opsForZSet().incrementScore("trending:hotels", itemId, 2.0)
            }
            "hotel_view_duration" -> {
                metadata["duration"]?.let { duration ->
                    if ((duration as Number).toDouble() > 30.0) {
                        redisTemplate.opsForValue().increment("hotel:$itemId:long_views")
                        redisTemplate.opsForZSet().incrementScore("trending:hotels", itemId, 0.5)
                    }
                }
            }
        }

        redisTemplate.opsForZSet().incrementScore("user:$uid:preferences", itemId, 1.0)
    }

    private fun updateMetricCounters(eventType: String, itemId: String, userId: String) {
        redisTemplate.opsForValue().increment("count:$eventType")
        redisTemplate.opsForValue().increment("count:$eventType:$itemId")
        redisTemplate.opsForValue().increment("count:user:$userId:$eventType")
        redisTemplate.expire("trending:hotels", Duration.ofDays(7))
    }
}
