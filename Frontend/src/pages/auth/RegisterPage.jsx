// Frontend/src/pages/auth/RegisterPage.jsx
//
// [DIUBAH] Hanya merapikan logika (tampilan/markup sama persis):
//  - Hapus navigate("/login") + setTimeout yang ditulis dua kali.
//  - Hapus blok cek `hasError` yang duplikat.
//  - Tambah console.error(err) supaya error non-ApiError tidak hilang diam-diam.

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";

import InputField from "../../components/common/InputField.jsx";
import PasswordField from "../../components/common/PasswordField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import SuccessMessage from "../../components/common/SuccessMessage.jsx";
import RegisterSkeleton from "../../components/skeletons/RegisterSkeleton.jsx";

import { validateNim, validatePassword } from "../../utils/validators.js";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nim: "", password: "" });
  const [errors, setErrors] = useState({ nim: "", password: "" });
  const [touched, setTouched] = useState({ nim: false, password: false });

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

    setForm((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    validateField(name, value);

    if (serverError) setServerError("");
    if (success) setSuccess("");
  }

  function validateField(name, value) {
    let errorMsg = "";

    switch (name) {
      case "nim":
        errorMsg = validateNim(value);
        break;
      case "password":
        errorMsg = validatePassword(value);
        break;
      default:
        break;
    }

    setErrors((current) => ({ ...current, [name]: errorMsg }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError("");
    setSuccess("");

    const nim = form.nim.trim();

    const newErrors = {
      nim: validateNim(nim),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    setTouched({ nim: true, password: true });

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      setLoading(true);

      await register({
        nim,
        password: form.password,
        konfirmasiPassword: form.password, // 1 kolom password -> dipakai untuk 2 field
      });

      setSuccess("Aktivasi berhasil. Mengarahkan ke halaman login...");
      setTimeout(() => navigate("/login", { replace: true }), 800); // [DIUBAH] cukup sekali
    } catch (err) {
      console.error("Registrasi gagal:", err); // [BARU]

      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Aktivasi gagal.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (booting) {
    return <RegisterSkeleton />;
  }

  return (
    <main className="auth-page">
      <div className="auth-card auth-card--register">
        <div className="auth-illustration">
          <img src="/assets/INF.png" alt="INF-Learning" />
        </div>

        <div className="auth-form-col">
          <div className="auth-form-top">
            <h1 className="auth-title">Get Started!</h1>

            <SuccessMessage message={success} />
            {serverError && <ErrorMessage message={serverError} />}

            <form onSubmit={handleSubmit} noValidate>
              <InputField
                label="NIM"
                name="nim"
                value={form.nim}
                onChange={handleChange}
                placeholder="Contoh: 24880100XX"
                error={touched.nim ? errors.nim : ""}
                required
              />
              {touched.nim && errors.nim && (
                <ErrorMessage message={errors.nim} variant="field" />
              )}

              <PasswordField
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Masukan Password"
                error={touched.password ? errors.password : ""}
                showStrength
              />
              {touched.password && errors.password && (
                <ErrorMessage message={errors.password} variant="field" />
              )}

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Mendaftar..." : "Daftar"}
              </button>
            </form>
          </div>

          <p className="auth-footer">
            Sudah punya akun? <strong>Masuk</strong>{" "}
            <Link to="/login">disini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
