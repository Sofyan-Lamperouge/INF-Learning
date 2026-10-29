from sqlalchemy.orm import Session
from sqlalchemy import func, or_

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
        query = query.filter(
            or_(Materi.judul.ilike(like), Materi.deskripsi.ilike(like))
        )

    total = query.count()
    items = (
        query.order_by(Materi.dibuat_pada.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items, total


def count_terbit(db: Session) -> int:
    return db.query(Materi).filter(Materi.status == "terbit").count()


def count_by_url(db: Session, url: str) -> int:
    """Jumlah materi yang memakai URL file tertentu (untuk memutuskan boleh/tidaknya file fisik dihapus)."""
    return db.query(Materi).filter(Materi.url == url).count()


def kategori_semester(db: Session, *, status: str | None = None) -> list[tuple[int, int, int]]:
    """Return [(semester, jumlah materi, jumlah mata kuliah berbeda)] hanya semester yang punya materi."""
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
) -> Materi:
    materi = Materi(
        judul=judul,
        deskripsi=deskripsi,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=jenis,
        url=url,
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