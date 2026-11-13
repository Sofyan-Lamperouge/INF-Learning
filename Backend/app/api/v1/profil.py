"""Endpoint profil pengguna: ganti dan hapus foto profil (mahasiswa only).

  PUT    /profil/foto   unggah / ganti foto (multipart, field `file`)
  DELETE /profil/foto   hapus foto

URL foto ikut muncul di GET /auth/me, respons login, dan GET /mahasiswa/dashboard (profil.foto_url).
"""

from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.profil import FotoProfilResponse
from app.services import profil_service

router = APIRouter(prefix="/profil", tags=["Profil"])


@router.put(
    "/foto",
    response_model=FotoProfilResponse,
    status_code=status.HTTP_200_OK,
    summary="Unggah atau ganti foto profil (mahasiswa only)",
    description=(
        f"Format JPG, PNG, atau WEBP, maksimal {settings.MAX_FOTO_MB} MB. Format dikenali dari isi "
        "file, bukan dari ekstensi. Foto lama otomatis dihapus."
    ),
)
def ganti_foto(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    mhs: Pengguna = Depends(require_role("mahasiswa")),
):
    return FotoProfilResponse(foto_url=profil_service.ganti_foto(db, mhs, file))


@router.delete(
    "/foto",
    response_model=FotoProfilResponse,
    status_code=status.HTTP_200_OK,
    summary="Hapus foto profil (mahasiswa only)",
)
def hapus_foto(
    db: Session = Depends(get_db),
    mhs: Pengguna = Depends(require_role("mahasiswa")),
):
    profil_service.hapus_foto(db, mhs)
    return FotoProfilResponse(foto_url=None)
