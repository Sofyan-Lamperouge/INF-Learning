"""Autentikasi: registrasi (aktivasi akun) dan login."""

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


def registrasi(db: Session, data: RegistrasiRequest) -> Pengguna:
    """Registrasi = aktivasi akun: set kata sandi dan ubah status menjadi 'aktif'.

    NIM harus sudah diinput admin sebelumnya.
    """
    pengguna = crud_pengguna.get_by_nomor_induk(db, data.nomor_induk)

    if not pengguna:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NIM tidak terdaftar. Hubungi admin.",
        )

    # Diblokir admin
    if pengguna.status == "nonaktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda dinonaktifkan. Hubungi admin.",
        )

    # Sudah aktif DAN sudah punya kata sandi. Jika admin mengubah status menjadi "aktif"
    # padahal kata sandi belum pernah dibuat, registrasi tetap diizinkan (agar akun tidak terkunci).
    if pengguna.status == "aktif" and pengguna.kata_sandi:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Akun sudah aktif. Silakan login.",
        )

    pengguna.kata_sandi = hash_kata_sandi(data.kata_sandi)
    pengguna.status = "aktif"
    db.commit()
    db.refresh(pengguna)

    return pengguna


def login(db: Session, data: LoginRequest) -> LoginResponse:
    pengguna = crud_pengguna.get_by_nomor_induk(db, data.nomor_induk)

    # Pesan sengaja sama untuk NIM tidak ada, belum punya kata sandi, dan kata sandi salah
    # agar NIM yang terdaftar tidak bisa ditebak.
    if (
        not pengguna
        or not pengguna.kata_sandi
        or not verifikasi_kata_sandi(data.kata_sandi, pengguna.kata_sandi)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="NIM atau kata sandi salah",
        )

    if pengguna.status != "aktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda belum aktif. Silakan registrasi terlebih dahulu.",
        )

    return LoginResponse(
        access_token=buat_access_token({"sub": str(pengguna.id)}),
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        pengguna=PenggunaRingkas.model_validate(pengguna),
    )
