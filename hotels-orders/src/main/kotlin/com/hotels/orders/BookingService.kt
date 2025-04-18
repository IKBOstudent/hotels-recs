package com.hotels.orders

import jakarta.persistence.EntityNotFoundException
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class BookingService(
    private val bookingRepository: BookingRepository,
) {
    @Transactional
    fun createBooking(request: BookingRequest): BookingResponse {
        // Validate dates
        if (request.checkInDate.isBefore(LocalDate.now())) {
            throw IllegalArgumentException("Check-in date cannot be in the past")
        }

        if (request.checkOutDate.isBefore(request.checkInDate)) {
            throw IllegalArgumentException("Check-out date must be after check-in date")
        }

        val booking = Booking(
            userId = request.userId,
            hotelId = request.hotelId,
            checkInDate = request.checkInDate,
            checkOutDate = request.checkOutDate,
            status = BookingStatus.INIT
        )

        val savedBooking = bookingRepository.save(booking)

        return BookingResponse(
            id = savedBooking.id,
            userId = savedBooking.userId,
            hotelId = savedBooking.hotelId,
            checkInDate = savedBooking.checkInDate,
            checkOutDate = savedBooking.checkOutDate,
            status = savedBooking.status,
            createdAt = savedBooking.createdAt,
            updatedAt = savedBooking.updatedAt
        )
    }

    @Transactional
    fun updateBookingStatus(id: Long, status: BookingStatus): BookingResponse {
        val booking = bookingRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Booking not found with id: $id") }

        val updatedBooking = booking.copy(
            status = status,
            updatedAt = LocalDateTime.now()
        )

        val savedBooking = bookingRepository.save(updatedBooking)

        return BookingResponse(
            id = savedBooking.id,
            userId = savedBooking.userId,
            hotelId = savedBooking.hotelId,
            checkInDate = savedBooking.checkInDate,
            checkOutDate = savedBooking.checkOutDate,
            status = savedBooking.status,
            createdAt = savedBooking.createdAt,
            updatedAt = savedBooking.updatedAt
        )
    }

    fun getBooking(id: Long): BookingResponse {
        val booking = bookingRepository.findById(id)
            .orElseThrow { EntityNotFoundException("Booking not found with id: $id") }

        return BookingResponse(
            id = booking.id,
            userId = booking.userId,
            hotelId = booking.hotelId,
            checkInDate = booking.checkInDate,
            checkOutDate = booking.checkOutDate,
            status = booking.status,
            createdAt = booking.createdAt,
            updatedAt = booking.updatedAt
        )
    }

    fun getUserBookings(userId: Long): List<BookingResponse> {
        return bookingRepository.findByUserId(userId).map { booking ->
            BookingResponse(
                id = booking.id,
                userId = booking.userId,
                hotelId = booking.hotelId,
                checkInDate = booking.checkInDate,
                checkOutDate = booking.checkOutDate,
                status = booking.status,
                createdAt = booking.createdAt,
                updatedAt = booking.updatedAt
            )
        }
    }
}

