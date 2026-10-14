from datetime import datetime

from sqlalchemy import BigInteger, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Materi(Base):
    __tablename__ = "materi"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    judul: Mapped[str] = mapped_column(String(200), nullable=False)
    deskripsi: Mapped[str | None] = mapped_column(Text, nullable=True)
    mata_kuliah: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    semester: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    jenis: Mapped[str] = mapped_column(String(20), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    dibuat_oleh: Mapped[int | None] = mapped_column(
        BigInteger, ForeignKey("pengguna.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(20), default="terbit", nullable=False
    )
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    diubah_pada: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:
        return f"<Materi(id={self.id}, judul={self.judul}, mata_kuliah={self.mata_kuliah})>"