from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_kata_sandi(kata_sandi: str) -> str:
    """Hash password dengan bcrypt."""
    return pwd_context.hash(kata_sandi)


def verifikasi_kata_sandi(kata_sandi: str, hash_tersimpan: str) -> bool:
    """Cek apakah password cocok dengan hash."""
    return pwd_context.verify(kata_sandi, hash_tersimpan)