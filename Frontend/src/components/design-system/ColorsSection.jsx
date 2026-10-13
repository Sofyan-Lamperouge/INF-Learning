// src/components/design-system/ColorsSection.jsx
// Section: Color Palette — semua warna yang dipakai di aplikasi

const COLORS = [
  {
    group: 'Primary',
    description: 'Warna utama brand — tombol, aksen, link',
    colors: [
      { name: 'Primary',     hex: '#7ec8f5', usage: 'Tombol utama, border input' },
      { name: 'Primary Dark', hex: '#4ea8e0', usage: 'Hover state tombol' },
      { name: 'Primary Deep', hex: '#2f9fe0', usage: 'Focus state, link aktif' },
    ],
  },
  {
    group: 'Background',
    description: 'Warna latar belakang halaman',
    colors: [
      { name: 'Background',  hex: '#f5fbff', usage: 'Latar halaman umum' },
      { name: 'Background Soft', hex: '#eaf5fc', usage: 'Latar halaman auth' },
      { name: 'Card',        hex: '#ffffff', usage: 'Latar card putih' },
    ],
  },
  {
    group: 'Text',
    description: 'Warna teks',
    colors: [
      { name: 'Text Primary',   hex: '#1a1a1a', usage: 'Judul, teks utama' },
      { name: 'Text Secondary', hex: '#6b7280', usage: 'Subtitle, deskripsi' },
      { name: 'Text Muted',     hex: '#9ca3af', usage: 'Placeholder input' },
    ],
  },
  {
    group: 'Semantic',
    description: 'Warna berdasarkan makna — sukses, error, warning',
    colors: [
      { name: 'Error',   hex: '#dc2626', usage: 'Pesan error, border error' },
      { name: 'Success', hex: '#16a34a', usage: 'Pesan sukses' },
      { name: 'Warning', hex: '#f59e0b', usage: 'Pesan peringatan' },
      { name: 'Info',    hex: '#3b82f6', usage: 'Pesan informasi' },
    ],
  },
  {
    group: 'Neutral',
    description: 'Warna netral untuk UI non-brand',
    colors: [
      { name: 'Border',       hex: '#e5e7eb', usage: 'Border card, divider' },
      { name: 'Border Light', hex: '#cbd5e1', usage: 'Border input default' },
      { name: 'Disabled',     hex: '#b7dff5', usage: 'Tombol disabled' },
      { name: 'Skeleton',     hex: '#ececec', usage: 'Placeholder loading' },
    ],
  },
];

export default function ColorsSection() {
  return (
    <section className="ds-section" id="colors">
      <header className="ds-section-header">
        <span className="ds-section-number">01</span>
        <h2 className="ds-section-title">Colors</h2>
        <p className="ds-section-desc">
          Palet warna aplikasi — semua warna yang boleh dipakai.
          Gunakan warna ini agar konsisten di seluruh halaman.
        </p>
      </header>

      {COLORS.map((group) => (
        <div key={group.group} className="ds-color-group">
          <h3 className="ds-color-group-title">{group.group}</h3>
          <p className="ds-color-group-desc">{group.description}</p>

          <div className="ds-color-grid">
            {group.colors.map((color) => (
              <div key={color.name} className="ds-color-item">
                <div
                  className="ds-color-swatch"
                  style={{ background: color.hex }}
                />
                <div className="ds-color-info">
                  <span className="ds-color-name">{color.name}</span>
                  <span className="ds-color-hex">{color.hex}</span>
                  <span className="ds-color-usage">{color.usage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}