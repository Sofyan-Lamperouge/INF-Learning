"""Query dasar tabel sesi_login (satu baris = satu sesi login di satu perangkat)."""

from datetime import datetime

from sqlalchemy.orm import Session

from app.models.pengguna import SesiLogin


def get_by_id(db: Session, sesi_id: int) -> SesiLogin | None:
    return db.query(SesiLogin).filter(SesiLogin.id == sesi_id).first()


def buat(
    db: Session,
    *,
    pengguna_id: int,
    token: str,
    kedaluwarsa_pada: datetime,
    perangkat: str | None = None,
    alamat_ip: str | None = None,
) -> SesiLogin:
    sesi = SesiLogin(
        pengguna_id=pengguna_id,
        token=token,
        kedaluwarsa_pada=kedaluwarsa_pada,
        perangkat=perangkat,
        alamat_ip=alamat_ip,
    )
    db.add(sesi)
    db.commit()
    db.refresh(sesi)
    return sesi


def hapus(db: Session, sesi: SesiLogin) -> None:
    db.delete(sesi)
    db.commit()


def hapus_kedaluwarsa_milik(db: Session, pengguna_id: int, sekarang: datetime) -> None:
    """Bersihkan sesi lama milik satu pengguna yang sudah lewat batas waktunya."""
    db.query(SesiLogin).filter(
        SesiLogin.pengguna_id == pengguna_id,
        SesiLogin.kedaluwarsa_pada <= sekarang,
    ).delete(synchronize_session=False)
    db.commit()
