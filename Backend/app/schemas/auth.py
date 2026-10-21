import re
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator


POLA_NIM = re.compile(r"^2\d88\d{6}$")

class RegistrasiRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=10, max_length=10)
    kata_sandi: str = Field(..., min_length=8, max_length=72)
    konfirmasi_kata_sandi: str = Field(..., min_length=8, max_length=72)

    @field_validator("nomor_induk")
    @classmethod
    def validasi_nim(cls, v: str) -> str:
        v = v.strip()
        if not POLA_NIM.match(v):
            raise ValueError("Format NIM tidak dikenali")
        return v

class RegistrasiResponse(BaseModel):
    id: int
    peran: str
    nomor_induk: str
    nama: str
    status: str
    dibuat_pada: datetime

    model_config = {
        "from_attributes": True
    }


class LoginRequest(BaseModel):
    nomor_induk: str = Field(
        ...,
        min_length=3,
        max_length=50,
    )

    kata_sandi: str = Field(
        ...,
        min_length=8,
        max_length=72,
    )


class PenggunaRingkas(BaseModel):
    id: int
    peran: str
    nomor_induk: str
    nama: str
    status: str
    model_config = {
        "from_attributes": True
    }


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    pengguna: PenggunaRingkas