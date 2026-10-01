import { api } from "./api.js";

// Endpoint di bawah ini adalah "kontrak" antara Frontend dan Backend
// untuk story FE-01 (Registrasi) dan FE-02 (Login). Sengaja TIDAK ada
// parameter "role" yang dikirim dari sini sama sekali -- role murni
// ditentukan Backend dari pola NIM/NIP, sesuai AC yang sudah disepakati.

export function register({ nimNip, nama, password }) {
  // Backend diharapkan merespons 201 dengan { role: "Mahasiswa" | "Dosen" }
  // atau 422 dengan { message: "Format NIM/NIP tidak dikenali" }
  return api.post("/register", { nimNip, nama, password });
}

export function login({ nimNip, password }) {
  // Backend diharapkan merespons 200 dengan { token, role }
  // atau 401 dengan { message: "NIM/NIP atau kata sandi salah" }
  return api.post("/login", { nimNip, password });
}
