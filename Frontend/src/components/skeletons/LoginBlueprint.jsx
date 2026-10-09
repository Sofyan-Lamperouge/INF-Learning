// src/components/skeletons/LoginBlueprint.jsx
//
// Blueprint LOW-FIDELITY halaman login.
// Bukan loading skeleton — ini cetak biru struktur halaman.
// Diakses via URL: /login/skeleton

export default function LoginBlueprint() {
  return (
    <main className="bp-page">

      {/* Breadcrumb — menunjukkan ini blueprint */}
      <div className="bp-header">
        <span className="bp-badge">BLUEPRINT</span>
        <span className="bp-title">Login Page — Low-Fidelity Skeleton</span>
      </div>

      {/* Card utama — 2 kolom */}
      <div className="bp-card">

        {/* KIRI: Area Ilustrasi */}
        <div className="bp-box bp-image">
          [ AREA ILUSTRASI ]<br />
          Kotak besar<br />
          (400 × ~400)
        </div>

        {/* KANAN: Form Blueprint */}
        <div className="bp-form-col">

          <div className="bp-box bp-h1">
            JUDUL (H1)
          </div>

          <div className="bp-box bp-subtitle">
            SUBTITLE
          </div>

          <div className="bp-box bp-label">
            LABEL
          </div>
          <div className="bp-box bp-input">
            INPUT FIELD
          </div>

          <div className="bp-box bp-label">
            LABEL
          </div>
          <div className="bp-box bp-input">
            INPUT FIELD
          </div>

          <div className="bp-box bp-button">
            TOMBOL (BUTTON)
          </div>

          <div className="bp-box bp-footer">
            FOOTER LINK
          </div>

        </div>
      </div>

    </main>
  );
}