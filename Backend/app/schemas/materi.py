from datetime import datetime
from pydantic import BaseModel, Field, field_validator


VALID_JENIS = {"pdf", "ppt", "pptx", "doc", "docx", "xls", "xlsx"}


class MateriCreateRequest(BaseModel):
    judul: str = Field(..., min_length=3, max_length=200)
    deskripsi: str | None = Field(None, max_length=2000)
    mata_kuliah: str = Field(..., min_length=2, max_length=100)
    semester: int = Field(..., ge=1, le=8)
    jenis: str = Field(..., min_length=3, max_length=20)
    url: str = Field(..., min_length=5, max_length=500)

    @field_validator("jenis")
    @classmethod
    def validasi_jenis(cls, v: str) -> str:
        v = v.strip().lower()
        if v not in VALID_JENIS:
            raise ValueError(
                f"Jenis harus salah satu dari: {', '.join(sorted(VALID_JENIS))}"
            )
        return v

    @field_validator("url")
    @classmethod
    def validasi_url(cls, v: str) -> str:
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("URL harus dimulai dengan http:// atau https://")
        return v


class MateriUpdateRequest(BaseModel):
    judul: str | None = Field(None, min_length=3, max_length=200)
    deskripsi: str | None = Field(None, max_length=2000)
    mata_kuliah: str | None = Field(None, min_length=2, max_length=100)
    semester: int | None = Field(None, ge=1, le=8)
    jenis: str | None = Field(None, min_length=3, max_length=20)
    url: str | None = Field(None, min_length=5, max_length=500)
    status: str | None = None

    @field_validator("jenis")
    @classmethod
    def validasi_jenis(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip().lower()
        if v not in VALID_JENIS:
            raise ValueError(
                f"Jenis harus salah satu dari: {', '.join(sorted(VALID_JENIS))}"
            )
        return v

    @field_validator("url")
    @classmethod
    def validasi_url(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip()
        if not (v.startswith("http://") or v.startswith("https://")):
            raise ValueError("URL harus dimulai dengan http:// atau https://")
        return v

    @field_validator("status")
    @classmethod
    def validasi_status(cls, v: str | None) -> str | None:
        if v is None:
            return v
        v = v.strip().lower()
        if v not in {"draft", "terbit", "arsip"}:
            raise ValueError("Status harus: draft, terbit, atau arsip")
        return v


class MateriResponse(BaseModel):
    id: int
    judul: str
    deskripsi: str | None
    mata_kuliah: str
    semester: int
    jenis: str
    url: str
    dibuat_oleh: int | None
    status: str
    dibuat_pada: datetime
    diubah_pada: datetime

    model_config = {"from_attributes": True}