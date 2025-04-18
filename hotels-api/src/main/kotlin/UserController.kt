package org.example

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class UserController {
    @GetMapping("/user")
    fun getUserInfo(request: HttpServletRequest): ResponseEntity<Map<String, Any>> {
        val firebaseToken =
            request.getAttribute("firebaseToken") as? FirebaseToken
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val userData =
            mapOf(
                "uid" to firebaseToken.uid,
                "email" to (firebaseToken.email ?: ""),
                "name" to (firebaseToken.name ?: ""),
                "isEmailVerified" to firebaseToken.isEmailVerified,
                "claims" to firebaseToken.claims,
            )

        return ResponseEntity.ok(userData)
    }
}
