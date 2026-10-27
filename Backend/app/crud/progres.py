from sqlalchemy import case, func
from sqlalchemy.orm import Session

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
    db.commit()
    db.refresh(progres)
    return progres


def map_status_by_materi(db: Session, pengguna_id: int) -> dict[int, str]:
    rows = (
        db.query(ProgresMateri.materi_id, ProgresMateri.status)
        .filter(ProgresMateri.pengguna_id == pengguna_id)
        .all()
    )
    return {materi_id: status for materi_id, status in rows}


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
    selesai = {mk: n for mk, n in selesai_rows}
    return [(mk, int(total), int(selesai.get(mk, 0))) for mk, total in total_rows]


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
