import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/materi">Platform Belajar Informatika</Link>
      {isAuthenticated ? (
        <span>
          Masuk sebagai {role} <button onClick={logout}>Keluar</button>
        </span>
      ) : (
        <span>
          <Link to="/login">Masuk</Link> | <Link to="/register">Daftar</Link>
        </span>
      )}
    </nav>
  );
}

export default Navbar;
