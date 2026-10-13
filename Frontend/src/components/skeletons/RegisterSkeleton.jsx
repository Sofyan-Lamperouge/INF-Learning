export default function RegisterSkeleton() {
  return (
    <main
      className="auth-page skeleton-mode"
      role="status"
      aria-label="Memuat halaman registrasi"
    >
      <div className="auth-card">
        <div className="image-placeholder skeleton-block"></div>

        <div className="auth-form-col">
          <span className="skeleton-block title-bar"></span>
          <span className="skeleton-block subtitle-bar"></span>

          {/* Field 1 — NIM */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Field 2 — Password */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Field 3 — Konfirmasi Password */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          <span className="skeleton-block button-bar"></span>
          <span className="skeleton-block footer-bar"></span>
        </div>
      </div>
    </main>
  );
}