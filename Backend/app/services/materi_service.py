from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import materi as crud_materi
from app.models.materi import Materi
from app.schemas.materi import MateriCreateRequest, MateriUpdateRequest


def list_materi(
    db: Session,
    *,
    mata_kuliah: str | None = None,
    semester: int | None = None,
    jenis: str | None = None,
    q: str | None = None,
    page: int = 1,
    limit: int = 20,
):
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 20

    skip = (page - 1) * limit

    items, total = crud_materi.get_all(
        db,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=jenis,
        q=q,
        skip=skip,
        limit=limit,
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


def get_materi(db: Session, materi_id: int) -> Materi:
    materi = crud_materi.get_by_id(db, materi_id)
    if not materi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Materi tidak ditemukan",
        )
    return materi


def create_materi(
    db: Session, data: MateriCreateRequest, admin_id: int
) -> Materi:
    return crud_materi.create(
        db,
        judul=data.judul,
        deskripsi=data.deskripsi,
        mata_kuliah=data.mata_kuliah,
        semester=data.semester,
        jenis=data.jenis,
        url=data.url,
        dibuat_oleh=admin_id,
        status="terbit",
    )


def update_materi(
    db: Session, materi_id: int, data: MateriUpdateRequest
) -> Materi:
    materi = get_materi(db, materi_id)

    fields = data.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tidak ada field yang diubah",
        )

    return crud_materi.update(db, materi, **fields)


def delete_materi(db: Session, materi_id: int) -> None:
    materi = get_materi(db, materi_id)
    crud_materi.delete(db, materi)