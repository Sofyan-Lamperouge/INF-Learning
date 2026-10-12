import { Link } from 'react-router-dom';
import LoginMockup from '../../components/mockups/LoginMockup.jsx';

export default function LoginMockupPage() {
  return (
    <>
      <LoginMockup />

      <nav className="mk-nav">
        <Link to="/login">← Halaman Final</Link>
        <Link to="/login/skeleton">Blueprint</Link>
        <Link to="/login/wireframe">Wireframe</Link>
        <Link to="/mockup">Semua Mockup</Link>
      </nav>
    </>
  );
}