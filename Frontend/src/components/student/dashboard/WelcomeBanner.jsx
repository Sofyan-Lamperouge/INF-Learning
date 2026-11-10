// src/components/student/dashboard/WelcomeBanner.jsx
// Banner "Selamat datang kembali, <nama> 👋".
//
// Ilustrasi (buku + tanaman) dan bentuk biru di kanan memakai SVG bawaan
// supaya langsung tampil. Mau pakai gambar asli dari Figma? Ganti <WelcomeIllustration />
// dengan <img src="/assets/nama-file.png" alt="" /> (taruh file di public/assets).

import { namaDepan } from './helpers.js';

function WelcomeIllustration() {
  return (
    <svg
      className="sd-welcome-art"
      viewBox="0 0 266 186"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sd-blob-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EAF7FF" />
          <stop offset="1" stopColor="#C4E7FB" />
        </linearGradient>
      </defs>

      {/* bentuk latar */}
      <path
        d="M20 60C34 22 62-2 104 2c36 4 46 38 72 60 28 22 74 30 82 66 6 28-26 52-82 55-56 3-116 1-152-15C-2 154-2 100 20 60Z"
        fill="url(#sd-blob-a)"
      />

      {/* daun */}
      <path d="M190 104C170 62 200 20 246 24c6 46-20 78-56 80Z" fill="#2AB7A7" />
      <path d="M200 106c14-34 44-44 62-38-4 28-30 46-62 38Z" fill="#37C7B7" />
      <path d="M186 106c-18-14-16-34 0-44 10 12 10 30 0 44Z" fill="#1FA595" />
      <path d="M196 108 214 58" stroke="#1B8F82" strokeWidth="2" strokeLinecap="round" />

      {/* buku bawah */}
      <rect x="34" y="124" width="200" height="40" rx="11" fill="#1B64C8" />
      <rect x="40" y="130" width="132" height="28" rx="8" fill="#F4F8FE" stroke="#BCD2EA" />
      <path d="M52 140h104M52 148h104" stroke="#D3DFEE" strokeWidth="2" strokeLinecap="round" />

      {/* buku atas */}
      <rect x="54" y="90" width="152" height="38" rx="11" fill="#2A8BFF" />
      <rect x="60" y="96" width="96" height="26" rx="8" fill="#F4F8FE" stroke="#BCD2EA" />
      <path d="M72 106h64M72 113h64" stroke="#D3DFEE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WelcomeBlob() {
  return (
    <svg
      className="sd-welcome-blob"
      viewBox="0 0 443 239"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sd-blob-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E1F3FD" />
          <stop offset="1" stopColor="#CBEAFC" />
        </linearGradient>
      </defs>
      <path
        d="M0 226C0 186 22 160 56 142c28-14 60-8 96-4 46 7 88 20 128 8 26-8 38-34 52-76C346 30 376 2 443 0v226c0 7-5 13-12 13H12c-7 0-12-6-12-13Z"
        fill="url(#sd-blob-b)"
      />
    </svg>
  );
}

export default function WelcomeBanner({ nama }) {
  return (
    <section className="sd-card sd-welcome">
      <WelcomeBlob />

      <div className="sd-welcome-illustration">
        <WelcomeIllustration />
      </div>

      <span className="sd-welcome-divider" aria-hidden="true" />

      <div className="sd-welcome-text">
        <p className="sd-welcome-hello">Selamat datang kembali,</p>
        <h1 className="sd-welcome-name">
          {namaDepan(nama)} <span aria-hidden="true">👋</span>
        </h1>
        <p className="sd-welcome-desc">
          Ringkasan materi, kuis, dan mahasiswa yang terbaru ditambahkan atau
          diperbarui
        </p>
      </div>
    </section>
  );
}