from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.materi import Materi


def get_all(
    db: Session,
    *,
    mata_kuliah: str | None = None,
    semester: int | None = None,
    jenis: str | None = None,
    q: str | None = None,
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


def update(db: Session, materi: Materi, **fields) -> Materi:
    for key, value in fields.items():
        if value is not None:
            setattr(materi, key, value)
    db.commit()
    db.refresh(materi)
    return materi


def delete(db: Session, materi: Materi) -> None:
    db.delete(materi)
    db.commit()