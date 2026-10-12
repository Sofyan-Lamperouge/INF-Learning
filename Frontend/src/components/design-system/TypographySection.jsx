// src/components/design-system/TypographySection.jsx
// Section: Typography — semua ukuran & gaya font

const TYPOGRAPHY = [
  {
    name: 'H1 — Page Title',
    example: 'Welcome Back!',
    className: 'ds-text-h1',
    size: '1.75rem',
    weight: '700',
    lineHeight: '1.25',
    usage: 'Judul halaman utama',
  },
  {
    name: 'H2 — Section Title',
    example: 'Daftar Materi',
    className: 'ds-text-h2',
    size: '1.25rem',
    weight: '700',
    lineHeight: '1.3',
    usage: 'Judul section / card',
  },
  {
    name: 'H3 — Subsection',
    example: 'Pengantar Algoritma',
    className: 'ds-text-h3',
    size: '1rem',
    weight: '700',
    lineHeight: '1.4',
    usage: 'Judul list item',
  },
  {
    name: 'Body — Regular',
    example: 'Masuk untuk mulai belajar.',
    className: 'ds-text-body',
    size: '0.95rem',
    weight: '400',
    lineHeight: '1.5',
    usage: 'Paragraf umum',
  },
  {
    name: 'Body — Small',
    example: 'Belum punya akun? Buat di sini',
    className: 'ds-text-small',
    size: '0.85rem',
    weight: '400',
    lineHeight: '1.5',
    usage: 'Footer, caption',
  },
  {
    name: 'Label — Form',
    example: 'NIM / NIP',
    className: 'ds-text-label',
    size: '0.85rem',
    weight: '600',
    lineHeight: '1.4',
    usage: 'Label form',
  },
  {
    name: 'Button — Text',
    example: 'Masuk',
    className: 'ds-text-button',
    size: '0.95rem',
    weight: '700',
    lineHeight: '1',
    usage: 'Teks tombol',
  },
  {
    name: 'Caption — Small',
    example: 'Contoh: 24880100XX',
    className: 'ds-text-caption',
    size: '0.75rem',
    weight: '400',
    lineHeight: '1.4',
    usage: 'Placeholder, hint',
  },
];

export default function TypographySection() {
  return (
    <section className="ds-section" id="typography">
      <header className="ds-section-header">
        <span className="ds-section-number">02</span>
        <h2 className="ds-section-title">Typography</h2>
        <p className="ds-section-desc">
          Skala tipografi — semua ukuran font yang dipakai.
          Font utama: <strong>Poppins</strong>.
        </p>
      </header>

      <div className="ds-typography-list">
        {TYPOGRAPHY.map((type) => (
          <div key={type.name} className="ds-typography-item">
            <div className="ds-typography-preview">
              <span className={type.className}>{type.example}</span>
            </div>

            <div className="ds-typography-meta">
              <span className="ds-typography-name">{type.name}</span>
              <span className="ds-typography-spec">
                {type.size} · weight {type.weight} · line-height {type.lineHeight}
              </span>
              <span className="ds-typography-usage">{type.usage}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}