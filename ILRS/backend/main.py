import os
import sqlite3
import shutil
import threading
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PyPDF2 import PdfReader
import requests

# API KEY
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Create uploads folder
os.makedirs("uploads", exist_ok=True)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
conn = sqlite3.connect("database.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    filename TEXT
)
""")
conn.commit()


# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {"message": "Backend running successfully"}


# =========================
# SERVE FILES
# =========================
@app.get("/files/{filename}")
def get_file(filename: str):
    file_path = f"uploads/{filename}"
    return FileResponse(file_path)


# =========================
# UPLOAD
# =========================
@app.post("/upload")
async def upload_paper(file: UploadFile = File(...)):
    try:
        file_location = os.path.join("uploads", file.filename)

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        cursor.execute(
            "INSERT INTO papers (title, filename) VALUES (?, ?)",
            (file.filename, file.filename),
        )
        conn.commit()

        return {"message": "File uploaded successfully"}

    except Exception as e:
        print("Upload Error:", e)
        return {"error": str(e)}


# =========================
# GET PAPERS
# =========================
@app.get("/papers")
def get_papers():
    cursor.execute("SELECT * FROM papers")
    data = cursor.fetchall()
    return {"papers": data}


# =========================
# SUMMARIZE
# =========================
@app.get("/summarize/{filename}")
def summarize_file(filename: str):
    try:
        print("Summarizing:", filename)

        file_path = f"uploads/{filename}"

        if not os.path.exists(file_path):
            return {"summary": "File not found"}

        reader = PdfReader(file_path)

        text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted

        if not text.strip():
            return {"summary": "No readable text found"}

        text = text.replace("\n", " ")
        text = text[:3000]

        result = {"summary": None}

        # OpenRouter function
        def run_openrouter():
            try:
                print("Calling OpenRouter...")

                response = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "openai/gpt-4o-mini",
                        "messages": [
                            {
                                "role": "user",
                                "content": f"""
Summarize this research paper:
- Use bullet points
- Keep it simple
- Highlight key ideas

TEXT:
{text}
"""
                            }
                        ]
                    },
                    timeout=20
                )

                data = response.json()

                if "choices" in data:
                    result["summary"] = data["choices"][0]["message"]["content"]
                    print("OpenRouter success")

            except Exception as e:
                print("OpenRouter error:", e)

        # Run thread
        t = threading.Thread(target=run_openrouter)
        t.start()
        t.join(timeout=25)

        if result["summary"]:
            return {"summary": result["summary"]}

        return {"summary": "Summary unavailable"}

    except Exception as e:
        print("Summary Error:", e)
        return {"summary": str(e)} 
    