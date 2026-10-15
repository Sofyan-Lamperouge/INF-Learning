from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.materi import (
    MateriCreateRequest,
    MateriResponse,
    MateriUpdateRequest,
)
from app.services import materi_service

router = APIRouter(prefix="/materi", tags=["Materi"])


@router.get(
    "",
    summary="List materi (butuh login)",
    description="Semua user yang login bisa lihat list materi. Support filter & pagination.",
)
def list_materi(
    mata_kuliah: str | None = Query(None),
    semester: int | None = Query(None, ge=1, le=8),
    jenis: str | None = Query(None),
    q: str | None = Query(None, description="Cari di judul/deskripsi"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: Pengguna = Depends(get_current_user),
):
    return materi_service.list_materi(
        db,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=jenis,
        q=q,
        page=page,
        limit=limit,
    )


@router.get(
    "/{materi_id}",
    response_model=MateriResponse,
    summary="Detail materi (butuh login)",
)
def get_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    _: Pengguna = Depends(get_current_user),
):
    return materi_service.get_materi(db, materi_id)


@router.post(
    "",
    response_model=MateriResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah materi (admin only)",
)
def create_materi(
    data: MateriCreateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return materi_service.create_materi(db, data, admin.id)


@router.put(
    "/{materi_id}",
    response_model=MateriResponse,
    summary="Edit materi (admin only)",
)
def update_materi(
    materi_id: int,
    data: MateriUpdateRequest,
    db: Session = Depends(get_db),
    _: Pengguna = Depends(require_role("admin")),
):
    return materi_service.update_materi(db, materi_id, data)


@router.delete(
    "/{materi_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus materi (admin only)",
)
def delete_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    _: Pengguna = Depends(require_role("admin")),
):
    materi_service.delete_materi(db, materi_id)