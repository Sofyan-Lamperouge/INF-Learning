// src/components/skeletons/DashboardMahasiswaSkeleton.jsx
//
// Kerangka (skeleton) Dashboard Mahasiswa — kotak-kotak abu-abu sebagai
// gambaran tata letak sebelum desain final selesai. Juga bisa dipakai nanti
// sebagai loading state:
//
//   if (loading) return <DashboardMahasiswaSkeleton />;
//
// Efek shimmer memakai kelas dasar `ds-box` (sudah ada di global.css).
// Semua kelas khusus halaman ini diawali `dm-`.

export default function DashboardMahasiswaWireframePage() {
  return (
    <div className="dm-page" aria-busy="true" aria-label="Memuat dashboard">
      <div className="dm-container">

        {/* 1. NAVBAR: logo | menu | profil */}
        <header className="dm-card dm-navbar">
          <div className="ds-box dm-logo"></div>

          <div className="dm-nav-links">
            <div className="ds-box dm-nav-link"></div>
            <div className="ds-box dm-nav-link"></div>
            <div className="ds-box dm-nav-link"></div>
          </div>

          <div className="dm-profile">
            <div className="ds-box dm-avatar"></div>
            <div className="dm-profile-text">
              <div className="ds-box dm-line dm-w-120"></div>
              <div className="ds-box dm-line dm-line-sm dm-w-70"></div>
            </div>
            <div className="ds-box dm-chevron"></div>
          </div>
        </header>

        {/* 2. HERO: ilustrasi + sapaan */}
        <section className="dm-card dm-hero">
          <div className="ds-box dm-hero-illustration"></div>
          <div className="dm-hero-divider"></div>
          <div className="dm-hero-text">
            <div className="ds-box dm-line dm-w-240"></div>
            <div className="ds-box dm-line dm-line-lg dm-w-160"></div>
            <div className="ds-box dm-line dm-line-sm dm-w-360"></div>
            <div className="ds-box dm-line dm-line-sm dm-w-280"></div>
          </div>
        </section>

        {/* 3. BARIS TENGAH: Lanjutkan Belajar + Aksi Cepat */}
        <div className="dm-row dm-row-middle">
          {/* Lanjutkan Belajar */}
          <section className="dm-card dm-section">
            <div className="dm-section-header">
              <div className="ds-box dm-section-icon"></div>
              <div className="ds-box dm-line dm-w-180"></div>
            </div>

            <div className="dm-continue">
              <div className="ds-box dm-continue-thumb"></div>
              <div className="dm-continue-body">
                <div className="ds-box dm-line dm-line-lg dm-w-70p"></div>
                <div className="ds-box dm-line dm-line-sm dm-w-30p"></div>
                <div className="dm-progress-row">
                  <div className="ds-box dm-progress-bar"></div>
                  <div className="ds-box dm-line dm-line-sm dm-w-40"></div>
                </div>
                <div className="ds-box dm-btn dm-btn-right"></div>
              </div>
            </div>
          </section>

          {/* Aksi Cepat */}
          <section className="dm-card dm-section">
            <div className="dm-section-header">
              <div className="ds-box dm-section-icon"></div>
              <div className="ds-box dm-line dm-w-140"></div>
            </div>

            <div className="dm-actions">
              {[1, 2].map((item) => (
                <div key={item} className="dm-action-item">
                  <div className="ds-box dm-action-icon"></div>
                  <div className="ds-box dm-line dm-w-50p"></div>
                  <div className="ds-box dm-chevron dm-action-chevron"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. BARIS BAWAH: Materi Terakhir Dibaca + Kuis Terakhir Dikerjakan */}
        <div className="dm-row dm-row-bottom">
          {/* Materi Terakhir Dibaca */}
          <section className="dm-card dm-section">
            <div className="dm-section-header dm-section-header--between">
              <div className="dm-section-header-left">
                <div className="ds-box dm-section-icon"></div>
                <div className="ds-box dm-line dm-w-200"></div>
              </div>
              <div className="ds-box dm-line dm-line-sm dm-w-80"></div>
            </div>

            <div className="dm-list">
              {[1, 2, 3].map((item) => (
                <div key={item} className="dm-list-item">
                  <div className="ds-box dm-list-thumb"></div>
                  <div className="dm-list-body">
                    <div className="dm-list-title-row">
                      <div className="ds-box dm-line dm-w-60p"></div>
                      <div className="ds-box dm-badge"></div>
                    </div>
                    <div className="ds-box dm-line dm-line-sm dm-w-30p"></div>
                    <div className="dm-progress-row">
                      <div className="ds-box dm-progress-bar"></div>
                      <div className="ds-box dm-line dm-line-sm dm-w-40"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Kuis Terakhir Dikerjakan */}
          <section className="dm-card dm-section">
            <div className="dm-section-header dm-section-header--between">
              <div className="dm-section-header-left">
                <div className="ds-box dm-section-icon"></div>
                <div className="ds-box dm-line dm-w-220"></div>
              </div>
              <div className="ds-box dm-line dm-line-sm dm-w-80"></div>
            </div>

            <div className="dm-list">
              {[1, 2, 3].map((item) => (
                <div key={item} className="dm-list-item">
                  <div className="ds-box dm-list-thumb"></div>
                  <div className="dm-list-body">
                    <div className="ds-box dm-line dm-w-60p"></div>
                    <div className="ds-box dm-line dm-line-sm dm-w-30p"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}