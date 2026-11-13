// src/components/student/dashboard/WelcomeBanner.jsx
// Banner sambutan: kartu luar + panel dalam berisi maskot, garis pemisah,
// badge "Selamat datang kembali", nama besar, dan hiasan awan di kanan.

import Art from './Art.jsx';
import { ASET } from './Assets.js';
import { namaDepan } from './helpers.js';

export default function WelcomeBanner({ nama }) {
  return (
    <section className="sd-card sd-welcome">
      <div className="sd-welcome-panel">
        <Art src={ASET.awanMegaMendung} className="sd-welcome-cloud" />
        <Art src={ASET.maskotSambutan} className="sd-welcome-maskot" />

        <span className="sd-welcome-divider" aria-hidden="true" />

        <div className="sd-welcome-text">
          <span className="sd-welcome-badge">Selamat datang kembali</span>

          <h1 className="sd-welcome-name">
            {namaDepan(nama)} <span aria-hidden="true">👋</span>
          </h1>

          <p className="sd-welcome-desc">
            Ringkasan materi, kuis, dan mahasiswa yang terbaru ditambahkan atau
            diperbarui
          </p>
        </div>
      </div>
    </section>
  );
}