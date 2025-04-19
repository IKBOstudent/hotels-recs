package com.hotels.api.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("firebase")
data class FirebaseProperties(
    val credentialsPath: String,
)
