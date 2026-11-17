"""Endpoint kontak admin (mahasiswa only).

  GET /kontak-admin/whatsapp   tautan WhatsApp ke admin dengan pesan yang sudah terisi

FE cukup membuka `tautan` (window.open / <a href>); tidak ada pesan yang dikirim lewat server.
"""

from typing import Literal

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import require_role
from app.models.pengguna import Pengguna
from app.schemas.kontak import KontakWhatsAppResponse
from app.services import kontak_service

router = APIRouter(prefix="/kontak-admin", tags=["Kontak Admin"])


@router.get(
    "/whatsapp",
    response_model=KontakWhatsAppResponse,
    summary="Tautan WhatsApp untuk menghubungi admin (mahasiswa only)",
    description=(
        "Mengembalikan tautan wa.me dengan pesan yang sudah terisi otomatis (nama, NIM, angkatan, "
        "topik, dan pesan opsional). Mengembalikan 503 bila nomor WhatsApp admin belum diatur."
    ),
)
def kontak_whatsapp(
    topik: Literal["akun", "materi", "lainnya"] = Query(
        "lainnya", description="Topik: akun, materi, atau lainnya"
    ),
    pesan: str | None = Query(None, max_length=500, description="Pesan tambahan (opsional)"),
    mhs: Pengguna = Depends(require_role("mahasiswa")),
):
    return kontak_service.buat_kontak_whatsapp(mhs, topik, pesan)
