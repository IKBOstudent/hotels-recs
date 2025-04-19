package com.hotels.api.model

class AuthRequest {
    data class SignUp(
        val email: String,
        val password: String,
        val displayName: String? = null,
    )

    data class SignIn(
        val email: String,
        val password: String,
    )
}
