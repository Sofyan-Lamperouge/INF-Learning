"""Penyimpanan file upload materi (validasi, simpan, hapus).

Semua file disimpan di settings.UPLOAD_DIR dengan nama acak, lalu dilayani
lewat /uploads/<nama>. Di Railway, UPLOAD_DIR harus berada di dalam Volume.
"""

import contextlib
import os
import re
import uuid
import zipfile
from collections.abc import Callable
from urllib.parse import urlparse

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

EKSTENSI_DIIZINKAN = {".pdf", ".docx", ".pptx"}  # Excel (.xlsx) tidak diizinkan
_CHUNK = 1024 * 1024  # baca 1 MB per putaran agar file besar tidak memenuhi memori


_PESAN_PALSU = (
    "Isi file tidak sesuai dengan ekstensinya. "
    "File ditolak karena kemungkinan telah dimanipulasi"
)

# DOCX/PPTX sebenarnya arsip ZIP; tiap jenis punya bagian wajib sendiri.
_BAGIAN_WAJIB = {
    ".docx": "word/document.xml",
    ".pptx": "ppt/presentation.xml",
}
_MAX_ENTRI_ZIP = 5000
_MAX_UKURAN_ZIP = 300 * 1024 * 1024  # total isi setelah diekstrak (cegah zip bomb)


def _file_palsu() -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=_PESAN_PALSU)


def cek_isi_awal(file: UploadFile, ext: str) -> None:
    """Cek cepat signature (magic bytes) SEBELUM file ditulis ke disk.

    Content-Type kiriman klien tidak dipercaya; yang dilihat adalah isi file.
    """
    awal = file.file.read(1024)
    file.file.seek(0)
    if not awal:
        return  # file kosong ditangani simpan_upload ("File kosong")

    if ext == ".pdf":
        if b"%PDF-" not in awal:
            raise _file_palsu()
    elif not awal.startswith(b"PK\x03\x04"):  # docx/pptx harus berupa ZIP
        raise _file_palsu()


def cek_isi_penuh(lokasi: str, ext: str) -> None:
    """Cek struktur file setelah tersimpan: jenis aslinya harus cocok dengan ekstensi."""
    if ext == ".pdf":
        return  # signature PDF sudah diperiksa di cek_isi_awal
    try:
        with zipfile.ZipFile(lokasi) as arsip:
            info = arsip.infolist()
            if len(info) > _MAX_ENTRI_ZIP or sum(i.file_size for i in info) > _MAX_UKURAN_ZIP:
                raise _file_palsu()
            nama = {i.filename for i in info}
            if "[Content_Types].xml" not in nama or _BAGIAN_WAJIB[ext] not in nama:
                raise _file_palsu()
    except zipfile.BadZipFile:
        raise _file_palsu() from None


def cek_ekstensi(file: UploadFile) -> str:
    """Return ekstensi (mis. '.pdf') atau 400 jika tidak diizinkan."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in EKSTENSI_DIIZINKAN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format file tidak diizinkan",
        )
    cek_isi_awal(file, ext)  # tolak ekstensi palsu sebelum menyentuh disk
    return ext


def nama_asli_bersih(file: UploadFile) -> str:
    """Nama file asli dari klien, dibersihkan (tanpa folder & karakter terlarang)."""
    nama = os.path.basename((file.filename or "").replace("\\", "/"))
    nama = _KARAKTER_TERLARANG.sub("", nama).strip(" .")
    dasar, ext = os.path.splitext(nama)
    dasar = dasar[: 200 - len(ext)].strip(" .")
    return f"{dasar or 'file'}{ext.lower()}"


def nama_unik(nama: str, sudah_ada: Callable[[str], bool]) -> str:
    """laporan.pdf -> laporan(1).pdf -> laporan(2).pdf ... sampai tidak bentrok."""
    if not sudah_ada(nama):
        return nama
    dasar, ext = os.path.splitext(nama)
    i = 1
    while sudah_ada(f"{dasar}({i}){ext}"):
        i += 1
    return f"{dasar}({i}){ext}"


def simpan_upload(file: UploadFile) -> tuple[str, str]:
    """Simpan file ke UPLOAD_DIR. Return (jenis, url). Gagal -> tidak ada file tersisa."""
    ext = cek_ekstensi(file)
    batas = settings.MAX_UPLOAD_MB * 1024 * 1024

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    nama = f"{uuid.uuid4().hex}{ext}"
    lokasi = os.path.join(settings.UPLOAD_DIR, nama)

    ukuran = 0
    try:
        with open(lokasi, "wb") as out:
            while chunk := file.file.read(_CHUNK):
                ukuran += len(chunk)
                if ukuran > batas:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"Ukuran file maksimal {settings.MAX_UPLOAD_MB} MB",
                    )
                out.write(chunk)
        if ukuran == 0:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File kosong")
        cek_isi_penuh(lokasi, ext)  # file sudah tertutup; periksa struktur aslinya
    except BaseException:
        _hapus_lokasi(lokasi)  # file palsu langsung dibuang, tidak ada file yatim
        raise

    url = f"{settings.PUBLIC_BASE_URL.rstrip('/')}/uploads/{nama}"
    return ext.lstrip("."), url


def deteksi_format_foto(data: bytes) -> str | None:
    """Kenali format gambar dari isi file (magic bytes), bukan dari nama/ekstensi/Content-Type.

    Hanya JPG, PNG, dan WEBP. SVG sengaja tidak diizinkan karena bisa memuat script.
    """
    if data.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def simpan_foto(file: UploadFile) -> str:
    """Validasi dan simpan foto profil ke UPLOAD_DIR. Return URL-nya.

    Nama file dibuat acak dan ekstensinya diambil dari isi file, jadi nama asli dari
    klien tidak pernah dipakai.
    """
    batas = settings.MAX_FOTO_MB * 1024 * 1024
    data = file.file.read(batas + 1)  # +1 byte untuk mendeteksi file yang kelebihan ukuran

    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File kosong")
    if len(data) > batas:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Ukuran foto maksimal {settings.MAX_FOTO_MB} MB",
        )
    format_foto = deteksi_format_foto(data)
    if format_foto is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Format foto tidak diizinkan. Gunakan JPG, PNG, atau WEBP",
        )

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    nama = f"foto-{uuid.uuid4().hex}.{format_foto}"
    with open(os.path.join(settings.UPLOAD_DIR, nama), "wb") as out:
        out.write(data)
    return f"{settings.PUBLIC_BASE_URL.rstrip('/')}/uploads/{nama}"


def lokasi_file_dari_url(url: str | None) -> str | None:
    """Lokasi file di disk untuk sebuah URL upload, atau None bila bukan file milik server ini.

    Aman dari path traversal: hanya nama file (basename) yang dipakai, selalu di UPLOAD_DIR.
    """
    if not url:
        return None
    path = urlparse(url).path
    if not path.startswith("/uploads/"):
        return None  # tautan eksternal, bukan file milik server ini
    nama = os.path.basename(path)
    if not nama:
        return None
    return os.path.join(settings.UPLOAD_DIR, nama)


def hapus_file_dari_url(url: str | None) -> None:
    """Hapus file fisik milik sebuah URL upload. Aman: hanya menyentuh isi UPLOAD_DIR."""
    lokasi = lokasi_file_dari_url(url)
    if lokasi:
        _hapus_lokasi(lokasi)


_KARAKTER_TERLARANG = re.compile(r'[\\/:*?"<>|\x00-\x1f]')


def nama_unduhan(judul: str | None, ekstensi: str) -> str:
    """Nama file untuk unduhan, diambil dari judul materi (karakter terlarang dibuang)."""
    bersih = _KARAKTER_TERLARANG.sub("", judul or "")
    bersih = re.sub(r"\s+", " ", bersih).strip(" .")[:100].strip(" .")
    return f"{bersih or 'materi'}{ekstensi}"


def _hapus_lokasi(lokasi: str) -> None:
    with contextlib.suppress(OSError):  # sudah tidak ada / tidak bisa dihapus: abaikan
        os.remove(lokasi)