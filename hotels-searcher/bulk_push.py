from opensearchpy import OpenSearch, helpers
import pandas as pd

client = OpenSearch(
    hosts=[{"host": "localhost", "port": 9200}],
    http_auth=("admin", "testpassword"),
    use_ssl=False
)

df = pd.read_json("hotels-russia.json")
hotels = df.to_dict(orient="records")

actions = [
    {
        "_index": "hotels",
        "_id": hotel["HotelCode"],
        "_source": {
            "id": hotel["HotelName"],
            "lat": hotel["lat"],
            "lon": hotel["lon"],
            "city": hotel["cityName"],
            "country": hotel["countyName"],
            "name": hotel["hotelName"],
            "stars": hotel["HotelRating"],
            "address": hotel["Address"],
            "description": hotel["Description"],
            "aspects": hotel["HotelFacilities"]
        }
    }
    for hotel in hotels
]

success, failed = helpers.bulk(client, actions, chunk_size=1000)

print(f"Успешно: {success}, Ошибки: {len(failed)}")
if failed:
    print("Ошибки:", failed)
