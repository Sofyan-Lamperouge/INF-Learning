"""Schema autentikasi: registrasi (aktivasi akun), login, dan data pengguna ringkas."""

from datetime import datetime

from pydantic import BaseModel, Field, field_validator, model_validator

from app.core.validators import validasi_nim

BATAS_BYTE_KATA_SANDI = 72  # batas bcrypt, dihitung dalam byte (bukan karakter)


def _cek_byte(v: str) -> str:
    if len(v.encode("utf-8")) > BATAS_BYTE_KATA_SANDI:
        raise ValueError("Kata sandi terlalu panjang (maksimal 72 byte)")
    return v


class RegistrasiRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=10, max_length=10)
    kata_sandi: str = Field(..., min_length=8, max_length=72)
    # Opsional. Jika dikirim, harus sama dengan kata_sandi.
    konfirmasi_kata_sandi: str | None = Field(None, min_length=8, max_length=72)

    @field_validator("nomor_induk")
    @classmethod
    def cek_nim(cls, v: str) -> str:
        return validasi_nim(v)

    @field_validator("kata_sandi", "konfirmasi_kata_sandi")
    @classmethod
    def validasi_byte(cls, v: str | None) -> str | None:
        return v if v is None else _cek_byte(v)

    @model_validator(mode="after")
    def cek_konfirmasi_kata_sandi(self):
        if self.konfirmasi_kata_sandi is not None and self.kata_sandi != self.konfirmasi_kata_sandi:
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
    # Lama tidak-aktif (detik) sebelum sesi berakhir. Diperpanjang oleh setiap request.
    expires_in: int
    pengguna: PenggunaRingkas
