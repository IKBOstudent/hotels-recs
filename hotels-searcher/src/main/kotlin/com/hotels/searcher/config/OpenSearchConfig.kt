package com.hotels.searcher.config

import org.apache.http.HttpHost
import org.apache.http.auth.AuthScope
import org.apache.http.auth.UsernamePasswordCredentials
import org.apache.http.impl.client.BasicCredentialsProvider
import org.apache.http.ssl.SSLContextBuilder
import org.opensearch.client.RestClient
import org.opensearch.client.json.jackson.JacksonJsonpMapper
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.transport.rest_client.RestClientTransport
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties(OpenSearchProperties::class)
class OpenSearchConfig {
    @Bean
    fun openSearchClient(properties: OpenSearchProperties): OpenSearchClient {
        val host = HttpHost(properties.host, properties.port, "https")
        val credentialsProvider = BasicCredentialsProvider()
        credentialsProvider.setCredentials(AuthScope(host), UsernamePasswordCredentials("admin", "admin"))

        val sslContext =
            SSLContextBuilder
                .create()
                .loadTrustMaterial(null) { _, _ -> true }
                .build()

        val restClient =
            RestClient
                .builder(host)
                .setHttpClientConfigCallback { clientConfigBuilder ->
                    clientConfigBuilder
                        .setDefaultCredentialsProvider(credentialsProvider)
                        .setSSLContext(sslContext)
                        .setSSLHostnameVerifier { _, _ -> true }
                }.setRequestConfigCallback { requestConfigBuilder ->
                    requestConfigBuilder
                        .setConnectTimeout(properties.connectionTimeout.toMillis().toInt())
                        .setSocketTimeout(properties.socketTimeout.toMillis().toInt())
                }.build()
        val transport = RestClientTransport(restClient, JacksonJsonpMapper())
        return OpenSearchClient(transport)
    }
}
