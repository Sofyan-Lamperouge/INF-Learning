from sqlalchemy.orm import Session

from app.models.pengguna import Pengguna


def get_by_nomor_induk(db: Session, nomor_induk: str) -> Pengguna | None:
    return db.query(Pengguna).filter(Pengguna.nomor_induk == nomor_induk).first()


def create(
    db: Session,
    *,
    peran: str,
    nomor_induk: str,
    nama: str,
    kata_sandi_hashed: str | None = None,
    angkatan: int | None = None,
    status: str = "belum_aktif",
) -> Pengguna:
    pengguna = Pengguna(
        peran=peran,
        nomor_induk=nomor_induk,
        nama=nama,
        kata_sandi=kata_sandi_hashed,
        angkatan=angkatan,
        status=status,
    )
    db.add(pengguna)
    db.commit()
    db.refresh(pengguna)
    return pengguna