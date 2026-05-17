from elasticsearch import Elasticsearch

es = Elasticsearch(
    "https://localhost:9200",
    basic_auth=("elastic", "Aqmtk*WJi_F*f9jTfHe0"),
    verify_certs=False
)

query = input("Enter your search query: ")

response = es.search(
    index="research_papers",
    query={
        "match": {
            "abstract": query
        }
    }
)

print("\nTop Results:\n")

for hit in response["hits"]["hits"]:
    data = hit["_source"]
    print("Title:", data["title"])
    print("Authors:", data["authors"])
    print("-" * 50)