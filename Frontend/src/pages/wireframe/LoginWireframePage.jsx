import { Link } from 'react-router-dom';
import LoginWireframe from '../../components/wireframes/LoginWireframe.jsx';

export default function LoginWireframePage() {
  return (
    <>
      <LoginWireframe />

      <nav className="wf-nav">
        <Link to="/login">← Halaman Final</Link>
        <Link to="/login/skeleton">Blueprint Skeleton</Link>
        <Link to="/wireframe">Semua Wireframe</Link>
      </nav>
    </>
  );
}