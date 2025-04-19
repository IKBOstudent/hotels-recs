package com.hotels.orders.service

import com.hotels.orders.model.Booking
import com.hotels.orders.model.BookingRequest
import com.hotels.orders.model.BookingResponse
import com.hotels.orders.repository.BookingRepository
import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class BookingService(
    private val bookingRepository: BookingRepository,
) {
    fun validateRequest(request: BookingRequest) {
        require(request.checkInDate.isBefore(request.checkOutDate)) {
            "Check-in date must be before check-out date"
        }
    }

    @Transactional
    fun createBooking(request: BookingRequest): BookingResponse {
        validateRequest(request)

        val booking =
            Booking(
                userId = request.userId,
                hotelId = request.hotelId,
                checkInDate = request.checkInDate,
                checkOutDate = request.checkOutDate,
                status = Booking.Status.PENDING,
            )

        val savedBooking = bookingRepository.save(booking)

        return mapToBookingResponse(savedBooking)
    }

    fun getBooking(id: Long): BookingResponse {
        val booking =
            bookingRepository
                .findById(id)
                .orElseThrow { EntityNotFoundException("Booking not found with id: $id") }

        return mapToBookingResponse(booking)
    }

    @Transactional
    fun cancelBooking(id: Long): BookingResponse {
        val booking =
            bookingRepository
                .findById(id)
                .orElseThrow { EntityNotFoundException("Booking not found with id: $id") }

        if (booking.status == Booking.Status.CANCELLED) {
            throw IllegalStateException("Booking is already cancelled")
        }

        val updatedBooking =
            booking.copy(
                status = Booking.Status.CANCELLED,
                updatedAt = LocalDateTime.now(),
            )

        val savedBooking = bookingRepository.save(updatedBooking)

        return mapToBookingResponse(savedBooking)
    }

    fun getUserBookings(userId: Long): List<BookingResponse> = bookingRepository.findByUserId(userId).map(this::mapToBookingResponse)

    private fun mapToBookingResponse(booking: Booking): BookingResponse =
        BookingResponse(
            id = booking.id,
            userId = booking.userId,
            hotelId = booking.hotelId,
            checkInDate = booking.checkInDate,
            checkOutDate = booking.checkOutDate,
            status = booking.status,
            createdAt = booking.createdAt,
            updatedAt = booking.updatedAt,
        )
}
