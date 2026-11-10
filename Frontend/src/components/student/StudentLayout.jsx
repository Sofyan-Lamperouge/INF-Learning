// src/components/student/StudentLayout.jsx
// Layout halaman mahasiswa: TOP BAR + konten
// (padanan DashboardLayout milik admin yang memakai sidebar).

import StudentTopBar from './StudentTopBar.jsx';

export default function StudentLayout({ children }) {
  return (
    <div className="sd-layout">
      <div className="sd-container">
        <StudentTopBar />
        <main className="sd-content">{children}</main>
      </div>
    </div>
  );
}