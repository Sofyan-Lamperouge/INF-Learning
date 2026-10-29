import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../services/authService.js';
import { ApiError } from '../../services/api.js';
import InputField from '../../components/common/InputField.jsx';
import PasswordField from '../../components/common/PasswordField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import SuccessMessage from '../../components/common/SuccessMessage.jsx';
import RegisterSkeleton from '../../components/skeletons/RegisterSkeleton.jsx';
import { validateNim, validatePassword } from '../../utils/validators.js';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ nim: '', password: '' });
  const [errors, setErrors] = useState({ nim: '', password: '' });
  const [touched, setTouched] = useState({ nim: false, password: false });
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  function validateField(name, value) {
    const errorMessage =
      name === 'nim'
        ? validateNim(value)
        : name === 'password'
          ? validatePassword(value)
          : '';

    setErrors((current) => ({ ...current, [name]: errorMessage }));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setTouched((current) => ({ ...current, [name]: true }));
    validateField(name, value);
    setServerError('');
    setSuccess('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    setSuccess('');

    const nim = form.nim.trim();
    const nextErrors = {
      nim: validateNim(nim),
      password: validatePassword(form.password),
    };

    setErrors(nextErrors);
    setTouched({ nim: true, password: true });

    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      setLoading(true);

      await register({
        nim,
        password: form.password,
        konfirmasiPassword: form.password,
      });

      setSuccess(
        <>
          <strong>Daftar Berhasil!</strong> Selamat bergabung{' '}
          <strong>Mahasiswa</strong>. Kamu akan diarahkan ke halaman login.
        </>,
      );

      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (error) {
      console.error('Registrasi gagal:', error);

      setServerError(
        error instanceof ApiError ? error.message : 'Aktivasi gagal.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (booting) return <RegisterSkeleton />;

  return (
    <main className="auth-page">
      <div className="auth-layout">
        {success && (
          <div className="auth-notification">
            <SuccessMessage message={success} />
          </div>
        )}

        <section className="auth-card auth-card--register">
          <div className="auth-illustration">
            <img
              src="/assets/INForm.png"
              alt="INF-orm Learning Management System"
            />
          </div>

          <div className="auth-form-col">
            <div className="auth-form-top">
              <h1 className="auth-title">Get Started!</h1>

              {serverError && <ErrorMessage message={serverError} />}

              <form onSubmit={handleSubmit} noValidate>
                <InputField
                  label="NIM"
                  name="nim"
                  value={form.nim}
                  onChange={handleChange}
                  placeholder="Contoh: 24880100XX"
                  error={touched.nim ? errors.nim : ''}
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
                  placeholder="Masukkan Password"
                  error={touched.password ? errors.password : ''}
                  showStrength
                />

                {touched.password && errors.password && (
                  <ErrorMessage message={errors.password} variant="field" />
                )}

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Mendaftar...' : 'Daftar'}
                </button>
              </form>
            </div>

            <p className="auth-footer">
              Sudah punya akun? Masuk{' '}
              <Link to="/login">di sini</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}