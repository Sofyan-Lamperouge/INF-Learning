// src/components/dashboard/Sidebar.jsx
// Sidebar dashboard admin

import { Link, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu.jsx";
import SidebarUser from "./SidebarUser.jsx";
import { useAuth } from "../../hooks/useAuth.js";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
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
