package com.hotels.searcher.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("redis")
data class RedisProperties(
    val host: String = "",
    val port: Int = 6379,
)
