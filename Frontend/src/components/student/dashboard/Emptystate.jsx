// src/components/student/dashboard/EmptyState.jsx
//
// Tampilan kosong: maskot + judul + keterangan (+ tombol opsional).
//   layout="horizontal" -> maskot di kiri, teks di kanan (Lanjutkan Belajar)
//   layout="vertical"   -> maskot di atas, teks di bawah, rata tengah
//                          (Materi Terakhir Dibaca, Kuis Terakhir Dikerjakan)

import Art from './Art.jsx';

export default function EmptyState({
  layout = 'vertical',
  art,
  artClass = '',
  title,
  desc,
  descClass = '',
  action = null,
}) {
  return (
    <div className={`sd-empty-state sd-empty-state--${layout}`}>
      <Art src={art} className={artClass} />

      <div className="sd-empty-text">
        <h3 className="sd-empty-title">{title}</h3>
        <p className={`sd-empty-desc ${descClass}`.trim()}>{desc}</p>
        {action}
      </div>
    </div>
  );
}