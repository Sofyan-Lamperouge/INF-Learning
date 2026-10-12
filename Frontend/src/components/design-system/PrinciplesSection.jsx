// src/components/design-system/PrinciplesSection.jsx
// Section: Principles — prinsip desain aplikasi

const PRINCIPLES = [
  {
    icon: '🎯',
    title: 'Konsisten',
    description:
      'Semua halaman pakai warna, font, dan spacing yang sama. User tidak bingung saat pindah halaman.',
  },
  {
    icon: '🧭',
    title: 'Jelas (Clear)',
    description:
      'Hierarki visual jelas — judul besar, subtitle kecil. User tahu mana yang penting.',
  },
  {
    icon: '⚡',
    title: 'Cepat (Performance)',
    description:
      'Loading state (skeleton) muncul saat data dimuat. User tidak melihat layar kosong.',
  },
  {
    icon: '♿',
    title: 'Aksesibel',
    description:
      'Kontras warna memadai, teks bisa dibaca. Mendukung role ARIA untuk screen reader.',
  },
  {
    icon: '📱',
    title: 'Responsive',
    description:
      'Tampilan menyesuaikan ukuran layar — desktop, tablet, dan mobile.',
  },
  {
    icon: '🎨',
    title: 'Minimalis',
    description:
      'Tidak ada elemen berlebihan. Fokus pada fungsi utama halaman.',
  },
];

export default function PrinciplesSection() {
  return (
    <section className="ds-section" id="principles">
      <header className="ds-section-header">
        <span className="ds-section-number">05</span>
        <h2 className="ds-section-title">Principles</h2>
        <p className="ds-section-desc">
          Prinsip desain aplikasi INF-Learning — panduan filosofi visual.
        </p>
      </header>

      <div className="ds-principles-grid">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="ds-principle-card">
            <span className="ds-principle-icon">{p.icon}</span>
            <h3 className="ds-principle-title">{p.title}</h3>
            <p className="ds-principle-desc">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}