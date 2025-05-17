package com.hotels.searcher.service

import com.hotels.searcher.dto.HotelsSearchReq
import com.hotels.searcher.dto.HotelsSearchRsp
import com.hotels.searcher.model.Hotel
import com.hotels.searcher.model.Offer
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.opensearch._types.FieldValue
import org.opensearch.client.opensearch._types.query_dsl.BoolQuery
import org.opensearch.client.opensearch._types.query_dsl.MultiMatchQuery
import org.opensearch.client.opensearch._types.query_dsl.Query
import org.opensearch.client.opensearch._types.query_dsl.TermsQuery
import org.opensearch.client.opensearch._types.query_dsl.TextQueryType
import org.opensearch.client.opensearch.core.SearchRequest
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.math.exp

@Service
class HotelSearchService(
    private val openSearchClient: OpenSearchClient,
    private val offersService: OffersService,
    private val rankingService: HotelRankingService,
) {
    data class SearchResult(
        val hotels: List<Hotel>,
        val totalCount: Long,
    )

    fun validateRequest(request: HotelsSearchReq) {
        require(request.checkInDate.isBefore(request.checkOutDate)) {
            "Check-in date must be before check-out date"
        }
    }

    private fun baseSearch(
        locationQuery: String,
        additionalQuery: String,
        skipHotels: List<Long>,
    ): SearchResult {
        val boolQuery = BoolQuery.Builder()

        if (locationQuery.isNotEmpty()) {
            val locationMultiMatch =
                MultiMatchQuery
                    .Builder()
                    .query(locationQuery)
                    .fields(
                        listOf(
                            "city^3",
                            "address^2",
                            "description^1",
                        ),
                    ).type(TextQueryType.BestFields)
                    .build()

            boolQuery.must(Query.of { q -> q.multiMatch(locationMultiMatch) })
        }

        if (additionalQuery.isNotEmpty()) {
            val additionalMultiMatch =
                MultiMatchQuery
                    .Builder()
                    .query(additionalQuery)
                    .fields(
                        listOf(
                            "amenities^3",
                            "description^1",
                        ),
                    ).type(TextQueryType.MostFields)
                    .fuzziness("auto")
                    .tieBreaker(0.3)
                    .build()

            boolQuery.must(Query.of { q -> q.multiMatch(additionalMultiMatch) })
        }

        if (skipHotels.isNotEmpty()) {
            val skipTerms =
                TermsQuery
                    .Builder()
                    .field("_id")
                    .terms { t -> t.value(skipHotels.map(FieldValue::of)) }
                    .build()

            boolQuery.mustNot(Query.of { q -> q.terms(skipTerms) })
        }

        val searchRequest =
            SearchRequest
                .Builder()
                .index("hotels")
                .trackScores(true)
                .query(Query.of { q -> q.bool(boolQuery.build()) })
                .build()

        val searchResponse =
            openSearchClient
                .search(searchRequest, Hotel::class.java)

        val hotels =
            searchResponse
                .hits()
                .hits()
                .mapNotNull { hit ->
                    val hotel = hit.source()
                    hotel?.relevance = normalized(hit.score() ?: 0.0)
                    hotel
                }

        return SearchResult(hotels, searchResponse.hits().total()?.value() ?: 0)
    }

    private fun normalized(score: Double): Double = 1.0 / (1.0 + exp(-score.toDouble()))

    fun searchHotels(
        request: HotelsSearchReq,
        uid: String?,
    ): HotelsSearchRsp {
        validateRequest(request)
        val searchResults = baseSearch(request.locationQuery, request.additionalQuery, request.skipHotels)
        val rerankedHotels = rankingService.rerankResults(searchResults.hotels, uid)
        val offers = buildOffers(rerankedHotels, request.checkInDate, request.checkOutDate)
        return HotelsSearchRsp(offers, searchResults.totalCount > request.limit)
    }

    private fun buildOffers(
        hotels: List<Hotel>,
        checkInDate: LocalDate,
        checkOutDate: LocalDate,
    ): List<Offer> = hotels.map { offersService.getOffer(it, checkInDate, checkOutDate) }
}
