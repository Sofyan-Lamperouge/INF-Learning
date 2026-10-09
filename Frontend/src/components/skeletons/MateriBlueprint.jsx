// src/components/skeletons/MateriBlueprint.jsx
//
// Blueprint LOW-FIDELITY halaman daftar materi.
// Diakses via URL: /materi/skeleton

export default function MateriBlueprint() {
  return (
    <main className="bp-page">

      <div className="bp-header">
        <span className="bp-badge">BLUEPRINT</span>
        <span className="bp-title">Materi Page — Low-Fidelity Skeleton</span>
      </div>

      <div className="bp-card bp-card--single">

        {/* Navbar */}
        <div className="bp-box bp-navbar">
          NAVBAR (logo kiri, link kanan)
        </div>

        {/* Judul halaman */}
        <div className="bp-box bp-h1 bp-h1--left">
          JUDUL HALAMAN (H1)
        </div>

        {/* List materi */}
        <div className="bp-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bp-list-item">
              <div className="bp-box bp-list-icon">ICON</div>
              <div className="bp-list-content">
                <div className="bp-box bp-list-title">JUDUL MATERI</div>
                <div className="bp-box bp-list-desc">DESKRIPSI SINGKAT</div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </main>
  );
}