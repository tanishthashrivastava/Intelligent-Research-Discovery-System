import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
nltk.download('punkt_tab')

print("Loading dataset...")

# Download required NLTK resources (first time only)
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Load dataset
df = pd.read_csv("arxiv_papers.csv")

print("Dataset loaded:", len(df), "rows")

stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()


def preprocess_text(text):

    text = str(text).lower()

    # remove numbers
    text = re.sub(r'\d+', '', text)

    # remove punctuation
    text = re.sub(r'[^\w\s]', '', text)

    # tokenization
    tokens = word_tokenize(text)

    # remove stopwords
    tokens = [word for word in tokens if word not in stop_words]

    # lemmatization
    tokens = [lemmatizer.lemmatize(word) for word in tokens]

    return " ".join(tokens)


print("Processing abstracts...")

df["processed_text"] = df["Abstract"].apply(preprocess_text)

# remove empty rows
df = df.dropna(subset=["processed_text"])

# save processed dataset
df.to_csv("processed_papers.csv", index=False)

print("processed_papers.csv created successfully!")
print("Total processed rows:", len(df))