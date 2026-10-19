// src/components/dashboard/DashboardLayout.jsx
// Layout wrapper untuk halaman dashboard

import Sidebar from './Sidebar.jsx';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">

      {/* Sidebar kiri */}
      <Sidebar />

      {/* Konten utama kanan */}
      <main className="dashboard-content">
        {children}
      </main>

    </div>
  );
}