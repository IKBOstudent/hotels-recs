package com.hotels.searcher.dto

import jakarta.validation.constraints.FutureOrPresent
import jakarta.validation.constraints.Min
import java.time.LocalDate

data class HotelsSearchReq(
    @field:FutureOrPresent
    val checkInDate: LocalDate = LocalDate.now().plusDays(1),
    @field:FutureOrPresent
    val checkOutDate: LocalDate = LocalDate.now().plusDays(2),
    val queryString: String = "",
    val skipHotels: List<Long> = emptyList(),
    @field:Min(1)
    val limit: Int = 10,
)
