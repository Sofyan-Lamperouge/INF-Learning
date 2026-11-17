// src/components/student/baca/MateriLainnya.jsx
import { Link } from 'react-router-dom';
import FileBadge from './FileBadge.jsx';
import { namaBerkas } from './helpers.js';

export default function MateriLainnya({ daftar, aktifId, memuat }) {
  return (
    <aside className="bm-side" aria-label="Materi lainnya">
      <h2 className="bm-side-judul">Materi lainnya</h2>
      <div className="bm-side-list">
        {memuat && <p className="bm-side-kosong">Memuat...</p>}
        {!memuat && daftar.length === 0 && <p className="bm-side-kosong">Belum ada materi lain.</p>}
        {daftar.map((m) => (
          <Link
            key={m.id}
            to={`/materi/${m.id}`}
            className={`bm-side-item${m.id === aktifId ? ' aktif' : ''}`}
            aria-current={m.id === aktifId ? 'page' : undefined}
          >
            <FileBadge jenis={m.jenis} kecil />
            <span className="bm-side-teks">
              <strong>{m.judul}</strong>
              <small>{namaBerkas(m)}</small>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
