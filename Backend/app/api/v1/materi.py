import os
import shutil
import uuid
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.materi import MateriCreateRequest, MateriResponse, MateriUpdateRequest
from app.services import materi_service

router = APIRouter(prefix="/materi", tags=["Materi"])

# ... (biarkan endpoint GET list dan GET detail tetap sama) ...

@router.post(
    "",
    response_model=MateriResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah materi via Upload File (admin only)",
)
def create_materi(
    # 1. Terima data teks via Form
    judul: str = Form(...),
    mata_kuliah: str = Form(...),
    semester: int = Form(...),
    deskripsi: str | None = Form(None),
    # 2. Terima File
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    # Validasi tipe file (opsional, sesuaikan kebutuhan)
    allowed_extensions = [".pdf", ".docx", ".pptx", ".xlsx"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Format file tidak diizinkan")

    # Generate nama file unik agar tidak bentrok (pakai UUID)
    nama_file_baru = f"{uuid.uuid4().hex}{ext}"
    file_location = f"uploads/{nama_file_baru}"

    # Simpan file ke folder uploads
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Tentukan URL file. 
    base_url = "inf-learning-production.up.railway.app" 
    
    file_url = f"{base_url}/uploads/{nama_file_baru}"

    # Buat object request untuk dikirim ke Service
    data = MateriCreateRequest(
        judul=judul,
        deskripsi=deskripsi,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=ext.replace(".", ""), # pdf, docx, dll
        url=file_url
    )

    return materi_service.create_materi(db, data, admin.id)

# ... (biarkan endpoint PUT dan DELETE tetap sama) ...
@router.get("", response_model=MateriListResponse, summary="List materi")
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
        db, mata_kuliah=mata_kuliah, semester=semester,
        jenis=jenis, q=q, page=page, limit=limit,
    )


@router.get("/{materi_id}", response_model=MateriResponse)
def detail_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    user: Pengguna = Depends(get_current_user),
):
    return materi_service.get_materi(db, materi_id)


@router.put("/{materi_id}", response_model=MateriResponse)
def edit_materi(
    materi_id: int,
    data: MateriUpdateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return materi_service.update_materi(db, materi_id, data)


@router.delete("/{materi_id}", status_code=status.HTTP_204_NO_CONTENT)
def hapus_materi(
    materi_id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    materi_service.delete_materi(db, materi_id)