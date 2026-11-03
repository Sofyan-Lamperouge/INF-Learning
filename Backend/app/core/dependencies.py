from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.services import auth_service


# Skema "Bearer <token>" di header Authorization
bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Pengguna:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak ada",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise JWTError("sub tidak ada")
        pengguna_id = int(sub)
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid atau sudah kedaluwarsa",
            headers={"WWW-Authenticate": "Bearer"},
        )

    pengguna = auth_service.get_pengguna_by_id(db, pengguna_id)
    if pengguna is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Pengguna tidak ditemukan",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if pengguna.status != "aktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda nonaktif",
        )

    return pengguna


def require_role(*peran_diizinkan: str):
    """Dependency factory: cek apakah user punya peran yang diizinkan."""
    def checker(pengguna: Pengguna = Depends(get_current_user)) -> Pengguna:
        if pengguna.peran not in peran_diizinkan:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Anda tidak memiliki akses ke endpoint ini",
            )
        return pengguna
    return checker