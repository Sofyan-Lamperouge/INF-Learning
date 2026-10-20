from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.crud import mahasiswa as crud_mhs
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.mahasiswa import (
    MahasiswaCreateRequest,
    MahasiswaResponse,
    MahasiswaUpdateRequest,
)

router = APIRouter(prefix="/mahasiswa", tags=["Mahasiswa"])


@router.get(
    "",
    summary="List semua mahasiswa (admin only)",
)
def list_mahasiswa(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    skip = (page - 1) * limit
    items, total = crud_mhs.get_all(db, skip=skip, limit=limit)
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


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
    existing = (
        db.query(Pengguna)
        .filter(Pengguna.nomor_induk == data.nomor_induk)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="NIM sudah terdaftar",
        )
    return crud_mhs.create(db, data.model_dump())


@router.put(
    "/{id}",
    response_model=MahasiswaResponse,
    summary="Edit data/status mahasiswa (admin only)",
)
def edit_mahasiswa(
    id: int,
    data: MahasiswaUpdateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    mhs = crud_mhs.get_by_id(db, id)
    if not mhs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mahasiswa tidak ditemukan",
        )
    return crud_mhs.update(db, mhs, data.model_dump(exclude_unset=True))


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
    mhs = crud_mhs.get_by_id(db, id)
    if not mhs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mahasiswa tidak ditemukan",
        )
    crud_mhs.delete(db, mhs)