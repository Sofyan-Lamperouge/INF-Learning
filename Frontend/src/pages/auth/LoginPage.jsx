import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";
import InputField from "../../components/common/InputField.jsx";
import PasswordField from "../../components/common/PasswordField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import SuccessMessage from "../../components/common/SuccessMessage.jsx";
import LoginSkeleton from "../../components/skeletons/LoginSkeleton.jsx";
import { validateNimNip } from "../../utils/validators.js";

function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({ nimNip: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Skeleton muncul 800ms saat pertama kali halaman dibuka
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(t);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  }

  function validate() {
    const next = {};
    const nimErr = validateNimNip(form.nimNip);
    if (nimErr) next.nimNip = nimErr;
    if (!form.password) next.password = "Password Salah!";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      const { token, role } = await login(form);
      setSuccess(
        "Login Berhasil! Selamat datang kembali, Kamu akan diarahkan ke halaman utama."
      );
      loginSuccess(token, role);
      setTimeout(() => navigate("/materi"), 1200);
    } catch (err) {
      if (err instanceof ApiError) setServerError(err.message);
      else setServerError("Gagal terhubung ke server, periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  }

  if (booting) return <LoginSkeleton />;

  return (
    <>
      {success && <SuccessMessage message={success} />}

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-illustration" aria-hidden="true"></div>

          <div className="auth-form-col">
            <h1 className="auth-title">Welcome Back!</h1>
            <p className="auth-subtitle">Masuk untuk mulai belajar.</p>

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                label="NIM/NIP"
                name="nimNip"
                value={form.nimNip}
                onChange={handleChange}
                placeholder="Contoh: 24880100XX"
                error={errors.nimNip}
                required
              />
              {errors.nimNip && <ErrorMessage message={errors.nimNip} />}

              <PasswordField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Masukkan Password"
                error={errors.password}
              />
              {errors.password && <ErrorMessage message={errors.password} />}

              {serverError && <ErrorMessage message={serverError} />}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>

            <p className="auth-footer">
              Belum punya akun? <Link to="/register">Buat di sini</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default LoginPage;