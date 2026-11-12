"""Schema profil pengguna (foto profil)."""

from pydantic import BaseModel


class FotoProfilResponse(BaseModel):
    # URL foto saat ini; null jika foto sudah dihapus / belum ada.
    foto_url: str | None
