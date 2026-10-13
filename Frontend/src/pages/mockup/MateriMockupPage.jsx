import { Link } from 'react-router-dom';
import MateriMockup from '../../components/mockups/MateriMockup.jsx';

export default function MateriMockupPage() {
  return (
    <>
      <MateriMockup />

      <nav className="mk-nav">
        <Link to="/materi">← Halaman Final</Link>
        <Link to="/materi/skeleton">Blueprint</Link>
        <Link to="/materi/wireframe">Wireframe</Link>
        <Link to="/mockup">Semua Mockup</Link>
      </nav>
    </>
  );
}