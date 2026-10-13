// src/components/mockups/LoginMockup.jsx
//
// Mockup halaman LOGIN — level medium fidelity.
// Lebih detail dari wireframe, tapi belum final design.
// Diakses via /login/mockup

export default function LoginMockup() {
  return (
    <main className="mk-page">

      {/* Header mockup */}
      <header className="mk-header">
        <span className="mk-badge">MOCKUP</span>
        <span className="mk-title">Login Page — Medium Fidelity</span>
      </header>

      {/* Card utama — mirip final design */}
      <div className="mk-card">

        {/* KIRI — Ilustrasi placeholder */}
        <div className="mk-illustration">
          <div className="mk-illustration-content">
            <span className="mk-illustration-icon">🖼</span>
            <span className="mk-illustration-label">ILUSTRASI</span>
            <span className="mk-illustration-sub">INF-orm</span>
          </div>
        </div>

        {/* KANAN — Form mockup */}
        <div className="mk-form-col">

          <h1 className="mk-h1">Welcome Back!</h1>
          <p className="mk-subtitle">Masuk untuk mulai belajar.</p>

          {/* Field NIM */}
          <div className="mk-field">
            <label className="mk-label">NIM</label>
            <div className="mk-input">
              <span className="mk-input-placeholder">20240101</span>
            </div>
          </div>

          {/* Field Password */}
          <div className="mk-field">
            <label className="mk-label">Password</label>
            <div className="mk-input">
              <span className="mk-input-placeholder">••••••••</span>
              <span className="mk-input-icon">👁</span>
            </div>
          </div>

          {/* Tombol */}
          <button className="mk-btn" type="button">
            Masuk
          </button>

          {/* Footer link */}
          <p className="mk-footer">
            Belum punya akun? <span className="mk-link">Buat di sini</span>
          </p>

        </div>
      </div>

      {/* Legenda */}
      <footer className="mk-legend">
        <span>🎨 Mockup = medium fidelity</span>
        <span>Belum ada interaksi & logic</span>
      </footer>

    </main>
  );
}