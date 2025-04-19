package com.hotels.orders.repository

import com.hotels.orders.model.Booking
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BookingRepository : JpaRepository<Booking, Long> {
    fun findByUserId(userId: Long): List<Booking>

    fun findByHotelId(hotelId: Long): List<Booking>

    fun findByUserIdAndStatus(
        userId: Long,
        status: Booking.Status,
    ): List<Booking>
}
