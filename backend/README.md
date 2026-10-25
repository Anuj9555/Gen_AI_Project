# WanderAI Backend API

FastAPI backend with Controller-Service-Repository architecture, Supabase integration, and multi-provider AI itinerary planning engine.

## Setup & Run

### 1. Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in Supabase or AI provider keys as needed.

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 4. Run Test Suite
```bash
pytest
```
