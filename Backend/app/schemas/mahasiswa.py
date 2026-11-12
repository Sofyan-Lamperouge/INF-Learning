"""Schema CRUD mahasiswa (admin), ringkasan, dan impor CSV."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

from app.core.validators import validasi_nim
from app.schemas.tipe import StatusAkun

ANGKATAN_MIN = 2000
ANGKATAN_MAKS = 2100


def _validasi_nama(v: str) -> str:
    v = " ".join(v.split())  # buang spasi di tepi dan rapikan spasi ganda
    if len(v) < 3:
        raise ValueError("Nama minimal 3 karakter")
    return v


class MahasiswaCreateRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=10, max_length=10)
    nama: str = Field(..., min_length=3, max_length=100)
    angkatan: int | None = Field(None, ge=ANGKATAN_MIN, le=ANGKATAN_MAKS)

    @field_validator("nomor_induk")
    @classmethod
    def cek_nim(cls, v: str) -> str:
        return validasi_nim(v)

    @field_validator("nama")
    @classmethod
    def cek_nama(cls, v: str) -> str:
        return _validasi_nama(v)


class MahasiswaUpdateRequest(BaseModel):
    """Semua field opsional. `angkatan: null` mengosongkan angkatan; null pada field lain diabaikan.

    `nomor_induk` hanya bisa diganti untuk akun yang belum diaktivasi (aturan di service).
    """

    nomor_induk: str | None = Field(None, min_length=10, max_length=10)
    nama: str | None = Field(None, min_length=3, max_length=100)
    angkatan: int | None = Field(None, ge=ANGKATAN_MIN, le=ANGKATAN_MAKS)
    status: StatusAkun | None = None

    @field_validator("nomor_induk")
    @classmethod
    def cek_nim(cls, v: str | None) -> str | None:
        return None if v is None else validasi_nim(v)

    @field_validator("nama")
    @classmethod
    def cek_nama(cls, v: str | None) -> str | None:
        return None if v is None else _validasi_nama(v)


class MahasiswaResponse(BaseModel):
    id: int
    nomor_induk: str
    nama: str
    angkatan: int | None
    status: str
    foto_url: str | None = None
    dibuat_pada: datetime

    model_config = {"from_attributes": True}


class MahasiswaListResponse(BaseModel):
    items: list[MahasiswaResponse]
    total: int
    page: int
    limit: int
    total_pages: int


class RingkasanMahasiswaResponse(BaseModel):
    """Jumlah mahasiswa per status akun (untuk kartu statistik halaman Kelola Mahasiswa)."""

    total: int
    belum_aktif: int
    aktif: int
    nonaktif: int


class BarisImportBermasalah(BaseModel):
    baris: int  # nomor baris di file CSV (baris 1 = header)
    nomor_induk: str | None
    status: Literal["dilewati", "gagal"]
    alasan: str


class ImportMahasiswaResponse(BaseModel):
    """Laporan impor CSV. Pada mode simulasi tidak ada data yang disimpan."""

    simulasi: bool
    total_baris: int
    ditambahkan: int  # simulasi=true: jumlah yang AKAN ditambahkan
    dilewati: int  # NIM sudah terdaftar / dobel di file
    gagal: int  # data baris tidak valid
    masalah: list[BarisImportBermasalah]
