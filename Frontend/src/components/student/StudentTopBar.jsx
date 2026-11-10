// src/components/student/StudentTopBar.jsx
// Top bar mahasiswa: logo | menu (Beranda, Materi, Kuis) | kartu pengguna.

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ChevronDownIcon, LogoutIcon } from './StudentIcons.jsx';

const NAV_ITEMS = [
  { to: '/beranda', label: 'Beranda' },
  { to: '/materi', label: 'Materi' },
  { to: '/kuis', label: 'Kuis' },
];

export default function StudentTopBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);

  // Tutup menu pengguna saat klik di luar atau tekan Escape.
  useEffect(() => {
    function handleClickOutside(event) {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate('/', { replace: true });
  }

  const nama = user?.nama || 'Mahasiswa';
  const inisial = nama.trim().charAt(0).toUpperCase();

  return (
    <header className="sd-topbar">
      <Link to="/beranda" className="sd-logo">
        INF<span>orm</span>
      </Link>

      <nav className="sd-nav" aria-label="Menu utama">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sd-user" ref={userRef}>
        <button
          type="button"
          className="sd-user-button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sd-avatar" aria-hidden="true">{inisial}</span>

          <span className="sd-user-info">
            <span className="sd-user-name">{nama}</span>
            <span className="sd-user-role">Mahasiswa</span>
          </span>

          <ChevronDownIcon
            className={`sd-user-chevron${menuOpen ? ' is-open' : ''}`}
          />
        </button>

        {menuOpen && (
          <div className="sd-user-menu" role="menu">
            <button
              type="button"
              role="menuitem"
              className="sd-user-menu-item"
              onClick={handleLogout}
            >
              <LogoutIcon />
              Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}