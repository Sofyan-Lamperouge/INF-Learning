"""Pemeriksaan hak akses saat sebuah file upload dibuka lewat URL bertanda tangan."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.waktu import sekarang_utc
from app.crud import materi as crud_materi
from app.crud import pengguna as crud_pengguna
from app.crud import sesi as crud_sesi

PESAN_TAUTAN = "Tautan file tidak valid atau sudah kedaluwarsa"


def _ditolak() -> HTTPException:
    # Satu pesan untuk semua kegagalan sesi/akun, supaya tidak jadi petunjuk bagi penyerang.
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=PESAN_TAUTAN)


def _tanpa_hak() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, detail="Anda tidak memiliki akses ke file ini"
    )


def _tidak_ada() -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File tidak ditemukan")


def periksa_akses(db: Session, nama: str, sesi_id: int) -> None:
    """Pastikan sesi pemilik URL masih aktif, akunnya aktif, dan perannya berhak atas file ini.

    Sengaja TIDAK memperpanjang sesi: membuka file bukan aktivitas pengguna.
    Aturan: admin boleh semua file. Mahasiswa hanya boleh materi berstatus `terbit` dan
    foto profilnya sendiri.
    """
    sesi = crud_sesi.get_by_id(db, sesi_id)
    if sesi is None or sesi.kedaluwarsa_pada <= sekarang_utc():
        raise _ditolak()
    pengguna = sesi.pengguna
    if pengguna is None or pengguna.status != "aktif":
        raise _ditolak()

    if nama.startswith("foto-"):
        pemilik = crud_pengguna.get_by_nama_foto(db, nama)
        if pemilik is None:
            raise _tidak_ada()
        if pengguna.peran != "admin" and pemilik.id != pengguna.id:
            raise _tanpa_hak()
        return

    materi = crud_materi.get_by_nama_berkas(db, nama)
    if materi is None:
        raise _tidak_ada()
    if pengguna.peran != "admin" and materi.status != "terbit":
        raise _tanpa_hak()
