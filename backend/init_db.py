from database import engine, Base, get_db
import models

# =========================
# SQLAlchemy Tables
# =========================
Base.metadata.create_all(bind=engine)
print(" SQLAlchemy tables created")


# =========================
# SQLite Manual Tables
# =========================

conn = get_db() 
cursor = conn.cursor() 

#  SEARCH HISTORY TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT
)
""")
print(" search_history table created")


#  CONTACT US TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT
)
""")
print(" contact_messages table created")


#  UPLOADED PAPERS TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS uploaded_papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    content TEXT
)
""")
print(" uploaded_papers table created")


#  SUPPORT REQUESTS TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS support_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    message TEXT
)
""")
print(" support_requests table created")


#  SAVED PAPERS (LIBRARY) TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS saved_papers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    abstract TEXT,
    link TEXT
)
""")
print(" saved_papers table created")


# =========================
# SAVE & CLOSE
# =========================
conn.commit()
conn.close()

print(" All tables ready successfully ")