package com.hotels.orders.model

import jakarta.validation.constraints.FutureOrPresent
import java.time.LocalDate

data class BookingRequest(
    val userId: Long,
    val hotelId: Long,
    @field:FutureOrPresent
    val checkInDate: LocalDate,
    @field:FutureOrPresent
    val checkOutDate: LocalDate,
)
