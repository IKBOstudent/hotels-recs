package com.hotels.searcher.config

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

@ConfigurationProperties("opensearch")
data class OpenSearchProperties(
    var host: String?,
    val port: Int = 9200,
    var username: String? = null,
    var password: String? = null,
    var connectionTimeout: Duration = Duration.ofSeconds(30),
    var socketTimeout: Duration = Duration.ofSeconds(30),
    var socketKeepAlive: Boolean = false,
)
