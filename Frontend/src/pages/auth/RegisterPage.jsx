import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService.js";
import { ApiError } from "../../services/api.js";
import InputField from "../../components/common/InputField.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

// FE-01 | Tampilan Role Otomatis di Registrasi
// AC: tidak ada dropdown/input role di halaman ini sama sekali.
// Role hanya muncul di NOTIFIKASI setelah Backend merespons sukses.
function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nimNip: "", nama: "", password: "" });
  const [error, setError] = useState("");
  const [successRole, setSuccessRole] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessRole(null);
    setLoading(true);
    try {
      // TIDAK ADA field role dikirim di sini -- sesuai AC-4 (role dari
      // request diabaikan), field ini memang sengaja tidak pernah ada.
      const result = await register(form);
      setSuccessRole(result.role); // "Mahasiswa" atau "Dosen"
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message); // contoh: "Format NIM/NIP tidak dikenali"
      } else {
        setError("Gagal terhubung ke server, periksa koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

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
          name="nama"
          value={form.nama}
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

        {/* Sengaja TIDAK ADA dropdown/select role di sini -- lihat AC-1 */}

        <ErrorMessage message={error} />
        {successRole && (
          <p className="success-message">
            Akun berhasil dibuat sebagai {successRole}
          </p>
        )}

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
