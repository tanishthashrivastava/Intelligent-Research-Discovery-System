import pandas as pd
import numpy as np

print("Loading embeddings and dataset...")

# Load embeddings
embeddings = pd.read_csv("paper_embeddings.csv").values

# Load metadata
df = pd.read_csv("processed_papers.csv")

print("Data loaded:", len(df), "papers")


# -----------------------------
# STEP 1: Citation Weight Logic
# -----------------------------
# (Since arXiv does not give citation count directly,
# we simulate influence using text richness + length)

def compute_citation_weight(text):
    text = str(text)
    
    # simple heuristic: longer + richer text = more importance
    length_score = len(text.split())
    
    # normalize
    return length_score


print("Computing citation weights...")

df["citation_weight"] = df["processed_text"].apply(compute_citation_weight)

# Normalize weights (0 to 1)
max_weight = df["citation_weight"].max()
df["citation_weight"] = df["citation_weight"] / max_weight


# -----------------------------
# STEP 2: Entropy Calculation
# -----------------------------
# Entropy = how diverse the embedding vector is

def compute_entropy(vector):
    vector = np.array(vector)
    
    # avoid division by zero
    vector = np.abs(vector) + 1e-9
    
    prob = vector / np.sum(vector)
    
    entropy = -np.sum(prob * np.log(prob))
    
    return entropy


print("Computing entropy for each embedding...")

entropy_list = []

for vec in embeddings:
    entropy_list.append(compute_entropy(vec))

df["entropy_score"] = entropy_list

# Normalize entropy
max_entropy = df["entropy_score"].max()
df["entropy_score"] = df["entropy_score"] / max_entropy


# -----------------------------
# STEP 3: Dynamic Recalibration
# -----------------------------
# Adjust embeddings using:
# new_vector = old_vector * (1 + alpha * weight * entropy)

alpha = 0.5  # tuning factor

print("Applying dynamic recalibration...")

recalibrated_embeddings = []

for i in range(len(embeddings)):
    
    weight = df.loc[i, "citation_weight"]
    entropy = df.loc[i, "entropy_score"]
    
    factor = 1 + alpha * weight * entropy
    
    new_vec = embeddings[i] * factor
    
    recalibrated_embeddings.append(new_vec)


recalibrated_embeddings = np.array(recalibrated_embeddings)


# -----------------------------
# STEP 4: Save Results
# -----------------------------

print("Saving recalibrated embeddings...")

recal_df = pd.DataFrame(recalibrated_embeddings)

recal_df.to_csv("recalibrated_embeddings.csv", index=False)

# Optional: save combined dataset
df["recalibration_factor"] = [
    1 + alpha * df.loc[i, "citation_weight"] * df.loc[i, "entropy_score"]
    for i in range(len(df))
]

df.to_csv("papers_with_recalibration.csv", index=False)

print("Recalibration completed successfully!")