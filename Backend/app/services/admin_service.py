from sqlalchemy.orm import Session
from app.models.pengguna import Pengguna
from app.models.materi import Materi
from app.schemas.admin import DashboardStatsResponse


def get_dashboard_stats(db: Session) -> DashboardStatsResponse:
    # Hitung total mahasiswa
    total_mahasiswa = (
        db.query(Pengguna)
        .filter(Pengguna.peran == "mahasiswa")
        .count()
    )

    # Hitung total materi
    total_materi = db.query(Materi).count()

    return DashboardStatsResponse(
        total_mahasiswa=total_mahasiswa,
        total_materi=total_materi,
    )