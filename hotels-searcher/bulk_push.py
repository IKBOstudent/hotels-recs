import spacy
from spacy.matcher import PhraseMatcher
import numpy as np
import json
import random
import requests
import argparse
import time

from opensearchpy import OpenSearch, helpers

class HotelVectorizer:
    def __init__(self, images):
        self.nlp = spacy.load("en_core_web_lg")
        self.hotel_vectors = {}
        self.hotel_data = {}
        self.hotel_images = images

    def extract_amenities_enhanced(self, text):
        patterns = [
            "free wifi", "pool", "fitness center", "air condition", "restaurant", "room service",
            "breakfast in room", "airport shuttle", "spa", "parking", "laundry service",
            "breakfast included", "pets allowed", "elevator", "family rooms"
        ]

        matcher = PhraseMatcher(self.nlp.vocab, attr="LOWER")
        patterns = [self.nlp(pattern) for pattern in patterns]
        matcher.add("AMENITIES", None, *patterns)

        negation_terms = ["no", "not", "without", "don't have", "doesn't have", "doesn't offer",
                        "don't offer", "unavailable", "not available", "not included"]

        doc = self.nlp(text.lower())
        matches = matcher(doc)

        found_amenities = []
        excluded_amenities = []

        for match_id, start, end in matches:
            amenity = doc[start:end].text

            negated = False
            window_start = max(0, start - 5)
            previous_tokens = doc[window_start:start]

            for negation in negation_terms:
                if negation in previous_tokens.text:
                    negated = True
                    excluded_amenities.append(amenity)
                    break

            if not negated:
                found_amenities.append(amenity)

        return list(dict.fromkeys(found_amenities))

    def process_hotel(self, hotel_id, name, city, address, description, amenities, lat, lon):
        if not hotel_id or not name or not city or not amenities or not lat or not lon:
            return

        amenities = self.extract_amenities_enhanced(amenities)

        num_images = random.randint(1, 5)
        images = random.sample(self.hotel_images, min(num_images, len(self.hotel_images)))
        # print(images)

        weights = {
            'name': 1.0,
            'description': 2.0,
            'amenities': 1.5
        }

        self.hotel_data[hotel_id] = {
            'name': name,
            'city': city,
            'address': address.strip(),
            'description': description,
            'coordinates': {'lat': lat, 'lon': lon},
            'amenities': amenities,
            'rating': round(random.uniform(1.0, 5.0), 1),
            'images': images
        }

        amenities_text = " ".join(amenities)

        name_vec = self.nlp(name).vector * weights['name']
        description_vec = self.nlp(description).vector * weights['description']
        amenities_vec = self.nlp(amenities_text).vector * weights['amenities'] if amenities else np.zeros(self.nlp.meta['vectors']['width'])

        combined_vector = name_vec + description_vec + amenities_vec

        if np.linalg.norm(combined_vector) > 0:
            combined_vector = combined_vector / np.linalg.norm(combined_vector)

        self.hotel_vectors[hotel_id] = combined_vector
        return combined_vector

    def bulk_index_to_opensearch(self, index_name, opensearch_client):
        actions = []
        for hotel_id, vector in self.hotel_vectors.items():
            hotel_data = self.hotel_data[hotel_id]

            doc = {
                '_index': index_name,
                '_id': hotel_id,
                '_source': {
                    "id": hotel_id,
                    "coordinates": hotel_data["coordinates"],
                    'name': hotel_data['name'],
                    'city': hotel_data['city'],
                    'country': 'Russia',
                    'address': hotel_data['address'],
                    'description': hotel_data['description'],
                    'amenities': hotel_data['amenities'],
                    "images": hotel_data['images'],
                    "rating": hotel_data['rating'],
                    'hotel_vector': vector.tolist()
                }
            }

            actions.append(doc)

        success, failed = helpers.bulk(opensearch_client, actions, chunk_size=1000)

        print(f"success: {success}, errors: {len(failed)}")
        if failed:
            print("errors:", failed)


def fetch_hotel_images(api_token):
    headers = {
        "Authorization": f"Client-ID {api_token}"
    }

    all_images = []

    try:
        response = requests.get(
            f"https://api.unsplash.com/search/photos?page=1&query=hotel",
            headers=headers
        )

        if response.status_code == 200:
            results = response.json().get("results", [])
            image_urls = [item["urls"]["regular"] for item in results]
            all_images.extend(image_urls)

            time.sleep(1)
        else:
            print(f"Error fetching images for {query}: {response.status_code}")

    except Exception as e:
        print(f"Exception while fetching images: {e}")

    print(f"Fetched a total of {len(all_images)} hotel images")
    return all_images


def setup_opensearch_index(client, index_name, vector_dimension=300):
    index_body = {
        "settings": {
            "index": {
                "knn": True,
                "knn.space_type": "cosinesimil"
            },
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
                "rating": {"type": "float"},
                "images": {"type": "keyword"},
                "description": {
                    "type": "text",
                    "analyzer": "html_strip_analyzer"
                },
                "amenities": {"type": "keyword"},
                "hotel_vector": {
                    "type": "knn_vector",
                    "dimension": vector_dimension
                }
            }
        }
    }

    client.indices.create(index=index_name, body=index_body)


def bulk_import_hotels(hotels_data, api_token):
    os_client = OpenSearch(
        hosts=[{'host': "localhost", 'port': 9200}],
        http_auth=("admin", "admin"),
        http_compress=True,
        schema='http',
        verify_certs=False,
        use_ssl=False,
        ssl_show_warn=False,
    )

    index_name = "hotels"

    exists = os_client.indices.exists(index_name)
    if exists:
        print("index already exists")
        os_client.indices.delete(index = index_name)
        print("removed old version")

    hotel_images = fetch_hotel_images(api_token)
    vectorizer = HotelVectorizer(hotel_images)

    for hotel in hotels_data[:100]:
        vectorizer.process_hotel(
            hotel_id=hotel["HotelCode"],
            name=hotel["HotelName"],
            city=hotel["cityName"],
            address=hotel["Address"],
            description=hotel["Description"],
            amenities=hotel["HotelFacilities"],
            lat=hotel["lat"],
            lon=hotel["lon"]
        )

    vector_dim = vectorizer.nlp.meta['vectors']['width']
    setup_opensearch_index(os_client, index_name, vector_dimension=vector_dim)

    count = vectorizer.bulk_index_to_opensearch(index_name, os_client)
    return count


parser = argparse.ArgumentParser()
parser.add_argument("-t", "--token", help = "unsplash api token")
args = parser.parse_args()

with open("hotels-russia.json", 'r') as file:
    data = json.load(file)

    bulk_import_hotels(data, args.token)

