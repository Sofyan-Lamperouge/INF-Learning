export default function LoginSkeleton() {
  return (
    <main
      className="auth-page skeleton-mode"
      role="status"
      aria-label="Memuat halaman login"
    >
      <div className="auth-card">
        {/* Kiri: kotak abu besar (ilustrasi) */}
        <div className="image-placeholder skeleton-block"></div>

        {/* Kanan: form skeleton */}
        <div className="auth-form-col">
          {/* Bar judul + subjudul */}
          <span className="skeleton-block title-bar"></span>
          <span className="skeleton-block subtitle-bar"></span>

          {/* Field 1 */}
          <span className="skeleton-block label-bar"></span>
          <span className="skeleton-block field-bar"></span>

          {/* Field 2 */}
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