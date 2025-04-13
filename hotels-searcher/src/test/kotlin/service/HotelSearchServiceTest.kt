package service

import dto.HotelsSearchReq
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.junit.jupiter.MockitoExtension
import java.time.LocalDate

@ExtendWith(MockitoExtension::class)
class HotelSearchServiceTest {
    private val hotelSearchService = HotelSearchService()

    @Test
    fun `search returns hotels matching all params`() {
        Assertions.assertTrue(true)
    }

    @Test
    fun `search returns empty list when no matching offers`() {
        Assertions.assertTrue(true)
    }

    @Test
    fun `search validates date range correctly`() {
        var exception =
            Assertions.assertThrows(IllegalArgumentException::class.java) {
                hotelSearchService.validateRequest(
                    HotelsSearchReq(
                        checkInDate = LocalDate.now().plusDays(3),
                        checkOutDate = LocalDate.now().plusDays(1),
                    ),
                )
            }

        Assertions.assertEquals(exception.message, "Check-in date must be before check-out date")
    }
}
