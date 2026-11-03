from datetime import datetime

from sqlalchemy import case, func
from sqlalchemy.orm import Session

from app.core.waktu import sekarang_utc
from app.models.materi import Materi
from app.models.progres import ProgresMateri


def get(db: Session, pengguna_id: int, materi_id: int) -> ProgresMateri | None:
    return (
        db.query(ProgresMateri)
        .filter(
            ProgresMateri.pengguna_id == pengguna_id,
            ProgresMateri.materi_id == materi_id,
        )
        .first()
    )


def upsert(db: Session, pengguna_id: int, materi_id: int, status: str) -> ProgresMateri:
    """Buat/ubah progres. Status 'selesai' tidak boleh turun kembali ke 'dilihat'."""
    progres = get(db, pengguna_id, materi_id)
    if progres is None:
        progres = ProgresMateri(pengguna_id=pengguna_id, materi_id=materi_id, status=status)
        db.add(progres)
    elif not (progres.status == "selesai" and status == "dilihat"):
        progres.status = status

    # Catat waktu selesai hanya sekali (saat pertama kali selesai)
    if progres.status == "selesai" and progres.selesai_pada is None:
        progres.selesai_pada = sekarang_utc()

    db.commit()
    db.refresh(progres)
    return progres


def map_status_by_materi(db: Session, pengguna_id: int) -> dict[int, str]:
    rows = (
        db.query(ProgresMateri.materi_id, ProgresMateri.status)
        .filter(ProgresMateri.pengguna_id == pengguna_id)
        .all()
    )
    return dict(rows)


def hitung_progres(db: Session, pengguna_id: int) -> tuple[int, int]:
    """Return (jumlah materi terbit yang sudah dilihat/selesai, jumlah yang selesai)."""
    row = (
        db.query(
            func.count(ProgresMateri.id),
            func.coalesce(func.sum(case((ProgresMateri.status == "selesai", 1), else_=0)), 0),
        )
        .join(Materi, Materi.id == ProgresMateri.materi_id)
        .filter(ProgresMateri.pengguna_id == pengguna_id, Materi.status == "terbit")
        .one()
    )
    return int(row[0]), int(row[1])


def progres_per_mata_kuliah(db: Session, pengguna_id: int) -> list[tuple[str, int, int]]:
    """Return [(mata_kuliah, total materi terbit, jumlah selesai)] urut nama."""
    total_rows = (
        db.query(Materi.mata_kuliah, func.count(Materi.id))
        .filter(Materi.status == "terbit")
        .group_by(Materi.mata_kuliah)
        .order_by(Materi.mata_kuliah.asc())
        .all()
    )
    selesai_rows = (
        db.query(Materi.mata_kuliah, func.count(ProgresMateri.id))
        .join(ProgresMateri, ProgresMateri.materi_id == Materi.id)
        .filter(
            Materi.status == "terbit",
            ProgresMateri.pengguna_id == pengguna_id,
            ProgresMateri.status == "selesai",
        )
        .group_by(Materi.mata_kuliah)
        .all()
    )
    selesai = dict(selesai_rows)
    return [(mk, int(total), int(selesai.get(mk, 0))) for mk, total in total_rows]


def materi_selesai_terbaru(
    db: Session, pengguna_id: int, limit: int = 5
) -> list[tuple[Materi, datetime]]:
    """Materi terbit yang sudah selesai dibaca mahasiswa, yang paling baru diselesaikan dulu.

    Return [(materi, waktu_selesai)]. Baris lama tanpa selesai_pada memakai diubah_pada.
    """
    waktu = func.coalesce(ProgresMateri.selesai_pada, ProgresMateri.diubah_pada)
    rows = (
        db.query(Materi, waktu)
        .join(ProgresMateri, ProgresMateri.materi_id == Materi.id)
        .filter(
            ProgresMateri.pengguna_id == pengguna_id,
            ProgresMateri.status == "selesai",
            Materi.status == "terbit",
        )
        .order_by(waktu.desc(), Materi.id.desc())
        .limit(limit)
        .all()
    )
    return [(materi, selesai_pada) for materi, selesai_pada in rows]


def materi_terakhir_dilihat(db: Session, pengguna_id: int) -> Materi | None:
    """Materi terbit terakhir yang berstatus 'dilihat' (belum selesai)."""
    return (
        db.query(Materi)
        .join(ProgresMateri, ProgresMateri.materi_id == Materi.id)
        .filter(
            ProgresMateri.pengguna_id == pengguna_id,
            ProgresMateri.status == "dilihat",
            Materi.status == "terbit",
        )
        .order_by(ProgresMateri.diubah_pada.desc())
        .first()
    )