package service

import dto.HotelsSearchReq
import org.springframework.stereotype.Service

@Service
class HotelSearchService {
    fun validateRequest(request: HotelsSearchReq) {
        require(request.checkInDate.isBefore(request.checkOutDate)) {
            "Check-in date must be before check-out date"
        }
    }
}
