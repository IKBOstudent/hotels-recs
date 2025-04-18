package com.hotels.orders

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/bookings")
class BookingController(private val bookingService: BookingService) {

    @PostMapping
    fun createBooking(@RequestBody request: BookingRequest): ResponseEntity<BookingResponse> {
        val booking = bookingService.createBooking(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(booking)
    }

    @PutMapping("/{id}/status")
    fun updateBookingStatus(
        @PathVariable id: Long,
        @RequestParam status: BookingStatus
    ): ResponseEntity<BookingResponse> {
        val booking = bookingService.updateBookingStatus(id, status)
        return ResponseEntity.ok(booking)
    }

    @GetMapping("/{id}")
    fun getBooking(@PathVariable id: Long): ResponseEntity<BookingResponse> {
        val booking = bookingService.getBooking(id)
        return ResponseEntity.ok(booking)
    }

    @GetMapping("/user/{userId}")
    fun getUserBookings(@PathVariable userId: Long): ResponseEntity<List<BookingResponse>> {
        val bookings = bookingService.getUserBookings(userId)
        return ResponseEntity.ok(bookings)
    }
}
