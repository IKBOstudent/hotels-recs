package com.hotels.searcher.model

import java.time.LocalDate

data class Offer(
    val hotel: Hotel,
    val price: Int?,
    val nights: Int,
    val checkInDate: LocalDate,
    val checkOutDate: LocalDate,
)
