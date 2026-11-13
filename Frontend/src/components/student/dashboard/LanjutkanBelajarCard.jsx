// src/components/student/dashboard/LanjutkanBelajarCard.jsx
// Kartu "Lanjutkan Belajar". Data: dashboard.lanjutkan_belajar (atau null).
//   - memuat  -> kotak shimmer
//   - kosong  -> maskot + "Belum ada materi yang dipelajari" + tombol Mulai Belajar
//   - ada     -> thumbnail, judul, mata kuliah, progres, tombol Lanjutkan

import { Link } from 'react-router-dom';
import EmptyState from './Emptystate.jsx';
import ProgressBar from './ProgressBar.jsx';
import SectionCard from './SectionCard.jsx';
import { ASET } from './Assets.js';
import { persenBelajar } from './helpers.js';
import { catatProgres } from '../../../services/dashboardMahasiswaService.js';
import { ArrowRightIcon, DocumentIcon, PlayIcon } from '../StudentIcons.jsx';

export default function LanjutkanBelajarCard({ materi = null, loading = false }) {
  function handleLanjutkan() {
    // Catat bahwa materi dibuka. Kegagalan pencatatan tidak boleh menghalangi.
    catatProgres(materi.id, 'dilihat').catch(() => {});
  }

  let isi;

  if (loading) {
    isi = <div className="sd-inner sd-lanjutkan sd-loading" aria-hidden="true" />;
  } else if (!materi) {
    isi = (
      <div className="sd-inner sd-empty-box sd-empty-box--lanjutkan">
        <EmptyState
          layout="horizontal"
          art={ASET.maskotLanjutkan}
          artClass="sd-art--lanjutkan"
          title="Belum ada materi yang dipelajari"
          desc="Mulai pelajari materi untuk melihat progres belajarmu di sini."
          action={
            <Link to="/materi" className="sd-btn-outline">
              Mulai Belajar
              <ArrowRightIcon />
            </Link>
          }
        />
      </div>
    );
  } else {
    const persen = persenBelajar(materi.status_belajar);

    isi = (
      <div className="sd-inner sd-lanjutkan">
        <div className="sd-thumb sd-thumb--lg">
          <DocumentIcon />
        </div>

        <div className="sd-lanjutkan-info">
          <h3 className="sd-lanjutkan-title">{materi.judul}</h3>
          <p className="sd-lanjutkan-sub">{materi.mata_kuliah}</p>

          <div className="sd-progress-row sd-progress-row--lg">
            <ProgressBar value={persen} />
            <span className="sd-progress-label">{persen}%</span>
          </div>

          <a
            className="sd-btn-lanjutkan"
            href={materi.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLanjutkan}
          >
            Lanjutkan
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    );
  }

  return (
    <SectionCard
      className="sd-card--lanjutkan"
      icon={<PlayIcon />}
      title="Lanjutkan Belajar"
      busy={loading}
    >
      {isi}
    </SectionCard>
  );
}