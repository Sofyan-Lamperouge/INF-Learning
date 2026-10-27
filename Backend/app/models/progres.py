from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ProgresMateri(Base):
    """Catatan progres belajar: satu baris per (mahasiswa, materi)."""

    __tablename__ = "progres_materi"
    __table_args__ = (
        UniqueConstraint("pengguna_id", "materi_id", name="uq_progres_pengguna_materi"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    pengguna_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("pengguna.id", ondelete="CASCADE"), nullable=False, index=True
    )
    materi_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("materi.id", ondelete="CASCADE"), nullable=False, index=True
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="dilihat")  # dilihat / selesai
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    diubah_pada: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
