from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


def _normalisasi_url(url: str) -> str:
    """Normalisasi URL database dari berbagai format Railway."""
    if not url or not url.strip():
        raise ValueError(
            "DATABASE_URL kosong. Pastikan environment variable sudah di-set."
        )

    # Hapus spasi / newline di awal & akhir
    url = url.strip()

    # mysql:// → mysql+pymysql://
    if url.startswith("mysql://"):
        url = url.replace("mysql://", "mysql+pymysql://", 1)

    # Tambah charset kalau belum ada
    if "charset" not in url:
        separator = "&" if "?" in url else "?"
        url = f"{url}{separator}charset=utf8mb4"

    return url


_db_url = _normalisasi_url(settings.DATABASE_URL)

engine = create_engine(
    _db_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()