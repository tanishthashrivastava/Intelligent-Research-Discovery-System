from elasticsearch import Elasticsearch
import pandas as pd

print("Connecting to Elasticsearch...")

# Connect to Elasticsearch (secure connection)
es = Elasticsearch(
    "https://localhost:9200",
    basic_auth=("elastic", "jH-LdCg63IPsExc-LvA4"),
    verify_certs=False
)

# Check connection
if es.ping():
    print("Connected to Elasticsearch!")
else:
    print("Connection failed!")

# Load dataset
print("Loading dataset...")
df = pd.read_csv("processed_papers.csv")

index_name = "research_papers"

# Delete index if already exists (optional clean run)
if es.indices.exists(index=index_name):
    es.indices.delete(index=index_name)
    print("Old index deleted")

# Create index
es.indices.create(index=index_name)
print("Index created!")

# Insert data
print("Indexing data...")

for i, row in df.iterrows():
    doc = {
        "title": row["Title"],
        "authors": row["Authors"],
        "abstract": row["Abstract"],
        "processed_text": row["processed_text"]
    }

    es.index(index=index_name, id=i, document=doc)

print("All data indexed successfully!") 