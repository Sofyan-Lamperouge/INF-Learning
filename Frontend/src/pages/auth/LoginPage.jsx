import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '../../services/authService.js';
import { ApiError } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';
import InputField from '../../components/common/InputField.jsx';
import PasswordField from '../../components/common/PasswordField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import SuccessMessage from '../../components/common/SuccessMessage.jsx';
import LoginSkeleton from '../../components/skeletons/LoginSkeleton.jsx';
import { validateNimLogin } from '../../utils/validators.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({ nim: '', password: '' });
  const [errors, setErrors] = useState({ nim: '', password: '' });
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
    setSuccess('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccess('');

    const nim = form.nim.trim();
    const nextErrors = {
      nim: validateNimLogin(nim),
      password: form.password ? '' : 'Password wajib diisi.',
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      setLoading(true);

      const result = await login({
        nim,
        password: form.password,
      });

      setSuccess(
        <>
          <strong>Login Berhasil!</strong> Selamat datang kembali. Kamu akan
          {' '}diarahkan ke halaman utama.
        </>,
      );

      loginSuccess(result.token, result.role, result.user);

      setTimeout(() => {
        navigate(
          result.role === 'admin' ? '/dashboard' : '/materi',
          { replace: true },
        );
      }, 1200);
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : 'Gagal terhubung ke server, periksa koneksi Anda.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (booting) return <LoginSkeleton />;

  return (
    <main className="auth-page">
      <div className="auth-layout">
        {success && (
          <div className="auth-notification">
            <SuccessMessage message={success} />
          </div>
        )}

        <section className="auth-card">
          <div className="auth-illustration">
            <img
              src="/assets/INForm.png"
              alt="INF-orm Learning Management System"
            />
          </div>

          <div className="auth-form-col">
            <div className="auth-form-top">
              <h1 className="auth-title">Welcome Back!</h1>
              <p className="auth-subtitle">Masuk untuk mulai belajar.</p>

              {serverError && <ErrorMessage message={serverError} />}

              <form onSubmit={handleSubmit} noValidate>
                <InputField
                  label="NIM"
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

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Masuk'}
                </button>
              </form>
            </div>

            <p className="auth-footer">
              Belum punya akun? <strong>Buat</strong>{' '}
              <Link to="/register">di sini</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}