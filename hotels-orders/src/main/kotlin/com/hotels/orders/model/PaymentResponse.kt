package com.hotels.orders.model

import java.time.LocalDateTime

data class PaymentResponse(
    val bookingId: Long,
    val amount: Long,
    val currency: String = "USD",
    val paymentId: String,
    val status: String,
    val timestamp: LocalDateTime = LocalDateTime.now(),
)
