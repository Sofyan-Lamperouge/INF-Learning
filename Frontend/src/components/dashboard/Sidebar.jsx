// src/components/dashboard/Sidebar.jsx
// Sidebar dashboard admin

import { useState, useEffect } from "react"; // ✅ 1. Tambahkan import useState & useEffect
import { Link, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu.jsx";
import SidebarUser from "./SidebarUser.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import SidebarSkeleton from "../skeletons/SidebarSkeleton.jsx";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sembunyikan skeleton setelah 1 detik
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Pindahkan handleLogout ke ATAS if(loading) agar tidak melanggar aturan React Hooks
  function handleLogout() {
    logout();
    navigate("./pages/LandingPage", { replace: true });
  }

  // ✅ 3. Pengecekan loading diletakkan setelah semua fungsi dideklarasikan
  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="sidebar">
      {/* === LOGO (Teks) === */}
      <div className="sidebar-brand">
        <Link to="/dashboard" className="sidebar-logo">
          <span className="sidebar-logo-text">
            INF<span className="sidebar-logo-accent">orm</span>
          </span>
          <span className="sidebar-logo-tagline">
            Learning Management System
          </span>
        </Link>
      </div>

      <div className="sidebar-divider"></div>

      {/* === MENU === */}
      <SidebarMenu />

      <div className="sidebar-divider"></div>

      {/* === TOMBOL KELUAR === */}
      <button type="button" className="sidebar-logout" onClick={handleLogout}>
        <span className="sidebar-logout-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>
        <span className="sidebar-logout-label">Keluar</span>
      </button>

      <div className="sidebar-divider"></div>

      {/* === USER CARD === */}
      <SidebarUser />
    </aside>
  );
}