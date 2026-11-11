export default function StatCard({ icon, title, value, badge, badgeTone = "blue", subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>

      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-subtitle">
          <span className={`stat-card-badge stat-card-badge-${badgeTone}`}>{badge}</span>{" "}
          {subtitle}
        </span>
      </div>
    </div>
  );
}