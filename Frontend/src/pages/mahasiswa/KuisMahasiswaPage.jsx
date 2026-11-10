// src/pages/mahasiswa/KuisMahasiswaPage.jsx
// Penampung halaman /kuis supaya menu "Kuis" di top bar tidak mengarah ke
// halaman kosong. Fitur kuis di backend masih ditunda.

import StudentLayout from '../../components/student/StudentLayout.jsx';
import SectionCard from '../../components/student/dashboard/SectionCard.jsx';
import { CheckBoxIcon } from '../../components/student/StudentIcons.jsx';

export default function KuisMahasiswaPage() {
  return (
    <StudentLayout>
      <SectionCard className="sd-card--kuis" icon={<CheckBoxIcon />} title="Kuis">
        <div className="sd-kuis-box sd-kuis-box--note">
          Fitur kuis akan segera tersedia.
        </div>
      </SectionCard>
    </StudentLayout>
  );
}