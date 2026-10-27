from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.crud import materi as crud_materi
from app.crud import progres as crud_progres
from app.models.materi import Materi
from app.models.pengguna import Pengguna
from app.schemas.dashboard_mahasiswa import (
    DashboardMahasiswaResponse,
    MateriDashboard,
    ProfilMahasiswa,
    ProgresMataKuliah,
    StatistikBelajar,
)


def _persen(bagian: int, total: int) -> float:
    return round(bagian / total * 100, 1) if total else 0.0


def _ke_materi_dashboard(materi: Materi, status_map: dict[int, str]) -> MateriDashboard:
    return MateriDashboard(
        id=materi.id,
        judul=materi.judul,
        mata_kuliah=materi.mata_kuliah,
        semester=materi.semester,
        jenis=materi.jenis,
        url=materi.url,
        dibuat_pada=materi.dibuat_pada,
        status_belajar=status_map.get(materi.id, "belum"),
    )


def get_dashboard(db: Session, mhs: Pengguna) -> DashboardMahasiswaResponse:
    status_map = crud_progres.map_status_by_materi(db, mhs.id)

    total_materi = crud_materi.count_terbit(db)
    dilihat, selesai = crud_progres.hitung_progres(db, mhs.id)

    terbaru, _ = crud_materi.get_all(db, status="terbit", skip=0, limit=5)
    lanjut = crud_progres.materi_terakhir_dilihat(db, mhs.id)

    return DashboardMahasiswaResponse(
        profil=ProfilMahasiswa(
            id=mhs.id, nama=mhs.nama, nomor_induk=mhs.nomor_induk, angkatan=mhs.angkatan
        ),
        statistik=StatistikBelajar(
            total_materi=total_materi,
            materi_dilihat=dilihat,
            materi_selesai=selesai,
            persen_selesai=_persen(selesai, total_materi),
        ),
        lanjutkan_belajar=_ke_materi_dashboard(lanjut, status_map) if lanjut else None,
        materi_terbaru=[_ke_materi_dashboard(m, status_map) for m in terbaru],
        progres_mata_kuliah=[
            ProgresMataKuliah(mata_kuliah=mk, total=t, selesai=s, persen=_persen(s, t))
            for mk, t, s in crud_progres.progres_per_mata_kuliah(db, mhs.id)
        ],
    )


def catat_progres(db: Session, mhs: Pengguna, materi_id: int, status_baru: str):
    materi = crud_materi.get_by_id(db, materi_id)
    if not materi or materi.status != "terbit":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Materi tidak ditemukan"
        )
    return crud_progres.upsert(db, mhs.id, materi_id, status_baru)
