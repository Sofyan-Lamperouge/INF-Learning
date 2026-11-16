"""Aturan bisnis kontak admin: membentuk tautan WhatsApp (wa.me) untuk mahasiswa."""

import logging
import re
from urllib.parse import quote

from fastapi import HTTPException, status

from app.core.config import settings
from app.models.pengguna import Pengguna
from app.schemas.kontak import KontakWhatsAppResponse

logger = logging.getLogger(__name__)

TOPIK = {
    "akun": "Masalah akun atau login",
    "materi": "Kendala materi kuliah",
    "lainnya": "Pertanyaan lainnya",
}


def normalisasi_nomor_wa(mentah: str | None) -> str | None:
    """Ubah nomor ke format internasional tanpa tanda + (mis. 6281234567890).

    Menerima 0812-3456-7890, +62 812 3456 7890, 0062812..., 812..., maupun 6281...
    Return None bila bukan nomor yang masuk akal (bukan angka, atau panjang di luar 10-15 digit).
    """
    if not mentah:
        return None
    nomor = re.sub(r"[\s\-.()]", "", mentah.strip())
    if nomor.startswith("+"):
        nomor = nomor[1:]
    elif nomor.startswith("00"):
        nomor = nomor[2:]
    elif nomor.startswith("0"):
        nomor = "62" + nomor[1:]
    elif nomor.startswith("8"):
        nomor = "62" + nomor
    if not nomor.isdigit() or not 10 <= len(nomor) <= 15:
        return None
    return nomor


def format_tampil(nomor: str) -> str:
    """+62 812-3456-7890 untuk nomor Indonesia; selain itu cukup +<digit>."""
    if nomor.startswith("62"):
        sisa = nomor[2:]
        return "+62 " + "-".join(bagian for bagian in (sisa[:3], sisa[3:7], sisa[7:]) if bagian)
    return "+" + nomor


def buat_kontak_whatsapp(
    mhs: Pengguna, topik: str = "lainnya", pesan: str | None = None
) -> KontakWhatsAppResponse:
    nomor = normalisasi_nomor_wa(settings.WHATSAPP_ADMIN_NOMOR)
    if nomor is None:
        if settings.WHATSAPP_ADMIN_NOMOR:
            logger.warning("WHATSAPP_ADMIN_NOMOR tidak valid: %r", settings.WHATSAPP_ADMIN_NOMOR)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Kontak WhatsApp admin belum tersedia",
        )

    # Identitas diambil dari akun yang login, bukan dari input FE, supaya admin tahu siapa
    # yang menghubungi. Pesan ini tetap bisa diedit mahasiswa di WhatsApp sebelum dikirim.
    identitas = f"{mhs.nama} (NIM {mhs.nomor_induk}"
    if mhs.angkatan:
        identitas += f", angkatan {mhs.angkatan}"
    identitas += ")"

    isi = (pesan or "").strip() or "Mohon bantuannya."
    teks = "\n".join(
        [
            f"Halo Admin {settings.APP_NAME}, saya {identitas}.",
            f"Topik: {TOPIK[topik]}",
            "",
            isi,
        ]
    )

    return KontakWhatsAppResponse(
        nomor=nomor,
        nomor_tampil=format_tampil(nomor),
        pesan=teks,
        tautan=f"https://wa.me/{nomor}?text={quote(teks, safe='')}",
    )
