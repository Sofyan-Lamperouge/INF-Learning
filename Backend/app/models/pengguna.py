from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.waktu import sekarang_utc
from app.db.base import Base


class Pengguna(Base):
    __tablename__ = "pengguna"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    peran: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    nomor_induk: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    nama: Mapped[str] = mapped_column(String(100), nullable=False)
    kata_sandi: Mapped[str | None] = mapped_column(String(255), nullable=True)
    angkatan: Mapped[int | None] = mapped_column(Integer, nullable=True)
    # URL foto profil (file di UPLOAD_DIR, dilayani lewat /uploads). Kosong = belum ada foto.
    foto_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="belum_aktif", nullable=False)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=sekarang_utc)
    diubah_pada: Mapped[datetime] = mapped_column(
        DateTime, default=sekarang_utc, onupdate=sekarang_utc
    )

    sesi_login: Mapped[list["SesiLogin"]] = relationship(
        back_populates="pengguna", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Pengguna(id={self.id}, peran={self.peran}, nama={self.nama})>"


class SesiLogin(Base):
    __tablename__ = "sesi_login"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    pengguna_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("pengguna.id", ondelete="CASCADE"), nullable=False
    )
    token: Mapped[str] = mapped_column(String(512), nullable=False)
    perangkat: Mapped[str | None] = mapped_column(String(255), nullable=True)
    alamat_ip: Mapped[str | None] = mapped_column(String(45), nullable=True)
    kedaluwarsa_pada: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=sekarang_utc)

    pengguna: Mapped["Pengguna"] = relationship(back_populates="sesi_login")
