package com.hotels.orders.service

import com.hotels.orders.model.Booking
import com.hotels.orders.model.PaymentResponse
import com.hotels.orders.repository.BookingRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

@Service
class PaymentService(
    private val bookingRepository: BookingRepository,
) {
    @Transactional
    fun processPayment(bookingId: Long): PaymentResponse {
        val booking =
            bookingRepository
                .findById(bookingId)
                .orElseThrow { EntityNotFoundException("Booking not found with id: $bookingId") }

        if (booking.status != Booking.Status.PENDING) {
            throw IllegalStateException("Booking is not in PENDING state, current state: ${booking.status}")
        }

        Thread.sleep(2000) // emulate payment processing

        val nights = ChronoUnit.DAYS.between(booking.checkInDate, booking.checkOutDate)
        val amount = 100 * nights

        val updatedBooking =
            booking.copy(
                status = Booking.Status.CONFIRMED,
                updatedAt = LocalDateTime.now(),
            )

        bookingRepository.save(updatedBooking)

        return PaymentResponse(
            bookingId = booking.id,
            amount = amount,
            paymentId = booking.id.toString(),
            status = "Success",
            timestamp = LocalDateTime.now(),
        )
    }
}
