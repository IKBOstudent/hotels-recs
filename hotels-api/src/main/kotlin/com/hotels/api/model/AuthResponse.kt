package com.hotels.api.model

data class AuthResponse(
    val token: String,
    val userId: String,
    val email: String,
    val displayName: String?,
)
