// src/components/mockups/RegisterMockup.jsx
// Mockup halaman REGISTER — 4 field

export default function RegisterMockup() {
  return (
    <main className="mk-page">

      <header className="mk-header">
        <span className="mk-badge">MOCKUP</span>
        <span className="mk-title">Register Page — Medium Fidelity</span>
      </header>

      <div className="mk-card mk-card--register">

        {/* KIRI — Ilustrasi */}
        <div className="mk-illustration">
          <div className="mk-illustration-content">
            <span className="mk-illustration-icon">🖼</span>
            <span className="mk-illustration-label">ILUSTRASI</span>
            <span className="mk-illustration-sub">INF-orm</span>
          </div>
        </div>

        {/* KANAN — Form */}
        <div className="mk-form-col">

          <h1 className="mk-h1">Get Started!</h1>

          {/* Field 1 — Nama */}
          <div className="mk-field">
            <label className="mk-label">Nama Lengkap</label>
            <div className="mk-input">
              <span className="mk-input-placeholder">Budi Santoso</span>
            </div>
          </div>

          {/* Field 2 — NIM */}
          <div className="mk-field">
            <label className="mk-label">NIM</label>
            <div className="mk-input">
              <span className="mk-input-placeholder">20240101</span>
            </div>
          </div>

          {/* Field 3 — Password */}
          <div className="mk-field">
            <label className="mk-label">Password</label>
            <div className="mk-input">
              <span className="mk-input-placeholder">••••••••</span>
              <span className="mk-input-icon">👁</span>
            </div>
          </div>

          {/* Field 4 — Konfirmasi Password */}
          <div className="mk-field">
            <label className="mk-label">Konfirmasi Password</label>
            <div className="mk-input">
              <span className="mk-input-placeholder">••••••••</span>
              <span className="mk-input-icon">👁</span>
            </div>
          </div>

          {/* Tombol */}
          <button className="mk-btn" type="button">
            Daftar
          </button>

          {/* Footer */}
          <p className="mk-footer">
            Sudah punya akun? <span className="mk-link">Login</span>
          </p>

        </div>
      </div>

      <footer className="mk-legend">
        <span>🎨 Mockup = medium fidelity</span>
        <span>Belum ada interaksi & logic</span>
      </footer>

    </main>
  );
}