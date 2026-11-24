"""Rute file upload: GET/HEAD /uploads/{nama}?exp=...&sid=...&sig=... (menggantikan folder statis).

Tidak berada di bawah /api/v1 supaya URL file yang tersimpan di database tetap berlaku.
Urutan pemeriksaan: nama file -> tanda tangan & masa berlaku -> sesi/akun/hak akses di database
-> keberadaan file. URL tanpa tanda tangan, salah, atau kedaluwarsa ditolak 403.
"""

import os
import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core import tautan_file
from app.core.config import settings
from app.db.session import get_db
from app.services import berkas_service

# include_in_schema=False: URL ini hanya valid bila diterbitkan API, tidak untuk dicoba di Swagger.
router = APIRouter(tags=["Berkas"], include_in_schema=False)

# Hanya nama file sederhana (UUID/nama unik buatan server); menolak "..", "/", dan karakter aneh.
POLA_NAMA = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,254}$")

MEDIA_TYPE = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


@router.api_route("/uploads/{nama_berkas}", methods=["GET", "HEAD"])
def ambil_berkas(
    nama_berkas: str,
    exp: str | None = None,
    sid: str | None = None,
    sig: str | None = None,
    db: Session = Depends(get_db),
):
    if not POLA_NAMA.match(nama_berkas):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File tidak ditemukan")

    # Tanda tangan diperiksa sebelum menyentuh database/disk, supaya tidak bisa dipakai menebak file.
    hasil = tautan_file.verifikasi(nama_berkas, exp, sid, sig)
    if hasil is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=berkas_service.PESAN_TAUTAN)
    sesi_id, sisa = hasil

    berkas_service.periksa_akses(db, nama_berkas, sesi_id)  # sesi aktif, akun aktif, hak akses

    folder = os.path.realpath(settings.UPLOAD_DIR)
    lokasi = os.path.realpath(os.path.join(folder, nama_berkas))
    if os.path.dirname(lokasi) != folder or not os.path.isfile(lokasi):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File tidak ditemukan")

    ekstensi = os.path.splitext(nama_berkas)[1].lower()
    return FileResponse(
        lokasi,
        media_type=MEDIA_TYPE.get(ekstensi, "application/octet-stream"),
        headers={
            "X-Content-Type-Options": "nosniff",
            # Cache privat singkat: akses tetap diperiksa server tiap kali cache habis.
            "Cache-Control": f"private, max-age={min(sisa, 900)}",
        },
    )
