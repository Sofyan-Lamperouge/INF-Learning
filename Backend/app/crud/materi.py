from datetime import datetime

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.materi import Materi


def get_all(
    db: Session,
    *,
    mata_kuliah: str | None = None,
    semester: int | None = None,
    jenis: str | None = None,
    q: str | None = None,
    status: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Materi)

    if mata_kuliah:
        query = query.filter(Materi.mata_kuliah == mata_kuliah)
    if semester:
        query = query.filter(Materi.semester == semester)
    if jenis:
        query = query.filter(Materi.jenis == jenis)
    if status:
        query = query.filter(Materi.status == status)
    if q:
        like = f"%{q}%"
        query = query.filter(or_(Materi.judul.ilike(like), Materi.deskripsi.ilike(like)))

    total = query.count()
    items = query.order_by(Materi.dibuat_pada.desc()).offset(skip).limit(limit).all()
    return items, total


def count_terbit(db: Session) -> int:
    return db.query(Materi).filter(Materi.status == "terbit").count()


def count_by_url(db: Session, url: str) -> int:
    """Jumlah materi yang memakai URL file tertentu (dasar untuk menghapus file fisik)."""
    return db.query(Materi).filter(Materi.url == url).count()


def nama_file_ada(db: Session, nama: str, *, kecuali_id: int | None = None) -> bool:
    """Apakah nama file ini sudah dipakai materi lain (tanpa membedakan huruf besar/kecil)."""
    query = db.query(Materi.id).filter(func.lower(Materi.nama_file) == nama.lower())
    if kecuali_id is not None:
        query = query.filter(Materi.id != kecuali_id)
    return query.first() is not None


def judul_ada(
    db: Session, judul: str, mata_kuliah: str, *, kecuali_id: int | None = None
) -> bool:
    """Apakah materi lain sudah memakai judul ini pada mata kuliah yang sama?

    Perbandingan tidak membedakan huruf besar/kecil dan mengabaikan spasi di tepi.
    `kecuali_id` dipakai saat edit agar materi itu sendiri tidak dihitung.
    """
    query = db.query(Materi.id).filter(
        func.lower(func.trim(Materi.judul)) == judul.strip().lower(),
        func.lower(func.trim(Materi.mata_kuliah)) == mata_kuliah.strip().lower(),
    )
    if kecuali_id is not None:
        query = query.filter(Materi.id != kecuali_id)
    return query.first() is not None


def kategori_semester(db: Session, *, status: str | None = None) -> list[tuple[int, int, int]]:
    """Return [(semester, jumlah materi, jumlah mata kuliah berbeda)] untuk semester yang berisi."""
    query = db.query(
        Materi.semester,
        func.count(Materi.id),
        func.count(func.distinct(Materi.mata_kuliah)),
    )
    if status:
        query = query.filter(Materi.status == status)
    rows = query.group_by(Materi.semester).order_by(Materi.semester.asc()).all()
    return [(int(s), int(total), int(mk)) for s, total, mk in rows]


def kategori_mata_kuliah(
    db: Session, *, semester: int, status: str | None = None
) -> list[tuple[str, int]]:
    """Return [(mata_kuliah, jumlah materi)] pada sebuah semester, urut abjad."""
    query = db.query(Materi.mata_kuliah, func.count(Materi.id)).filter(Materi.semester == semester)
    if status:
        query = query.filter(Materi.status == status)
    rows = query.group_by(Materi.mata_kuliah).order_by(Materi.mata_kuliah.asc()).all()
    return [(mk, int(total)) for mk, total in rows]


def get_by_id(db: Session, materi_id: int) -> Materi | None:
    return db.query(Materi).filter(Materi.id == materi_id).first()


def create(
    db: Session,
    *,
    judul: str,
    deskripsi: str | None,
    mata_kuliah: str,
    semester: int,
    jenis: str,
    url: str,
    dibuat_oleh: int | None,
    status: str = "terbit",
    nama_file: str | None = None,
) -> Materi:
    materi = Materi(
        judul=judul,
        deskripsi=deskripsi,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=jenis,
        url=url,
        nama_file=nama_file,
        dibuat_oleh=dibuat_oleh,
        status=status,
    )
    db.add(materi)
    db.commit()
    db.refresh(materi)
    return materi


# Kolom yang boleh dikosongkan (diset ke NULL) lewat update
KOLOM_BOLEH_KOSONG = {"deskripsi"}


def update(db: Session, materi: Materi, **fields) -> Materi:
    for key, value in fields.items():
        if value is not None or key in KOLOM_BOLEH_KOSONG:
            setattr(materi, key, value)
    db.commit()
    db.refresh(materi)
    return materi


def delete(db: Session, materi: Materi) -> None:
    db.delete(materi)
    db.commit()


def hitung_dibuat_antara(db: Session, awal: datetime, akhir: datetime) -> int:
    """Jumlah materi (semua status) yang dibuat pada awal <= dibuat_pada < akhir."""
    return (
        db.query(func.count(Materi.id))
        .filter(Materi.dibuat_pada >= awal, Materi.dibuat_pada < akhir)
        .scalar()
        or 0
    )