# Backend/app/api/v1/materi.py
#
# [DIUBAH]
#  - [BARU] GET "" (list + filter + paginasi), GET "/{id}", PUT "/{id}", DELETE "/{id}".
#    Sebelumnya hanya berisi komentar "# ... (biarkan endpoint ... tetap sama) ..." sehingga
#    endpoint tersebut tidak ada sama sekali (frontend tidak bisa mengambil daftar materi).
#  - [DIPERBAIKI] URL file upload sekarang diawali https:// (lewat settings.PUBLIC_BASE_URL).
#    Sebelumnya tanpa skema sehingga validasi MateriCreateRequest gagal -> error 500 saat upload.
#  - Endpoint POST (upload) logikanya tetap sama.

import os
import shutil
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_current_user, require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.materi import (
    MateriCreateRequest,
    MateriListResponse,
    MateriResponse,
    MateriUpdateRequest,
)
from app.services import materi_service

router = APIRouter(prefix="/materi", tags=["Materi"])


# ------------------------------------------------------------
# [BARU] GET /materi  -> daftar materi (semua pengguna yang login)
# ------------------------------------------------------------
@router.get(
    "",
    response_model=MateriListResponse,
    summary="List materi (filter + paginasi)",
)
def list_materi(
    mata_kuliah: str | None = Query(None),
    semester: int | None = Query(None, ge=1, le=8),
    jenis: str | None = Query(None),
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    user: Pengguna = Depends(get_current_user),
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


# ------------------------------------------------------------
# [BARU] GET /materi/{id}
# ------------------------------------------------------------
@router.get(
    "/{materi_id}",
    response_model=MateriResponse,
    summary="Detail materi",
)
def detail_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    user: Pengguna = Depends(get_current_user),
):
    return materi_service.get_materi(db, materi_id)


# ------------------------------------------------------------
# POST /materi  -> upload materi (admin only)
# ------------------------------------------------------------
@router.post(
    "",
    response_model=MateriResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah materi via Upload File (admin only)",
)
def create_materi(
    judul: str = Form(...),
    mata_kuliah: str = Form(...),
    semester: int = Form(...),
    deskripsi: str | None = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    allowed_extensions = [".pdf", ".docx", ".pptx", ".xlsx"]
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Format file tidak diizinkan")

    # Nama file unik agar tidak bentrok
    nama_file_baru = f"{uuid.uuid4().hex}{ext}"
    file_location = f"uploads/{nama_file_baru}"

    os.makedirs("uploads", exist_ok=True)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # [DIPERBAIKI] URL lengkap dengan https://
    base_url = settings.PUBLIC_BASE_URL.rstrip("/")
    file_url = f"{base_url}/uploads/{nama_file_baru}"

    data = MateriCreateRequest(
        judul=judul,
        deskripsi=deskripsi,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=ext.replace(".", ""),  # pdf, docx, dll
        url=file_url,
    )

    return materi_service.create_materi(db, data, admin.id)


# ------------------------------------------------------------
# [BARU] PUT /materi/{id}  (admin only)
# ------------------------------------------------------------
@router.put(
    "/{materi_id}",
    response_model=MateriResponse,
    summary="Edit materi (admin only)",
)
def edit_materi(
    materi_id: int,
    data: MateriUpdateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return materi_service.update_materi(db, materi_id, data)


# ------------------------------------------------------------
# [BARU] DELETE /materi/{id}  (admin only)
# ------------------------------------------------------------
@router.delete(
    "/{materi_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus materi (admin only)",
)
def hapus_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    materi_service.delete_materi(db, materi_id)