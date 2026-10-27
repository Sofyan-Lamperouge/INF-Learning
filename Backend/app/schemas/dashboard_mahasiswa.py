from datetime import datetime
from typing import Literal

from pydantic import BaseModel

StatusBelajar = Literal["belum", "dilihat", "selesai"]


class ProfilMahasiswa(BaseModel):
    id: int
    nama: str
    nomor_induk: str
    angkatan: int | None


class StatistikBelajar(BaseModel):
    total_materi: int
    materi_dilihat: int
    materi_selesai: int
    persen_selesai: float


class MateriDashboard(BaseModel):
    id: int
    judul: str
    mata_kuliah: str
    semester: int
    jenis: str
    url: str
    dibuat_pada: datetime
    status_belajar: StatusBelajar


class ProgresMataKuliah(BaseModel):
    mata_kuliah: str
    total: int
    selesai: int
    persen: float


class DashboardMahasiswaResponse(BaseModel):
    profil: ProfilMahasiswa
    statistik: StatistikBelajar
    lanjutkan_belajar: MateriDashboard | None
    materi_terbaru: list[MateriDashboard]
    progres_mata_kuliah: list[ProgresMataKuliah]


class ProgresRequest(BaseModel):
    status: Literal["dilihat", "selesai"]


class ProgresResponse(BaseModel):
    materi_id: int
    status: StatusBelajar
    diubah_pada: datetime

    model_config = {"from_attributes": True}
