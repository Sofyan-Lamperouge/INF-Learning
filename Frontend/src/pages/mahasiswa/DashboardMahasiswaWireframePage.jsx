// src/pages/mahasiswa/DashboardMahasiswaWireframePage.jsx
// Wireframe (kerangka abu-abu) Dashboard Mahasiswa. Statis: tanpa data & tanpa backend.
// Strukturnya sama dengan DashboardMahasiswaPage.jsx, sehingga nanti tinggal diganti
// kotak abu-abu ini dengan komponen asli satu per satu.

// Kotak berisi tanda silang = tempat gambar / ikon
function Ph({ className = '', round = false }) {
  return (
    <span className={`dmw-ph${round ? ' dmw-ph--round' : ''} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 0 100 100M100 0 0 100" />
      </svg>
    </span>
  );
}

// Pil biru = tempat teks menu / tautan
function Pill({ w = 100, className = '' }) {
  return <span className={`dmw-pill ${className}`} style={{ width: w }} aria-hidden="true" />;
}

function Button({ children = 'button', className = '' }) {
  return <span className={`dmw-btn ${className}`}>{children}</span>;
}

// Kartu daftar: judul + pil tautan, garis, lalu isi kosong (ikon, teks, tombol)
function ListCard({ className = '' }) {
  return (
    <section className={`dmw-card dmw-list ${className}`}>
      <header className="dmw-list-head">
        <h2>Judul</h2>
        <Pill w={190} />
      </header>
      <hr className="dmw-line" />
      <div className="dmw-empty">
        <Ph className="dmw-ph--sm" />
        <p>Lorem ipsum dolor sit amet</p>
        <Button />
      </div>
    </section>
  );
}

export default function DashboardMahasiswaWireframePage() {
  return (
    <div className="dmw-page">
      {/* NAVBAR: logo, 3 menu, kartu pengguna */}
      <header className="dmw-card dmw-nav">
        <span className="dmw-logo">logo</span>

        <div className="dmw-nav-menu">
          <Pill w={110} />
          <Pill w={90} />
          <Pill w={70} />
        </div>

        <div className="dmw-user">
          <Ph round className="dmw-ph--avatar" />
          <div>
            <strong>Haikal Azkal Azkiya</strong>
            <small>Mahasiswa</small>
          </div>
        </div>
      </header>

      {/* BANNER SAMBUTAN */}
      <section className="dmw-card dmw-banner">
        <Ph className="dmw-ph--art" />
        <div className="dmw-banner-text">
          <h1>Selamat Datang, Haikal!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </section>

      {/* BARIS 1: Lanjutkan Belajar (lebar) + Aksi Cepat */}
      <div className="dmw-grid dmw-grid--top">
        <section className="dmw-card dmw-lanjut">
          <header className="dmw-list-head">
            <Ph className="dmw-ph--icon" />
            <h2>Judul</h2>
          </header>
          <div className="dmw-lanjut-item">
            <Ph className="dmw-ph--cover" />
            <div className="dmw-lanjut-body">
              <Pill w={260} className="dmw-pill--lg" />
              <Pill w={140} />
              <div className="dmw-bar"><span /></div>
              <Button className="dmw-btn--sm">button</Button>
            </div>
          </div>
        </section>

        <section className="dmw-card dmw-aksi">
          <header className="dmw-list-head">
            <Ph className="dmw-ph--icon" />
            <h2>Judul</h2>
          </header>
          {[1, 2].map((n) => (
            <div key={n} className="dmw-aksi-item">
              <Ph className="dmw-ph--icon" />
              <Pill w={170} />
            </div>
          ))}
        </section>
      </div>

      {/* BARIS 2: Materi Terakhir Dibaca + Kuis Terakhir */}
      <div className="dmw-grid dmw-grid--bottom">
        <ListCard />
        <ListCard />
      </div>
    </div>
  );
}