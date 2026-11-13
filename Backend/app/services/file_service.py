"""Penyimpanan file upload materi (validasi, simpan, hapus).

Semua file disimpan di settings.UPLOAD_DIR dengan nama acak, lalu dilayani
lewat /uploads/<nama>. Di Railway, UPLOAD_DIR harus berada di dalam Volume.
"""

import contextlib
import os
import re
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
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File kosong")
    except BaseException:
        _hapus_lokasi(lokasi)
        raise

    url = f"{settings.PUBLIC_BASE_URL.rstrip('/')}/uploads/{nama}"
    return ext.lstrip("."), url


def deteksi_format_foto(data: bytes) -> str | None:
    """Kenali format gambar dari isi file (magic bytes), bukan dari nama/ekstensi/Content-Type.

    Hanya JPG, PNG, dan WEBP. SVG sengaja tidak diizinkan karena bisa memuat script.
    """
    if data.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def simpan_foto(file: UploadFile) -> str:
    """Validasi dan simpan foto profil ke UPLOAD_DIR. Return URL-nya.

    Nama file dibuat acak dan ekstensinya diambil dari isi file, jadi nama asli dari
    klien tidak pernah dipakai.
    """
    batas = settings.MAX_FOTO_MB * 1024 * 1024
    data = file.file.read(batas + 1)  # +1 byte untuk mendeteksi file yang kelebihan ukuran

    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File kosong")
    if len(data) > batas:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Ukuran foto maksimal {settings.MAX_FOTO_MB} MB",
        )
    format_foto = deteksi_format_foto(data)
    if format_foto is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format foto tidak diizinkan. Gunakan JPG, PNG, atau WEBP",
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    nama = f"foto-{uuid.uuid4().hex}.{format_foto}"
    with open(os.path.join(settings.UPLOAD_DIR, nama), "wb") as out:
        out.write(data)
    return f"{settings.PUBLIC_BASE_URL.rstrip('/')}/uploads/{nama}"


def lokasi_file_dari_url(url: str | None) -> str | None:
    """Lokasi file di disk untuk sebuah URL upload, atau None bila bukan file milik server ini.

    Aman dari path traversal: hanya nama file (basename) yang dipakai, selalu di UPLOAD_DIR.
    """
    if not url:
        return None
    path = urlparse(url).path
    if not path.startswith("/uploads/"):
        return None  # tautan eksternal, bukan file milik server ini
    nama = os.path.basename(path)
    if not nama:
        return None
    return os.path.join(settings.UPLOAD_DIR, nama)


def hapus_file_dari_url(url: str | None) -> None:
    """Hapus file fisik milik sebuah URL upload. Aman: hanya menyentuh isi UPLOAD_DIR."""
    lokasi = lokasi_file_dari_url(url)
    if lokasi:
        _hapus_lokasi(lokasi)


_KARAKTER_TERLARANG = re.compile(r'[\\/:*?"<>|\x00-\x1f]')


def nama_unduhan(judul: str | None, ekstensi: str) -> str:
    """Nama file untuk unduhan, diambil dari judul materi (karakter terlarang dibuang)."""
    bersih = _KARAKTER_TERLARANG.sub("", judul or "")
    bersih = re.sub(r"\s+", " ", bersih).strip(" .")[:100].strip(" .")
    return f"{bersih or 'materi'}{ekstensi}"


def _hapus_lokasi(lokasi: str) -> None:
    with contextlib.suppress(OSError):  # sudah tidak ada / tidak bisa dihapus: abaikan
        os.remove(lokasi)
