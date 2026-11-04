"""Query dasar tabel pengguna (admin dan mahasiswa)."""

from sqlalchemy.orm import Session

from app.models.pengguna import Pengguna


def get_by_id(db: Session, pengguna_id: int) -> Pengguna | None:
    return db.query(Pengguna).filter(Pengguna.id == pengguna_id).first()


def get_by_nomor_induk(db: Session, nomor_induk: str) -> Pengguna | None:
    return db.query(Pengguna).filter(Pengguna.nomor_induk == nomor_induk).first()
