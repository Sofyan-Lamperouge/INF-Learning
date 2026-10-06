import re
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


# ============================================================
# Konstanta pola NIM/NIP
# ============================================================
POLA_NIM = re.compile(r"^2\d88\d{6}$")
POLA_NIP = re.compile(r"^\d{18}$")


class RegistrasiRequest(BaseModel):
    nama: str = Field(..., min_length=3, max_length=100)
    nomor_induk: str = Field(..., min_length=8, max_length=18)
    email: EmailStr
    kata_sandi: str = Field(..., min_length=8, max_length=72)
    konfirmasi_kata_sandi: str = Field(..., min_length=8, max_length=72)

    @field_validator("nomor_induk")
    @classmethod
    def validasi_nomor_induk(cls, v: str) -> str:
        v = v.strip()
        if POLA_NIM.match(v) or POLA_NIP.match(v):
            return v
        raise ValueError("Format NIM/NIP tidak dikenali")

    @model_validator(mode="after")
    def cek_konfirmasi_kata_sandi(self):
        if self.kata_sandi != self.konfirmasi_kata_sandi:
            raise ValueError("Konfirmasi kata sandi tidak cocok")
        return self


class RegistrasiResponse(BaseModel):
    id: int
    peran: str
    nomor_induk: str
    nama: str
    email: str
    status: str
    dibuat_pada: datetime

    model_config = {"from_attributes": True}

# ============================================================
# Schema untuk Login
# ============================================================
class LoginRequest(BaseModel):
    nomor_induk: str = Field(..., min_length=3, max_length=50)
    kata_sandi: str = Field(..., min_length=1, max_length=72)


class PenggunaRingkas(BaseModel):
    id: int
    peran: str
    nomor_induk: str
    nama: str
    email: str
    status: str

    model_config = {"from_attributes": True}


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    pengguna: PenggunaRingkas