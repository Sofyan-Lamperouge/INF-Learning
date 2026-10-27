from datetime import datetime
from pydantic import BaseModel


# Schema ringkas untuk list materi di dashboard
class MateriRingkas(BaseModel):
    id: int
    judul: str
    mata_kuliah: str
    semester: int
    jenis: str
    url: str
    dibuat_pada: datetime

    model_config = {"from_attributes": True}


# Schema ringkas untuk list mahasiswa di dashboard
class MahasiswaRingkas(BaseModel):
    id: int
    nama: str
    nomor_induk: str
    angkatan: int | None
    status: str
    dibuat_pada: datetime

    model_config = {"from_attributes": True}


# Response utama untuk Dashboard
class DashboardStatsResponse(BaseModel):
    total_mahasiswa: int
    total_materi: int
    materi_terbaru: list[MateriRingkas]
    mahasiswa_terbaru: list[MahasiswaRingkas]