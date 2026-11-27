import { useAuth } from '../../hooks/useAuth.js';

// Komponen kartu user di sidebar dashboard. Menampilkan inisial, nama, dan peran pengguna.
export default function SidebarUser() {
  const { user, role } = useAuth();

  const nama = user?.nama || user?.namaLengkap || 'Haikal Azkal Azkiya';
  const peran = role === 'admin' ? 'Administrator' : role || 'Administrator';
  
  // Ambil inisial dari nama pengguna: huruf pertama dari dua kata pertama, diubah menjadi huruf kapital.
  const inisial = nama
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="sidebar-user">
      <div className="sidebar-user-avatar">
        {inisial}
      </div>

      <div className="sidebar-user-info">
        <span className="sidebar-user-name">{nama}</span>
        <span className="sidebar-user-role">{peran}</span>
      </div>
    </div>
  );
}