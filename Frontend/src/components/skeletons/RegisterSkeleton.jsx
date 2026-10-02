// src/components/skeletons/RegisterSkeleton.jsx
//
// Skeleton untuk RegisterPage.
// Struktur mengikuti RegisterPage:
//   - Judul "Daftar Akun"      → skeleton bar
//   - InputField NIM / NIP     → skeleton field
//   - InputField Nama Lengkap  → skeleton field
//   - InputField Kata Sandi    → skeleton field
//   - Button "Daftar"          → skeleton tombol biru
//   - Link "Sudah punya akun? Masuk di sini" → skeleton footer
function RegisterSkeleton() {
  return (
    <main
      className="auth-page skeleton-mode"
      role="status"
      aria-label="Memuat halaman registrasi"
    >
      <div className="card">
        {/* Kiri: ilustrasi / gambar */}
        <div className="image-placeholder" aria-hidden="true"></div>

        {/* Kanan: form skeleton */}
        <div className="form-col">
          {/* Header: avatar + judul halaman */}
          <div className="header-row">
            <span className="avatar" aria-hidden="true"></span>
            <span className="header-title" aria-hidden="true"></span>
          </div>

          {/* Deskripsi singkat */}
          <span className="line line--90" aria-hidden="true"></span>
          <span className="line line--60" aria-hidden="true"></span>

          {/* InputField: NIM / NIP */}
          <div className="field">
            <span className="field-label">NIM / NIP</span>
            <span className="field-value"></span>
          </div>

          {/* InputField: Nama Lengkap */}
          <div className="field">
            <span className="field-label">Nama Lengkap</span>
            <span className="field-value"></span>
          </div>

          {/* InputField: Kata Sandi */}
          <div className="field">
            <span className="field-label">Kata Sandi</span>
            <span className="field-value"></span>
          </div>

          {/* Button: Daftar (tetap berwarna biru) */}
          <button
            type="button"
            className="btn-blue"
            disabled
            aria-label="Memuat tombol daftar"
          >
            Daftar
          </button>

          {/* Footer: link "Sudah punya akun? Masuk di sini" */}
          <div className="footer-row">
            <span className="footer-line footer-line--lg" aria-hidden="true"></span>
            <span className="footer-line footer-line--sm" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterSkeleton;