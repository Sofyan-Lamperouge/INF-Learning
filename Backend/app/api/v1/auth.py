"""Endpoint autentikasi: registrasi (aktivasi akun), login, dan data pengguna saat ini."""

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_sesi_aktif
from app.db.session import get_db
from app.models.pengguna import Pengguna, SesiLogin
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    PenggunaRingkas,
    RegistrasiRequest,
    RegistrasiResponse,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


def _alamat_ip(request: Request) -> str | None:
    """IP klien. Di Railway request melewati proxy, jadi pakai X-Forwarded-For bila ada."""
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else None


@router.post(
    "/registrasi",
    response_model=RegistrasiResponse,
    status_code=status.HTTP_200_OK,
    summary="Aktivasi akun mahasiswa",
    description=(
        "Aktivasi akun dengan NIM yang sudah diinput admin. "
        "Set password dan ubah status akun jadi aktif."
    ),
)
def registrasi(data: RegistrasiRequest, db: Session = Depends(get_db)):
    return auth_service.registrasi(db, data)


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Login dan ambil access token",
    description=(
        "Sesi berakhir otomatis jika tidak ada aktivitas selama `expires_in` detik "
        "(default 20 menit). Setiap request ke API memperpanjang sesi."
    ),
)
def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    return auth_service.login(
        db,
        data,
        perangkat=request.headers.get("user-agent"),
        alamat_ip=_alamat_ip(request),
    )


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="Logout (akhiri sesi di server)",
    description="Menghapus sesi saat ini; token yang sama langsung tidak berlaku lagi.",
)
def logout(sesi: SesiLogin = Depends(get_sesi_aktif), db: Session = Depends(get_db)):
    auth_service.logout(db, sesi)
    return {"detail": "Berhasil keluar"}


@router.get(
    "/me",
    response_model=PenggunaRingkas,
    status_code=status.HTTP_200_OK,
    summary="Data pengguna yang sedang login",
)
def me(pengguna: Pengguna = Depends(get_current_user)):
    return pengguna
