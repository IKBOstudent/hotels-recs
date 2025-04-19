package com.hotels.orders.model

import java.time.LocalDate
import java.time.LocalDateTime

data class BookingResponse(
    val id: Long,
    val userId: Long,
    val hotelId: Long,
    val checkInDate: LocalDate,
    val checkOutDate: LocalDate,
    val status: Booking.Status,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
)
