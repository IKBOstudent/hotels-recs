package com.hotels.searcher.model

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class Hotel(
    val id: Int = 0,
    val coordinates: Coordinates? = null,
    val name: String? = null,
    val city: String? = null,
    val rating: Double? = null,
    val address: String? = null,
    val description: String? = null,
    val amenities: List<String>? = null,
    val images: List<String>? = null,
    val vector: FloatArray? = null,
    var relevance: Double = 0.0,
) {
    data class Coordinates(
        val lat: String? = "",
        val lon: String? = "",
    )
}
