"""URL file upload bertanda tangan yang TERIKAT SESI LOGIN.

Alur:
  1. File disimpan dengan URL polos di database (mis. https://host/uploads/<uuid>.pdf).
  2. Setiap kali API mengeluarkan URL itu (materi, foto profil, dashboard), URL diberi
     ?exp=<kedaluwarsa>&sid=<id sesi login pemilik>&sig=<tanda tangan HMAC>. Hanya pengguna yang
     lolos login/peran di endpoint API yang menerima URL, dan URL itu terikat ke sesinya.
  3. Rute /uploads/{nama} (api/v1/berkas.py) memeriksa tanda tangan, lalu MEMERIKSA ULANG ke
     database: sesi masih aktif, akun masih aktif, dan peran itu berhak atas file tersebut
     (services/berkas_service.py). Logout, sesi habis, atau akun dinonaktifkan langsung
     mematikan semua URL yang sudah beredar.

Catatan keamanan: pemilik sesi yang masih aktif bisa mengirim URL-nya ke orang lain; selama
sesi pemilik aktif dan URL belum kedaluwarsa, orang itu bisa membukanya.
"""

import base64
import hashlib
import hmac
import time
from contextvars import ContextVar
from typing import Annotated
from urllib.parse import urlencode, urlparse, urlunparse

from pydantic import PlainSerializer

from app.core.config import settings

AWAL_PATH = "/uploads/"

# Penampung per-request untuk id sesi pemilik respons. Diisi KonteksSesiMiddleware (dict kosong),
# lalu diisi dependency get_sesi_aktif atau proses login. Dict dibagi lewat ContextVar supaya
# isinya tetap terlihat saat respons diserialisasi walau dependency berjalan di threadpool.
_konteks: ContextVar[dict | None] = ContextVar("konteks_sesi_berkas", default=None)


class KonteksSesiMiddleware:
    """Middleware ASGI murni: menyediakan penampung id sesi untuk setiap request HTTP."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        token = _konteks.set({})
        try:
            await self.app(scope, receive, send)
        finally:
            _konteks.reset(token)


def tetapkan_sesi(sesi_id: int) -> None:
    """Catat id sesi pemilik respons yang sedang dibuat (dipanggil setelah login tervalidasi)."""
    konteks = _konteks.get()
    if konteks is not None:
        konteks["sid"] = sesi_id


def sesi_saat_ini() -> int | None:
    konteks = _konteks.get()
    return konteks.get("sid") if konteks else None


def _sekarang() -> float:
    return time.time()  # dipisah agar mudah diganti di tes


def _kunci() -> bytes:
    # Diturunkan dari JWT_SECRET dengan label khusus, jadi tidak perlu secret baru dan kunci
    # ini tidak sama dengan kunci penanda tangan JWT.
    return hashlib.sha256(b"tautan-file-v2:" + settings.JWT_SECRET.encode("utf-8")).digest()


def _tanda_tangan(nama: str, exp: int, sid: int) -> str:
    pesan = f"{nama}\n{exp}\n{sid}".encode("utf-8")
    digest = hmac.new(_kunci(), pesan, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")


def nama_berkas_dari_url(url: str | None) -> str | None:
    """Nama file bila url adalah file upload milik server ini (satu segmen di bawah /uploads/)."""
    if not url:
        return None
    path = urlparse(url).path
    if not path.startswith(AWAL_PATH):
        return None  # tautan eksternal, bukan file milik server ini
    nama = path[len(AWAL_PATH):]
    if not nama or "/" in nama:
        return None
    return nama


def buang_tanda_tangan(url: str) -> str:
    """Buang ?exp=&sid=&sig= dari URL file lokal.

    Dipakai pada input: bila FE mengirim balik URL yang diterimanya (mis. saat mengedit materi),
    yang disimpan tetap URL polos. Tanpa ini, ubah materi dianggap mengganti file dan file asli
    bisa terhapus.
    """
    if nama_berkas_dari_url(url) is None:
        return url
    p = urlparse(url)
    return urlunparse((p.scheme, p.netloc, p.path, "", "", ""))


def tandatangani_url(url: str | None, sid: int | None = None) -> str | None:
    """Beri tanda tangan terikat sesi pada URL file lokal.

    URL eksternal dan None dikembalikan apa adanya. Bila tidak ada sesi yang diketahui
    (mis. endpoint publik), URL file lokal dikembalikan POLOS: tautan itu tidak akan bisa dibuka
    (fail closed), tidak pernah terbuka secara tidak sengaja.
    """
    nama = nama_berkas_dari_url(url)
    if nama is None:
        return url
    sid = sid if sid is not None else sesi_saat_ini()
    if sid is None:
        return url
    jendela = max(1, settings.FILE_URL_TTL_MENIT) * 60
    # Kedaluwarsa dibulatkan ke batas jendela berikutnya + 1 jendela: masa berlaku pasti
    # lebih dari 1 jendela (>= TTL) dan paling lama 2 jendela. URL sama dalam satu jendela.
    exp = (int(_sekarang()) // jendela + 2) * jendela
    p = urlparse(url)
    query = urlencode({"exp": exp, "sid": sid, "sig": _tanda_tangan(nama, exp, sid)})
    return urlunparse((p.scheme, p.netloc, p.path, "", query, ""))


def verifikasi(
    nama: str, exp: str | None, sid: str | None, sig: str | None
) -> tuple[int, int] | None:
    """(id sesi, sisa detik) bila tanda tangan valid dan belum kedaluwarsa; selain itu None.

    Ini hanya memeriksa keaslian URL. Sesi dan hak akses diperiksa ke database oleh
    services/berkas_service.py.
    """
    if not exp or not sid or not sig:
        return None
    try:
        exp_int, sid_int = int(exp), int(sid)
    except ValueError:
        return None
    benar = _tanda_tangan(nama, exp_int, sid_int).encode("ascii")
    if not hmac.compare_digest(benar, sig.encode("utf-8", "ignore")):
        return None
    sisa = exp_int - int(_sekarang())
    return (sid_int, sisa) if sisa > 0 else None


# Tipe untuk field skema respons: nilai ditandatangani otomatis saat respons dibentuk.
UrlBerkas = Annotated[str, PlainSerializer(tandatangani_url, return_type=str)]
UrlBerkasOpsional = Annotated[
    str | None, PlainSerializer(tandatangani_url, return_type=str | None)
]
