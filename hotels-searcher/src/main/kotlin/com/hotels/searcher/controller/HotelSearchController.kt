package com.hotels.searcher.controller

import com.hotels.searcher.dto.HotelsSearchReq
import com.hotels.searcher.dto.HotelsSearchRsp
import com.hotels.searcher.service.HotelSearchService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class HotelSearchController(
    private val searchService: HotelSearchService,
) {
    @PostMapping("/search")
    fun searchHotels(
        @RequestHeader(name = "X-User-Id", required = false) uid: String?,
        @Valid @RequestBody request: HotelsSearchReq,
    ): HotelsSearchRsp {
        println("uid: $uid")
        return searchService.searchHotels(request, uid)
    }
}
