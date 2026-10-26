# Backend/app/schemas/auth.py
#
# [DIUBAH]
#  - konfirmasi_kata_sandi sekarang OPSIONAL. Kalau dikirim, tetap harus sama dengan kata_sandi.
#    Frontend boleh mengirim nilai yang sama dengan password, atau tidak mengirimnya sama sekali.
#  - Validator panjang password dalam BYTE (bcrypt maks 72 byte, max_length hanya menghitung karakter).

import re
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator


POLA_NIM = re.compile(r"^2\d88\d{6}$")


def _cek_byte(v: str) -> str:
    if len(v.encode("utf-8")) > 72:
        raise ValueError("Kata sandi terlalu panjang (maksimal 72 byte)")
    return v


class RegistrasiRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=10, max_length=10)
    kata_sandi: str = Field(..., min_length=8, max_length=72)
    konfirmasi_kata_sandi: str | None = Field(None, min_length=8, max_length=72)  # [DIUBAH] opsional

    @field_validator("nomor_induk")
    @classmethod
    def validasi_nim(cls, v: str) -> str:
        v = v.strip()
        if not POLA_NIM.match(v):
            raise ValueError("Format NIM tidak dikenali")
        return v

    @field_validator("kata_sandi", "konfirmasi_kata_sandi")
    @classmethod
    def validasi_byte(cls, v: str | None) -> str | None:  # [BARU]
        return v if v is None else _cek_byte(v)

    @model_validator(mode="after")
    def cek_konfirmasi_kata_sandi(self):
        if (
            self.konfirmasi_kata_sandi is not None
            and self.kata_sandi != self.konfirmasi_kata_sandi
        ):
            raise ValueError("Konfirmasi kata sandi tidak cocok")
        return self


class RegistrasiResponse(BaseModel):
    id: int
    peran: str
    nomor_induk: str
    nama: str
    status: str
    dibuat_pada: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=3, max_length=50)
    kata_sandi: str = Field(..., min_length=8, max_length=72)


class PenggunaRingkas(BaseModel):
    id: int
    peran: str
    nomor_induk: str
    nama: str
    status: str

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    pengguna: PenggunaRingkas