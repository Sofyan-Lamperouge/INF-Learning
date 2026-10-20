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

  // ✅ 1. State Statistik (Awalnya 0 semua)
  const [stats, setStats] = useState({
    totalMateri: 0,
    totalKuis: 0,
    totalMahasiswa: 0, // Ubah dari 4 menjadi 0
  });

  // ✅ 2. State List (Awalnya Kosong)
  const [materiList, setMateriList] = useState([]); // Tambah setMateriList
  const [kuisList, setKuisList] = useState([]);     // Tambah setKuisList
  const [mahasiswaList, setMahasiswaList] = useState([]); // Mahasiswa jadi kosong

  // ✅ 3. Fungsi untuk menarik data dari Backend
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // ==========================================
        // 👇 HAPUS KOMENTAR DI BAWAH INI JIKA BACKEND SUDAH SIAP 👇
        // ==========================================
        
        /* 
        const responseMahasiswa = await fetch('http://localhost:8000/api/mahasiswa');
        const dataMahasiswa = await responseMahasiswa.json();
        
        setMahasiswaList(dataMahasiswa);
        
        // Update statistik secara otomatis berdasarkan jumlah data
        setStats(prev => ({
          ...prev,
          totalMahasiswa: dataMahasiswa.length,
        }));
        */

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    }

    fetchDashboardData();
  }, []); // Array kosong artinya fungsi ini jalan sekali saat halaman dibuka

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
        
        {/* Pastikan komponen TabelMahasiswa menerima prop 'mahasiswaList' */}
        <TabelMahasiswa mahasiswaList={mahasiswaList} />
      </div>

    </DashboardLayout>
  );
}