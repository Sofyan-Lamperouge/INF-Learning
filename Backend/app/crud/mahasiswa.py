"""Query tabel pengguna khusus peran mahasiswa."""

from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from app.models.pengguna import Pengguna

_UKURAN_POTONGAN_IN = 500  # batasi jumlah nilai pada satu klausa IN


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


def get_by_id(db: Session, id: int) -> Pengguna | None:
    return db.query(Pengguna).filter(Pengguna.id == id, Pengguna.peran == "mahasiswa").first()


def hitung_per_status(db: Session) -> dict[str, int]:
    """Jumlah mahasiswa per status akun, mis. {"aktif": 10, "belum_aktif": 3}."""
    rows = (
        db.query(Pengguna.status, func.count(Pengguna.id))
        .filter(Pengguna.peran == "mahasiswa")
        .group_by(Pengguna.status)
        .all()
    )
    return {status: int(jumlah) for status, jumlah in rows}


def nim_yang_sudah_ada(db: Session, daftar_nim: list[str]) -> set[str]:
    """Himpunan NIM dari daftar_nim yang sudah dipakai pengguna mana pun."""
    ada: set[str] = set()
    for awal in range(0, len(daftar_nim), _UKURAN_POTONGAN_IN):
        potongan = daftar_nim[awal : awal + _UKURAN_POTONGAN_IN]
        rows = db.query(Pengguna.nomor_induk).filter(Pengguna.nomor_induk.in_(potongan)).all()
        ada.update(nim for (nim,) in rows)
    return ada


def create(db: Session, data: dict) -> Pengguna:
    mhs = _baru(data)
    db.add(mhs)
    db.commit()
    db.refresh(mhs)
    return mhs


def create_banyak(db: Session, daftar: list[dict]) -> None:
    """Tambah banyak mahasiswa sekaligus dalam satu transaksi."""
    db.add_all([_baru(data) for data in daftar])
    db.commit()


def update(db: Session, mhs: Pengguna, data: dict) -> Pengguna:
    for key, value in data.items():
        setattr(mhs, key, value)
    db.commit()
    db.refresh(mhs)
    return mhs


def reset_akun(db: Session, mhs: Pengguna) -> Pengguna:
    """Kosongkan kata sandi dan kembalikan ke belum_aktif agar mahasiswa bisa registrasi ulang."""
    mhs.kata_sandi = None
    mhs.status = "belum_aktif"
    db.commit()
    db.refresh(mhs)
    return mhs


def delete(db: Session, mhs: Pengguna) -> None:
    db.delete(mhs)
    db.commit()


def _baru(data: dict) -> Pengguna:
    return Pengguna(
        peran="mahasiswa",
        nomor_induk=data["nomor_induk"],
        nama=data["nama"],
        angkatan=data.get("angkatan"),
        status="belum_aktif",
        kata_sandi=None,
    )
