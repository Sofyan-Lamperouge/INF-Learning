import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  register,
} from "../../services/authService.js";

import {
  ApiError,
} from "../../services/api.js";


function RegisterPage() {

  const navigate =
    useNavigate();


  const [form, setForm] =
    useState({
      namaLengkap: "",
      nimNip: "",
      email: "",
      password: "",
      konfirmasiPassword: "",
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


    if (!form.namaLengkap) {

      setError(
        "Nama lengkap wajib diisi."
      );

      return;
    }


    if (!form.nimNip) {

      setError(
        "NIM/NIP wajib diisi."
      );

      return;
    }


    if (!form.email) {

      setError(
        "Email wajib diisi."
      );

      return;
    }


    if (
      form.password.length < 8
    ) {

      setError(
        "Password minimal 8 karakter."
      );

      return;
    }


    if (
      form.password !==
      form.konfirmasiPassword
    ) {

      setError(
        "Konfirmasi password tidak sama."
      );

      return;
    }


    try {

      setLoading(true);


      await register(form);


      alert(
        "Registrasi berhasil. Silakan login."
      );


      navigate(
        "/login",
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
          "Registrasi gagal."
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
            Get Started!
          </h1>


          <form
            onSubmit={
              handleSubmit
            }
          >

            <label>
              Nama Lengkap
            </label>

            <input
              name="namaLengkap"
              value={
                form.namaLengkap
              }
              onChange={
                handleChange
              }
              placeholder="Nama lengkap"
            />


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
              placeholder="NIM/NIP"
            />


            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              placeholder="nama@email.com"
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
              placeholder="Password"
            />


            <label>
              Konfirmasi Password
            </label>

            <input
              type="password"
              name="konfirmasiPassword"
              value={
                form.konfirmasiPassword
              }
              onChange={
                handleChange
              }
              placeholder="Ulangi password"
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
                ? "Mendaftarkan..."
                : "Daftar"}

            </button>

          </form>


          <p>

            Sudah punya akun?{" "}

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

    </main>
  );
}


export default RegisterPage;