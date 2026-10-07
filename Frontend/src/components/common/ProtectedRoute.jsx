import {
  Navigate,
} from 'react-router-dom';

import {
  useAuth,
} from '../../hooks/useAuth.js';


export default function ProtectedRoute({
  children,
}) {
  const {
    isAuthenticated,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <main className="materi-page">
        <p>
          Memeriksa sesi login...
        </p>
      </main>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
}