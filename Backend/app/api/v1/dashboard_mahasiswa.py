from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.dashboard_mahasiswa import (
    DashboardMahasiswaResponse,
    ProgresRequest,
    ProgresResponse,
)
from app.services import dashboard_mahasiswa_service as service

router = APIRouter(tags=["Dashboard Mahasiswa"])


@router.get(
    "/mahasiswa/dashboard",
    response_model=DashboardMahasiswaResponse,
    summary="Ringkasan dashboard mahasiswa (mahasiswa only)",
)
def dashboard_mahasiswa(
    db: Session = Depends(get_db),
    mhs: Pengguna = Depends(require_role("mahasiswa")),
):
    return service.get_dashboard(db, mhs)


@router.post(
    "/materi/{materi_id}/progres",
    response_model=ProgresResponse,
    summary="Catat progres belajar pada sebuah materi (mahasiswa only)",
    description="status 'dilihat' saat materi dibuka, 'selesai' saat ditandai selesai. "
    "Status 'selesai' tidak akan turun kembali menjadi 'dilihat'.",
)
def catat_progres(
    materi_id: int,
    data: ProgresRequest,
    db: Session = Depends(get_db),
    mhs: Pengguna = Depends(require_role("mahasiswa")),
):
    return service.catat_progres(db, mhs, materi_id, data.status)
