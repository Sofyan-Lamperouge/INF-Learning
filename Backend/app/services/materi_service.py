from fastapi import HTTPException, UploadFile, status
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.crud import materi as crud_materi
from app.crud import progres as crud_progres
from app.models.materi import Materi
from app.schemas.materi import MateriCreateRequest, MateriUpdateRequest
from app.services import file_service

# URL sementara hanya untuk memvalidasi field lain SEBELUM file disimpan ke disk
_URL_VALIDASI = "https://validasi.invalid/file"


def _ke_422(exc: ValidationError) -> RequestValidationError:
    """Ubah ValidationError pydantic menjadi respons 422 berformat sama dengan validasi FastAPI."""
    errors = [
        {**e, "loc": ("body", *e["loc"])}
        for e in exc.errors(include_url=False, include_context=False, include_input=False)
    ]
    return RequestValidationError(errors)


# ------------------------------------------------------------
# Baca
# ------------------------------------------------------------
def list_materi(
    db: Session,
    *,
    mata_kuliah: str | None = None,
    semester: int | None = None,
    jenis: str | None = None,
    q: str | None = None,
    hanya_terbit: bool = False,
    pengguna_id: int | None = None,
    page: int = 1,
    limit: int = 20,
):
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 20

    skip = (page - 1) * limit

    items, total = crud_materi.get_all(
        db,
        mata_kuliah=mata_kuliah,
        semester=semester,
        jenis=jenis,
        q=q,
        status="terbit" if hanya_terbit else None,
        skip=skip,
        limit=limit,
    )

    if pengguna_id is not None:
        tandai_status_belajar(db, items, pengguna_id)

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
    }


def tandai_status_belajar(db: Session, daftar_materi: list[Materi], pengguna_id: int) -> None:
    """Isi atribut status_belajar (belum/dilihat/selesai) milik mahasiswa pada tiap materi."""
    status_map = crud_progres.map_status_by_materi(db, pengguna_id)
    for materi in daftar_materi:
        materi.status_belajar = status_map.get(materi.id, "belum")


def get_kategori_semester(db: Session, *, hanya_terbit: bool) -> dict:
    """Semester 1-8 selalu tampil; yang belum punya materi berjumlah 0."""
    ada = {
        s: (total, mk)
        for s, total, mk in crud_materi.kategori_semester(
            db, status="terbit" if hanya_terbit else None
        )
    }
    return {
        "items": [
            {
                "semester": s,
                "total_materi": ada.get(s, (0, 0))[0],
                "total_mata_kuliah": ada.get(s, (0, 0))[1],
            }
            for s in range(1, 9)
        ]
    }


def get_kategori_mata_kuliah(db: Session, *, semester: int, hanya_terbit: bool) -> dict:
    rows = crud_materi.kategori_mata_kuliah(
        db, semester=semester, status="terbit" if hanya_terbit else None
    )
    return {
        "semester": semester,
        "items": [{"mata_kuliah": mk, "total_materi": total} for mk, total in rows],
    }


def get_materi(db: Session, materi_id: int) -> Materi:
    materi = crud_materi.get_by_id(db, materi_id)
    if not materi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Materi tidak ditemukan",
        )
    return materi


# ------------------------------------------------------------
# Tulis (admin)
# ------------------------------------------------------------
def create_materi(
    db: Session, data: MateriCreateRequest, admin_id: int
) -> Materi:
    return crud_materi.create(
        db,
        judul=data.judul,
        deskripsi=data.deskripsi,
        mata_kuliah=data.mata_kuliah,
        semester=data.semester,
        jenis=data.jenis,
        url=data.url,
        dibuat_oleh=admin_id,
        status="terbit",
    )


def upload_materi(
    db: Session,
    *,
    judul: str,
    mata_kuliah: str,
    semester: int,
    deskripsi: str | None,
    file: UploadFile,
    admin_id: int,
) -> Materi:
    """POST /materi. Semua validasi dilakukan sebelum file disimpan (tidak ada file yatim)."""
    ext = file_service.cek_ekstensi(file)  # 400 bila format salah

    bidang = dict(
        judul=judul.strip(),
        mata_kuliah=mata_kuliah.strip(),
        semester=semester,
        deskripsi=(deskripsi or "").strip() or None,
    )
    try:
        MateriCreateRequest(**bidang, jenis=ext.lstrip("."), url=_URL_VALIDASI)
    except ValidationError as exc:
        raise _ke_422(exc)

    jenis, url = file_service.simpan_upload(file)  # 413 bila > batas ukuran
    try:
        return create_materi(db, MateriCreateRequest(**bidang, jenis=jenis, url=url), admin_id)
    except Exception:
        file_service.hapus_file_dari_url(url)
        raise


def update_materi(
    db: Session, materi_id: int, data: MateriUpdateRequest
) -> Materi:
    """PUT /materi/{id} (JSON, tanpa ganti file)."""
    materi = get_materi(db, materi_id)

    fields = data.model_dump(exclude_unset=True)
    if not fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tidak ada field yang diubah",
        )

    url_lama = materi.url
    materi = crud_materi.update(db, materi, **fields)

    # Jika url diganti, file lama dibuang selama tidak dipakai materi lain
    url_baru = fields.get("url")
    if url_baru and url_baru != url_lama and crud_materi.count_by_url(db, url_lama) == 0:
        file_service.hapus_file_dari_url(url_lama)

    return materi


def ubah_materi_form(
    db: Session,
    materi_id: int,
    *,
    judul: str | None,
    mata_kuliah: str | None,
    semester: int | None,
    deskripsi: str | None,
    file: UploadFile | None,
) -> Materi:
    """PUT /materi/{id}/edit (multipart, dipakai modal Edit Materi di frontend).

    - Hanya field yang dikirim yang diubah.
    - deskripsi kosong ("") berarti dikosongkan.
    - file opsional: bila ada, file lama diganti (dan dihapus dari disk).
    """
    materi = get_materi(db, materi_id)

    if file is not None and not file.filename:
        file = None  # bagian file kosong dari form dianggap "tidak mengganti file"

    fields: dict = {}
    if judul is not None:
        fields["judul"] = judul.strip()
    if mata_kuliah is not None:
        fields["mata_kuliah"] = mata_kuliah.strip()
    if semester is not None:
        fields["semester"] = semester
    if deskripsi is not None:
        fields["deskripsi"] = deskripsi.strip() or None

    if not fields and file is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tidak ada field yang diubah",
        )

    if file is not None:
        file_service.cek_ekstensi(file)  # 400 bila format salah

    try:  # validasi dulu, sebelum menyentuh disk
        MateriUpdateRequest(**fields)
    except ValidationError as exc:
        raise _ke_422(exc)

    url_lama = materi.url
    url_baru = None
    if file is not None:
        jenis, url_baru = file_service.simpan_upload(file)  # 413 bila > batas ukuran
        fields["jenis"] = jenis
        fields["url"] = url_baru

    try:
        materi = crud_materi.update(db, materi, **fields)
    except Exception:
        file_service.hapus_file_dari_url(url_baru)
        raise

    # File lama dibuang hanya setelah database berhasil diperbarui
    if url_baru and url_lama != url_baru and crud_materi.count_by_url(db, url_lama) == 0:
        file_service.hapus_file_dari_url(url_lama)

    return materi


def delete_materi(db: Session, materi_id: int) -> None:
    materi = get_materi(db, materi_id)
    url = materi.url
    crud_materi.delete(db, materi)
    # Hapus file fisiknya juga, kecuali masih dipakai materi lain
    if crud_materi.count_by_url(db, url) == 0:
        file_service.hapus_file_dari_url(url)
