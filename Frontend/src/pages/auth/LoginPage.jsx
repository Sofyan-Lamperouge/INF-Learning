import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { login } from '../../services/authService.js';
import { ApiError } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';

import InputField from '../../components/common/InputField.jsx';
import PasswordField from '../../components/common/PasswordField.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import SuccessMessage from '../../components/common/SuccessMessage.jsx';
import LoginSkeleton from '../../components/skeletons/LoginSkeleton.jsx';

<<<<<<< HEAD
// ❌ HAPUS IMPORT validateNim
=======
import { validateNimLogin } from '../../utils/validators.js';

>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const [form, setForm] = useState({
    nim: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    nim: '',
    password: '',
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
<<<<<<< HEAD
    if (error) setError('');
=======

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    if (serverError) setServerError('');
>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1
    if (success) setSuccess('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
<<<<<<< HEAD
    setError('');
=======

    setServerError('');
>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1
    setSuccess('');

    const nim = form.nim.trim();

<<<<<<< HEAD
    // ✅ VALIDASI BARU: Hanya cek kosong
    const errors = [
      !nim ? 'NIM atau ID Admin wajib diisi.' : '',
      !form.password ? 'Password wajib diisi.' : '',
    ];
=======
    const newErrors = {
      nim: validateNimLogin(nim),
      password: form.password ? '' : 'Password wajib diisi.',
    };
>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    try {
      setLoading(true);

      const result = await login({
        nim,
        password: form.password,
      });

      setSuccess('Login Berhasil! Kamu akan diarahkan...');

      // Simpan sesi login
      loginSuccess(result.token, result.role, result.user);

      // ✅ LOGIKA REDIRECT: Beda halaman untuk Admin dan Mahasiswa
      setTimeout(() => {
        if (result.role === 'admin') {
          navigate('/admin/dashboard', { replace: true }); 
          // Sesuaikan '/admin/dashboard' dengan route frontend kamu nanti
        } else {
          navigate('/materi', { replace: true });
        }
      }, 800);

    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError('Gagal terhubung ke server, periksa koneksi Anda.');
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
<<<<<<< HEAD

          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Masuk untuk mulai belajar.</p>
=======
          <h1 className="auth-title">
            Welcome Back!
          </h1>

          <p className="auth-subtitle">
            Masuk untuk mulai belajar.
          </p>
>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1

          <SuccessMessage message={success} />
          {serverError && <ErrorMessage message={serverError} />}

          <form onSubmit={handleSubmit} noValidate>
<<<<<<< HEAD

            {/* ✅ Ubah label & placeholder agar Admin tahu bisa login di sini */}
            <InputField
              label="NIM / ID Admin"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="Masukkan NIM atau ID Admin"
=======
            {/* Field NIM/NIP */}
            <InputField
              label="NIM/NIP"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="Contoh: 24880100XX"
              error={errors.nim}
>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1
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
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <p className="auth-footer">
<<<<<<< HEAD
            Belum punya akun? <Link to="/register">Buat di sini</Link>
=======
            Belum punya akun? <b>Buat</b>{' '}
            <Link to="/register"> di sini</Link>
>>>>>>> 4c05f8ec4d1cea5215c8cda9e857879c5cd1a5d1
          </p>
        </div>
      </div>
    </main>
  );
}