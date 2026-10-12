import { Link } from 'react-router-dom';

const WIREFRAMES = [
  {
    title: 'Login Page',
    description: 'Wireframe login — 2 kolom, 2 field, 1 tombol',
    finalUrl: '/login',
    skeletonUrl: '/login/skeleton',
    wireframeUrl: '/login/wireframe',
  },
  {
    title: 'Register Page',
    description: 'Wireframe register — 4 field + konfirmasi',
    finalUrl: '/register',
    skeletonUrl: '/register/skeleton',
    wireframeUrl: '/register/wireframe',
  },
  {
    title: 'Materi Page',
    description: 'Wireframe materi — navbar, search, list, pagination',
    finalUrl: '/materi',
    skeletonUrl: '/materi/skeleton',
    wireframeUrl: '/materi/wireframe',
  },
];

export default function WireframeIndexPage() {
  return (
    <main className="wf-index">

      <header className="wf-index-header">
        <span className="wf-badge">WIREFRAME</span>
        <h1>Dokumentasi Wireframe</h1>
        <p>
          Kumpulan wireframe halaman aplikasi INF-Learning.
          Wireframe menunjukkan struktur + fungsi + state setiap halaman —
          lebih detail dari blueprint skeleton, tapi belum final design.
        </p>
      </header>

      <div className="wf-index-grid">
        {WIREFRAMES.map((wf) => (
          <div key={wf.title} className="wf-index-card">
            <h3>{wf.title}</h3>
            <p>{wf.description}</p>

            <div className="wf-index-actions">
              <Link to={wf.finalUrl} className="wf-btn wf-btn--primary">
                Final
              </Link>
              <Link to={wf.skeletonUrl} className="wf-btn wf-btn--outline">
                Skeleton
              </Link>
              <Link to={wf.wireframeUrl} className="wf-btn wf-btn--outline">
                Wireframe
              </Link>
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}