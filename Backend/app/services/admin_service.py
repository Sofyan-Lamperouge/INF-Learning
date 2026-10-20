from sqlalchemy.orm import Session
from app.models.pengguna import Pengguna
from app.models.materi import Materi
from app.models.kuis import Kuis
from app.schemas.admin import DashboardStatsResponse


def get_dashboard_stats(db: Session) -> DashboardStatsResponse:
    # ==========================================
    # 1. HITUNG STATISTIK (Card Angka)
    # ==========================================
    total_mahasiswa = (
        db.query(Pengguna)
        .filter(Pengguna.peran == "mahasiswa")
        .count()
    )
    total_materi = db.query(Materi).count()
    total_kuis = db.query(Kuis).count()

    # ==========================================
    # 2. AMBIL 5 DATA TERBARU (List Tabel)
    # ==========================================
    # Ambil 5 materi terbaru berdasarkan waktu dibuat
    materi_terbaru = (
        db.query(Materi)
        .order_by(Materi.dibuat_pada.desc())
        .limit(5)
        .all()
    )

    # Ambil 5 mahasiswa terbaru yang registrasi/aktivasi
    mahasiswa_terbaru = (
        db.query(Pengguna)
        .filter(Pengguna.peran == "mahasiswa")
        .order_by(Pengguna.dibuat_pada.desc())
        .limit(5)
        .all()
    )

    # ==========================================
    # 3. KEMBALIKAN RESPONSE
    # ==========================================
    return DashboardStatsResponse(
        total_mahasiswa=total_mahasiswa,
        total_materi=total_materi,
        total_kuis=total_kuis,
        materi_terbaru=materi_terbaru,
        mahasiswa_terbaru=mahasiswa_terbaru,
    )