"""Utilitas waktu."""

from datetime import datetime, timezone


def sekarang_utc() -> datetime:
    """Waktu UTC saat ini tanpa informasi zona (naive).

    Pengganti datetime.utcnow() yang sudah deprecated; hasilnya identik, sehingga data
    di database dan format tanggal pada respons API tidak berubah.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)
