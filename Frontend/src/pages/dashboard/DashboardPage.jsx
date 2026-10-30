// Frontend/src/pages/dashboard/DashboardPage.jsx
//
// [DIUBAH]
//  - fetchDashboardData sekarang benar-benar memanggil GET /admin/dashboard
//    (sebelumnya hanya menunggu 1,5 detik, sehingga semua data selalu kosong).
//  - Menambah import getDashboard dari adminService.
//  - kuisList belum diisi karena backend belum mengirim daftar kuis.
//  - [DIPERBAIKI] total_kuis sudah tidak dikirim backend (fitur kuis ditunda) -> pakai ?? 0
//    agar kartu statistik tidak menampilkan undefined.

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
import { getDashboard } from '../../services/adminService.js'; // [BARU]

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    totalMateri: 0,
    totalKuis: 0,
    totalMahasiswa: 0,
  });
  const [materiList, setMateriList] = useState([]);
  const [kuisList] = useState([]); // belum ada datanya dari backend
  const [mahasiswaList, setMahasiswaList] = useState([]);

  useEffect(() => {
    let active = true;

    async function fetchDashboardData() {
      try {
        const data = await getDashboard(); 

        if (!active) return;

        setStats({
          totalMateri: data.total_materi,
          totalKuis: data.total_kuis ?? 0, // kuis ditunda: backend tidak mengirim total_kuis
          totalMahasiswa: data.total_mahasiswa,
        });
        setMateriList(data.materi_terbaru);
        setMahasiswaList(data.mahasiswa_terbaru);
      } catch (error) {
        console.error('Gagal mengambil data dashboard:', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, []);

  function handleUpload() {
    navigate('/dashboard/materi');
  }

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard Admin"
        searchPlaceholder="Cari materi, kuis..."
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      <MainPanel user={user} stats={stats} onUpload={handleUpload} />

      {/* Rekap Materi (full width) */}
      <RekapMateri materiList={materiList} />

      {/* Rekap Kuis + Mahasiswa (2 kolom) */}
      <div className="dashboard-bottom-grid">
        <RekapKuis kuisList={kuisList} />
        <TabelMahasiswa mahasiswaList={mahasiswaList} />
      </div>
    </DashboardLayout>
  );
}