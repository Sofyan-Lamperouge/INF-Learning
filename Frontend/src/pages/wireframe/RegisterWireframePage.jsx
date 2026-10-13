import { Link } from 'react-router-dom';
import RegisterWireframe from '../../components/wireframes/RegisterWireframe.jsx';

export default function RegisterWireframePage() {
  return (
    <>
      <RegisterWireframe />

      <nav className="wf-nav">
        <Link to="/register">← Halaman Final</Link>
        <Link to="/register/skeleton">Blueprint Skeleton</Link>
        <Link to="/wireframe">Semua Wireframe</Link>
      </nav>
    </>
  );
}