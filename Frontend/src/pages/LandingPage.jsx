// src/pages/LandingPage.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "Apa itu INForm?",
      a: "INForm adalah platform Learning Management System yang membantu dosen dan mahasiswa mengelola materi, tugas, diskusi, dan progres belajar secara online.",
    },
    {
      q: "Bagaimana cara mendaftar?",
      a: "Klik tombol Daftar di pojok kanan atas, isi data diri, lalu masuk dengan akun barumu. Setelah itu kamu bisa langsung memilih mata kuliah.",
    },
    {
      q: "Bagaimana cara melihat progres belajar?",
      a: "Buka Dashboard. Progres tiap mata kuliah dan pencapaianmu tampil di sana dan diperbarui secara real-time.",
    },
  ];

  return (
    <div className="landing-wrapper">
      {/* ================= NAVBAR FLOATING (BUBBLE) ================= */}
      <div className="landing-header-wrapper">
        <header className="landing-header">
          <div className="landing-nav">
            <Link to="/" className="landing-logo">
              INF<span>orm</span>
            </Link>

            <nav className="landing-nav-links">
              <a href="#beranda">Beranda</a>
              <a href="#fitur">Fitur</a>
              <a href="#tentang">Tentang</a>
              <a href="#faq">FAQ</a>
            </nav>

            <div className="landing-nav-actions">
              <Link to="/login" className="btn-login-outline">
                Login
              </Link>
              <Link to="/register" className="btn-register-solid">
                Register
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section id="beranda" className="landing-hero landing-container">
        <div className="landing-hero-text">
          <img src="/assets/star.png" alt="" className="hero-star-bg hero-star-bg--left" />
          <span className="landing-badge">Learning Management System</span>

          <h1 className="landing-title" style={{ position: 'relative' }}>
            <img src="/assets/star.png" alt="" className="hero-star-bg hero-star-bg--right" />

            Belajar Lebih Mudah
            <br />
            dengan <span style={{ color: "#1e6f9e" }}>INF</span>
            <span style={{ color: "#8bd4ff" }}>orm</span>
          </h1>

          <p className="landing-desc">
            INForm adalah platform pembelajaran digital yang dirancang untuk
            mendukung proses belajar mengajar, kapan saja dan di mana saja.
          </p>

          {/* Tombol Mulai Sekarang */}
          <Link to="/register" className="btn-hero">
            Mulai Sekarang
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginLeft: "8px" }} // Jarak antara teks dan panah
            >
              <path
                d="M13.2 4.93005L17.45 9.16005C18.79 10.5001 19.45 11.1601 19.45 11.9901C19.45 12.8201 18.79 13.4901 17.45 14.8201L13.21 19.0701M4.29004 12.0001H19.13"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke="white"
              />
            </svg>
          </Link>
        </div>

        <div className="landing-hero-image">
          <img src="/assets/belajar.png" alt="Ilustrasi Belajar" />
        </div>
      </section>

      {/* ================= KEUNGGULAN SECTION ================= */}
      <section id="fitur" className="landing-features landing-container">
        <div className="landing-section-header">
          <span className="landing-subtitle">Keunggulan</span>
          <h2 className="landing-section-title">
            {/* ✅ Pecah teks INForm untuk diberi warna */}
            Kenapa Memilih <span style={{ color: "#1e6f9e" }}>INF</span>
            <span style={{ color: "#8bd4ff" }}>orm</span>?
          </h2>
          <p className="landing-section-desc">
            Kami berkomitmen untuk memberikan pengalaman belajar terbaik dengan
            fitur yang lengkap dan mudah digunakan.
          </p>
        </div>

        <div className="landing-features-grid">
          {/* Fitur 1 — Akses Fleksibel */}
          <div className="feature-item">
            <div className="feature-icon">
              {/* Ikon Monitor/Tablet */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E6F9E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3>Akses Fleksibel</h3>
            <p>
              Belajar kapan saja dan di mana saja dengan perangkat favoritmu.
            </p>
          </div>

          {/* Fitur 2 — Materi Lengkap */}
          <div className="feature-item">
            <div className="feature-icon">
              {/* Ikon Buku */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E6F9E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h3>Materi Lengkap</h3>
            <p>
              Tersedia berbagai materi pembelajaran yang sesuai dengan
              kurikulum.
            </p>
          </div>

          {/* Fitur 3 — Kuis Interaktif */}
          <div className="feature-item">
            <div className="feature-icon">
              {/* Ikon Checklist */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E6F9E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3>Kuis Interaktif</h3>
            <p>
              Uji pemahamanmu melalui kuis interaktif dan lihat hasil belajarmu
              secara langsung.
            </p>
          </div>

          {/* Fitur 4 — Pantau Kemajuan */}
          <div className="feature-item">
            <div className="feature-icon">
              {/* Ikon Jam/History */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1E6F9E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3>Pantau Kemajuan</h3>
            <p>Lihat progres belajar dan pencapaianmu secara real-time.</p>
          </div>
        </div>
      </section>

      {/* ================= TENTANG SECTION ================= */}
      <section id="tentang" className="landing-about">
        <img src="/assets/tandaTanya.png" alt="" className="about-bg-question about-bg-question--large" />
        <img src="/assets/tandaTanya.png" alt="" className="about-bg-question about-bg-question--small" />
        <div className="landing-container landing-about-inner">
          {/* Kolom Kiri: Teks */}
          <div className="landing-about-text">
            <span className="landing-subtitle">Tentang</span>
            <h2 className="landing-section-title">
              Satu platform untuk semua
              <br />
              yang terlibat dalam belajar
            </h2>
            <p className="landing-section-desc">
              INForm menghubungkan materi, tugas, kuis, dan perkembangan belajar
              dalam satu tempat, sehingga proses belajar mengajar berjalan lebih
              rapi dan mudah dipantau.
            </p>
          </div>

          {/* Kolom Kanan: Kotak Mahasiswa & Admin */}
          <div className="landing-about-cards">
            <div className="about-card">
              <h3 className="about-card-title">Mahasiswa</h3>
              <p className="about-card-desc">
                Mengakses materi dan mengerjakan kuis untuk mendukung proses
                belajar.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Admin</h3>
              <p className="about-card-desc">
                Mengelola data dan menjaga keteraturan sistem pembelajaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="landing-faq">
        <div className="landing-container landing-faq-inner">
          {/* Kiri: Teks FAQ */}
          <div className="landing-faq-text">
            <span className="landing-subtitle">FAQ</span>
            <h2 className="landing-section-title">
              Pertanyaan yang
              <br />
              Sering Diajukan
            </h2>
            <p className="landing-section-desc">
              Belum menemukan jawabannya? Hubungi tim kami melalui halaman
              bantuan.
            </p>
          </div>

          {/* Kanan: Accordion FAQ */}
          <div className="landing-faq-list">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${openFaq === index ? "active" : ""}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-icon">
                    {openFaq === index ? (
                      /* Ikon Panah Atas */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    ) : (
                      /* Ikon Panah Bawah */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">
        <div className="landing-container landing-footer-inner">
          <div className="footer-brand">
            <h2 className="footer-logo">
              INF<span>orm</span>
            </h2>
            <p className="footer-desc">
              Platform pembelajaran digital untuk belajar dan mengajar, kapan
              saja dan di mana saja.
            </p>
          </div>

          <div className="footer-links">
            <h4>Jelajahi</h4>
            <a href="#beranda">Beranda</a>
            <a href="#fitur">Fitur</a>
            <a href="#tentang">Tentang</a>
            <a href="#faq">FAQ</a>
          </div>

          <div className="footer-contact">
            <h4>Hubungi Kami</h4>
            <p>✉️ inform@gmail.com</p>
            <p>🕒 Senin–Jumat, 08.00–17.00</p>
          </div>
        </div>

        <div className="landing-container footer-bottom">
          <p>© 2026 INForm. All Right Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
