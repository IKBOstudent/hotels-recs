package dto

import jakarta.validation.constraints.FutureOrPresent
import jakarta.validation.constraints.Min
import java.time.LocalDate

data class HotelsSearchReq(
    @field:FutureOrPresent
    val checkInDate: LocalDate,
    @field:FutureOrPresent
    val checkOutDate: LocalDate,
    val queryString: String = "",
    @field:Min(0)
    val skip: Int = 0,
    @field:Min(1)
    val limit: Int = 10,
)
