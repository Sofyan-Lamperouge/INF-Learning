// src/components/student/materi/SemesterGrid.jsx
// Delapan kartu semester (4 kolom x 2 baris). Klik = pilih semester.

import { ChevronRightIcon, FolderIcon } from './MateriIcons.jsx';
import { warnaFolder } from './helpers.js';

export default function SemesterGrid({
  items = [],          // dari GET /materi/kategori/semester
  aktif,               // semester terpilih (angka)
  tampilkan = 'mata_kuliah', // 'mata_kuliah' | 'materi' -> teks kecil di kartu
  loading = false,
  onPilih,
}) {
  const daftar = loading
    ? Array.from({ length: 8 }, (_, i) => ({ semester: i + 1 }))
    : items;

  return (
    <div className="sm-semester-grid" aria-busy={loading}>
      {daftar.map((item) => {
        const jumlah =
          tampilkan === 'materi' ? item.total_materi : item.total_mata_kuliah;
        const satuan = tampilkan === 'materi' ? 'Materi' : 'Mata Kuliah';

        return (
          <button
            key={item.semester}
            type="button"
            className={`sm-semester${aktif === item.semester ? ' sm-semester--aktif' : ''}${loading ? ' sm-skel' : ''}`}
            onClick={() => onPilih?.(item.semester)}
            disabled={loading}
            aria-pressed={aktif === item.semester}
          >
            <span
              className="sm-semester-icon"
              style={{ background: warnaFolder(item.semester) }}
            >
              <FolderIcon />
            </span>

            <span className="sm-semester-text">
              <span className="sm-semester-title">Semester {item.semester}</span>
              <span className="sm-semester-sub">
                {loading ? '' : `${jumlah ?? 0} ${satuan}`}
              </span>
            </span>

            <ChevronRightIcon className="sm-semester-chevron" />
          </button>
        );
      })}
    </div>
  );
}
