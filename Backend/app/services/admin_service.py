"""Data ringkasan untuk dashboard admin."""

from sqlalchemy.orm import Session

from app.core.waktu import rentang_hari_ini_utc
from app.crud import materi as crud_materi
from app.crud import mahasiswa as crud_mhs
from app.models.materi import Materi
from app.models.pengguna import Pengguna
from app.schemas.admin import DashboardStatsResponse

JUMLAH_TERBARU = 5


def get_dashboard_stats(db: Session) -> DashboardStatsResponse:
    mahasiswa = db.query(Pengguna).filter(Pengguna.peran == "mahasiswa")
    awal, akhir = rentang_hari_ini_utc()

    return DashboardStatsResponse(
        total_mahasiswa=mahasiswa.count(),
        total_materi=db.query(Materi).count(),
        mahasiswa_hari_ini=crud_mhs.hitung_dibuat_antara(db, awal, akhir),
        materi_hari_ini=crud_materi.hitung_dibuat_antara(db, awal, akhir),
        # Semua status materi ikut (draft/arsip juga), terbaru dulu
        materi_terbaru=db.query(Materi)
        .order_by(Materi.dibuat_pada.desc())
        .limit(JUMLAH_TERBARU)
        .all(),
        mahasiswa_terbaru=mahasiswa.order_by(Pengguna.dibuat_pada.desc())
        .limit(JUMLAH_TERBARU)
        .all(),
    )
