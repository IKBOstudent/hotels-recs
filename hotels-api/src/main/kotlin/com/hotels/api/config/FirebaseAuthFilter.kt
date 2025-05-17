package com.hotels.api.config

import com.google.firebase.auth.FirebaseAuth
import org.apache.http.HttpHeaders
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import reactor.core.scheduler.Schedulers

@Component
class FirebaseAuthFilter(
    private val firebaseAuth: FirebaseAuth,
) : AuthenticationWebFilter(DummyAuthenticationManager()) {
    companion object {
        const val ROLE_USER = "ROLE_USER"
    }

    init {
        setServerAuthenticationConverter { exchange ->
            val token = extractToken(exchange.request)

            if (token.isNullOrEmpty()) {
                return@setServerAuthenticationConverter Mono.empty()
            }

            Mono
                .fromCallable<Authentication> {
                    try {
                        val firebaseToken = firebaseAuth.verifyIdToken(token)
                        val uid = firebaseToken.uid

                        val authorities = listOf(SimpleGrantedAuthority(ROLE_USER))
                        val principal = UserDetails(uid, authorities)

                        UsernamePasswordAuthenticationToken(principal, token, authorities)
                    } catch (e: Exception) {
                        throw BadCredentialsException("Invalid Firebase token", e)
                    }
                }.subscribeOn(Schedulers.boundedElastic())
        }
    }

    private fun extractToken(request: ServerHttpRequest): String? {
        val authHeader = request.headers.getFirst(HttpHeaders.AUTHORIZATION) ?: return null

        return if (authHeader.startsWith("Bearer ")) {
            authHeader.substring(7)
        } else {
            null
        }
    }

    class UserDetails(
        val uid: String,
        private val authorities: Collection<GrantedAuthority>,
    ) : Authentication {
        override fun getName(): String = uid

        override fun getAuthorities(): Collection<GrantedAuthority> = authorities

        override fun getCredentials(): Any? = null

        override fun getDetails(): Any? = null

        override fun getPrincipal(): Any = this

        override fun isAuthenticated(): Boolean = true

        override fun setAuthenticated(isAuthenticated: Boolean): Unit =
            throw UnsupportedOperationException("Cannot change authentication status")
    }

    class DummyAuthenticationManager : ReactiveAuthenticationManager {
        override fun authenticate(authentication: Authentication): Mono<Authentication> = Mono.just(authentication)
    }
}
