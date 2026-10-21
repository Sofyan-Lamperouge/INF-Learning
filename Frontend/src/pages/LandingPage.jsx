// src/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LandingSkeleton from "../components/skeletons/LandingSkeleton";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LandingSkeleton />;
  }

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
          <img
            src="/assets/star.png"
            alt=""
            className="hero-star-bg hero-star-bg--left"
          />
          <span className="landing-badge">Learning Management System</span>

          <h1 className="landing-title" style={{ position: "relative" }}>
            <img
              src="/assets/star.png"
              alt=""
              className="hero-star-bg hero-star-bg--right"
            />
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 50 44"
                fill="#1E6F9E"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.55556 5.73913C5.55556 4.21702 6.14087 2.75725 7.18274 1.68095C8.22461 0.604657 9.63769 0 11.1111 0H40.7407C42.2142 0 43.6272 0.604657 44.6691 1.68095C45.711 2.75725 46.2963 4.21702 46.2963 5.73913V24.8696C46.2963 26.3917 45.711 27.8514 44.6691 28.9277C43.6272 30.004 42.2142 30.6087 40.7407 30.6087H25.9259V26.7826H40.7407C41.2319 26.7826 41.7029 26.5811 42.0502 26.2223C42.3975 25.8635 42.5926 25.3769 42.5926 24.8696V5.73913C42.5926 5.23176 42.3975 4.74517 42.0502 4.3864C41.7029 4.02764 41.2319 3.82609 40.7407 3.82609H11.1111C10.62 3.82609 10.1489 4.02764 9.80165 4.3864C9.45436 4.74517 9.25926 5.23176 9.25926 5.73913H7.40741C6.76543 5.73913 6.14815 5.81948 5.55556 5.98017V5.73913ZM48.1481 38.2609H25.9259V34.4348H48.1481C48.6393 34.4348 49.1103 34.6363 49.4576 34.9951C49.8049 35.3539 50 35.8405 50 36.3478C50 36.8552 49.8049 37.3418 49.4576 37.7006C49.1103 38.0593 48.6393 38.2609 48.1481 38.2609ZM11.1111 38.2609C11.6023 38.2609 12.0733 38.0593 12.4206 37.7006C12.7679 37.3418 12.963 36.8552 12.963 36.3478C12.963 35.8405 12.7679 35.3539 12.4206 34.9951C12.0733 34.6363 11.6023 34.4348 11.1111 34.4348C10.62 34.4348 10.1489 34.6363 9.80165 34.9951C9.45436 35.3539 9.25926 35.8405 9.25926 36.3478C9.25926 36.8552 9.45436 37.3418 9.80165 37.7006C10.1489 38.0593 10.62 38.2609 11.1111 38.2609ZM0 15.3043C0 13.7822 0.585316 12.3225 1.62718 11.2462C2.66905 10.1699 4.08213 9.56522 5.55556 9.56522H16.6667C18.1401 9.56522 19.5532 10.1699 20.595 11.2462C21.6369 12.3225 22.2222 13.7822 22.2222 15.3043V38.2609C22.2222 39.783 21.6369 41.2428 20.595 42.319C19.5532 43.3953 18.1401 44 16.6667 44H5.55556C4.08213 44 2.66905 43.3953 1.62718 42.319C0.585316 41.2428 0 39.783 0 38.2609V15.3043ZM5.55556 13.3913C5.06441 13.3913 4.59339 13.5929 4.2461 13.9516C3.89881 14.3104 3.7037 14.797 3.7037 15.3043V38.2609C3.7037 38.7682 3.89881 39.2548 4.2461 39.6136C4.59339 39.9724 5.06441 40.1739 5.55556 40.1739H16.6667C17.1578 40.1739 17.6288 39.9724 17.9761 39.6136C18.3234 39.2548 18.5185 38.7682 18.5185 38.2609V15.3043C18.5185 14.797 18.3234 14.3104 17.9761 13.9516C17.6288 13.5929 17.1578 13.3913 16.6667 13.3913H5.55556Z"
                  fill="currentColor"
                />
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
                width="32"
                height="32"
                viewBox="0 0 50 50"
                fill="#1E6F9E"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25 41.6666C25 41.6666 28.125 39.5833 35.4166 39.5833C42.7083 39.5833 45.8333 41.6666 45.8333 41.6666V12.4999C45.8333 12.4999 42.7083 8.33325 35.4166 8.33325C28.125 8.33325 25 12.4999 25 12.4999C25 12.4999 21.875 8.33325 14.5833 8.33325C7.29163 8.33325 4.16663 12.4999 4.16663 12.4999V41.6666C4.16663 41.6666 7.29163 39.5833 14.5833 39.5833C21.875 39.5833 25 41.6666 25 41.6666ZM25 12.4999V41.6666"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
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
                width="32"
                height="32"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5833 6.25H35.4167C40.019 6.25 43.75 9.98096 43.75 14.5833V35.4167C43.75 40.019 40.019 43.75 35.4167 43.75H14.5833C9.98096 43.75 6.25 40.019 6.25 35.4167V14.5833C6.25 9.98096 9.98096 6.25 14.5833 6.25Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.75 24.9999L23.4375 29.1666L31.25 20.8333"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
                width="32"
                height="32"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.8875 33.4583C10.6497 37.0221 13.5085 39.9269 17.0437 41.7458C20.5531 43.5487 24.555 44.1572 28.4417 43.4791C32.3402 42.793 35.9119 40.8635 38.6229 37.9791C41.3582 35.0667 43.1 31.3622 43.5979 27.3978C44.1027 23.4244 43.3416 19.3929 41.4229 15.877C39.5218 12.3878 36.5502 9.60163 32.9458 7.92909C29.366 6.2711 25.343 5.82637 21.4875 6.66242C17.6333 7.49784 14.475 9.39784 11.8625 12.402C11.5479 12.7353 10.3312 14.0812 9.32083 16.1124M15.625 16.6666L8.10625 18.1666L6.25 10.4166M25 18.7499V27.0833L31.25 31.2499"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Pantau Kemajuan</h3>
            <p>Lihat progres belajar dan pencapaianmu secara real-time.</p>
          </div>
        </div>
      </section>

      {/* ================= TENTANG SECTION ================= */}
      <section id="tentang" className="landing-about">
        <img
          src="/assets/tandaTanya.png"
          alt=""
          className="about-bg-question about-bg-question--large"
        />
        <img
          src="/assets/tandaTanya.png"
          alt=""
          className="about-bg-question about-bg-question--small"
        />
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
            <p>
              {/* SVG EMAIL */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "8px" }} // Jarak antara ikon dan teks
              >
                <path
                  d="M40.625 9.375H9.375C5.92812 9.375 3.125 12.1781 3.125 15.625V34.375C3.125 37.8219 5.92812 40.625 9.375 40.625H40.625C44.0719 40.625 46.875 37.8219 46.875 34.375V15.625C46.875 12.1781 44.0719 9.375 40.625 9.375ZM9.375 12.5H40.625C42.35 12.5 43.75 13.9031 43.75 15.625V16.2531L25 26.35L6.25 16.2531V15.625C6.25 13.9031 7.65 12.5 9.375 12.5ZM40.625 37.5H9.375C8.5462 37.5 7.75134 37.1708 7.16529 36.5847C6.57924 35.9987 6.25 35.2038 6.25 34.375V19.8031L24.2594 29.5C24.487 29.6225 24.7415 29.6867 25 29.6867C25.2585 29.6867 25.513 29.6225 25.7406 29.5L43.75 19.8031V34.375C43.75 35.2038 43.4208 35.9987 42.8347 36.5847C42.2487 37.1708 41.4538 37.5 40.625 37.5Z"
                  fill="currentColor"
                />
              </svg>
              inform@gmail.com
            </p>
            <p>
              {/* SVG WAKTU (JAM) */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "8px" }} // Jarak antara ikon dan teks
              >
                <path
                  d="M45.8333 25.0001C45.8333 36.506 36.5059 45.8334 25 45.8334C13.494 45.8334 4.16663 36.506 4.16663 25.0001C4.16663 13.4941 13.494 4.16675 25 4.16675C36.5059 4.16675 45.8333 13.4941 45.8333 25.0001Z"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M31.25 33.3333L26.2208 28.3042C25.4394 27.5229 25.0002 26.4633 25 25.3583V12.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Senin–Jumat, 08.00–17.00
            </p>
          </div>
        </div>

        <div className="landing-container footer-bottom">
          <p>© 2026 INForm. All Right Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
