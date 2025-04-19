package com.hotels.api.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.FileInputStream
import java.io.IOException

@Configuration
@EnableConfigurationProperties(FirebaseProperties::class)
class FirebaseConfig(
    val properties: FirebaseProperties,
) {
    @Bean
    fun firebaseAuth(): FirebaseAuth {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseAuth.getInstance()
        }

        if (properties.credentialsPath.isEmpty()) {
            return FirebaseAuth.getInstance()
        }

        try {
            val credentials = GoogleCredentials.fromStream(FileInputStream(properties.credentialsPath))

            val options =
                FirebaseOptions
                    .builder()
                    .setCredentials(credentials)
                    .build()

            FirebaseApp.initializeApp(options)
        } catch (e: IOException) {
            throw IllegalArgumentException("Could not read Firebase credentials file: ${properties.credentialsPath}", e)
        }

        return FirebaseAuth.getInstance()
    }
}
