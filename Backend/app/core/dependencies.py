"""Dependency FastAPI: sesi login, pengguna yang sedang login, dan pembatasan peran."""

from datetime import timedelta
from hmac import compare_digest

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.core.waktu import sekarang_utc
from app.crud import sesi as crud_sesi
from app.db.session import get_db
from app.models.pengguna import Pengguna, SesiLogin

# Skema "Bearer <token>" di header Authorization
bearer_scheme = HTTPBearer(auto_error=False)

# Perpanjangan sesi hanya ditulis ke database jika sudah bergeser lebih dari ini,
# supaya tidak ada UPDATE pada setiap request.
_JEDA_PERBARUI = timedelta(seconds=60)


def _tidak_terautentikasi(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_sesi_aktif(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> SesiLogin:
    """Validasi token + sesi di database, lalu perpanjang batas tidak-aktif.

    Sesi dianggap berakhir jika tidak ada request selama SESI_IDLE_MENIT menit.
    """
    if credentials is None:
        raise _tidak_terautentikasi("Token tidak ada")

    try:
        payload = decode_access_token(credentials.credentials)
        pengguna_id = int(payload["sub"])
        sesi_id = int(payload["sid"])
        jti = str(payload["jti"])
    except (JWTError, ValueError, KeyError, TypeError):
        # Termasuk token lama (tanpa sid/jti) yang diterbitkan sebelum fitur sesi ada.
        raise _tidak_terautentikasi("Token tidak valid atau sudah kedaluwarsa") from None

    sesi = crud_sesi.get_by_id(db, sesi_id)
    if sesi is None or sesi.pengguna_id != pengguna_id or not compare_digest(sesi.token, jti):
        raise _tidak_terautentikasi("Sesi tidak ditemukan atau sudah berakhir. Silakan login kembali")

    sekarang = sekarang_utc()
    if sesi.kedaluwarsa_pada <= sekarang:
        crud_sesi.hapus(db, sesi)
        raise _tidak_terautentikasi(
            f"Sesi berakhir karena tidak ada aktivitas selama {settings.SESI_IDLE_MENIT} menit. "
            "Silakan login kembali"
        )

    batas_baru = sekarang + timedelta(minutes=settings.SESI_IDLE_MENIT)
    if batas_baru - sesi.kedaluwarsa_pada > _JEDA_PERBARUI:
        sesi.kedaluwarsa_pada = batas_baru
        db.commit()

    return sesi


def get_current_user(sesi: SesiLogin = Depends(get_sesi_aktif)) -> Pengguna:
    pengguna = sesi.pengguna
    if pengguna is None:
        raise _tidak_terautentikasi("Pengguna tidak ditemukan")

    # Status dicek di database pada setiap request, jadi akun yang dinonaktifkan admin
    # langsung ditolak walau sesinya belum berakhir.
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
