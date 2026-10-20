import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";

import InputField from "../../components/common/InputField.jsx";
import PasswordField from "../../components/common/PasswordField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import SuccessMessage from "../../components/common/SuccessMessage.jsx";
import LoginSkeleton from "../../components/skeletons/LoginSkeleton.jsx";

import { validateNimLogin } from "../../utils/validators.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({
    nim: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    nim: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    if (serverError) setServerError("");
    if (success) setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError("");
    setSuccess("");

    const nim = form.nim.trim();

    const newErrors = {
      nim: validateNimLogin(nim),
      password: form.password ? "" : "Password wajib diisi.",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    try {
      setLoading(true);

      const result = await login({
        nim,
        password: form.password,
      });

      setSuccess(
        "Login Berhasil! Selamat datang kembali, Kamu akan diarahkan ke halaman utama.",
      );

      loginSuccess(result.token, result.role);

      setTimeout(() => {
        // ✅ PERBAIKAN: Cek role sebelum pindah halaman
        if (result.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/materi", { replace: true });
        }
      }, 800);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Gagal terhubung ke server, periksa koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (booting) {
    return <LoginSkeleton />;
  }

  // ... kode di atasnya tetap sama ...

  return (
    <main className="auth-page">
      {/* ❌ TAG <img> BACKGROUND SUDAH DIHAPUS */}

      <div className="auth-card">
        <div className="auth-illustration">
          <img src="/assets/INF.png" alt="INF-Learning" />
        </div>

        <div className="auth-form-col">
          <h1 className="auth-title">Welcome Back!</h1>

          <p className="auth-subtitle">Masuk untuk mulai belajar.</p>

          <SuccessMessage message={success} />
          {serverError && <ErrorMessage message={serverError} />}

          <form onSubmit={handleSubmit} noValidate>
            {/* Field NIM/NIP */}
            <InputField
              label="NIM/NIP"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="Contoh: 24880100XX"
              error={errors.nim}
              required
            />
            {errors.nim && (
              <ErrorMessage message={errors.nim} variant="field" />
            )}

            {/* Field Password */}
            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
              error={errors.password}
            />
            {errors.password && (
              <ErrorMessage message={errors.password} variant="field" />
            )}

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="auth-footer">
            Belum punya akun? <b>Buat</b> <Link to="/register"> di sini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
