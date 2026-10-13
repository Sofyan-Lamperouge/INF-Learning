// src/components/wireframes/RegisterWireframe.jsx
// Wireframe halaman REGISTER — 4 field

export default function RegisterWireframe() {
  return (
    <main className="wf-page">

      <header className="wf-header">
        <span className="wf-badge">WIREFRAME</span>
        <span className="wf-title">Register Page — Wireframe Detail</span>
      </header>

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

          {/* Judul */}
          <div className="wf-box wf-box--dashed wf-h1">
            <span className="wf-label">JUDUL HALAMAN</span>
            <span className="wf-desc">H1 — "Get Started!"</span>
          </div>

          {/* Field 1 — Nama */}
          <div className="wf-group">
            <span className="wf-group-label">FIELD 1 — NAMA LENGKAP</span>
            <div className="wf-box wf-box--dashed wf-label">
              <span className="wf-label">LABEL</span>
            </div>
            <div className="wf-box wf-box--dashed wf-input">
              <span className="wf-label">INPUT TEXT</span>
              <span className="wf-desc">type="text"</span>
            </div>
            <span className="wf-state">↳ Validasi: min 3, max 100 karakter</span>
          </div>

          {/* Field 2 — NIM */}
          <div className="wf-group">
            <span className="wf-group-label">FIELD 2 — NIM</span>
            <div className="wf-box wf-box--dashed wf-label">
              <span className="wf-label">LABEL</span>
            </div>
            <div className="wf-box wf-box--dashed wf-input">
              <span className="wf-label">INPUT TEXT</span>
              <span className="wf-desc">type="text"</span>
            </div>
            <span className="wf-state">↳ Validasi: format NIM (9 digit)</span>
          </div>

          {/* Field 3 — Password */}
          <div className="wf-group">
            <span className="wf-group-label">FIELD 3 — PASSWORD</span>
            <div className="wf-box wf-box--dashed wf-label">
              <span className="wf-label">LABEL</span>
            </div>
            <div className="wf-box wf-box--dashed wf-input">
              <span className="wf-label">INPUT PASSWORD</span>
              <span className="wf-desc">type="password" + toggle mata</span>
            </div>
            <span className="wf-state">↳ Validasi: min 8, max 72 karakter</span>
          </div>

          {/* Field 4 — Konfirmasi Password */}
          <div className="wf-group">
            <span className="wf-group-label">FIELD 4 — KONFIRMASI PASSWORD</span>
            <div className="wf-box wf-box--dashed wf-label">
              <span className="wf-label">LABEL</span>
            </div>
            <div className="wf-box wf-box--dashed wf-input">
              <span className="wf-label">INPUT PASSWORD</span>
              <span className="wf-desc">type="password" + toggle mata</span>
            </div>
            <span className="wf-state">↳ Validasi: harus sama dengan field 3</span>
          </div>

          {/* Tombol */}
          <div className="wf-group">
            <span className="wf-group-label">ACTION</span>
            <div className="wf-box wf-box--solid wf-button">
              <span className="wf-label">TOMBOL</span>
              <span className="wf-desc">"Daftar" — submit form</span>
            </div>
          </div>

          {/* Footer link */}
          <div className="wf-box wf-box--dashed wf-footer">
            <span className="wf-label">FOOTER LINK</span>
            <span className="wf-desc">"Sudah punya akun? Login"</span>
          </div>

        </div>
      </div>

      <footer className="wf-legend">
        <span><span className="wf-dot wf-dot--solid"></span> Solid = elemen final</span>
        <span><span className="wf-dot wf-dot--dashed"></span> Dashed = placeholder</span>
      </footer>

    </main>
  );
}