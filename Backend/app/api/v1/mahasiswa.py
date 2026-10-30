# Backend/app/api/v1/mahasiswa.py
#
# CRUD mahasiswa untuk admin:
#   GET    /mahasiswa        daftar + pencarian (q) + filter status/angkatan + paginasi
#   GET    /mahasiswa/{id}   detail
#   POST   /mahasiswa        tambah (status awal belum_aktif)
#   PUT    /mahasiswa/{id}   ubah nama / angkatan / status / NIM (NIM hanya jika akun belum diaktivasi)
#   DELETE /mahasiswa/{id}   hapus
#
# Catatan: GET /mahasiswa/dashboard (khusus mahasiswa) ada di dashboard_mahasiswa.py dan
# didaftarkan lebih dulu di main.py, jadi tidak bentrok dengan GET /mahasiswa/{id}.

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.mahasiswa import (
    MahasiswaCreateRequest,
    MahasiswaListResponse,
    MahasiswaResponse,
    MahasiswaUpdateRequest,
    StatusAkun,
)
from app.services import mahasiswa_service as service

router = APIRouter(prefix="/mahasiswa", tags=["Mahasiswa"])


@router.get(
    "",
    response_model=MahasiswaListResponse,
    summary="List mahasiswa + pencarian & filter (admin only)",
)
def list_mahasiswa(
    q: str | None = Query(None, max_length=100, description="Cari di nama atau NIM"),
    status: StatusAkun | None = Query(None, description="Filter status akun"),
    angkatan: int | None = Query(None, ge=2000, le=2100),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return service.list_mahasiswa(
        db, q=q, status=status, angkatan=angkatan, page=page, limit=limit
    )


@router.get(
    "/{id}",
    response_model=MahasiswaResponse,
    summary="Detail mahasiswa (admin only)",
)
def detail_mahasiswa(
    id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return service.get_mahasiswa(db, id)


@router.post(
    "",
    response_model=MahasiswaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah mahasiswa manual (admin only)",
)
def tambah_mahasiswa(
    data: MahasiswaCreateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return service.tambah_mahasiswa(db, data)


@router.put(
    "/{id}",
    response_model=MahasiswaResponse,
    summary="Edit data/status mahasiswa (admin only)",
    description=(
        "Kirim hanya field yang berubah. `angkatan: null` mengosongkan angkatan. "
        "`nomor_induk` hanya bisa diganti untuk akun yang belum diaktivasi."
    ),
)
def edit_mahasiswa(
    id: int,
    data: MahasiswaUpdateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return service.ubah_mahasiswa(db, id, data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus mahasiswa (admin only)",
)
def hapus_mahasiswa(
    id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    service.hapus_mahasiswa(db, id)