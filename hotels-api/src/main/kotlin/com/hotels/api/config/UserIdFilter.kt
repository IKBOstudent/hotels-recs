package com.hotels.api.config

import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
class UserIdFilter : WebFilter {
    companion object {
        const val USER_ID_HEADER = "X-User-Id"
    }

    override fun filter(
        exchange: ServerWebExchange,
        chain: WebFilterChain,
    ): Mono<Void> =
        ReactiveSecurityContextHolder
            .getContext()
            .map { it.authentication }
            .filter { it != null && it.isAuthenticated }
            .cast(UsernamePasswordAuthenticationToken::class.java)
            .filter { it.principal is FirebaseAuthFilter.UserDetails }
            .map { it.principal as FirebaseAuthFilter.UserDetails }
            .flatMap { userDetails ->
//                val mutatedRequest =
//                    exchange.request
//                        .mutate()
//                        .header(USER_ID_HEADER, userDetails.uid)
//                        .build()

                print("aboba ${userDetails.uid}")

//                val mutatedExchange =
//                    exchange
//                        .mutate()
//                        .request(mutatedRequest)
//                        .build()

//                chain.filter(mutatedExchange)
                chain.filter(exchange)
            }.switchIfEmpty(chain.filter(exchange))
}
