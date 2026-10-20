from datetime import datetime
from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Kuis(Base):
    __tablename__ = "kuis"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    judul: Mapped[str] = mapped_column(String(200), nullable=False)
    deskripsi: Mapped[str | None] = mapped_column(Text, nullable=True)
    durasi_menit: Mapped[int] = mapped_column(Integer, default=30)
    status: Mapped[str] = mapped_column(String(20), default="draft") # draft / terbit / arsip
    dibuat_oleh: Mapped[int | None] = mapped_column(BigInteger, ForeignKey("pengguna.id", ondelete="SET NULL"), nullable=True)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    diubah_pada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    pertanyaan: Mapped[list["Pertanyaan"]] = relationship(back_populates="kuis", cascade="all, delete-orphan")

class Pertanyaan(Base):
    __tablename__ = "pertanyaan"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    kuis_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("kuis.id", ondelete="CASCADE"), nullable=False)
    teks_pertanyaan: Mapped[str] = mapped_column(Text, nullable=False)
    tipe: Mapped[str] = mapped_column(String(20), default="pilihan_ganda") # pilihan_ganda / esai
    bobot: Mapped[int] = mapped_column(Integer, default=1)
    urutan: Mapped[int] = mapped_column(Integer, default=0)

    kuis: Mapped["Kuis"] = relationship(back_populates="pertanyaan")
    pilihan: Mapped[list["PilihanJawaban"]] = relationship(back_populates="pertanyaan", cascade="all, delete-orphan")

class PilihanJawaban(Base):
    __tablename__ = "pilihan_jawaban"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    pertanyaan_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("pertanyaan.id", ondelete="CASCADE"), nullable=False)
    label: Mapped[str] = mapped_column(String(5), nullable=False) # A, B, C, D
    teks: Mapped[str] = mapped_column(Text, nullable=False)
    benar: Mapped[bool] = mapped_column(Boolean, default=False)

    pertanyaan: Mapped["Pertanyaan"] = relationship(back_populates="pilihan")