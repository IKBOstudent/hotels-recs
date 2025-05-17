package com.hotels.searcher.controller

import com.hotels.searcher.model.UserEvent
import com.hotels.searcher.service.UserMetricsStreamService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/metrics")
class UserMetricsController(
    private val metricsService: UserMetricsStreamService,
) {
    @PostMapping("/events")
    fun recordEvents(
        @RequestBody events: List<UserEvent>,
    ) {
        metricsService.recordEvents(events)
    }
}
