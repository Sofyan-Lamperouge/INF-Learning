"""Aturan bisnis CRUD mahasiswa (dipakai admin)."""

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.crud import mahasiswa as crud_mhs
from app.crud import pengguna as crud_pengguna
from app.models.pengguna import Pengguna
from app.schemas.mahasiswa import MahasiswaCreateRequest, MahasiswaUpdateRequest

# Field yang boleh dikosongkan (diset NULL) bila dikirim sebagai null
BOLEH_KOSONG = {"angkatan"}


def _nim_sudah_ada() -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail="NIM sudah terdaftar")


def list_mahasiswa(
    db: Session,
    *,
    q: str | None = None,
    status: str | None = None,
    angkatan: int | None = None,
    page: int = 1,
    limit: int = 20,
):
    items, total = crud_mhs.get_all(
        db,
        q=(q or "").strip() or None,
        status=status,
        angkatan=angkatan,
        skip=(page - 1) * limit,
        limit=limit,
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


def ringkasan(db: Session) -> dict:
    per_status = crud_mhs.hitung_per_status(db)
    return {
        "total": sum(per_status.values()),
        "belum_aktif": per_status.get("belum_aktif", 0),
        "aktif": per_status.get("aktif", 0),
        "nonaktif": per_status.get("nonaktif", 0),
    }


def get_mahasiswa(db: Session, id: int) -> Pengguna:
    mhs = crud_mhs.get_by_id(db, id)
    if not mhs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Mahasiswa tidak ditemukan"
        )
    return mhs


def tambah_mahasiswa(db: Session, data: MahasiswaCreateRequest) -> Pengguna:
    if crud_pengguna.get_by_nomor_induk(db, data.nomor_induk):
        raise _nim_sudah_ada()
    try:
        return crud_mhs.create(db, data.model_dump())
    except IntegrityError:  # dua permintaan bersamaan dengan NIM yang sama
        db.rollback()
        raise _nim_sudah_ada() from None


def ubah_mahasiswa(db: Session, id: int, data: MahasiswaUpdateRequest) -> Pengguna:
    mhs = get_mahasiswa(db, id)

    fields = {
        key: value
        for key, value in data.model_dump(exclude_unset=True).items()
        if value is not None or key in BOLEH_KOSONG
    }

    # NIM: abaikan jika sama dengan yang lama. Mengganti NIM hanya boleh
    # untuk akun yang belum diaktivasi (belum punya kata sandi).
    nim_baru = fields.get("nomor_induk")
    if nim_baru is not None:
        if nim_baru == mhs.nomor_induk:
            fields.pop("nomor_induk")
        else:
            if mhs.kata_sandi is not None:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="NIM tidak dapat diubah karena akun sudah diaktivasi",
                )
            if crud_pengguna.get_by_nomor_induk(db, nim_baru):
                raise _nim_sudah_ada()

    try:
        return crud_mhs.update(db, mhs, fields)
    except IntegrityError:
        db.rollback()
        raise _nim_sudah_ada() from None


def reset_akun(db: Session, id: int) -> Pengguna:
    """Kembalikan akun ke belum_aktif tanpa kata sandi (mis. mahasiswa lupa kata sandi).

    Data dan progres belajar tetap. Mahasiswa mengaktifkan lagi lewat registrasi.
    """
    return crud_mhs.reset_akun(db, get_mahasiswa(db, id))


def hapus_mahasiswa(db: Session, id: int) -> None:
    crud_mhs.delete(db, get_mahasiswa(db, id))
