// src/components/student/dashboard/SectionCard.jsx
// Kerangka kartu: kotak putih + header (ikon, judul, tautan opsional) + isi.

export default function SectionCard({
  icon,
  title,
  action,
  busy = false,
  className = '',
  children,
}) {
  return (
    <section className={`sd-card ${className}`.trim()} aria-busy={busy}>
      <header className="sd-card-header">
        <span className="sd-card-icon">{icon}</span>
        <h2 className="sd-card-title">{title}</h2>
        {action && <span className="sd-card-action">{action}</span>}
      </header>

      <div className="sd-card-body">{children}</div>
    </section>
  );
}