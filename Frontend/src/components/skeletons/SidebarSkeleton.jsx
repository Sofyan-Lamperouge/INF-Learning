// src/components/skeletons/SidebarSkeleton.jsx

export default function SidebarSkeleton() {
  return (
    <aside className="sidebar">
      
      {/* Logo Skeleton */}
      <div className="sidebar-brand" style={{ marginBottom: '1rem' }}>
        <div className="ss-box ss-logo-text"></div>
        <div className="ss-box ss-logo-tagline"></div>
      </div>

      <div className="sidebar-divider"></div>

      {/* Menu Skeleton */}
      <nav className="sidebar-menu" style={{ marginTop: '1rem', gap: '0.5rem' }}>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="ss-menu-item">
            <div className="ss-box ss-icon"></div>
            <div className="ss-box ss-label"></div>
          </div>
        ))}
      </nav>

      <div className="sidebar-divider"></div>

      {/* Tombol Keluar Skeleton */}
      <div className="ss-menu-item" style={{ marginTop: '0.5rem' }}>
        <div className="ss-box ss-icon"></div>
        <div className="ss-box ss-label" style={{ width: '60px' }}></div>
      </div>

      <div className="sidebar-divider"></div>

      {/* User Card Skeleton (Paling Bawah) */}
      <div className="sidebar-user" style={{ marginTop: 'auto' }}>
        <div className="ss-box ss-avatar"></div>
        <div className="ss-user-info">
          <div className="ss-box ss-name"></div>
          <div className="ss-box ss-role"></div>
        </div>
      </div>

    </aside>
  );
}