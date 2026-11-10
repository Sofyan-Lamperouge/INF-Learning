// src/components/student/dashboard/AksiCepatCard.jsx
// Kartu "Aksi Cepat": pintasan ke Materi dan Kuis (isi statis).

import { Link } from 'react-router-dom';
import SectionCard from './SectionCard.jsx';
import {
  BoltIcon,
  BookIcon,
  CheckBoxIcon,
  ChevronRightIcon,
} from '../StudentIcons.jsx';

const AKSI = [
  { to: '/materi', label: 'Lihat Semua Materi', icon: <BookIcon /> },
  { to: '/kuis', label: 'Kerjakan Kuis', icon: <CheckBoxIcon /> },
];

export default function AksiCepatCard() {
  return (
    <SectionCard className="sd-card--aksi" icon={<BoltIcon />} title="Aksi Cepat">
      <div className="sd-aksi-list">
        {AKSI.map((item) => (
          <Link key={item.to} to={item.to} className="sd-aksi-item">
            <span className="sd-aksi-icon">{item.icon}</span>
            <span className="sd-aksi-label">{item.label}</span>
            <ChevronRightIcon className="sd-aksi-chevron" />
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}