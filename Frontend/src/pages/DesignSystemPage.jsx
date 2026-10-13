// src/pages/DesignSystemPage.jsx
// Halaman dokumentasi Design System — diakses via /design-system

import ColorsSection from '../components/design-system/ColorsSection.jsx';
import TypographySection from '../components/design-system/TypographySection.jsx';
import SpacingSection from '../components/design-system/SpacingSection.jsx';
import ComponentsSection from '../components/design-system/ComponentsSection.jsx';
import PrinciplesSection from '../components/design-system/PrinciplesSection.jsx';

const NAV_ITEMS = [
  { id: 'colors',       label: '01 · Colors' },
  { id: 'typography',   label: '02 · Typography' },
  { id: 'spacing',      label: '03 · Spacing' },
  { id: 'components',   label: '04 · Components' },
  { id: 'principles',   label: '05 · Principles' },
];

export default function DesignSystemPage() {
  function handleScrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <main className="ds-page">

      {/* Hero header */}
      <header className="ds-hero">
        <span className="ds-badge">DESIGN SYSTEM</span>
        <h1 className="ds-hero-title">INF-orm — Design System</h1>
        <p className="ds-hero-desc">
          Dokumentasi lengkap aturan visual aplikasi — warna, tipografi, spacing,
          komponen, dan prinsip desain. Gunakan sebagai referensi untuk konsistensi
          di seluruh halaman.
        </p>
        <div className="ds-hero-meta">
          <span>Version 1.0</span>
          <span>•</span>
          <span>Font: Poppins</span>
          <span>•</span>
          <span>Primary: #7ec8f5</span>
        </div>
      </header>

      {/* Navigasi sticky */}
      <nav className="ds-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ds-nav-item"
            onClick={() => handleScrollTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Sections */}
      <ColorsSection />
      <TypographySection />
      <SpacingSection />
      <ComponentsSection />
      <PrinciplesSection />

      {/* Footer */}
      <footer className="ds-footer">
        <p>
          Design System INF-Learning — dibuat untuk konsistensi visual
          di seluruh halaman aplikasi.
        </p>
        <p className="ds-footer-sub">
          Dibuat dengan ❤ menggunakan React + CSS Custom
        </p>
      </footer>

    </main>
  );
}