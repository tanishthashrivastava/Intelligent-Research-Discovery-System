import pandas as pd
import numpy as np

print("Loading dataset...")

# Load recalibrated embeddings
embeddings = pd.read_csv("recalibrated_embeddings.csv").values

# Load paper metadata
df = pd.read_csv("processed_papers.csv")

print("Total papers:", len(df))


# -----------------------------
# STEP 1: Build Similarity Graph
# -----------------------------
# We create connections between papers based on similarity

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


print("Building similarity graph...")

threshold = 0.7   # similarity threshold

graph = {}

for i in range(len(embeddings)):
    graph[i] = []
    
    for j in range(len(embeddings)):
        if i != j:
            sim = cosine_sim(embeddings[i], embeddings[j])
            
            if sim > threshold:
                graph[i].append(j)


print("Graph created with connections.")


# -----------------------------
# STEP 2: Compute Graph Centrality
# -----------------------------
# Centrality = number of connections (simple degree centrality)

centrality = {}

for node in graph:
    centrality[node] = len(graph[node])

# Normalize centrality
max_centrality = max(centrality.values()) if centrality else 1

for node in centrality:
    centrality[node] = centrality[node] / max_centrality


print("Centrality scores computed.")


# -----------------------------
# STEP 3: Graph-Vector Fusion
# -----------------------------
# Update embeddings using centrality 

beta = 0.3  # tuning factor

print("Applying graph-vector fusion...")

fused_embeddings = []

for i in range(len(embeddings)):
    
    influence = centrality[i]
    
    factor = 1 + beta * influence
    
    new_vec = embeddings[i] * factor
    
    fused_embeddings.append(new_vec)


fused_embeddings = np.array(fused_embeddings)


# -----------------------------
# STEP 4: Save Results
# -----------------------------

print("Saving graph-enhanced embeddings...")

fused_df = pd.DataFrame(fused_embeddings)
fused_df.to_csv("graph_enhanced_embeddings.csv", index=False)

# Save centrality info
df["graph_centrality"] = [centrality[i] for i in range(len(df))]
df.to_csv("papers_with_graph.csv", index=False)

print("Graph module completed successfully!") 