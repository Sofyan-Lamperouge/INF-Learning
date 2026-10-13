import { Link } from 'react-router-dom';

const MOCKUPS = [
  {
    title: 'Login Page',
    description: 'Mockup login — 2 kolom, warna brand, ilustrasi placeholder',
    finalUrl: '/login',
    skeletonUrl: '/login/skeleton',
    wireframeUrl: '/login/wireframe',
    mockupUrl: '/login/mockup',
  },
  {
    title: 'Register Page',
    description: 'Mockup register — 4 field + konfirmasi password',
    finalUrl: '/register',
    skeletonUrl: '/register/skeleton',
    wireframeUrl: '/register/wireframe',
    mockupUrl: '/register/mockup',
  },
  {
    title: 'Materi Page',
    description: 'Mockup materi — navbar, search, list, pagination',
    finalUrl: '/materi',
    skeletonUrl: '/materi/skeleton',
    wireframeUrl: '/materi/wireframe',
    mockupUrl: '/materi/mockup',
  },
];

export default function MockupIndexPage() {
  return (
    <main className="mk-index">

      <header className="mk-index-header">
        <span className="mk-badge">MOCKUP</span>
        <h1>Dokumentasi Mockup</h1>
        <p>
          Kumpulan mockup medium-fidelity halaman aplikasi INF-Learning.
          Mockup menunjukkan tampilan visual dengan warna brand dan font asli,
          tapi belum memiliki logic & interaksi final.
        </p>
      </header>

      <div className="mk-index-grid">
        {MOCKUPS.map((mk) => (
          <div key={mk.title} className="mk-index-card">
            <h3>{mk.title}</h3>
            <p>{mk.description}</p>

            <div className="mk-index-actions">
              <Link to={mk.finalUrl} className="mk-btn mk-btn--primary">
                Final
              </Link>
              <Link to={mk.skeletonUrl} className="mk-btn mk-btn--outline">
                Skeleton
              </Link>
              <Link to={mk.wireframeUrl} className="mk-btn mk-btn--outline">
                Wireframe
              </Link>
              <Link to={mk.mockupUrl} className="mk-btn mk-btn--outline">
                Mockup
              </Link>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}