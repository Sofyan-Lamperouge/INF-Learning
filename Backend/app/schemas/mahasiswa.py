# Backend/app/schemas/mahasiswa.py
#
# [DIUBAH]
#  - MahasiswaUpdateRequest.status dibatasi: belum_aktif / aktif / nonaktif.
#  - MahasiswaListResponse dipakai sebagai response_model GET /mahasiswa
#    supaya hash kata_sandi tidak ikut terkirim ke klien.
#  - [BARU] nama di-trim dan tidak boleh hanya spasi.
#  - [BARU] angkatan dibatasi 2000-2100.
#  - [BARU] MahasiswaUpdateRequest.nomor_induk (hanya boleh untuk akun yang belum diaktivasi,
#    aturannya diperiksa di mahasiswa_service).

import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator

POLA_NIM = re.compile(r"^2\d88\d{6}$")

StatusAkun = Literal["belum_aktif", "aktif", "nonaktif"]


def _validasi_nim(v: str) -> str:
    v = v.strip()
    if not POLA_NIM.match(v):
        raise ValueError("Format NIM tidak dikenali")
    return v


def _validasi_nama(v: str) -> str:
    v = " ".join(v.split())  # buang spasi di tepi dan rapikan spasi ganda
    if len(v) < 3:
        raise ValueError("Nama minimal 3 karakter")
    return v


class MahasiswaCreateRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=10, max_length=10)
    nama: str = Field(..., min_length=3, max_length=100)
    angkatan: int | None = Field(None, ge=2000, le=2100)

    @field_validator("nomor_induk")
    @classmethod
    def cek_nim(cls, v: str) -> str:
        return _validasi_nim(v)

    @field_validator("nama")
    @classmethod
    def cek_nama(cls, v: str) -> str:
        return _validasi_nama(v)


class MahasiswaUpdateRequest(BaseModel):
    nomor_induk: str | None = Field(None, min_length=10, max_length=10)
    nama: str | None = Field(None, min_length=3, max_length=100)
    angkatan: int | None = Field(None, ge=2000, le=2100)
    status: StatusAkun | None = None

    @field_validator("nomor_induk")
    @classmethod
    def cek_nim(cls, v: str | None) -> str | None:
        return None if v is None else _validasi_nim(v)

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
    dibuat_pada: datetime

    model_config = {"from_attributes": True}


class MahasiswaListResponse(BaseModel):
    items: list[MahasiswaResponse]
    total: int
    page: int
    limit: int
    total_pages: int