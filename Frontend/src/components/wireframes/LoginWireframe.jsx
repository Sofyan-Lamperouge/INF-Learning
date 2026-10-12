// src/components/wireframes/LoginWireframe.jsx
//
// Wireframe halaman LOGIN.
// Lebih detail dari skeleton — ada label, navigasi, state.
// Diakses via /login/wireframe

export default function LoginWireframe() {
  return (
    <main className="wf-page">

      {/* Header wireframe */}
      <header className="wf-header">
        <span className="wf-badge">WIREFRAME</span>
        <span className="wf-title">Login Page — Wireframe Detail</span>
      </header>

      {/* Card utama */}
      <div className="wf-card">

        {/* KIRI — Ilustrasi */}
        <div className="wf-illustration">
          <div className="wf-box wf-box--dashed wf-box--full">
            <span className="wf-label">ILUSTRASI</span>
            <span className="wf-desc">Gambar INF-orm</span>
            <span className="wf-note">400 × ~400 px</span>
          </div>
        </div>

        {/* KANAN — Form */}
        <div className="wf-form-col">

          {/* Judul halaman */}
          <div className="wf-box wf-box--dashed wf-h1">
            <span className="wf-label">JUDUL HALAMAN</span>
            <span className="wf-desc">H1 — "Welcome Back!"</span>
          </div>

          {/* Subtitle */}
          <div className="wf-box wf-box--dashed wf-subtitle">
            <span className="wf-label">SUBTITLE</span>
            <span className="wf-desc">"Masuk untuk mulai belajar."</span>
          </div>

          {/* Field NIM */}
          <div className="wf-group">
            <span className="wf-group-label">FIELD 1 — NIM</span>
            <div className="wf-box wf-box--dashed wf-label">
              <span className="wf-label">LABEL</span>
            </div>
            <div className="wf-box wf-box--dashed wf-input">
              <span className="wf-label">INPUT TEXT</span>
              <span className="wf-desc">type="text", placeholder</span>
            </div>
            <span className="wf-state">↳ State: normal, error, filled</span>
          </div>

          {/* Field Password */}
          <div className="wf-group">
            <span className="wf-group-label">FIELD 2 — PASSWORD</span>
            <div className="wf-box wf-box--dashed wf-label">
              <span className="wf-label">LABEL</span>
            </div>
            <div className="wf-box wf-box--dashed wf-input">
              <span className="wf-label">INPUT PASSWORD</span>
              <span className="wf-desc">type="password", toggle mata</span>
            </div>
            <span className="wf-state">↳ State: hidden, visible</span>
          </div>

          {/* Tombol */}
          <div className="wf-group">
            <span className="wf-group-label">ACTION</span>
            <div className="wf-box wf-box--solid wf-button">
              <span className="wf-label">TOMBOL</span>
              <span className="wf-desc">"Masuk" — submit form</span>
            </div>
            <span className="wf-state">↳ State: normal, loading, disabled</span>
          </div>

          {/* Footer link */}
          <div className="wf-box wf-box--dashed wf-footer">
            <span className="wf-label">FOOTER LINK</span>
            <span className="wf-desc">"Belum punya akun? Buat di sini"</span>
          </div>

        </div>
      </div>

      {/* Legenda wireframe */}
      <footer className="wf-legend">
        <span><span className="wf-dot wf-dot--solid"></span> Solid = elemen final</span>
        <span><span className="wf-dot wf-dot--dashed"></span> Dashed = placeholder</span>
      </footer>

    </main>
  );
}