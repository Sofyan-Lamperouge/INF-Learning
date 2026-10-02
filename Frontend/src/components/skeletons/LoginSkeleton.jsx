// src/components/skeletons/LoginSkeleton.jsx
function LoginSkeleton() {
  return (
    <main
      className="auth-page skeleton-mode"
      role="status"
      aria-label="Memuat halaman login"
    >
      <div className="card">
        {/* Kiri: gambar / ilustrasi */}
        <div className="image-placeholder" aria-hidden="true"></div>

        {/* Kanan: form skeleton */}
        <div className="form-col">
          <div className="header-row">
            <span className="avatar" aria-hidden="true"></span>
            <span className="header-title" aria-hidden="true"></span>
          </div>

          <span className="line line--90" aria-hidden="true"></span>
          <span className="line line--60" aria-hidden="true"></span>

          <div className="field">
            <span className="field-label">NIM / NIP</span>
            <span className="field-value"></span>
          </div>
          <div className="field">
            <span className="field-label">Kata Sandi</span>
            <span className="field-value"></span>
          </div>

          <button type="button" className="btn-blue" disabled>
            Masuk
          </button>

          <div className="footer-row">
            <span className="footer-line footer-line--lg" aria-hidden="true"></span>
            <span className="footer-line footer-line--sm" aria-hidden="true"></span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginSkeleton;