// src/pages/mahasiswa/BacaMateriPage.jsx  (rute: /materi/:id)
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StudentLayout from '../../components/student/StudentLayout.jsx';
import PdfViewer from '../../components/student/baca/PdfViewer.jsx';
import MateriLainnya from '../../components/student/baca/MateriLainnya.jsx';
import DownloadToast from '../../components/student/baca/DownloadToast.jsx';
import FileBadge from '../../components/student/baca/FileBadge.jsx';
import useUnduh from '../../components/student/baca/useUnduh.js';
import { BackIcon, DownloadIcon, CalendarIcon } from '../../components/student/baca/BacaIcons.jsx';
import { ADALAH_PDF, formatTanggal, namaBerkas } from '../../components/student/baca/helpers.js';
import { getMateriDetail, getMateriLainnya, catatDilihat } from '../../services/bacaMateriService.js';

export default function BacaMateriPage() {
  const { id } = useParams();
  const [materi, setMateri] = useState(null);
  const [lainnya, setLainnya] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    let batal = false;
    setMemuat(true);
    setGalat('');
    getMateriDetail(id)
      .then((m) => {
        if (batal) return;
        setMateri(m);
        setMemuat(false);
        if (m.status_belajar === 'belum') catatDilihat(m.id).catch(() => {});
        getMateriLainnya(m.semester, m.mata_kuliah)
          .then((r) => !batal && setLainnya(r.items || []))
          .catch(() => {});
      })
      .catch(() => {
        if (!batal) {
          setGalat('Materi tidak ditemukan atau belum tersedia.');
          setMemuat(false);
        }
      });
    return () => {
      batal = true;
    };
  }, [id]);

  const nama = useMemo(() => namaBerkas(materi), [materi]);
  const { status, info, unduh, tutup } = useUnduh(materi?.id, nama);
  const mengunduh = status === 'downloading';

  const linkKembali = materi
    ? `/materi?semester=${materi.semester}&mk=${encodeURIComponent(materi.mata_kuliah)}`
    : '/materi';

  return (
    <StudentLayout>
      <div className="bm-page-wrap">
        {memuat && <div className="bm-skeleton" aria-busy="true">Memuat materi...</div>}

        {!memuat && galat && (
          <div className="bm-kosong">
            <p>{galat}</p>
            <Link to="/materi" className="bm-btn-unduh">Kembali ke Materi</Link>
          </div>
        )}

        {!memuat && materi && (
          <>
            <header className="bm-header">
              <Link to={linkKembali} className="bm-kembali">
                <BackIcon /> Kembali ke Semester {materi.semester}
              </Link>
              <div className="bm-header-isi">
                <FileBadge jenis={materi.jenis} />
                <div className="bm-header-info">
                  <h1 className="bm-judul">{materi.judul}</h1>
                  <div className="bm-meta">
                    <span className={`bm-semester semester-${materi.semester}`}>Semester {materi.semester}</span>
                    <span className="bm-mk">{materi.mata_kuliah}</span>
                    <span className="bm-tanggal"><CalendarIcon /> {formatTanggal(materi.dibuat_pada)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`bm-btn-unduh${mengunduh ? ' memuat' : ''}`}
                  onClick={unduh}
                  disabled={mengunduh}
                  aria-busy={mengunduh}
                >
                  <DownloadIcon />
                  {mengunduh ? 'Mengunduh...' : 'Unduh materi'}
                </button>
              </div>
            </header>

            <div className="bm-grid">
              {ADALAH_PDF(materi.jenis) ? (
                <PdfViewer materiId={materi.id} namaFile={nama} />
              ) : (
                <section className="bm-viewer bm-fallback">
                  <FileBadge jenis={materi.jenis} />
                  <h2>Pratinjau tidak tersedia</h2>
                  <p>File {String(materi.jenis).toUpperCase()} tidak dapat dibaca langsung di halaman ini. Silakan unduh materi untuk membukanya.</p>
                  <button type="button" className="bm-btn-unduh" onClick={unduh} disabled={mengunduh}>
                    <DownloadIcon /> {mengunduh ? 'Mengunduh...' : 'Unduh materi'}
                  </button>
                </section>
              )}
              <MateriLainnya daftar={lainnya} aktifId={materi.id} memuat={false} />
            </div>
          </>
        )}
      </div>
      <DownloadToast status={status} info={info} onTutup={tutup} />
    </StudentLayout>
  );
}
