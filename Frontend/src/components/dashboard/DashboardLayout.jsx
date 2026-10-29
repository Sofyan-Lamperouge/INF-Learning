// src/components/dashboard/DashboardLayout.jsx
// Layout wrapper untuk halaman dashboard

import Sidebar from './Sidebar.jsx';

export default function DashboardLayout({ children }) {
  return (
  <DashboardLayout>
    <div className="materi-container">
      {/* Isi halaman Materi: header, filter, tabel, dan paginasi */}
    </div>

    {editingMateri && (
      <EditMateriModal
        materi={editingMateri}
        mataKuliahOptions={matkulOptions}
        onClose={() => setEditingMateri(null)}
        onSaved={() => {
          setEditingMateri(null);
          setReloadKey((current) => current + 1);
        }}
      />
    )}
  </DashboardLayout>
);
}