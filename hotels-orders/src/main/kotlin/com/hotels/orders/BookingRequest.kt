package com.hotels.orders

import java.time.LocalDate

data class BookingRequest(
    val userId: Long,
    val hotelId: Long,
    val checkInDate: LocalDate,
    val checkOutDate: LocalDate
)