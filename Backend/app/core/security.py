"""Hash kata sandi (bcrypt) dan pembuatan/pembacaan JWT access token."""

import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.core.config import settings


# --- Password ---
def hash_kata_sandi(kata_sandi: str) -> str:
    return bcrypt.hashpw(kata_sandi.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verifikasi_kata_sandi(kata_sandi: str, hash_tersimpan: str) -> bool:
    try:
        return bcrypt.checkpw(
            kata_sandi.encode("utf-8"),
            hash_tersimpan.encode("utf-8"),
        )
    except ValueError:
        # mis. password > 72 byte atau hash tersimpan tidak valid -> anggap tidak cocok
        return False


# --- JWT ---
def buat_jti() -> str:
    """Pengenal acak untuk satu sesi login (disimpan di sesi_login dan di dalam JWT)."""
    return secrets.token_urlsafe(32)


def buat_access_token(data: dict) -> str:
    """Bikin JWT access token. `data` minimal berisi `sub` (user id)."""
    to_encode = data.copy()
    # exp = batas umur mutlak sesi. Batas tidak-aktif (idle) dicek terpisah lewat tabel
    # sesi_login pada setiap request (lihat core/dependencies.py).
    expired = datetime.now(timezone.utc) + timedelta(hours=settings.SESI_MAKS_JAM)
    to_encode.update({"exp": expired})
    return jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def decode_access_token(token: str) -> dict:
    """Decode JWT. Raise JWTError kalau tidak valid/expired."""
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
    )
