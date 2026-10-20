from datetime import datetime
from pydantic import BaseModel, Field

# ==========================================
# SCHEMA UNTUK KUIS
# ==========================================
class KuisCreateRequest(BaseModel):
    judul: str = Field(..., min_length=3, max_length=200)
    deskripsi: str | None = None
    durasi_menit: int = Field(30, ge=1) # default 30 menit

class KuisResponse(BaseModel):
    id: int
    judul: str
    deskripsi: str | None
    durasi_menit: int
    status: str
    dibuat_pada: datetime

    model_config = {"from_attributes": True}

# ==========================================
# SCHEMA UNTUK PERTANYAAN
# ==========================================
class PertanyaanCreateRequest(BaseModel):
    teks_pertanyaan: str = Field(..., min_length=3)
    tipe: str = Field("pilihan_ganda", description="pilihan_ganda / esai")
    bobot: int = Field(1, ge=1)
    urutan: int = Field(1, ge=1)

class PertanyaanResponse(BaseModel):
    id: int
    kuis_id: int
    teks_pertanyaan: str
    tipe: str
    bobot: int
    urutan: int

    model_config = {"from_attributes": True}

# ==========================================
# SCHEMA UNTUK PILIHAN JAWABAN
# ==========================================
class PilihanJawabanCreateRequest(BaseModel):
    label: str = Field(..., min_length=1, max_length=5, description="Contoh: A, B, C, D")
    teks: str = Field(..., min_length=1)
    benar: bool = Field(False, description="True jika ini jawaban yang benar")

class PilihanJawabanResponse(BaseModel):
    id: int
    pertanyaan_id: int
    label: str
    teks: str
    benar: bool

    model_config = {"from_attributes": True}