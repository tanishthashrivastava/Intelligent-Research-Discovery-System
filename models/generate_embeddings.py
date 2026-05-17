from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np

print("Loading processed dataset...")

# Load dataset
df = pd.read_csv("processed_papers.csv")

print("Rows loaded:", len(df))

# Load embedding model
print("Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")

# Get processed text
texts = df["processed_text"].astype(str).tolist()

print("Generating embeddings...")

# Generate embeddings (batch processing for speed)
embeddings = model.encode(texts, batch_size=32, show_progress_bar=True)

print("Embeddings generated:", len(embeddings))

# Convert embeddings to dataframe
embeddings_df = pd.DataFrame(embeddings)

# Save embeddings separately
embeddings_df.to_csv("paper_embeddings.csv", index=False)

print("Embeddings saved to paper_embeddings.csv")

# Optional: Save combined dataset
df["embedding_vector"] = embeddings.tolist()
df.to_csv("papers_with_embeddings.csv", index=False)

print("Combined dataset saved as papers_with_embeddings.csv") 