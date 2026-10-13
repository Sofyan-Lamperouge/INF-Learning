// src/components/mockups/MateriMockup.jsx
// Mockup halaman MATERI — dengan navbar & list

export default function MateriMockup() {
  return (
    <main className="mk-page">

      <header className="mk-header">
        <span className="mk-badge">MOCKUP</span>
        <span className="mk-title">Materi Page — Medium Fidelity</span>
      </header>

      <div className="mk-card mk-card--single">

        {/* Navbar */}
        <nav className="mk-navbar">
          <span className="mk-navbar-brand">INF-orm</span>
          <div className="mk-navbar-links">
            <span>Home</span>
            <span>Materi</span>
            <span>Profil</span>
          </div>
        </nav>

        {/* Header halaman */}
        <h1 className="mk-h1 mk-h1--left">Daftar Materi</h1>

        {/* Search & Filter */}
        <div className="mk-toolbar">
          <div className="mk-input mk-input--search">
            <span className="mk-input-placeholder">🔍 Cari materi...</span>
          </div>
          <div className="mk-input mk-input--filter">
            <span className="mk-input-placeholder">Kategori ▾</span>
          </div>
        </div>

        {/* List materi */}
        <div className="mk-list">
          {[
            { n: 1, judul: 'Pengantar Algoritma' },
            { n: 2, judul: 'Struktur Data Dasar' },
            { n: 3, judul: 'Pemrograman Berorientasi Objek' },
          ].map((item) => (
            <div key={item.n} className="mk-list-item">
              <div className="mk-list-icon">📚</div>

              <div className="mk-list-content">
                <h3 className="mk-list-title">{item.judul}</h3>
                <p className="mk-list-desc">
                  Konsep dasar dan penerapan dalam pemrograman.
                </p>
              </div>

              <span className="mk-list-action">→</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mk-pagination">
          <span className="mk-pagination-btn">‹ Prev</span>
          <span className="mk-pagination-num mk-pagination-num--active">1</span>
          <span className="mk-pagination-num">2</span>
          <span className="mk-pagination-num">3</span>
          <span className="mk-pagination-btn">Next ›</span>
        </div>

      </div>

      <footer className="mk-legend">
        <span>🎨 Mockup = medium fidelity</span>
        <span>Warna brand sudah muncul, tapi belum final</span>
      </footer>

    </main>
  );
}