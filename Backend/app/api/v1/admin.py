from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.admin import DashboardStatsResponse
from app.services import admin_service

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get(
    "/dashboard",
    response_model=DashboardStatsResponse,
    summary="Ambil data ringkasan untuk dashboard admin",
    description="Endpoint ini hanya bisa diakses oleh user dengan role 'admin'.",
)
def get_dashboard(
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return admin_service.get_dashboard_stats(db)