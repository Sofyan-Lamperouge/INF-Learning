// src/components/student/dashboard/KuisTerakhirCard.jsx
// Kartu "Kuis Terakhir Dikerjakan". Fitur kuis belum ada di backend, jadi
// selalu tampil kosong (maskot + "Belum ada kuis yang dikerjakan").
// Di desain, tampilan "ada isi" masih berupa kotak kosong -> TODO.

import { Link } from 'react-router-dom';
import EmptyState from './EmptyState.jsx';
import SectionCard from './SectionCard.jsx';
import { ASET } from './assets.js';
import { CheckBoxIcon } from '../StudentIcons.jsx';

export default function KuisTerakhirCard({ items = [] }) {
  return (
    <SectionCard
      className="sd-card--kuis"
      icon={<CheckBoxIcon />}
      title="Kuis Terakhir Dikerjakan"
      action={<Link to="/kuis">Lihat semua</Link>}
    >
      <div className="sd-inner sd-empty-box">
        {items.length === 0 ? (
          <EmptyState
            layout="vertical"
            art={ASET.maskotKuis}
            artClass="sd-art--kuis"
            title="Belum ada kuis yang dikerjakan"
            desc="Riwayat pengerjaan dan hasil kuismu akan ditampilkan di sini."
            descClass="sd-empty-desc--kuis"
          />
        ) : null /* TODO: daftar kuis (desain final belum ada) */}
      </div>
    </SectionCard>
  );
}