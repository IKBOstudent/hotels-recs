package com.hotels.searcher.model

data class UserEvent(
    val eventType: String,
    val itemId: String,
    val timestamp: String,
    val uid: String,
    val metadata: Map<String, Any>,
)
