package com.hotels.api.serivce

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthException
import com.google.firebase.auth.UserRecord
import com.hotels.api.model.AuthRequest
import com.hotels.api.model.AuthResponse
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class AuthService(
    private val firebaseAuth: FirebaseAuth,
) {
    fun signUp(request: AuthRequest.SignUp): AuthResponse {
        try {
            val createRequest =
                UserRecord
                    .CreateRequest()
                    .setEmail(request.email)
                    .setPassword(request.password)
                    .setDisplayName(request.displayName ?: request.email)
                    .setEmailVerified(false)
                    .setDisabled(false)

            val userRecord = firebaseAuth.createUser(createRequest)
            val customToken = firebaseAuth.createCustomToken(userRecord.uid)

            return AuthResponse(
                token = customToken,
                userId = userRecord.uid,
                email = userRecord.email,
                displayName = userRecord.displayName,
            )
        } catch (e: FirebaseAuthException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating user: ${e.message}")
        }
    }

    fun signIn(request: AuthRequest.SignIn): AuthResponse {
        try {
            // https://firebase.google.com/docs/reference/rest/auth

            val user = firebaseAuth.getUserByEmail(request.email)
            val customToken = firebaseAuth.createCustomToken(user.uid)

            return AuthResponse(
                token = customToken,
                userId = user.uid,
                email = user.email,
                displayName = user.displayName,
            )
        } catch (e: FirebaseAuthException) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")
        }
    }

    fun verifyToken(token: String): String {
        try {
            val decodedToken = firebaseAuth.verifyIdToken(token)
            return decodedToken.uid
        } catch (e: FirebaseAuthException) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token")
        }
    }
}
