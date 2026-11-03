# Backend/app/core/security.py

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings


# ============================================================
# Password
# ============================================================
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


# ============================================================
# JWT (tidak berubah)
# ============================================================
def buat_access_token(data: dict) -> str:
    """Bikin JWT access token. `data` minimal berisi `sub` (user id)."""
    to_encode = data.copy()
    expired = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
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