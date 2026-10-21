import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import DashboardHeader from '../../components/dashboard/DashboardHeader.jsx';
import MainPanel from '../../components/dashboard/MainPanel.jsx';
import RekapMateri from '../../components/dashboard/RekapMateri.jsx';
import RekapKuis from '../../components/dashboard/RekapKuis.jsx';
import TabelMahasiswa from '../../components/dashboard/TabelMahasiswa.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton.jsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ 1. Semua State diletakkan di atas
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    totalMateri: 0,
    totalKuis: 0,
    totalMahasiswa: 0,
  });
  const [materiList, setMateriList] = useState([]);
  const [kuisList, setKuisList] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);

  // ✅ 2. Satu useEffect untuk mengambil semua data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        // ✅ Loading diset false setelah data selesai diambil
        setLoading(false); 
      }
    }

    fetchDashboardData();
  }, []);

  function handleUpload() {
    navigate('/dashboard/materi');
  }

  // ✅ 3. Jika masih loading, tampilkan Skeleton
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  // ✅ 4. Jika sudah selesai, tampilkan halaman asli
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard Admin"
        searchPlaceholder="Cari materi, kuis..."
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      <MainPanel
        user={user}
        stats={stats}
        onUpload={handleUpload}
      />

      {/* ✅ Rekap Materi (full width) */}
      <RekapMateri materiList={materiList} />

      {/* ✅ Rekap Kuis + Mahasiswa (2 kolom) */}
      <div className="dashboard-bottom-grid">
        <RekapKuis kuisList={kuisList} />
        <TabelMahasiswa mahasiswaList={mahasiswaList} />
      </div>
    </DashboardLayout>
  );
}