package com.hotels.api.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain

@Configuration
@EnableWebFluxSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(
        http: ServerHttpSecurity,
        firebaseAuthFilter: FirebaseAuthFilter,
    ): SecurityWebFilterChain {
        http
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .csrf { it.disable() }
            .authorizeExchange { exchanges ->
                exchanges
                    .anyExchange()
                    .permitAll()
            }.addFilterAt(firebaseAuthFilter, SecurityWebFiltersOrder.AUTHENTICATION)

        return http.build()
    }
}
