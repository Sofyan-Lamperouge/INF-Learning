import { useAuth } from "../../hooks/useAuth.js";

export default function MateriListPage() {
  const { role, logout } = useAuth();

  return (
    <main className="materi-page">
      <h1>Daftar Materi</h1>
      <p>
        Selamat datang, <strong>{role}</strong>. Halaman ini akan menampilkan
        daftar materi untuk Mahasiswa dan Dosen.
      </p>
      <button type="button" className="btn-primary" onClick={logout}>
        Logout
      </button>
    </main>
  );
}