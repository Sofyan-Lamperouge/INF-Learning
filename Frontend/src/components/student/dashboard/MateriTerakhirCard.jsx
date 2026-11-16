// src/components/student/dashboard/MateriTerakhirCard.jsx
// Kartu "Materi Terakhir Dibaca". `items` = materi yang sudah dibuka/diselesaikan
// (maks. 3 ditampilkan). Kosong -> maskot tidur + "Belum ada materi yang dibaca".

import { Link } from 'react-router-dom';
import EmptyState from './Emptystate.jsx';
import ProgressBar from './ProgressBar.jsx';
import SectionCard from './SectionCard.jsx';
import { ASET } from './Assets.js';
import { persenBelajar, warnaSemester } from './helpers.js';
import { catatProgres } from '../../../services/dashboardMahasiswaService.js';
import { BookIcon, DocumentIcon } from '../StudentIcons.jsx';

const JUMLAH_TAMPIL = 3;

export default function MateriTerakhirCard({ items = [], loading = false }) {
  let isi;

  if (loading) {
    isi = (
      <div className="sd-list">
        {Array.from({ length: JUMLAH_TAMPIL }, (_, index) => (
          <div
            key={index}
            className="sd-inner sd-list-item sd-loading"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  } else if (items.length === 0) {
    isi = (
      <div className="sd-inner sd-empty-box">
        <EmptyState
          layout="vertical"
          art={ASET.maskotMateri}
          artClass="sd-art--materi"
          title="Belum ada materi yang dibaca"
          desc="Materi yang terakhir kamu baca akan muncul di sini."
        />
      </div>
    );
  } else {
    isi = (
      <div className="sd-list">
        {items.slice(0, JUMLAH_TAMPIL).map((materi) => {
          const persen = persenBelajar(materi.status_belajar);

          return (
            <a
              key={materi.id}
              className="sd-inner sd-list-item"
              href={materi.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => catatProgres(materi.id, 'dilihat').catch(() => {})}
            >
              <span className="sd-thumb sd-thumb--sm">
                <DocumentIcon />
              </span>

              <span className="sd-list-info">
                <span className="sd-list-head">
                  <span className="sd-list-title">{materi.judul}</span>
                  <span
                    className="sd-badge"
                    style={{ background: warnaSemester(materi.semester) }}
                  >
                    Semester {materi.semester}
                  </span>
                </span>

                <span className="sd-list-sub">{materi.mata_kuliah}</span>

                <span className="sd-progress-row">
                  <ProgressBar value={persen} />
                  <span className="sd-progress-label">{persen}%</span>
                </span>
              </span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <SectionCard
      className="sd-card--materi"
      icon={<BookIcon />}
      title="Materi Terakhir Dibaca"
      action={<Link to="/materi">Lihat semua</Link>}
      busy={loading}
    >
      {isi}
    </SectionCard>
  );
}