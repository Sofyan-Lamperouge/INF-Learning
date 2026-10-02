import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import InputField from "../../components/common/InputField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import RegisterSkeleton from "../../components/skeletons/RegisterSkeleton.jsx";

// FE-01 | Registrasi
function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nimNip: "",
    namaLengkap: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Paksa skeleton tampil terus (demo / "gangguan jaringan")
  const [booting] = useState(true);

  // Kalau nanti mau normal, pakai versi ini:
  // const [booting, setBooting] = useState(true);
  // useEffect(() => {
  //   const t = setTimeout(() => setBooting(false), 1500);
  //   return () => clearTimeout(t);
  // }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Gagal terhubung ke server, periksa koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  // ✅ Kunci: saat booting, tampilkan skeleton
  if (booting) return <RegisterSkeleton />;

  return (
    <main className="auth-page">
      <h1>Daftar Akun</h1>
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          label="NIM / NIP"
          name="nimNip"
          value={form.nimNip}
          onChange={handleChange}
          required
        />
        <InputField
          label="Nama Lengkap"
          name="namaLengkap"
          value={form.namaLengkap}
          onChange={handleChange}
          required
        />
        <InputField
          label="Kata Sandi"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <ErrorMessage message={error} />

        <button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
      <p>
        Sudah punya akun? <Link to="/login">Masuk di sini</Link>
      </p>
    </main>
  );
}

export default RegisterPage;