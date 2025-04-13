package model

data class Hotel(
    val id: String,
    val name: String,
    val description: String,
    val address: Address,
    val amenities: List<String>,
    val rating: Float,
)

data class Address(
    val city: String,
    val street: String,
    val location: GeoPoint,
)

data class GeoPoint(
    val lat: Double,
    val lon: Double,
)
