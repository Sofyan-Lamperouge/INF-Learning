"""Menentukan alamat pratinjau materi yang bisa dibuka FE di <iframe>.

- PDF          -> langsung url file (browser menampilkannya sendiri).
- PPT/Word/XLS -> viewer Office Online milik Microsoft (file diambil dari url publik oleh server Microsoft).
- Lainnya      -> None (FE cukup menampilkan tombol unduh).

Catatan: viewer Office Online bukan layanan yang dijamin resmi oleh Microsoft. Bila suatu saat
berhenti berfungsi, set PRATINJAU_OFFICE_AKTIF=false dan FE otomatis kembali ke tombol unduh.
"""

import ipaddress
from urllib.parse import quote, urlparse

from app.core.config import settings

OFFICE_JENIS = {"ppt", "pptx", "doc", "docx", "xls", "xlsx"}
VIEWER_OFFICE = "https://view.officeapps.live.com/op/embed.aspx"


def _bisa_dijangkau_publik(url: str) -> bool:
    """False untuk localhost / IP privat: server Microsoft tidak bisa membuka alamat seperti itu."""
    bagian = urlparse(url)
    if bagian.scheme not in ("http", "https") or not bagian.hostname:
        return False
    host = bagian.hostname.lower()
    if host == "localhost" or host.endswith(".localhost") or host.endswith(".local"):
        return False
    try:
        ip = ipaddress.ip_address(host)
    except ValueError:
        return True  # nama domain biasa
    return not (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_unspecified)


def buat_url_pratinjau(jenis: str | None, url: str | None) -> str | None:
    if not jenis or not url:
        return None
    jenis = jenis.lower()

    if jenis == "pdf":
        return url

    if jenis in OFFICE_JENIS and settings.PRATINJAU_OFFICE_AKTIF and _bisa_dijangkau_publik(url):
        return f"{VIEWER_OFFICE}?src={quote(url, safe='')}"

    return None
