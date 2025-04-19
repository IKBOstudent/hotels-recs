package com.hotels.api.controller

import com.hotels.api.model.AuthRequest
import com.hotels.api.model.AuthResponse
import com.hotels.api.serivce.AuthService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/signup")
    fun signUp(
        @RequestBody request: AuthRequest.SignUp,
    ): ResponseEntity<AuthResponse> {
        val response = authService.signUp(request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/signin")
    fun signIn(
        @RequestBody request: AuthRequest.SignIn,
    ): ResponseEntity<AuthResponse> {
        val response = authService.signIn(request)
        return ResponseEntity.ok(response)
    }
}
