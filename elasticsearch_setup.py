from elasticsearch import Elasticsearch
import pandas as pd

es = Elasticsearch(
    "https://localhost:9200",
    basic_auth=("elastic", "Aqmtk*WJi_F*f9jTfHe0"),
    verify_certs=False
)

print("Connected!")

index_name = "research_papers"

df = pd.read_csv("processed_papers.csv")

# delete old index
if es.indices.exists(index=index_name):
    es.indices.delete(index=index_name)

# create index
es.indices.create(index=index_name)

# upload data
for i in range(len(df)):
    doc = {
        "title": df.loc[i, "Title"],
        "authors": df.loc[i, "Authors"],
        "abstract": df.loc[i, "Abstract"],
        "link": df.loc[i, "Link"]
    }

    es.index(index=index_name, id=i, document=doc)

print("Data uploaded successfully!") 