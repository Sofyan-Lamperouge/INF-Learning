// src/pages/BlueprintIndexPage.jsx
//
// Halaman daftar semua blueprint — diakses via /blueprint
// Seperti "indeks" untuk semua cetak biru halaman.

import { Link } from 'react-router-dom';

const BLUEPRINTS = [
  {
    title: 'Login Page',
    description: 'Halaman login — 2 kolom, 2 field, 1 tombol',
    finalUrl: '/login',
    blueprintUrl: '/login/skeleton',
  },
  {
    title: 'Register Page',
    description: 'Halaman register — 2 kolom, 4 field, 1 tombol',
    finalUrl: '/register',
    blueprintUrl: '/register/skeleton',
  },
  {
    title: 'Materi Page',
    description: 'Halaman daftar materi — navbar, list item',
    finalUrl: '/materi',
    blueprintUrl: '/materi/skeleton',
  },
];

export default function BlueprintIndexPage() {
  return (
    <main className="bp-index">
      <header className="bp-index-header">
        <span className="bp-badge">BLUEPRINT</span>
        <h1>Dokumentasi Blueprint</h1>
        <p>
          Kumpulan cetak biru (low-fidelity skeleton) halaman aplikasi INF-Learning.
          Blueprint ini menunjukkan struktur halaman tanpa detail visual —
          sebagai referensi desain & development.
        </p>
      </header>

      <div className="bp-index-grid">
        {BLUEPRINTS.map((bp) => (
          <div key={bp.title} className="bp-index-card">
            <h3>{bp.title}</h3>
            <p>{bp.description}</p>
            <div className="bp-index-actions">
              <Link to={bp.finalUrl} className="bp-btn bp-btn--primary">
                Lihat Final
              </Link>
              <Link to={bp.blueprintUrl} className="bp-btn bp-btn--outline">
                Lihat Blueprint
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}