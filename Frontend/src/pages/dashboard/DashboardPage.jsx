// src/pages/dashboard/DashboardPage.jsx
//
//  - Dua request terpisah, supaya satu panel yang gagal tidak menjatuhkan panel lain:
//      1) GET /admin/dashboard  -> statistik + mahasiswa terbaru
//      2) GET /materi           -> Rekap Materi
//  - `stats` bernilai null jika data belum ada / gagal dimuat. Semua pembacaan data
//    (d.total_materi, dst.) hanya dilakukan setelah dicek `d ? ... : null`,
//    sehingga halaman tidak error saat data kosong.
//  - Angka "hari ini" untuk badge [+N] dikirim backend (materi_hari_ini,
//    mahasiswa_hari_ini). Backend belum punya kuis, jadi kuis_hari_ini jatuh ke 0.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout.jsx";
import DashboardHeader from "../../components/dashboard/DashboardHeader.jsx";
import MainPanel from "../../components/dashboard/MainPanel.jsx";
import RekapMateri from "../../components/dashboard/RekapMateri.jsx";
import RekapKuis from "../../components/dashboard/RekapKuis.jsx";
import TabelMahasiswa from "../../components/dashboard/TabelMahasiswa.jsx";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { usePanelData } from "../../hooks/usePanelData.js";
import { getDashboard } from "../../services/adminService.js";
import { getMateriList } from "../../services/materiService.js";

// Didefinisikan di LUAR komponen agar referensinya stabil (dibutuhkan usePanelData).
const muatRingkasan = () => getDashboard();
const muatMateriTerbaru = () => getMateriList({ page: 1, limit: 5 });

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [kuisList] = useState([]); // belum ada datanya dari backend

  const ringkasan = usePanelData(muatRingkasan);
  const materi = usePanelData(muatMateriTerbaru);

  // Sesi habis (401) -> arahkan ke login.
  const sesiHabis = ringkasan.status === 401 || materi.status === 401;
  useEffect(() => {
    if (sesiHabis) navigate("/login", { replace: true });
  }, [sesiHabis, navigate]);

  function handleUpload() {
    navigate("/dashboard/materi/upload");
  }

  // Skeleton hanya selama SEMUA panel masih memuat.
  if (ringkasan.loading && materi.loading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const d = ringkasan.data;
  const stats = d
    ? {
        totalMateri: d.total_materi,
        totalKuis: d.total_kuis ?? 0,
        totalMahasiswa: d.total_mahasiswa,
        materiHariIni: d.materi_hari_ini ?? 0,
        kuisHariIni: d.kuis_hari_ini ?? 0,
        mahasiswaHariIni: d.mahasiswa_hari_ini ?? 0,
      }
    : null; // null = belum ada / gagal dimuat

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Dashboard Admin"
        searchPlaceholder="Cari materi, kuis..."
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      {/* Statistik + welcome. Jika gagal: kartu menampilkan "—" dan pesan error. */}
      <MainPanel
        user={user}
        stats={stats}
        statsError={ringkasan.error}
        onUpload={handleUpload}
      />

      {/* Rekap Materi (full width), dimuat dari request sendiri */}
      <RekapMateri
        materiList={materi.data?.items ?? []}
        loading={materi.loading}
        error={materi.error}
      />

      {/* Rekap Kuis + Mahasiswa (2 kolom) */}
      <div className="dashboard-bottom-grid">
        <RekapKuis kuisList={kuisList} />
        <TabelMahasiswa
          mahasiswaList={d?.mahasiswa_terbaru ?? []}
          loading={ringkasan.loading}
          error={ringkasan.error}
        />
      </div>
    </DashboardLayout>
  );
}