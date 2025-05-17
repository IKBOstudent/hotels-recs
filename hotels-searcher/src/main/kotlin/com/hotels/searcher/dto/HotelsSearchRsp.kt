package com.hotels.searcher.dto

import com.hotels.searcher.model.Offer

data class HotelsSearchRsp(
    val offers: List<Offer>,
    val hasMore: Boolean,
)
