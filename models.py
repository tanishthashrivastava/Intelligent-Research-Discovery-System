from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


# ================= USER =================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    plan = Column(String, default="Free")


# ================= LOGIN HISTORY =================
class LoginHistory(Base):
    __tablename__ = "login_history"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    login_time = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )


# ================= SEARCH HISTORY =================
class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index= True)
    email = Column(String, nullable=True)
    query = Column(String)
    created_at = Column( 
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )


# ================= SAVED PAPERS =================
class SavedPaper(Base):
    __tablename__ = "saved_papers"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    title = Column(String)
    abstract = Column(Text)
    link = Column(String)


# ================= UPLOADED PAPERS =================
class UploadedPaper(Base):
    __tablename__ = "uploaded_papers"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    filename = Column(String)
    content = Column(Text) 

# ==================PAPER SUMMARY==================
class PaperSummary(Base):
    __tablename__ = "paper_summaries"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    summary = Column(Text)
    created_at = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    
# ================= AI HISTORY =================
class AIHistory(Base):
    __tablename__ = "ai_history"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    question = Column(Text)
    answer = Column(Text)
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    ) 


# ================= DASHBOARD ACTIVITY =================
class DashboardActivity(Base):
    __tablename__ = "dashboard_activity"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    activity = Column(String)
    details = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ================= CONTACT =================
class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    subject = Column(String)
    message = Column(Text)
    created_at = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ) 


# ================= CITATIONS =================
class Citation(Base):
    __tablename__ = "citations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    citation = Column(Text)
    created_at = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ) 

# ================= ANALYSIS HISTORY =================

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    papers = Column(Text)
    analysis = Column(Text)
    created_at = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ) 

# Support Ticket
class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True)
    name = Column(String)
    email = Column(String)
    issue_type = Column(String)
    message = Column(Text)
    status = Column(String, default="Open")
    created_at = Column(
        String,
        default=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ) 
