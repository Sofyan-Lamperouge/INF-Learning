export default function LoginSkeleton() {
  return (
    <main
      className="auth-page skeleton-mode"
      role="status"
      aria-label="Memuat halaman login"
    >
      <div className="auth-card">
        <div className="auth-illustration skeleton-block"></div>

        <div className="auth-form-col">
          <div className="header-row">
            <span className="skeleton-block avatar"></span>
            <span className="skeleton-block header-title"></span>
          </div>

          <span className="skeleton-block line line--90"></span>
          <span className="skeleton-block line line--60"></span>

          <div className="field skeleton-block">
            <span>NIM/NIP</span>
          </div>
          <div className="field skeleton-block">
            <span>Password</span>
          </div>

          <button type="button" className="btn-primary btn-skeleton" disabled>
            Login
          </button>

          <div className="footer-row">
            <span className="skeleton-block footer-line footer-line--lg"></span>
            <span className="skeleton-block footer-line footer-line--sm"></span>
          </div>
        </div>
      </div>
    </main>
  );
}