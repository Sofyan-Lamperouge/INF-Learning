# Backend/app/api/v1/materi.py
#
# Endpoint materi:
#   GET    /materi                       daftar + filter + paginasi (semua pengguna login)
#   GET    /materi/kategori/semester     kategori semester 1-8 + jumlah materi
#   GET    /materi/kategori/mata-kuliah  kategori mata kuliah pada satu semester
#   GET    /materi/{id}                  detail
#   POST   /materi                       upload materi (admin)
#   PUT    /materi/{id}/edit             edit via form + ganti file opsional (admin) <- dipakai frontend
#   PUT    /materi/{id}                  edit via JSON tanpa ganti file (admin)
#   DELETE /materi/{id}                  hapus materi + file fisiknya (admin)
#
# Mahasiswa hanya melihat materi berstatus "terbit".

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.materi import (
    KategoriMataKuliahResponse,
    KategoriSemesterResponse,
    MateriListResponse,
    MateriResponse,
    MateriUpdateRequest,
)
from app.services import materi_service

router = APIRouter(prefix="/materi", tags=["Materi"])


# ------------------------------------------------------------
# GET /materi
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
        hanya_terbit=user.peran != "admin",
        pengguna_id=user.id if user.peran == "mahasiswa" else None,
        page=page,
        limit=limit,
    )


# ------------------------------------------------------------
# GET /materi/kategori/...  (didefinisikan sebelum "/{materi_id}")
# ------------------------------------------------------------
@router.get(
    "/kategori/semester",
    response_model=KategoriSemesterResponse,
    summary="Kategori semester beserta jumlah materi",
)
def kategori_semester(
    db: Session = Depends(get_db),
    user: Pengguna = Depends(get_current_user),
):
    return materi_service.get_kategori_semester(db, hanya_terbit=user.peran != "admin")


@router.get(
    "/kategori/mata-kuliah",
    response_model=KategoriMataKuliahResponse,
    summary="Kategori mata kuliah pada sebuah semester",
)
def kategori_mata_kuliah(
    semester: int = Query(..., ge=1, le=8),
    db: Session = Depends(get_db),
    user: Pengguna = Depends(get_current_user),
):
    return materi_service.get_kategori_mata_kuliah(
        db, semester=semester, hanya_terbit=user.peran != "admin"
    )


# ------------------------------------------------------------
# GET /materi/{id}
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
    materi = materi_service.get_materi(db, materi_id)
    # Mahasiswa hanya boleh melihat materi yang sudah terbit
    if user.peran != "admin" and materi.status != "terbit":
        raise HTTPException(status_code=404, detail="Materi tidak ditemukan")
    if user.peran == "mahasiswa":
        materi_service.tandai_status_belajar(db, [materi], user.id)
    return materi


# ------------------------------------------------------------
# POST /materi  -> upload materi (admin only)
# ------------------------------------------------------------
@router.post(
    "",
    response_model=MateriResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah materi via upload file (admin only)",
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
    return materi_service.upload_materi(
        db,
        judul=judul,
        mata_kuliah=mata_kuliah,
        semester=semester,
        deskripsi=deskripsi,
        file=file,
        admin_id=admin.id,
    )


# ------------------------------------------------------------
# PUT /materi/{id}/edit  -> edit via form (admin only)
# Dipakai modal "Edit Materi" di frontend: multipart, file opsional.
# ------------------------------------------------------------
@router.put(
    "/{materi_id}/edit",
    response_model=MateriResponse,
    summary="Edit materi via form, file opsional (admin only)",
    description=(
        "Hanya field yang dikirim yang diubah. `deskripsi` kosong berarti dikosongkan. "
        "Jika `file` dikirim, file lama diganti dan dihapus dari server."
    ),
)
def edit_materi_form(
    materi_id: int,
    judul: str | None = Form(None),
    mata_kuliah: str | None = Form(None),
    semester: int | None = Form(None),
    deskripsi: str | None = Form(None),
    file: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return materi_service.ubah_materi_form(
        db,
        materi_id,
        judul=judul,
        mata_kuliah=mata_kuliah,
        semester=semester,
        deskripsi=deskripsi,
        file=file,
    )


# ------------------------------------------------------------
# PUT /materi/{id}  -> edit via JSON (admin only), tanpa ganti file
# Juga dipakai untuk mengubah status: draft / terbit / arsip.
# ------------------------------------------------------------
@router.put(
    "/{materi_id}",
    response_model=MateriResponse,
    summary="Edit materi via JSON (admin only)",
)
def edit_materi(
    materi_id: int,
    data: MateriUpdateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return materi_service.update_materi(db, materi_id, data)


# ------------------------------------------------------------
# DELETE /materi/{id}  (admin only)
# ------------------------------------------------------------
@router.delete(
    "/{materi_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus materi beserta file fisiknya (admin only)",
)
def hapus_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    materi_service.delete_materi(db, materi_id)
