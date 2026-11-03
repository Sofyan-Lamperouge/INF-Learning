"""Dependency FastAPI: pengguna yang sedang login dan pembatasan peran."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.crud import pengguna as crud_pengguna
from app.db.session import get_db
from app.models.pengguna import Pengguna

# Skema "Bearer <token>" di header Authorization
bearer_scheme = HTTPBearer(auto_error=False)


def _tidak_terautentikasi(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Pengguna:
    if credentials is None:
        raise _tidak_terautentikasi("Token tidak ada")

    try:
        payload = decode_access_token(credentials.credentials)
        sub = payload.get("sub")
        if sub is None:
            raise JWTError("sub tidak ada")
        pengguna_id = int(sub)
    except (JWTError, ValueError):
        raise _tidak_terautentikasi("Token tidak valid atau sudah kedaluwarsa") from None

    pengguna = crud_pengguna.get_by_id(db, pengguna_id)
    if pengguna is None:
        raise _tidak_terautentikasi("Pengguna tidak ditemukan")

    # Status dicek di database pada setiap request, jadi akun yang dinonaktifkan admin
    # langsung ditolak walau tokennya belum kedaluwarsa.
    if pengguna.status != "aktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda nonaktif",
        )

    return pengguna


def require_role(*peran_diizinkan: str):
    """Dependency factory: hanya izinkan pengguna dengan salah satu peran yang disebut."""

    def checker(pengguna: Pengguna = Depends(get_current_user)) -> Pengguna:
        if pengguna.peran not in peran_diizinkan:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Anda tidak memiliki akses ke endpoint ini",
            )
        return pengguna

    return checker
