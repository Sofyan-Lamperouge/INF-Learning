import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import MateriListPage from './pages/materi/MateriListPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

// Blueprint pages
import BlueprintIndexPage from './pages/BlueprintIndexPage.jsx';
import LoginBlueprintPage from './pages/auth/LoginBlueprintPage.jsx';
import RegisterBlueprintPage from './pages/auth/RegisterBlueprintPage.jsx';
import MateriBlueprintPage from './pages/materi/MateriBlueprintPage.jsx';


export default function App() {
  return (
    <Routes>
      {/* Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Halaman Final */}
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

      {/* === BLUEPRINT ROUTES (Low-Fidelity Skeleton) === */}
      <Route path="/blueprint" element={<BlueprintIndexPage />} />
      <Route path="/login/skeleton" element={<LoginBlueprintPage />} />
      <Route path="/register/skeleton" element={<RegisterBlueprintPage />} />
      <Route path="/materi/skeleton" element={<MateriBlueprintPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}