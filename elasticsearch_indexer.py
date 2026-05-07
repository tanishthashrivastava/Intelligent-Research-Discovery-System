from elasticsearch import Elasticsearch
import pandas as pd

print("Connecting to Elasticsearch...")

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")

# Load datasets
papers = pd.read_csv("processed_papers.csv")
embeddings = pd.read_csv("paper_embeddings.csv")

print("Datasets loaded:", len(papers)) 

index_name = "research_papers"

# Create index if not exists
if not es.indices.exists(index=index_name):

    mapping = {
        "mappings": {
            "properties": {
                "title": {"type": "text"},
                "authors": {"type": "text"},
                "abstract": {"type": "text"},
                "embedding": {
                    "type": "dense_vector",
                    "dims": 384
                }
            }
        }
    }

    es.indices.create(index=index_name, body=mapping)
    print("Index created")

# Insert papers
for i, row in papers.iterrows():

    doc = {
        "title": row["Title"],
        "authors": row["Authors"],
        "abstract": row["processed_text"],
        "embedding": embeddings.iloc[i].tolist()
    }

    es.index(index=index_name, id=i, document=doc)

print("All papers indexed successfully!")