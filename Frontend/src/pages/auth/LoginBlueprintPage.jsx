// src/pages/auth/LoginBlueprintPage.jsx
//
// Halaman blueprint login — diakses via /login/skeleton
// Menampilkan struktur low-fidelity tanpa logic.

import { Link } from 'react-router-dom';
import LoginBlueprint from '../../components/skeletons/LoginBlueprint.jsx';

export default function LoginBlueprintPage() {
  return (
    <>
      <LoginBlueprint />

      {/* Link navigasi — kembali ke versi final atau blueprint lain */}
      <nav className="bp-nav">
        <Link to="/login">← Lihat versi final</Link>
        <Link to="/blueprint">Semua Blueprint</Link>
      </nav>
    </>
  );
}