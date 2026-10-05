import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import InputField from "../../components/common/InputField.jsx";
import PasswordField from "../../components/common/PasswordField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import SuccessMessage from "../../components/common/SuccessMessage.jsx";
import RegisterSkeleton from "../../components/skeletons/RegisterSkeleton.jsx";
import {
  validateNimNip,
  validateNamaLengkap,
  validatePassword,
} from "../../utils/validators.js";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nimNip: "",
    namaLengkap: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
    const eNim = validateNimNip(form.nimNip);
    const eNama = validateNamaLengkap(form.namaLengkap);
    const ePwd = validatePassword(form.password);
    if (eNim) next.nimNip = eNim;
    if (eNama) next.namaLengkap = eNama;
    if (ePwd) next.password = ePwd;
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
      await register(form);
      setSuccess("Registrasi berhasil! Silakan masuk.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      if (err instanceof ApiError) setServerError(err.message);
      else setServerError("Gagal terhubung ke server, periksa koneksi Anda.");
    } finally {
      setLoading(false);
    }
  }

  if (booting) return <RegisterSkeleton />;

  return (
    <>
      {success && <SuccessMessage message={success} />}

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-illustration" aria-hidden="true"></div>

          <div className="auth-form-col">
            <h1 className="auth-title">Daftar Akun</h1>
            <p className="auth-subtitle">Buat akun untuk mulai belajar.</p>

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

              <InputField
                label="Nama Lengkap"
                name="namaLengkap"
                value={form.namaLengkap}
                onChange={handleChange}
                placeholder="Masukkan Nama Lengkap"
                error={errors.namaLengkap}
                required
              />
              {errors.namaLengkap && (
                <ErrorMessage message={errors.namaLengkap} />
              )}

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
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </form>

            <p className="auth-footer">
              Sudah punya akun? <Link to="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default RegisterPage;