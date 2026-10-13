// src/components/design-system/SpacingSection.jsx
// Section: Spacing — semua ukuran jarak

const SPACING = [
  { name: 'xs', value: '0.25rem', px: '4px',  usage: 'Jarak sangat kecil (ikon ke teks)' },
  { name: 'sm', value: '0.5rem',  px: '8px',  usage: 'Jarak antar label & input' },
  { name: 'md', value: '0.75rem', px: '12px', usage: 'Jarak antar field form' },
  { name: 'lg', value: '1rem',    px: '16px', usage: 'Jarak antar section kecil' },
  { name: 'xl', value: '1.5rem',  px: '24px', usage: 'Jarak antar section besar' },
  { name: '2xl', value: '2rem',   px: '32px', usage: 'Padding card' },
  { name: '3xl', value: '3rem',   px: '48px', usage: 'Padding halaman' },
];

const RADIUS = [
  { name: 'sm', value: '6px',  usage: 'Radius kecil — badge, tag' },
  { name: 'md', value: '10px', usage: 'Radius input & tombol' },
  { name: 'lg', value: '12px', usage: 'Radius tombol besar' },
  { name: 'xl', value: '22px', usage: 'Radius card utama' },
  { name: 'full', value: '9999px', usage: 'Radius pill / circle' },
];

const SHADOWS = [
  { name: 'sm',   value: '0 1px 3px rgba(0,0,0,0.04)',      usage: 'Card halus' },
  { name: 'md',   value: '0 4px 12px rgba(30,90,140,0.08)', usage: 'Card standar' },
  { name: 'lg',   value: '0 10px 30px rgba(30,90,140,0.10)', usage: 'Modal, dialog' },
  { name: 'xl',   value: '0 20px 50px rgba(30,90,140,0.12)', usage: 'Card utama halaman' },
];

export default function SpacingSection() {
  return (
    <section className="ds-section" id="spacing">
      <header className="ds-section-header">
        <span className="ds-section-number">03</span>
        <h2 className="ds-section-title">Spacing & Radius</h2>
        <p className="ds-section-desc">
          Skala jarak (spacing), radius, dan shadow. Gunakan nilai dari skala ini
          agar layout konsisten.
        </p>
      </header>

      {/* Spacing */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Spacing Scale</h3>
        <div className="ds-spacing-list">
          {SPACING.map((s) => (
            <div key={s.name} className="ds-spacing-item">
              <div className="ds-spacing-box">
                <div
                  className="ds-spacing-demo"
                  style={{ width: s.value, height: s.value }}
                />
              </div>
              <div className="ds-spacing-info">
                <span className="ds-spacing-name">
                  {s.name} — {s.value} ({s.px})
                </span>
                <span className="ds-spacing-usage">{s.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Border Radius</h3>
        <div className="ds-radius-grid">
          {RADIUS.map((r) => (
            <div key={r.name} className="ds-radius-item">
              <div
                className="ds-radius-box"
                style={{ borderRadius: r.value }}
              />
              <span className="ds-radius-name">{r.name}</span>
              <span className="ds-radius-value">{r.value}</span>
              <span className="ds-radius-usage">{r.usage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div className="ds-subsection">
        <h3 className="ds-subsection-title">Box Shadow</h3>
        <div className="ds-shadow-grid">
          {SHADOWS.map((sh) => (
            <div key={sh.name} className="ds-shadow-item">
              <div
                className="ds-shadow-box"
                style={{ boxShadow: sh.value }}
              />
              <span className="ds-shadow-name">{sh.name}</span>
              <span className="ds-shadow-value">{sh.value}</span>
              <span className="ds-shadow-usage">{sh.usage}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}