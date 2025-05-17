package com.hotels.searcher.service

import com.hotels.searcher.model.Hotel
import com.hotels.searcher.model.Offer
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.Period

@Service
class OffersService {
    fun getOffer(
        hotel: Hotel,
        checkInDate: LocalDate,
        checkOutDate: LocalDate,
    ): Offer {
        val nights = Period.between(checkInDate, checkOutDate).days
        val basePrice = 3500

        return Offer(
            hotel,
            (basePrice + hotel.id % 1000) * nights,
            nights,
            checkInDate,
            checkOutDate,
        )
    }
}
