package config

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

@ConfigurationProperties("opensearch")
data class OpenSearchProperties(
    var uri: String = "http://opensearch-node:9200",
    var username: String? = null,
    var password: String? = null,
    var connectionTimeout: Duration = Duration.ofSeconds(1),
    var socketTimeout: Duration = Duration.ofSeconds(30),
    var socketKeepAlive: Boolean = false,
)
