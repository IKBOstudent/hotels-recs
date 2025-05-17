package com.hotels.api.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("microservice")
class ProxyProperties(
    val hotelsOrdersUrl: String,
    val hotelsSearcherUrl: String,
)
