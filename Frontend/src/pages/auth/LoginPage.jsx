import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '../../services/authService.js';
import { ApiError } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';

import InputField from '../../components/common/InputField.jsx';
import PasswordField from '../../components/common/PasswordField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import SuccessMessage from '../../components/common/SuccessMessage.jsx';

import { validateNim } from '../../utils/validators.js';


export default function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({
    nim: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError('');
    if (success) setSuccess('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');

    const nim = form.nim.trim();

    const errors = [
      validateNim(nim),
      form.password ? '' : 'Password wajib diisi.',
    ];

    const firstError = errors.find(Boolean);

    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        nim,
        password: form.password,
      });

      setSuccess(
        'Login Berhasil! Selamat datang kembali, Kamu akan diarahkan ke halaman utama.'
      );

      loginSuccess(result.token, result.role);

      setTimeout(() => {
        navigate('/materi', { replace: true });
      }, 800);

    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Gagal terhubung ke server, periksa koneksi Anda.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <div className="auth-illustration">
          <img
            src="/assets/INF.png"
            alt="INF-Learning"
          />
        </div>

        <div className="auth-form-col">

          <h1 className="auth-title">
            Welcome Back!
          </h1>

          <p className="auth-subtitle">
            Masuk untuk mulai belajar.
          </p>

          <ErrorMessage message={error} />
          <SuccessMessage message={success} />

          <form onSubmit={handleSubmit} noValidate>

            <InputField
              label="NIM"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="Contoh: 24880100XX"
              required
            />

            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan Password"
            />

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

          </form>

          <p className="auth-footer">
            Belum punya akun?{' '}
            <Link to="/register">Buat di sini</Link>
          </p>

        </div>
      </div>
    </main>
  );
}