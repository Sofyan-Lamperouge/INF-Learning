"""Utilitas waktu."""

from datetime import datetime, time, timedelta, timezone

# WIB (UTC+7) tidak mengenal daylight saving, jadi offset tetap sudah cukup
ZONA_WIB = timezone(timedelta(hours=7))


def sekarang_utc() -> datetime:
    """Waktu UTC saat ini tanpa informasi zona (naive).

    Pengganti datetime.utcnow() yang sudah deprecated; hasilnya identik, sehingga data
    di database dan format tanggal pada respons API tidak berubah.
    """
    return datetime.now(timezone.utc).replace(tzinfo=None)


def rentang_hari_ini_utc() -> tuple[datetime, datetime]:
    """Awal (inklusif) dan akhir (eksklusif) hari ini menurut WIB, dalam UTC naive.

    Kolom dibuat_pada disimpan sebagai UTC, jadi batas hari WIB harus dikonversi dulu
    agar data jam 00.00-07.00 WIB tidak terhitung sebagai hari sebelumnya.
    """
    hari_ini_wib = datetime.now(ZONA_WIB).date()
    awal_wib = datetime.combine(hari_ini_wib, time.min, tzinfo=ZONA_WIB)
    akhir_wib = awal_wib + timedelta(days=1)
    return (
        awal_wib.astimezone(timezone.utc).replace(tzinfo=None),
        akhir_wib.astimezone(timezone.utc).replace(tzinfo=None),
    )
