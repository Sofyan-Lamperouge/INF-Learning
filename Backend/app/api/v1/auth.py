from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.pengguna import Pengguna

from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    PenggunaRingkas,
    RegistrasiRequest,
    RegistrasiResponse,
)

from app.services import auth_service


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/registrasi",
    response_model=RegistrasiResponse,
    status_code=status.HTTP_201_CREATED,
)
def registrasi(
    data: RegistrasiRequest,
    db: Session = Depends(get_db),
):
    return auth_service.registrasi(
        db,
        data,
    )


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    return auth_service.login(
        db,
        data,
    )


@router.get(
    "/me",
    response_model=PenggunaRingkas,
    status_code=status.HTTP_200_OK,
)
def me(
    pengguna: Pengguna = Depends(
        get_current_user
    ),
):
    return pengguna