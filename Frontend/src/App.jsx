import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage.jsx';          // ✅ IMPORT BARU
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import MateriListPage from './pages/materi/MateriListPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Blueprint pages
import BlueprintIndexPage from './pages/BlueprintIndexPage.jsx';
import LoginBlueprintPage from './pages/auth/LoginBlueprintPage.jsx';
import RegisterBlueprintPage from './pages/auth/RegisterBlueprintPage.jsx';
import MateriBlueprintPage from './pages/materi/MateriBlueprintPage.jsx';

// Wireframe pages
import WireframeIndexPage from './pages/WireframeIndexPage.jsx';
import LoginWireframePage from './pages/wireframe/LoginWireframePage.jsx';
import RegisterWireframePage from './pages/wireframe/RegisterWireframePage.jsx';
import MateriWireframePage from './pages/wireframe/MateriWireframePage.jsx';

// Mockup pages
import MockupIndexPage from './pages/MockupIndexPage.jsx';
import LoginMockupPage from './pages/mockup/LoginMockupPage.jsx';
import RegisterMockupPage from './pages/mockup/RegisterMockupPage.jsx';
import MateriMockupPage from './pages/mockup/MateriMockupPage.jsx';

// Design System
import DesignSystemPage from './pages/DesignSystemPage.jsx';

// Dashboard pages
import DashboardPage from './pages/dashboard/DashboardPage.jsx';
import MateriPage from './pages/dashboard/MateriPage.jsx';
import KuisPage from './pages/dashboard/KuisPage.jsx';
import MahasiswaPage from './pages/dashboard/MahasiswaPage.jsx';
import UploadMateriPage from './pages/dashboard/UploadMateriPage.jsx';

// ✅ Preview Skeleton
import PreviewSkeletonPage from './pages/PreviewSkeletonPage.jsx';


export default function App() {
  return (
    <Routes>
      {/* === LANDING PAGE (Pintu Masuk) === */}
      <Route path="/" element={<LandingPage />} />

      {/* === HALAMAN FINAL === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/materi"
        element={
          <ProtectedRoute>
            <MateriListPage />
          </ProtectedRoute>
        }
      />

      {/* === DASHBOARD === */}
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
          <ProtectedRoute>
            <MateriPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/kuis"
        element={
          <ProtectedRoute>
            <KuisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/mahasiswa"
        element={
          <ProtectedRoute>
            <MahasiswaPage />
          </ProtectedRoute>
        }
      />

      {/* === BLUEPRINT === */}
      <Route path="/blueprint" element={<BlueprintIndexPage />} />
      <Route path="/login/skeleton" element={<LoginBlueprintPage />} />
      <Route path="/register/skeleton" element={<RegisterBlueprintPage />} />
      <Route path="/materi/skeleton" element={<MateriBlueprintPage />} />

      {/* === WIREFRAME === */}
      <Route path="/wireframe" element={<WireframeIndexPage />} />
      <Route path="/login/wireframe" element={<LoginWireframePage />} />
      <Route path="/register/wireframe" element={<RegisterWireframePage />} />
      <Route path="/materi/wireframe" element={<MateriWireframePage />} />

      {/* === MOCKUP === */}
      <Route path="/mockup" element={<MockupIndexPage />} />
      <Route path="/login/mockup" element={<LoginMockupPage />} />
      <Route path="/register/mockup" element={<RegisterMockupPage />} />
      <Route path="/materi/mockup" element={<MateriMockupPage />} />

      {/* === DESIGN SYSTEM === */}
      <Route path="/design-system" element={<DesignSystemPage />} />

      {/* ✅ === PREVIEW SKELETON === */}
      <Route path="/preview/skeleton" element={<PreviewSkeletonPage />} />
      
      {/* === UPLOAD MATERI === */}
      <Route path="/dashboard/materi/upload" element={<UploadMateriPage />} />

      {/* Fallback — redirect ke Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}