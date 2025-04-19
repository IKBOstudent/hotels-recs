package com.hotels.orders.model

data class PaymentRequest(
    val cardNumber: String,
    val cardholderName: String,
    val expirationMonth: Int,
    val expirationYear: Int,
    val cvv: String,
)
