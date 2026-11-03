"""CRUD dan pengelolaan mahasiswa untuk admin.

  GET    /mahasiswa                 daftar + pencarian (q) + filter status/angkatan + paginasi
  GET    /mahasiswa/ringkasan       jumlah mahasiswa per status akun
  POST   /mahasiswa/import          impor massal dari CSV (?simulasi=true untuk pratinjau)
  GET    /mahasiswa/{id}            detail
  POST   /mahasiswa                 tambah (status awal belum_aktif)
  PUT    /mahasiswa/{id}            ubah nama / angkatan / status / NIM (NIM: akun belum aktivasi)
  POST   /mahasiswa/{id}/reset-akun kembalikan ke belum_aktif tanpa kata sandi
  DELETE /mahasiswa/{id}            hapus

Catatan: GET /mahasiswa/dashboard (khusus mahasiswa) ada di dashboard_mahasiswa.py dan
didaftarkan lebih dulu di main.py, jadi tidak bentrok dengan GET /mahasiswa/{id}.
"""

from fastapi import APIRouter, Depends, File, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_role
from app.db.session import get_db
from app.models.pengguna import Pengguna
from app.schemas.mahasiswa import (
    ANGKATAN_MAKS,
    ANGKATAN_MIN,
    ImportMahasiswaResponse,
    MahasiswaCreateRequest,
    MahasiswaListResponse,
    MahasiswaResponse,
    MahasiswaUpdateRequest,
    RingkasanMahasiswaResponse,
)
from app.schemas.tipe import StatusAkun
from app.services import impor_mahasiswa_service, mahasiswa_service

router = APIRouter(prefix="/mahasiswa", tags=["Mahasiswa"])


@router.get(
    "",
    response_model=MahasiswaListResponse,
    summary="List mahasiswa + pencarian & filter (admin only)",
)
def list_mahasiswa(
    q: str | None = Query(None, max_length=100, description="Cari di nama atau NIM"),
    status: StatusAkun | None = Query(None, description="Filter status akun"),
    angkatan: int | None = Query(None, ge=ANGKATAN_MIN, le=ANGKATAN_MAKS),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return mahasiswa_service.list_mahasiswa(
        db, q=q, status=status, angkatan=angkatan, page=page, limit=limit
    )


@router.get(
    "/ringkasan",
    response_model=RingkasanMahasiswaResponse,
    summary="Jumlah mahasiswa per status akun (admin only)",
)
def ringkasan_mahasiswa(
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return mahasiswa_service.ringkasan(db)


@router.post(
    "/import",
    response_model=ImportMahasiswaResponse,
    summary="Impor mahasiswa dari file CSV (admin only)",
    description=(
        "Kolom: `nomor_induk`, `nama`, `angkatan` (opsional). Pemisah koma/titik koma/tab "
        "dikenali otomatis. NIM yang sudah terdaftar dan baris tidak valid dilewati, baris "
        "lainnya tetap diproses. Dengan `simulasi=true` tidak ada data yang disimpan "
        "(untuk pratinjau)."
    ),
)
def import_mahasiswa(
    file: UploadFile = File(..., description="File .csv (UTF-8, maks 1 MB, maks 2000 baris)"),
    simulasi: bool = Query(False, description="true = hanya hitung & laporkan, tanpa menyimpan"),
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return impor_mahasiswa_service.impor_csv(db, file, simulasi=simulasi)


@router.get(
    "/{id}",
    response_model=MahasiswaResponse,
    summary="Detail mahasiswa (admin only)",
)
def detail_mahasiswa(
    id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return mahasiswa_service.get_mahasiswa(db, id)


@router.post(
    "",
    response_model=MahasiswaResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tambah mahasiswa manual (admin only)",
)
def tambah_mahasiswa(
    data: MahasiswaCreateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return mahasiswa_service.tambah_mahasiswa(db, data)


@router.put(
    "/{id}",
    response_model=MahasiswaResponse,
    summary="Edit data/status mahasiswa (admin only)",
    description=(
        "Kirim hanya field yang berubah. `angkatan: null` mengosongkan angkatan. "
        "`nomor_induk` hanya bisa diganti untuk akun yang belum diaktivasi."
    ),
)
def edit_mahasiswa(
    id: int,
    data: MahasiswaUpdateRequest,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return mahasiswa_service.ubah_mahasiswa(db, id, data)


@router.post(
    "/{id}/reset-akun",
    response_model=MahasiswaResponse,
    summary="Reset akun mahasiswa (admin only)",
    description=(
        "Menghapus kata sandi dan mengembalikan status ke belum_aktif, sehingga mahasiswa "
        "bisa registrasi ulang (mis. lupa kata sandi). Data dan progres belajar tetap."
    ),
)
def reset_akun_mahasiswa(
    id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    return mahasiswa_service.reset_akun(db, id)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Hapus mahasiswa (admin only)",
)
def hapus_mahasiswa(
    id: int,
    db: Session = Depends(get_db),
    admin: Pengguna = Depends(require_role("admin")),
):
    mahasiswa_service.hapus_mahasiswa(db, id)
