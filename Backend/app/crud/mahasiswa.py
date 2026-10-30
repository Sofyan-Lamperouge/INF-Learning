# Backend/app/crud/mahasiswa.py
#
# [DIUBAH] get_all kini mendukung pencarian (q), filter status, dan filter angkatan.
# [BARU]   get_by_nim, dipakai untuk memeriksa NIM ganda.
# update() menerima dict apa adanya; service yang memutuskan field mana yang boleh null.

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.pengguna import Pengguna


def get_all(
    db: Session,
    *,
    q: str | None = None,
    status: str | None = None,
    angkatan: int | None = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Pengguna).filter(Pengguna.peran == "mahasiswa")

    if status:
        query = query.filter(Pengguna.status == status)
    if angkatan is not None:
        query = query.filter(Pengguna.angkatan == angkatan)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Pengguna.nama.ilike(like), Pengguna.nomor_induk.ilike(like)))

    total = query.count()
    items = query.order_by(Pengguna.nomor_induk.asc()).offset(skip).limit(limit).all()
    return items, total


def get_by_id(db: Session, id: int):
    return db.query(Pengguna).filter(Pengguna.id == id, Pengguna.peran == "mahasiswa").first()


def get_by_nim(db: Session, nomor_induk: str):
    """Cari pengguna mana pun (admin/mahasiswa) berdasarkan NIM/nomor induk."""
    return db.query(Pengguna).filter(Pengguna.nomor_induk == nomor_induk).first()


def create(db: Session, data: dict):
    mhs = Pengguna(
        peran="mahasiswa",
        nomor_induk=data["nomor_induk"],
        nama=data["nama"],
        angkatan=data.get("angkatan"),
        status="belum_aktif",
        kata_sandi=None,
    )
    db.add(mhs)
    db.commit()
    db.refresh(mhs)
    return mhs


def update(db: Session, mhs: Pengguna, data: dict):
    for key, value in data.items():
        setattr(mhs, key, value)
    db.commit()
    db.refresh(mhs)
    return mhs


def delete(db: Session, mhs: Pengguna):
    db.delete(mhs)
    db.commit()