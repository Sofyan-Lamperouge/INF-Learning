// src/components/wireframes/MateriWireframe.jsx
// Wireframe halaman MATERI — dengan navbar & list

export default function MateriWireframe() {
  return (
    <main className="wf-page">

      <header className="wf-header">
        <span className="wf-badge">WIREFRAME</span>
        <span className="wf-title">Materi Page — Wireframe Detail</span>
      </header>

      <div className="wf-card wf-card--single">

        {/* Navbar */}
        <div className="wf-box wf-box--solid wf-navbar">
          <span className="wf-label">NAVBAR</span>
          <span className="wf-desc">Logo kiri, menu kanan</span>
        </div>

        {/* Header halaman */}
        <div className="wf-box wf-box--dashed wf-h1 wf-h1--left">
          <span className="wf-label">JUDUL HALAMAN</span>
          <span className="wf-desc">H1 — "Daftar Materi"</span>
        </div>

        {/* Search & Filter */}
        <div className="wf-toolbar">
          <div className="wf-box wf-box--dashed wf-search">
            <span className="wf-label">SEARCH BAR</span>
            <span className="wf-desc">Cari materi</span>
          </div>
          <div className="wf-box wf-box--dashed wf-filter">
            <span className="wf-label">FILTER</span>
            <span className="wf-desc">Kategori</span>
          </div>
        </div>

        {/* List materi */}
        <div className="wf-list">
          <span className="wf-group-label">
            LIST MATERI (diulang 3x untuk contoh)
          </span>

          {[1, 2, 3].map((n) => (
            <div key={n} className="wf-list-item">
              <div className="wf-box wf-box--dashed wf-list-icon">
                <span className="wf-label">ICON</span>
              </div>

              <div className="wf-list-content">
                <div className="wf-box wf-box--dashed wf-list-title">
                  <span className="wf-label">JUDUL MATERI {n}</span>
                </div>
                <div className="wf-box wf-box--dashed wf-list-desc">
                  <span className="wf-label">DESKRIPSI SINGKAT</span>
                </div>
                <span className="wf-state">↳ Klik untuk buka detail</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="wf-box wf-box--dashed wf-pagination">
          <span className="wf-label">PAGINATION</span>
          <span className="wf-desc">Prev | 1 2 3 | Next</span>
        </div>

      </div>

      <footer className="wf-legend">
        <span>
          <span className="wf-dot wf-dot--solid"></span>
          Solid = elemen final
        </span>
        <span>
          <span className="wf-dot wf-dot--dashed"></span>
          Dashed = placeholder
        </span>
      </footer>

    </main>
  );
}