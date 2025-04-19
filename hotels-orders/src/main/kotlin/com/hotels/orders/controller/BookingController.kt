package com.hotels.orders.controller

import com.hotels.orders.model.BookingRequest
import com.hotels.orders.model.BookingResponse
import com.hotels.orders.model.PaymentResponse
import com.hotels.orders.service.BookingService
import com.hotels.orders.service.PaymentService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/booking")
class BookingController(
    private val bookingService: BookingService,
    private val paymentService: PaymentService,
) {
    @PostMapping
    fun createBooking(
        @RequestBody request: BookingRequest,
    ): ResponseEntity<BookingResponse> {
        val booking = bookingService.createBooking(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(booking)
    }

    @PostMapping("/{id}/checkout")
    fun checkoutBooking(
        @PathVariable id: Long,
    ): ResponseEntity<PaymentResponse> {
        val paymentResponse = paymentService.processPayment(id)
        return ResponseEntity.ok(paymentResponse)
    }

    @PostMapping("/{id}/cancel")
    fun cancelBooking(
        @PathVariable id: Long,
    ): ResponseEntity<BookingResponse> {
        val booking = bookingService.cancelBooking(id)
        return ResponseEntity.ok(booking)
    }

    @GetMapping("/{id}")
    fun getBooking(
        @PathVariable id: Long,
    ): ResponseEntity<BookingResponse> {
        val booking = bookingService.getBooking(id)
        return ResponseEntity.ok(booking)
    }

    @GetMapping("/user/{userId}")
    fun getUserBookings(
        @PathVariable userId: Long,
    ): ResponseEntity<List<BookingResponse>> {
        val bookings = bookingService.getUserBookings(userId)
        return ResponseEntity.ok(bookings)
    }
}
