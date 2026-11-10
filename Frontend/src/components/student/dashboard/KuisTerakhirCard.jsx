// src/components/student/dashboard/KuisTerakhirCard.jsx
// Kartu "Kuis Terakhir Dikerjakan". Fitur kuis belum ada di backend,
// jadi kotak isinya sengaja dikosongkan (tinggal diisi nanti).

import { Link } from 'react-router-dom';
import SectionCard from './SectionCard.jsx';
import { CheckBoxIcon } from '../StudentIcons.jsx';

export default function KuisTerakhirCard() {
  return (
    <SectionCard
      className="sd-card--kuis"
      icon={<CheckBoxIcon />}
      title="Kuis Terakhir Dikerjakan"
      action={<Link to="/kuis">Lihat semua</Link>}
    >
      <div className="sd-kuis-box">
        {/* TODO: isi daftar kuis di sini kalau fitur kuis sudah jadi */}
      </div>
    </SectionCard>
  );
}