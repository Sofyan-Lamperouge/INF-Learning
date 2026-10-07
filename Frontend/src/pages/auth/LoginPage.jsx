import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  login,
} from "../../services/authService.js";

import {
  ApiError,
} from "../../services/api.js";

import {
  useAuth,
} from "../../hooks/useAuth.js";


function LoginPage() {

  const navigate =
    useNavigate();

  const {
    loginSuccess,
  } = useAuth();


  const [form, setForm] =
    useState({
      nimNip: "",
      password: "",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  function handleChange(event) {

    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });

    setError("");
  }


  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    setError("");


    if (!form.nimNip) {

      setError(
        "NIM/NIP wajib diisi."
      );

      return;
    }


    if (!form.password) {

      setError(
        "Password wajib diisi."
      );

      return;
    }


    try {

      setLoading(true);


      const result =
        await login(form);


      loginSuccess(
        result.token,
        result.role,
        result.user
      );


      navigate(
        "/materi",
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
          "Terjadi kesalahan pada server."
        );
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

          <h1>
            Welcome Back!
          </h1>

          <p>
            Masuk untuk mulai belajar.
          </p>


          <form
            onSubmit={
              handleSubmit
            }
          >

            <label>
              NIM/NIP
            </label>

            <input
              name="nimNip"
              value={
                form.nimNip
              }
              onChange={
                handleChange
              }
              placeholder="Masukkan NIM/NIP"
            />


            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Masukkan password"
            />


            {error && (

              <p
                role="alert"
                style={{
                  color: "red",
                }}
              >
                {error}
              </p>

            )}


            <button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Memproses..."
                : "Masuk"}

            </button>

          </form>


          <p>

            Belum punya akun?{" "}

            <Link to="/register">
              Daftar
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}


export default LoginPage;