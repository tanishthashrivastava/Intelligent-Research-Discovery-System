import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

print("Loading dataset...")

# Load paper data
df = pd.read_csv("processed_papers.csv")

# Load embeddings
embeddings = pd.read_csv("graph_enhanced_embeddings.csv").values
print("Dataset loaded:", len(df), "papers")


# Load embedding model
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# User query input
query_text = input("Enter your research query: ")

print("Encoding query...")

# Convert query to embedding
query_embedding = model.encode([query_text])

print("Computing similarity...")

# Calculate cosine similarity
similarities = cosine_similarity(query_embedding, embeddings)[0]

# Add similarity score
df["similarity_score"] = similarities

# Sort by similarity
results = df.sort_values("similarity_score", ascending=False)

print("\nTop 5 Relevant Papers:\n")

top_results = results.head(5)

for i, row in top_results.iterrows():
    print("Title:", row["Title"])
    print("Authors:", row["Authors"])
    print("Similarity Score:", round(row["similarity_score"], 3))
    print("Link:", row["Link"])
    print("-" * 60)