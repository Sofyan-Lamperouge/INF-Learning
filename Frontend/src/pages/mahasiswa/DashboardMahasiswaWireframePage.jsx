// src/pages/mahasiswa/DashboardMahasiswaPage.jsx
// Beranda mahasiswa. URL: /beranda

import { useEffect, useState } from 'react';
import StudentLayout from '../../components/student/StudentLayout.jsx';
import WelcomeBanner from '../../components/student/dashboard/WelcomeBanner.jsx';
import LanjutkanBelajarCard from '../../components/student/dashboard/LanjutkanBelajarCard.jsx';
import AksiCepatCard from '../../components/student/dashboard/AksiCepatCard.jsx';
import MateriTerakhirCard from '../../components/student/dashboard/MateriTerakhirCard.jsx';
import KuisTerakhirCard from '../../components/student/dashboard/KuisTerakhirCard.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getDashboardMahasiswa } from '../../services/dashboardMahasiswaService.js';

export default function DashboardMahasiswaPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function muatData() {
      try {
        const result = await getDashboardMahasiswa();
        if (active) setData(result);
      } catch (loadError) {
        if (active) {
          setError(loadError.message || 'Data beranda gagal dimuat.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    muatData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <StudentLayout>
      {error && (
        <p className="sd-alert" role="alert">
          {error}
        </p>
      )}

      <WelcomeBanner nama={data?.profil?.nama || user?.nama} />

      <div className="sd-row sd-row--atas">
        <LanjutkanBelajarCard
          materi={data?.lanjutkan_belajar}
          loading={loading}
        />
        <AksiCepatCard />
      </div>

      <div className="sd-row sd-row--bawah">
        <MateriTerakhirCard
          items={data?.materi_terbaru || []}
          loading={loading}
        />
        <KuisTerakhirCard />
      </div>
    </StudentLayout>
  );
}