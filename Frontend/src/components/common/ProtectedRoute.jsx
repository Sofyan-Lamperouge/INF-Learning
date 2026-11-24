import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";

const PESAN_AKSES_DITOLAK =
  "Akun Anda tidak memiliki akses ke halaman tersebut. Silakan login dengan akun yang sesuai.";

// Membatasi halaman berdasarkan login dan peran.
//
//   <ProtectedRoute>                              -> cukup sudah login
//   <ProtectedRoute allowedRoles={["admin"]}>     -> hanya admin
//   <ProtectedRoute allowedRoles={["mahasiswa"]}> -> hanya mahasiswa
//
// - Belum login                   -> diarahkan ke /login
// - Login, tetapi peran tidak sesuai -> sesi diakhiri, lalu diarahkan ke /login
//   dengan pesan penolakan.
export default function ProtectedRoute({ children, allowedRoles }) {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user, logout } = useAuth();

  // Peran diambil dari data pengguna yang dikirim server (respons login / GET /auth/me),
  // BUKAN dari sessionStorage, supaya tidak bisa dipalsukan lewat DevTools.
  const peran = user?.peran;
  const perluCekPeran = Array.isArray(allowedRoles) && allowedRoles.length > 0;
  const salahPeran =
    !loading &&
    isAuthenticated &&
    perluCekPeran &&
    !allowedRoles.includes(peran);

  useEffect(() => {
    if (!salahPeran) return;
    logout();
    navigate("/login", {
      replace: true,
      state: { pesan: PESAN_AKSES_DITOLAK },
    });
  }, [salahPeran, logout, navigate]);

  if (loading) {
    return (
      <main className="materi-page">
        <p>Memeriksa sesi login...</p>
      </main>
    );
  }

  // Jangan tampilkan isi halaman sedetik pun selama proses pengalihan.
  if (salahPeran) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}