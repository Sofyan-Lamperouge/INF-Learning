import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { register } from '../../services/authService.js';
import { ApiError } from '../../services/api.js';

import InputField from '../../components/common/InputField.jsx';
import PasswordField from '../../components/common/PasswordField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import SuccessMessage from '../../components/common/SuccessMessage.jsx';
import RegisterSkeleton from '../../components/skeletons/RegisterSkeleton.jsx';

import {
  validateNim,
  validatePassword,
  validateKonfirmasiPassword,
} from '../../utils/validators.js';


export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nim: '',
    password: '',
    konfirmasiPassword: '',
  });

  const [errors, setErrors] = useState({
    nim: '',
    password: '',
    konfirmasiPassword: '',
  });

  const [touched, setTouched] = useState({
    nim: false,
    password: false,
    konfirmasiPassword: false,
  });

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

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setTouched((current) => ({
      ...current,
      [name]: true,
    }));

    validateField(name, value);

    if (serverError) setServerError('');
    if (success) setSuccess('');
  }

  function validateField(name, value) {
    let errorMsg = '';

    switch (name) {
      case 'nim':
        errorMsg = validateNim(value);
        break;
      case 'password':
        errorMsg = validatePassword(value);
        break;
      case 'konfirmasiPassword':
        errorMsg = validateKonfirmasiPassword(form.password, value);
        break;
      default:
        break;
    }

    setErrors((current) => ({
      ...current,
      [name]: errorMsg,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setServerError('');
    setSuccess('');

    const nim = form.nim.trim();

    const newErrors = {
      nim: validateNim(nim),
      password: validatePassword(form.password),
      konfirmasiPassword: validateKonfirmasiPassword(
        form.password,
        form.konfirmasiPassword
      ),
    };

    setErrors(newErrors);

    setTouched({
      nim: true,
      password: true,
      konfirmasiPassword: true,
    });

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    try {
      setLoading(true);

      await register({
        nim,
        password: form.password,
        konfirmasiPassword: form.konfirmasiPassword,
      });

      setSuccess(
        'Aktivasi berhasil. Mengarahkan ke halaman login...'
      );

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 800);

    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Aktivasi gagal.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (booting) {
    return <RegisterSkeleton />;
  }

  // ... kode di atasnya tetap sama ...

  return (
    <main className="auth-page">
      {/* ❌ TAG <img> BACKGROUND SUDAH DIHAPUS */}

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

          <SuccessMessage message={success} />
          {serverError && <ErrorMessage message={serverError} />}

          <form onSubmit={handleSubmit} noValidate>
            {/* Field NIM */}
            <InputField
              label="NIM"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="Masukkan NIM (10 digit)"
              error={touched.nim ? errors.nim : ''}
              required
            />
            {touched.nim && errors.nim && (
              <ErrorMessage message={errors.nim} variant="field" />
            )}

            {/* Field Password */}
            <PasswordField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 Karakter, 1 Angka, 1 Simbol"
              error={touched.password ? errors.password : ''}
              showStrength
            />
            {touched.password && errors.password && (
              <ErrorMessage message={errors.password} variant="field" />
            )}

            {/* Field Konfirmasi Password */}
            <PasswordField
              label="Konfirmasi Password"
              name="konfirmasiPassword"
              value={form.konfirmasiPassword}
              onChange={handleChange}
              placeholder="Ulangi Password"
              error={
                touched.konfirmasiPassword ? errors.konfirmasiPassword : ''
              }
            />
            {touched.konfirmasiPassword && errors.konfirmasiPassword && (
              <ErrorMessage
                message={errors.konfirmasiPassword}
                variant="field"
              />
            )}

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Mengaktifkan...' : 'Aktivasi'}
            </button>
          </form>

          <p className="auth-footer">
            Sudah punya akun? <strong>Masuk</strong>{' '}
            <Link to="/login">disini</Link>
          </p>
        </div>
      </div>
    </main>
  );
}