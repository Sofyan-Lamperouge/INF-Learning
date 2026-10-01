import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";
import InputField from "../../components/common/InputField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

// FE-02 | Login Tanpa Pemilihan Role
// AC: tidak ada dropdown/input role dalam bentuk apa pun di halaman ini.
// Role diambil dari respons Backend, lalu dipakai untuk redirect ke
// halaman daftar materi (FE-03) yang sama untuk Mahasiswa maupun Dosen.
function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();
  const [form, setForm] = useState({ nimNip: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        setError(err.message); // contoh: "NIM/NIP atau kata sandi salah"
      } else {
        setError("Gagal terhubung ke server, periksa koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

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

        {/* Sengaja TIDAK ADA dropdown/select role di sini -- lihat AC */}

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
