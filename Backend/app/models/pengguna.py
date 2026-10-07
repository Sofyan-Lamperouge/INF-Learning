from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Pengguna(Base):
    __tablename__ = "pengguna"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    peran: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    nomor_induk: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    nama: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    kata_sandi: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="aktif", nullable=False)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    diubah_pada: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
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
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    pengguna: Mapped["Pengguna"] = relationship(back_populates="sesi_login")