// src/components/skeletons/RegisterBlueprint.jsx
//
// Blueprint LOW-FIDELITY halaman register.
// Diakses via URL: /register/skeleton

export default function RegisterBlueprint() {
  return (
    <main className="bp-page">

      <div className="bp-header">
        <span className="bp-badge">BLUEPRINT</span>
        <span className="bp-title">Register Page — Low-Fidelity Skeleton</span>
      </div>

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

          {/* Field 1 — Nama */}
          <div className="bp-box bp-label">LABEL</div>
          <div className="bp-box bp-input">INPUT FIELD</div>

          {/* Field 2 — NIM */}
          <div className="bp-box bp-label">LABEL</div>
          <div className="bp-box bp-input">INPUT FIELD</div>

          {/* Field 3 — Password */}
          <div className="bp-box bp-label">LABEL</div>
          <div className="bp-box bp-input">INPUT FIELD</div>

          {/* Field 4 — Konfirmasi Password */}
          <div className="bp-box bp-label">LABEL</div>
          <div className="bp-box bp-input">INPUT FIELD</div>

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