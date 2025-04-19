package com.hotels.searcher.service

import com.hotels.searcher.dto.HotelsSearchReq
import com.hotels.searcher.model.Hotel
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.client.opensearch._types.FieldValue
import org.opensearch.client.opensearch._types.query_dsl.BoolQuery
import org.opensearch.client.opensearch._types.query_dsl.MultiMatchQuery
import org.opensearch.client.opensearch._types.query_dsl.Query
import org.opensearch.client.opensearch._types.query_dsl.TermsQuery
import org.opensearch.client.opensearch._types.query_dsl.TextQueryType
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

    fun searchHotels(request: HotelsSearchReq): List<Hotel> {
        val multiMatchQuery =
            MultiMatchQuery
                .Builder()
                .query(request.queryString)
                .fields(
                    listOf(
                        "city^3",
                        "description^2",
                        "aspects^1",
                        "address^1",
                    ),
                ).type(TextQueryType.BestFields)
                .fuzziness("auto")
                .tieBreaker(0.3)
                .build()

        val termsQuery =
            if (request.skipHotels.isNotEmpty()) {
                TermsQuery
                    .Builder()
                    .field("_id")
                    .terms { t -> t.value(request.skipHotels.map(FieldValue::of)) }
                    .build()
            } else {
                null
            }

        val boolQuery =
            BoolQuery
                .Builder()
                .must(Query.of { q -> q.multiMatch(multiMatchQuery) })

        if (termsQuery != null) {
            boolQuery.mustNot(Query.of { q -> q.terms(termsQuery) })
        }

        val searchRequest =
            SearchRequest
                .Builder()
                .index("hotels")
                .query(Query.of { q -> q.bool(boolQuery.build()) })
                .size(request.limit)
                .build()

        val searchResponse = openSearchClient.search(searchRequest, Hotel::class.java)
        return searchResponse.hits().hits().map { it.source()!! }
    }
}
