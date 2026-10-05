import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Platform Belajar Informatika
      </Link>
      <div className="navbar-links">
        <Link to="/login">Login</Link>
        <span className="navbar-sep"> | </span>
        <Link to="/register">Registrasi</Link>
      </div>
    </nav>
  );
}