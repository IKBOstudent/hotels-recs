package service

import dto.HotelsSearchReq
import model.Hotel
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.opensearch._types.FieldValue
import org.opensearch.client.opensearch._types.query_dsl.MatchQuery
import org.opensearch.client.opensearch._types.query_dsl.Query
import org.opensearch.client.opensearch._types.query_dsl.TermQuery
import org.opensearch.client.opensearch.core.SearchRequest
import org.springframework.stereotype.Service

@Service
class HotelSearchService(
    private val openSearchClient: OpenSearchClient,
) {
    fun validateRequest(request: HotelsSearchReq) {
        require(request.checkInDate.isBefore(request.checkOutDate)) {
            "Check-in date must be before check-out date"
        }
    }

    fun searchHotels(
        query: String,
        city: String,
    ): List<Hotel> {
        val searchQuery =
            Query.of { q ->
                q.bool { b ->
                    b.must(
                        MatchQuery
                            .of { m ->
                                m.field("name").query(query)
                            }.toQuery(),
                        TermQuery
                            .of { t ->
                                t.field("address.city.keyword").value(city)
                            }.toQuery(),
                    )
                }
            }

        return openSearchClient
            .search(
                SearchRequest.of { s ->
                    s
                        .index("hotels")
                        .query(searchQuery)
                },
                Hotel::class.java,
            ).hits()
            .hits()
            .map { it.source() }
    }

    fun findByAmenities(amenities: List<String>): List<Hotel> {
        val query =
            Query.of { q ->
                q.terms { t ->
                    t
                        .field("amenities")
                        .terms { termsBuilder -> termsBuilder.value(amenities.map { FieldValue.of(it) }) }
                }
            }

        return openSearchClient
            .search({ it.index("hotels").query(query) }, Hotel::class.java)
            .hits()
            .hits()
            .map { it.source() }
    }
}
