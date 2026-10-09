// src/pages/auth/RegisterBlueprintPage.jsx
// Diakses via /register/skeleton

import { Link } from 'react-router-dom';
import RegisterBlueprint from '../../components/skeletons/RegisterBlueprint.jsx';

export default function RegisterBlueprintPage() {
  return (
    <>
      <RegisterBlueprint />

      <nav className="bp-nav">
        <Link to="/register">← Lihat versi final</Link>
        <Link to="/blueprint">Semua Blueprint</Link>
      </nav>
    </>
  );
}