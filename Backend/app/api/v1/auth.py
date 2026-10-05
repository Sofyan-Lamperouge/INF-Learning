from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    PenggunaRingkas,
    RegistrasiRequest,
    RegistrasiResponse,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/registrasi",
    response_model=RegistrasiResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Daftar akun baru",
    description=(
        "Mendaftarkan akun baru. Peran (dosen/mahasiswa) ditentukan otomatis "
        "berdasarkan pola NIM/NIP. Lihat `docs/ATURAN_POLA_NIM_NIP.md`."
    ),
)
def registrasi(
    data: RegistrasiRequest,
    db: Session = Depends(get_db),
):
    return auth_service.registrasi(db, data)


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Login",
    description="Login dengan nomor_induk dan kata_sandi. Mengembalikan access token JWT.",
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    return auth_service.login(db, data)


@router.get(
    "/me",
    response_model=PenggunaRingkas,
    status_code=status.HTTP_200_OK,
    summary="Info user login",
    description="Ambil data user yang sedang login. Butuh header Authorization: Bearer <token>.",
)
def me(pengguna: Pengguna = Depends(get_current_user)):
    return pengguna