import { Link } from 'react-router-dom';
import RegisterMockup from '../../components/mockups/RegisterMockup.jsx';

export default function RegisterMockupPage() {
  return (
    <>
      <RegisterMockup />

      <nav className="mk-nav">
        <Link to="/register">← Halaman Final</Link>
        <Link to="/register/skeleton">Blueprint</Link>
        <Link to="/register/wireframe">Wireframe</Link>
        <Link to="/mockup">Semua Mockup</Link>
      </nav>
    </>
  );
}