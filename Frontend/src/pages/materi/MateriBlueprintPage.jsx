// src/pages/materi/MateriBlueprintPage.jsx
// Diakses via /materi/skeleton

import { Link } from 'react-router-dom';
import MateriBlueprint from '../../components/skeletons/MateriBlueprint.jsx';

export default function MateriBlueprintPage() {
  return (
    <>
      <MateriBlueprint />

      <nav className="bp-nav">
        <Link to="/materi">← Lihat versi final</Link>
        <Link to="/blueprint">Semua Blueprint</Link>
      </nav>
    </>
  );
}