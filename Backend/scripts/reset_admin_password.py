
"""Script untuk mengganti password admin dan mencabut sesi lama."""

from getpass import getpass

from app.core.security import hash_kata_sandi
from app.db.session import SessionLocal
from app.models.pengguna import Pengguna, SesiLogin


def reset_admin_password():
    db = SessionLocal()

    try:
        nomor_induk = input("Nomor induk admin: ").strip()

        admin = db.query(Pengguna).filter(
            Pengguna.nomor_induk == nomor_induk,
            Pengguna.peran == "admin",
        ).first()

        if not admin:
            print("[GAGAL] Akun admin tidak ditemukan.")
            return

        print(f"Admin ditemukan: {admin.nama}")

        password_baru = getpass("Password baru: ")
        konfirmasi = getpass("Konfirmasi password baru: ")

        if len(password_baru) < 8:
            print("[GAGAL] Password minimal 16 karakter.")
            return

        if len(password_baru.encode("utf-8")) > 72:
            print("[GAGAL] Password maksimal 72 byte.")
            return

        if password_baru != konfirmasi:
            print("[GAGAL] Konfirmasi password tidak cocok.")
            return

        from app.core.security import verifikasi_kata_sandi

        if admin.kata_sandi and verifikasi_kata_sandi(
            password_baru, admin.kata_sandi
        ):
            print("[GAGAL] Password baru harus berbeda.")
            return

        persetujuan = input(
            "Ganti password dan cabut seluruh sesi? (y/n): "
        ).strip().lower()

        if persetujuan != "y":
            print("[BATAL] Tidak ada perubahan.")
            return

        # Mengganti password admin
        admin.kata_sandi = hash_kata_sandi(password_baru)

        # Mencabut seluruh sesi login admin
        jumlah_sesi = db.query(SesiLogin).filter(
            SesiLogin.pengguna_id == admin.id
        ).delete(synchronize_session=False)

        # Menyimpan seluruh perubahan
        db.commit()

        print("[OK] Password admin berhasil diganti.")
        print(f"[OK] {jumlah_sesi} sesi login dicabut.")
        print("[OK] Silakan login menggunakan password baru.")

    except Exception:
        db.rollback()
        print("[ERROR] Reset password gagal.")

    finally:
        db.close()


if __name__ == "__main__":
    reset_admin_password()
