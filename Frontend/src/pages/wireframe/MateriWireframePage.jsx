import { Link } from 'react-router-dom';
import MateriWireframe from '../../components/wireframes/MateriWireframe.jsx';

export default function MateriWireframePage() {
  return (
    <>
      <MateriWireframe />

      <nav className="wf-nav">
        <Link to="/materi">← Halaman Final</Link>
        <Link to="/materi/skeleton">Blueprint Skeleton</Link>
        <Link to="/wireframe">Semua Wireframe</Link>
      </nav>
    </>
  );
}