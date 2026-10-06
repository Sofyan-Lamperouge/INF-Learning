from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================================================
# Password
# ============================================================
def hash_kata_sandi(kata_sandi: str) -> str:
    return pwd_context.hash(kata_sandi)


def verifikasi_kata_sandi(kata_sandi: str, hash_tersimpan: str) -> bool:
    return pwd_context.verify(kata_sandi, hash_tersimpan)


# ============================================================
# JWT
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