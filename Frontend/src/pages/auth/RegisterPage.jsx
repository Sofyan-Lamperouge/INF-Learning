import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../services/authService.js';
import { ApiError } from '../../services/api.js';

import InputField from '../../components/common/InputField.jsx';
import PasswordField from '../../components/common/PasswordField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import SuccessMessage from '../../components/common/SuccessMessage.jsx';

import {
  validateNamaLengkap,
  validateNimNip,
  validatePassword,
  validateKonfirmasiPassword,
} from '../../utils/validators.js';


export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    namaLengkap: '',
    nimNip: '',
    password: '',
    konfirmasiPassword: '',
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

    const namaLengkap = form.namaLengkap.trim();
    const nimNip = form.nimNip.trim();

    const errors = [
      validateNamaLengkap(namaLengkap),
      validateNimNip(nimNip),
      validatePassword(form.password),
      validateKonfirmasiPassword(
        form.password,
        form.konfirmasiPassword
      ),
    ];

    const firstError = errors.find(Boolean);

    if (firstError) {
      setError(firstError);
      return;
    }

    try {
      setLoading(true);

      await register({
        namaLengkap,
        nimNip,
        password: form.password,
        konfirmasiPassword: form.konfirmasiPassword,
      });

      setSuccess(
        'Registrasi berhasil. Mengarahkan ke halaman login...'
      );

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 800);

    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Registrasi gagal.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card auth-card--register">

        <div className="auth-illustration">
          <img
            src="/assets/INF.png"
            alt="INF-Learning"
          />
        </div>

        <div className="auth-form-col">

          <h1 className="auth-title">
            Get Started!
          </h1>

          {/* Subtitle DIHAPUS */}

          <ErrorMessage message={error} />
          <SuccessMessage message={success} />

          <form onSubmit={handleSubmit} noValidate>

            <InputField
              label="Nama Lengkap"
              name="namaLengkap"
              value={form.namaLengkap}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />

            <InputField
              label="NIM/NIP"
              name="nimNip"
              value={form.nimNip}
              onChange={handleChange}
              placeholder="Masukkan NIM/NIP"
              required
            />

            {/* Field Email DIHAPUS */}

            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimal 8 karakter"
            />

            <PasswordField
              label="Konfirmasi Password"
              name="konfirmasiPassword"
              value={form.konfirmasiPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
            />

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Mendaftarkan...' : 'Daftar'}
            </button>

          </form>

          <p className="auth-footer">
            Sudah punya akun?{' '}
            <Link to="/login">Login</Link>
          </p>

        </div>
      </div>
    </main>
  );
}