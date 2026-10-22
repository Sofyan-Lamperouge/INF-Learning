import { Routes, Route, Navigate } from 'react-router-dom';

// === HALAMAN UTAMA ===
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import MateriListPage from './pages/materi/MateriListPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// === DASHBOARD PAGES ===
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import MateriPage from './pages/dashboard/MateriPage.jsx';
import KuisPage from './pages/dashboard/KuisPage.jsx';
import MahasiswaPage from './pages/dashboard/MahasiswaPage.jsx';
import UploadMateriPage from './pages/dashboard/UploadMateriPage.jsx';
import KonfirmasiMateriPage from './pages/dashboard/KonfirmasiMateriPage.jsx'; // ✅ Import ini ditambahkan

export default function App() {
  return (
    <Routes>
      {/* === LANDING PAGE === */}
      <Route path="/" element={<LandingPage />} />

      {/* === AUTHENTICATION === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* === MATERI MAHASISWA === */}
      <Route
        path="/materi"
        element={
          <ProtectedRoute>
            <MateriListPage />
          </ProtectedRoute>
        }
      />

      {/* === DASHBOARD ADMIN === */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard/materi"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MateriPage />
          </ProtectedRoute>
        }
      />

      {/* Rute Upload & Konfirmasi Materi */}
      <Route
        path="/dashboard/materi/upload"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UploadMateriPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/materi/konfirmasi"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <KonfirmasiMateriPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/kuis"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <KuisPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/mahasiswa"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MahasiswaPage />
          </ProtectedRoute>
        }
      />

      {/* === FALLBACK (Jika URL tidak ditemukan, lempar ke Landing Page) === */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}