"""Schema profil pengguna (foto profil)."""

from pydantic import BaseModel

from app.core.tautan_file import UrlBerkasOpsional


class FotoProfilResponse(BaseModel):
    # URL foto saat ini; null jika foto sudah dihapus / belum ada.
    foto_url: UrlBerkasOpsional
