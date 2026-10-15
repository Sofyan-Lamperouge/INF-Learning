import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/dashboard/DashboardLayout.jsx';
import DashboardHeader from '../../components/dashboard/DashboardHeader.jsx';
import MainPanel from '../../components/dashboard/MainPanel.jsx';
import RekapMateri from '../../components/dashboard/RekapMateri.jsx';
import RekapKuis from '../../components/dashboard/RekapKuis.jsx';
import TabelMahasiswa from '../../components/dashboard/TabelMahasiswa.jsx';
import { useAuth } from '../../hooks/useAuth.js';


export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState('');

  const [stats, setStats] = useState({
    totalMateri: 0,
    totalKuis: 0,
    totalMahasiswa: 4,
  });

  const [materiList] = useState([]);
  const [kuisList] = useState([]);

  // Mock mahasiswa data — nanti fetch dari backend
  const [mahasiswaList] = useState([
    { id: 1, nomor_induk: '2488010024', nama: 'Nisa Naila', angkatan: 2024 },
    { id: 2, nomor_induk: '2488010031', nama: 'Mohammad Sofyan Nurseha', angkatan: 2024 },
    { id: 3, nomor_induk: '2488010038', nama: 'Haikal Azkal Azkiya', angkatan: 2024 },
    { id: 4, nomor_induk: '2488010048', nama: 'Dzaky Muhammad Nafis', angkatan: 2024 },
    { id: 5, nomor_induk: '2488010071', nama: 'Mohammad Rizky Saputra', angkatan: 2024 },
  ]);

  function handleUpload() {
    navigate('/dashboard/materi');
  }

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