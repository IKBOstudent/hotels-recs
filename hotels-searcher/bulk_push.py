from opensearchpy import OpenSearch, helpers
import json

os_client = OpenSearch(
        hosts=[{'host': "localhost", 'port': 9200}],
        http_auth=("admin", "admin"),
        port=9200,
        schema='https',
        verify_certs=False,
        use_ssl=True,
        ssl_show_warn=False,
    )

index_name = "hotels"

exists = os_client.indices.exists(index_name)
print("index already exists")
os_client.indices.delete(index = index_name)
print("removed old version")

os_client.indices.create(
    index_name,
    body={
        "settings": {
            "analysis": {
                "char_filter": {
                    "html_filter": {"type": "html_strip"}
                },
                "analyzer": {
                    "html_strip_analyzer": {
                        "type": "custom",
                        "char_filter": ["html_filter"],
                        "tokenizer": "standard",
                        "filter": ["lowercase"]
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "id": {"type": "long"},
                "coordinates": {"type": "geo_point"},
                "city": {"type": "text"},
                "country": {"type": "text"},
                "address": {"type": "text"},
                "name": {"type": "text"},
                "description": {
                    "type": "text",
                    "analyzer": "html_strip_analyzer"
                },
                "aspects": {"type": "text"},
            }
        }
    },
)

print("index created")

with open("hotels-russia.json", 'r') as file:
    data = json.load(file)

    actions = []

    for hotel in data:
        hotel["countyName"] = "Russia"

        # TODO:
        # if "HotelFacilities" in hotel:
        #     hotel["HotelFacilities"] = parse(hotel["HotelRating"]) + hotel["HotelFacilities"]
        coordinates = None

        if hotel["lat"] and hotel["lon"]:
            coordinates = {
                "lat": hotel["lat"],
                "lon": hotel["lon"]
            }

        if hotel["cityName"] and hotel["HotelCode"] and hotel["HotelName"] and coordinates:
            actions.append({
                "_index": index_name,
                "_id": hotel["HotelCode"],
                "_source": {
                    "id": hotel["HotelCode"],
                    "coordinates": coordinates,
                    "city": hotel["cityName"],
                    "country": hotel["countyName"],
                    "address": hotel["Address"],
                    "name": hotel["HotelName"],
                    # "stars": TODO,
                    "description": hotel["Description"],
                    "aspects": hotel["HotelFacilities"]
                }
            })

    print("indexing data...")
    success, failed = helpers.bulk(os_client, actions, chunk_size=1000)

    print(f"success: {success}, errors: {len(failed)}")
    if failed:
        print("errors:", failed)
