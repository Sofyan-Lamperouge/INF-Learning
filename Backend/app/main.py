"""Titik masuk aplikasi FastAPI: middleware, router, file statis, dan endpoint kesehatan."""

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.api.v1 import admin, auth, dashboard_mahasiswa, mahasiswa, materi
from app.core.config import settings
from app.db.session import engine

logger = logging.getLogger(__name__)

API_PREFIX = "/api/v1"

# PENTING: dashboard_mahasiswa harus didaftarkan SEBELUM mahasiswa, supaya
# GET /mahasiswa/dashboard tidak ditangkap oleh GET /mahasiswa/{id}.
ROUTERS = (
    auth.router,
    materi.router,
    admin.router,
    dashboard_mahasiswa.router,
    mahasiswa.router,
)

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in ROUTERS:
    app.include_router(router, prefix=API_PREFIX)

# File upload dilayani statis dari UPLOAD_DIR (production: folder di Railway Volume)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/", tags=["root"])
def root():
    return {"app": settings.APP_NAME, "status": "ok"}


@app.get("/health", tags=["health"])
def health():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        # Detail error hanya ke log server, tidak dibocorkan ke klien (bisa memuat host/kredensial)
        logger.exception("Health check: koneksi database gagal")
        db_status = "error"
    return {"status": "ok", "database": db_status}
