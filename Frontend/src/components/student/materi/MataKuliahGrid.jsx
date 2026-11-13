// src/components/student/materi/MataKuliahGrid.jsx
// Kartu mata kuliah pada semester terpilih (2 kolom). "Lihat Detail" membuka tabel materi.

import { ArrowRightIcon } from './MateriIcons.jsx';

export default function MataKuliahGrid({
  semester,
  items = [],   // dari GET /materi/kategori/mata-kuliah
  loading = false,
  onDetail,
}) {
  if (loading) {
    return (
      <div className="sm-mk-grid" aria-busy="true">
        {[1, 2].map((n) => (
          <div key={n} className="sm-mk sm-skel sm-mk--skel" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="sm-empty">
        Belum ada materi pada Semester {semester}.
      </div>
    );
  }

  return (
    <div className="sm-mk-grid">
      {items.map((mk) => (
        <article key={mk.mata_kuliah} className="sm-mk">
          {/* Sampul: sementara dibuat dari teks. Ganti dengan <img> jika sudah ada gambar sampul. */}
          <div className="sm-mk-cover">
            <p className="sm-mk-cover-eyebrow">
              Semester {semester} · Mata Kuliah
            </p>
            <h3 className="sm-mk-cover-title">{mk.mata_kuliah}</h3>
            <p className="sm-mk-cover-desc">
              {mk.total_materi} materi tersedia untuk dipelajari.
            </p>
          </div>

          <h3 className="sm-mk-title">{mk.mata_kuliah}</h3>
          <p className="sm-mk-count">{mk.total_materi} Materi</p>

          <button
            type="button"
            className="sm-btn-detail"
            onClick={() => onDetail?.(mk.mata_kuliah)}
          >
            Lihat Detail
            <ArrowRightIcon />
          </button>
        </article>
      ))}
    </div>
  );
}
