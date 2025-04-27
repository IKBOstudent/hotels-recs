package com.hotels.searcher.controller

import com.hotels.searcher.dto.HotelsSearchReq
import com.hotels.searcher.service.HotelSearchService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/hotels")
class HotelSearchController(
    private val searchService: HotelSearchService,
) {
    @PostMapping("/search")
    fun searchHotels(
        @Valid @RequestBody request: HotelsSearchReq,
    ) = searchService.searchHotels(request)
}
