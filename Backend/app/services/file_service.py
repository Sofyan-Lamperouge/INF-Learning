"""Penyimpanan file upload materi (validasi, simpan, hapus).

Semua file disimpan di settings.UPLOAD_DIR dengan nama acak, lalu dilayani
lewat /uploads/<nama>. Di Railway, UPLOAD_DIR harus berada di dalam Volume.
"""
import os
import uuid
from urllib.parse import urlparse

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

EKSTENSI_DIIZINKAN = {".pdf", ".docx", ".pptx", ".xlsx"}
_CHUNK = 1024 * 1024  # baca 1 MB per putaran agar file besar tidak memenuhi memori


def cek_ekstensi(file: UploadFile) -> str:
    """Return ekstensi (mis. '.pdf') atau 400 jika tidak diizinkan."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in EKSTENSI_DIIZINKAN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format file tidak diizinkan",
        )
    return ext


def simpan_upload(file: UploadFile) -> tuple[str, str]:
    """Simpan file ke UPLOAD_DIR. Return (jenis, url). Gagal -> tidak ada file tersisa."""
    ext = cek_ekstensi(file)
    batas = settings.MAX_UPLOAD_MB * 1024 * 1024

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    nama = f"{uuid.uuid4().hex}{ext}"
    lokasi = os.path.join(settings.UPLOAD_DIR, nama)

    ukuran = 0
    try:
        with open(lokasi, "wb") as out:
            while chunk := file.file.read(_CHUNK):
                ukuran += len(chunk)
                if ukuran > batas:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"Ukuran file maksimal {settings.MAX_UPLOAD_MB} MB",
                    )
                out.write(chunk)
        if ukuran == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="File kosong"
            )
    except BaseException:
        _hapus_lokasi(lokasi)
        raise

    url = f"{settings.PUBLIC_BASE_URL.rstrip('/')}/uploads/{nama}"
    return ext.lstrip("."), url


def hapus_file_dari_url(url: str | None) -> None:
    """Hapus file fisik milik sebuah URL upload. Aman: hanya menyentuh isi UPLOAD_DIR."""
    if not url:
        return
    path = urlparse(url).path
    if not path.startswith("/uploads/"):
        return  # tautan eksternal, bukan file milik server ini
    nama = os.path.basename(path)
    if nama:
        _hapus_lokasi(os.path.join(settings.UPLOAD_DIR, nama))


def _hapus_lokasi(lokasi: str) -> None:
    try:
        os.remove(lokasi)
    except OSError:
        pass  # sudah tidak ada / tidak bisa dihapus: abaikan
