export default function RegisterSkeleton() {
  return (
    <main
      className="auth-page skeleton-mode"
      role="status"
      aria-label="Memuat halaman registrasi"
    >
      <div className="auth-card auth-card--register">

        {/* Kiri: kotak abu besar (ilustrasi) */}
        <div className="image-placeholder skeleton-block"></div>

        {/* Kanan: form skeleton */}
        <div className="auth-form-col">

          {/* Bar judul saja — subtitle-bar DIHAPUS */}
          <span className="skeleton-block title-bar"></span>

          {/* Field 1 — Nama Lengkap */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Field 2 — NIM/NIP */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Field 3 — Password */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Field 4 — Konfirmasi Password */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Tombol */}
          <span className="skeleton-block button-bar"></span>

          {/* Footer */}
          <span className="skeleton-block footer-bar"></span>
        </div>
      </div>
    </main>
  );
}