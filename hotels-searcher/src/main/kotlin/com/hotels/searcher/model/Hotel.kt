package com.hotels.searcher.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class Hotel(
    val id: Int? = null,
    val name: String? = null,
    val city: String? = null,
    val address: String? = null,
    val description: String? = null,
    val aspects: String? = null,
)
