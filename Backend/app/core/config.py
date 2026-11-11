"""Konfigurasi aplikasi, dibaca dari environment variable atau file .env."""

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "INF-Learning"
    APP_ENV: str = "development"
    APP_PORT: int = 8000

    # Alamat publik backend (diawali http:// atau https://), dipakai membentuk URL file upload.
    PUBLIC_BASE_URL: str = "https://inf-learning-production.up.railway.app"

    # Domain frontend yang boleh memanggil API, dipisah koma. "*" = semua (cocok untuk
    # pengembangan). Production sebaiknya diisi, mis. "https://app-anda.vercel.app".
    CORS_ORIGINS: str = "*"

    # Folder file upload materi. Di Railway arahkan ke folder di dalam Volume
    # (mis. /data/uploads) agar file tidak hilang saat redeploy.
    UPLOAD_DIR: str = "uploads"
    # Batas ukuran file upload (MB). Disamakan dengan batas di frontend.
    MAX_UPLOAD_MB: int = 10

    # Terima DATABASE_URL atau MYSQL_URL (mana saja yang ada)
    DATABASE_URL: str = Field(validation_alias=AliasChoices("DATABASE_URL", "MYSQL_URL"))

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    # Sesi login berakhir otomatis jika tidak ada aktivitas (request ke API) selama
    # SESI_IDLE_MENIT menit. Setiap request yang berhasil memperpanjang sesi.
    SESI_IDLE_MENIT: int = 20
    # Batas umur mutlak sesi (jam), tidak bisa diperpanjang oleh aktivitas. Pengguna yang
    # terus aktif tetap diminta login ulang setelah batas ini.
    SESI_MAKS_JAM: int = 12

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS_ORIGINS sebagai daftar; string kosong dianggap '*'."""
        daftar = [o.strip().rstrip("/") for o in self.CORS_ORIGINS.split(",") if o.strip()]
        return daftar or ["*"]


settings = Settings()
