import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_kata_sandi
from app.crud import pengguna as crud_pengguna
from app.schemas.auth import RegistrasiRequest
from app.models.pengguna import Pengguna


POLA_NIM = re.compile(r"^2\d88\d{6}$")
POLA_NIP = re.compile(r"^\d{18}$")


def tentukan_peran(nomor_induk: str) -> str:
    """Tentukan peran otomatis dari pola NIM/NIP."""
    if POLA_NIM.match(nomor_induk):
        return "mahasiswa"
    if POLA_NIP.match(nomor_induk):
        return "dosen"
    # Seharusnya tidak sampai sini karena sudah divalidasi di schema
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Format NIM/NIP tidak dikenali",
    )


def registrasi(db: Session, data: RegistrasiRequest) -> Pengguna:
    # Cek duplikat nomor_induk
    if crud_pengguna.get_by_nomor_induk(db, data.nomor_induk):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Nomor induk sudah terdaftar",
        )


    # Tentukan peran
    peran = tentukan_peran(data.nomor_induk)

    # Hash password
    hash_sandi = hash_kata_sandi(data.kata_sandi)

    # Simpan
    pengguna = crud_pengguna.create(
    db,
    peran=peran,
    nomor_induk=data.nomor_induk,
    nama=data.nama,
    kata_sandi_hashed=hash_sandi,
    status="aktif",
    )
    return pengguna

from app.core.security import (
    buat_access_token,
    hash_kata_sandi,
    verifikasi_kata_sandi,
)
from app.schemas.auth import LoginRequest, LoginResponse, PenggunaRingkas
from app.core.config import settings


def login(db: Session, data: LoginRequest) -> LoginResponse:
    # Cari user
    pengguna = crud_pengguna.get_by_nomor_induk(db, data.nomor_induk)

    # Cek user ada & password cocok
    # (pesan error disamakan biar tidak bisa dipakai untuk enumerasi NIM)
    if not pengguna or not verifikasi_kata_sandi(
        data.kata_sandi, pengguna.kata_sandi
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nomor induk atau kata sandi salah",
        )

    # Cek status
    if pengguna.status != "aktif":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun Anda nonaktif",
        )

    # Bikin token
    access_token = buat_access_token({"sub": str(pengguna.id)})

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        pengguna=PenggunaRingkas.model_validate(pengguna),
    )


def get_pengguna_by_id(db: Session, pengguna_id: int) -> Pengguna | None:
    return db.query(Pengguna).filter(Pengguna.id == pengguna_id).first()