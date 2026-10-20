from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_role, get_current_user
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.kuis import (
    KuisCreateRequest, KuisResponse, 
    PertanyaanCreateRequest, PertanyaanResponse, 
    PilihanJawabanCreateRequest, PilihanJawabanResponse
)
from app.services import kuis_service
from app.crud import kuis as crud_kuis

router = APIRouter(tags=["Kuis"])

# ==========================================
# ENDPOINT KUIS
# ==========================================
@router.get("/kuis", response_model=list[KuisResponse], summary="List semua kuis")
def list_kuis(
    db: Session = Depends(get_db), 
    user: Pengguna = Depends(get_current_user) # Mahasiswa & Admin bisa lihat
):
    return crud_kuis.get_all_kuis(db)

@router.post("/kuis", response_model=KuisResponse, status_code=status.HTTP_201_CREATED, summary="Buat Kuis Baru (Admin)")
def buat_kuis(
    data: KuisCreateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return kuis_service.buat_kuis_baru(db, data, admin.id)

# ==========================================
# ENDPOINT PERTANYAAN
# ==========================================
@router.post("/kuis/{kuis_id}/pertanyaan", response_model=PertanyaanResponse, status_code=status.HTTP_201_CREATED, summary="Tambah Pertanyaan ke Kuis (Admin)")
def tambah_pertanyaan(
    kuis_id: int,
    data: PertanyaanCreateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return kuis_service.tambah_pertanyaan_ke_kuis(db, kuis_id, data)

# ==========================================
# ENDPOINT PILIHAN JAWABAN
# ==========================================
@router.post("/pertanyaan/{pertanyaan_id}/pilihan", response_model=PilihanJawabanResponse, status_code=status.HTTP_201_CREATED, summary="Tambah Pilihan Jawaban (Admin)")
def tambah_pilihan(
    pertanyaan_id: int,
    data: PilihanJawabanCreateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return kuis_service.tambah_pilihan_jawaban(db, pertanyaan_id, data)