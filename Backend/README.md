# INF-Learning Backend

FastAPI + MySQL.

## Setup

1. Buat venv: `python -m venv venv`
2. Aktifkan: `venv\Scripts\activate.bat`
3. Install: `pip install -r requirements.txt`
4. Copy `.env.example` ke `.env`, isi `JWT_SECRET`
5. Jalankan: `uvicorn app.main:app --reload`
6. Buka http://localhost:8000/docs