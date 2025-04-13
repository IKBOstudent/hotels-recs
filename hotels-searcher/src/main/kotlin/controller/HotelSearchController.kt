package controller

import dto.HotelsSearchReq
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import service.HotelSearchService

@RestController
@RequestMapping("/api/hotels")
class HotelSearchController(
    private val searchService: HotelSearchService,
) {
    @PostMapping("/search")
    fun searchHotels(
        @Valid @RequestBody request: HotelsSearchReq,
    ) {}
}
