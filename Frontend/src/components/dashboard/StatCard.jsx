// src/components/dashboard/StatCard.jsx
// Kartu statistik di main panel dashboard

export default function StatCard({ icon, title, value, subtitle }) {
  return (
    <div className="stat-card">

      <div className="stat-card-icon">
        {icon}
      </div>

      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-subtitle">{subtitle}</span>
      </div>

    </div>
  );
}