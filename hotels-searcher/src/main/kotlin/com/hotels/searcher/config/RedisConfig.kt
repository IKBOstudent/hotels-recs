package com.hotels.searcher.config

import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.connection.RedisStandaloneConfiguration
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory
import org.springframework.data.redis.core.StringRedisTemplate

@Configuration
@EnableConfigurationProperties(RedisProperties::class)
class RedisConfig {
    @Bean
    fun redisConnectionFactory(properties: RedisProperties): RedisConnectionFactory {
        val redisStandaloneConfiguration = RedisStandaloneConfiguration(properties.host, properties.port)
        return LettuceConnectionFactory(redisStandaloneConfiguration)
    }

    @Bean
    fun redisTemplate(properties: RedisProperties): StringRedisTemplate = StringRedisTemplate(redisConnectionFactory(properties))
}
