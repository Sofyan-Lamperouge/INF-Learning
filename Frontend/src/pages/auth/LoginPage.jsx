import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  login,
} from '../../services/authService.js';

import {
  ApiError,
} from '../../services/api.js';

import {
  useAuth,
} from '../../hooks/useAuth.js';

import InputField from
  '../../components/common/InputField.jsx';

import PasswordField from
  '../../components/common/PasswordField.jsx';

import ErrorMessage from
  '../../components/common/ErrorMessage.jsx';


export default function LoginPage() {
  const navigate =
    useNavigate();


  const {
    loginSuccess,
  } = useAuth();


  const [form, setForm] =
    useState({
      nimNip: '',
      password: '',
    });


  const [error, setError] =
    useState('');


  const [loading, setLoading] =
    useState(false);


  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;


    setForm(
      (current) => ({
        ...current,

        [name]: value,
      })
    );


    if (error) {
      setError('');
    }
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setError('');


    const nimNip =
      form.nimNip.trim();


    if (!nimNip) {
      setError(
        'NIM/NIP wajib diisi.'
      );

      return;
    }


    if (!form.password) {
      setError(
        'Password wajib diisi.'
      );

      return;
    }


    try {
      setLoading(true);


      const result =
        await login({
          nimNip,
          password:
            form.password,
        });


      loginSuccess(
        result.token,
        result.role,
        result.user
      );


      navigate(
        '/materi',
        {
          replace: true,
        }
      );

    } catch (err) {

      if (
        err instanceof ApiError
      ) {
        setError(
          err.message
        );
      } else {
        setError(
          'Terjadi kesalahan pada server.'
        );
      }

    } finally {
      setLoading(false);
    }
  }


  return (
    <main
      className="auth-page"
    >

      <div
        className="auth-card"
      >

        <div
          className="auth-illustration"
        >
          <img
            src="/assets/INF.png"
            alt="INF-Learning"
          />
        </div>


        <div
          className="auth-form-col"
        >

          <h1
            className="auth-title"
          >
            Welcome Back!
          </h1>


          <p
            className="auth-subtitle"
          >
            Masuk untuk mulai
            belajar.
          </p>


          <ErrorMessage
            message={error}
          />


          <form
            onSubmit={
              handleSubmit
            }
            noValidate
          >

            <InputField
              label="NIM/NIP"
              name="nimNip"
              value={
                form.nimNip
              }
              onChange={
                handleChange
              }
              placeholder="Masukkan NIM/NIP"
              required
            />


            <PasswordField
              label="Password"
              name="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Masukkan password"
            />


            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Memproses...'
                : 'Masuk'}
            </button>

          </form>


          <p
            className="auth-footer"
          >
            Belum punya akun?{' '}

            <Link
              to="/register"
            >
              Daftar
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}