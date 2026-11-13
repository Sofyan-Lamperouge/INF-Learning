"""Aturan bisnis profil: ganti dan hapus foto profil."""

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.pengguna import Pengguna
from app.services import file_service


def ganti_foto(db: Session, pengguna: Pengguna, file: UploadFile) -> str:
    """Simpan foto baru, perbarui kolom foto_url, lalu hapus foto lama. Return URL baru."""
    url_baru = file_service.simpan_foto(file)  # validasi gagal -> HTTPException, tidak ada yang berubah
    foto_lama = pengguna.foto_url

    pengguna.foto_url = url_baru
    try:
        db.commit()
    except Exception:
        db.rollback()
        file_service.hapus_file_dari_url(url_baru)  # jangan tinggalkan file yatim
        raise

    file_service.hapus_file_dari_url(foto_lama)  # baru dihapus setelah database berhasil
    return url_baru


def hapus_foto(db: Session, pengguna: Pengguna) -> None:
    """Hapus foto profil. Aman dipanggil berulang (tidak ada foto = tidak melakukan apa-apa)."""
    foto_lama = pengguna.foto_url
    if foto_lama is None:
        return
    pengguna.foto_url = None
    db.commit()
    file_service.hapus_file_dari_url(foto_lama)
