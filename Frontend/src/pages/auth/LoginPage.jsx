import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";
import InputField from "../../components/common/InputField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import LoginSkeleton from "../../components/skeletons/LoginSkeleton.jsx";

// FE-02 | Login Tanpa Pemilihan Role
function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();
  const [form, setForm] = useState({ nimNip: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ SELALU TRUE → skeleton tampil terus (mode demo / "gangguan jaringan")
  const [booting] = useState(true);

  // Kalau nanti mau kembalikan ke normal, pakai versi ini:
  // const [booting, setBooting] = useState(true);
  // useEffect(() => {
  //   const t = setTimeout(() => setBooting(false), 2000);
  //   return () => clearTimeout(t);
  // }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, role } = await login(form);
      loginSuccess(token, role);
      navigate("/materi");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Gagal terhubung ke server, periksa koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ Kunci: saat booting, tampilkan skeleton
  if (booting) return <LoginSkeleton />;

  return (
    <main className="auth-page">
      <h1>Masuk</h1>
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          label="NIM / NIP"
          name="nimNip"
          value={form.nimNip}
          onChange={handleChange}
          required
        />
        <InputField
          label="Kata Sandi"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <ErrorMessage message={error} />

        <button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </main>
  );
}

export default LoginPage;