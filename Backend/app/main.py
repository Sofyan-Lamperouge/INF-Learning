"""Titik masuk aplikasi FastAPI: middleware, router, file statis, dan endpoint kesehatan."""

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text

from app.api.v1 import admin, auth, dashboard_mahasiswa, kontak_admin, mahasiswa, materi, profil
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
    profil.router,
    kontak_admin.router,
    mahasiswa.router,
)

IS_PRODUCTION = settings.APP_ENV.strip().lower() == "production"

# Di production dokumentasi API (/docs, /redoc, /openapi.json) dimatikan agar peta endpoint
# tidak terbuka untuk umum. Di development tetap aktif.
app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
)

if IS_PRODUCTION and "*" in settings.cors_origins_list:
    # Tidak menghentikan aplikasi, hanya mengingatkan di log Railway.
    logger.warning("CORS_ORIGINS masih '*' di production. Isi dengan domain frontend resmi.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    # Tanpa ini, JavaScript di FE tidak bisa membaca nama file dari unduhan lintas-origin
    expose_headers=["Content-Disposition"],
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