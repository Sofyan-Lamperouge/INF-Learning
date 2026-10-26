# Backend/app/schemas/mahasiswa.py
#
# [DIUBAH]
#  - MahasiswaUpdateRequest.status dibatasi: belum_aktif / aktif / nonaktif (sebelumnya string bebas).
#  - [BARU] MahasiswaListResponse, dipakai sebagai response_model GET /mahasiswa
#    supaya hash kata_sandi tidak ikut terkirim ke klien.

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator
import re

POLA_NIM = re.compile(r"^2\d88\d{6}$")


class MahasiswaCreateRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=10, max_length=10)
    nama: str = Field(..., min_length=3, max_length=100)
    angkatan: int | None = None

    @field_validator("nomor_induk")
    @classmethod
    def validasi_nim(cls, v: str) -> str:
        v = v.strip()
        if not POLA_NIM.match(v):
            raise ValueError("Format NIM tidak dikenali")
        return v


class MahasiswaUpdateRequest(BaseModel):
    nama: str | None = Field(None, min_length=3, max_length=100)
    angkatan: int | None = None
    status: Literal["belum_aktif", "aktif", "nonaktif"] | None = None  # [DIUBAH]


class MahasiswaResponse(BaseModel):
    id: int
    nomor_induk: str
    nama: str
    angkatan: int | None
    status: str
    dibuat_pada: datetime

    model_config = {"from_attributes": True}


# [BARU]
class MahasiswaListResponse(BaseModel):
    items: list[MahasiswaResponse]
    total: int
    page: int
    limit: int
    total_pages: int