// src/components/dashboard/MainPanel.jsx
// Panel biru berisi welcome + tombol upload + statistik

import StatCard from './StatCard.jsx';

// Icon SVG inline
function MateriIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function KuisIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MahasiswaIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 0 0 7.75" />
    </svg>
  );
}


export default function MainPanel({ user, stats, onUpload }) {
  const nama = user?.namaLengkap || 'Admin';

  const totalMateri = stats?.totalMateri ?? 0;
  const totalKuis = stats?.totalKuis ?? 0;
  const totalMahasiswa = stats?.totalMahasiswa ?? 0;

  return (
    <div className="main-panel">

      {/* === ROW ATAS: Welcome + Tombol Upload === */}
      <div className="main-panel-header">

        <div className="main-panel-welcome">
          <h2 className="main-panel-title">
            Selamat Datang, {nama}!
          </h2>
          <p className="main-panel-subtitle">
            Ringkasan materi, kuis, dan mahasiswa yang terbaru
            diambahkan atau diperbarui
          </p>
        </div>

        <button
          type="button"
          className="btn-upload"
          onClick={onUpload}
        >
          + Upload materi
        </button>

      </div>

      {/* === ROW BAWAH: 3 Kartu Statistik === */}
      <div className="main-panel-stats">

        <StatCard
          icon={<MateriIcon />}
          title="Total Materi"
          value={String(totalMateri).padStart(2, '0')}
          subtitle="(+) 0 Materi ditambahkan hari ini"
        />

        <StatCard
          icon={<KuisIcon />}
          title="Total Kuis"
          value={String(totalKuis).padStart(2, '0')}
          subtitle="(+) 0 Kuis ditambahkan hari ini"
        />

        <StatCard
          icon={<MahasiswaIcon />}
          title="Total Mahasiswa"
          value={String(totalMahasiswa).padStart(2, '0')}
          subtitle="(+) 0 Mahasiswa bergabung hari ini"
        />

      </div>

    </div>
  );
}