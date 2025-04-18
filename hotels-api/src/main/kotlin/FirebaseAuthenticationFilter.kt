package org.example

import com.google.firebase.FirebaseApp
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class FirebaseAuthenticationFilter : OncePerRequestFilter() {
    private lateinit var firebaseApp: FirebaseApp

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val authorizationHeader = request.getHeader("Authorization")

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            val idToken = authorizationHeader.substring(7)
            try {
                // Верификация токена
                val decodedToken = FirebaseAuth.getInstance(firebaseApp).verifyIdToken(idToken)

                // Сохраняем информацию о пользователе в атрибутах запроса
                request.setAttribute("firebaseToken", decodedToken)
            } catch (e: Exception) {
                logger.error("Ошибка аутентификации Firebase", e)
            }
        }

        filterChain.doFilter(request, response)
    }
}
