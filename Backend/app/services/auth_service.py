# Backend/app/services/auth_service.py
#
# [DIUBAH] registrasi(): cek "akun sudah aktif" sekarang juga memeriksa kata_sandi.
# Sebelumnya, kalau admin mengubah status jadi "aktif" padahal password belum pernah dibuat,
# registrasi ditolak (409) dan login juga gagal -> akun terkunci selamanya.
# Fungsi login dan get_pengguna_by_id tidak berubah.

import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    buat_access_token,
    hash_kata_sandi,
    verifikasi_kata_sandi,
)
from app.crud import pengguna as crud_pengguna
from app.models.pengguna import Pengguna
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    PenggunaRingkas,
    RegistrasiRequest,
)

POLA_NIM = re.compile(r"^2\d88\d{6}$")


# ============================================================
# Registrasi (Aktivasi Akun)
# ============================================================
def registrasi(db: Session, data: RegistrasiRequest) -> Pengguna:
    """
    Registrasi = aktivasi akun.
    NIM harus sudah diinput admin sebelumnya.
    Set password + ubah status jadi 'aktif'.
    """
    # 1. Cari pengguna by NIM
    pengguna = crud_pengguna.get_by_nomor_induk(db, data.nomor_induk)

    # 2. Tidak ada -> 404
    if not pengguna:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NIM tidak terdaftar. Hubungi admin.",
        )

    # 3. Nonaktif (di-block admin) -> 403
    if pengguna.status == "nonaktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda dinonaktifkan. Hubungi admin.",
        )

    # 4. Sudah aktif DAN sudah punya password -> 409   [DIUBAH]
    if pengguna.status == "aktif" and pengguna.kata_sandi:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Akun sudah aktif. Silakan login.",
        )

    # 5. Set password + aktifkan
    pengguna.kata_sandi = hash_kata_sandi(data.kata_sandi)
    pengguna.status = "aktif"
    db.commit()
    db.refresh(pengguna)

    return pengguna


# ============================================================
# Login (tidak berubah)
# ============================================================
def login(db: Session, data: LoginRequest) -> LoginResponse:
    pengguna = crud_pengguna.get_by_nomor_induk(db, data.nomor_induk)

    if not pengguna or not pengguna.kata_sandi:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="NIM atau kata sandi salah",
        )

    if not verifikasi_kata_sandi(data.kata_sandi, pengguna.kata_sandi):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="NIM atau kata sandi salah",
        )

    if pengguna.status != "aktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda belum aktif. Silakan registrasi terlebih dahulu.",
        )

    access_token = buat_access_token({"sub": str(pengguna.id)})

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        pengguna=PenggunaRingkas.model_validate(pengguna),
    )


def get_pengguna_by_id(db: Session, pengguna_id: int) -> Pengguna | None:
    return db.query(Pengguna).filter(Pengguna.id == pengguna_id).first()