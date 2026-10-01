import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import MateriListPage from "./pages/materi/MateriListPage.jsx";
import { useAuth } from "./hooks/useAuth.js";

// Setiap route di bawah ini berkorespondensi langsung ke satu kartu
// Product Backlog Frontend:
//   /register  -> FE-01 Tampilan Role Otomatis di Registrasi
//   /login     -> FE-02 Login Tanpa Pemilihan Role
//   /materi    -> FE-03 Halaman Daftar Topik Materi per Kategori
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/materi"
          element={isAuthenticated ? <MateriListPage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
