// src/mocks/mockApi.js
// Mock API — meniru respons backend untuk development.
// Aktif hanya jika VITE_USE_MOCK=true.

import { MOCK_USERS, MOCK_MATERI } from "./users.js";
import { ApiError } from "../services/api.js";

// Simulasi delay network (ms)
const DELAY = 800;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================================================
   POST /auth/login
   Request:  { nimNip, password }
   Response: { token, role }
   ============================================================ */
export async function mockLogin({ nimNip, password }) {
  await delay(DELAY);

  const user = MOCK_USERS.find(
    (u) => u.nimNip === nimNip && u.password === password
  );

  if (!user) {
    throw new ApiError("NIM/NIP atau password salah", 401);
  }

  return {
    token: "mock-token-" + Date.now(),
    role: user.role,
  };
}

/* ============================================================
   POST /auth/register
   Request:  { namaLengkap, nimNip, password }
   Response: { message }
   ============================================================ */
export async function mockRegister({ namaLengkap, nimNip, password }) {
  await delay(DELAY);

  const exists = MOCK_USERS.some((u) => u.nimNip === nimNip);
  if (exists) {
    throw new ApiError("NIM/NIP sudah terdaftar", 409);
  }

  // Di backend asli, data akan disimpan ke database
  // Di mock, kita cuma return sukses
  return {
    message: "Registrasi berhasil",
    user: { namaLengkap, nimNip },
  };
}

/* ============================================================
   GET /auth/me
   Header: Authorization: Bearer <token>
   Response: { user }
   ============================================================ */
export async function mockGetMe(token) {
  await delay(400);

  if (!token || !token.startsWith("mock-token-")) {
    throw new ApiError("Token tidak valid", 401);
  }

  return {
    user: { namaLengkap: "Budi Santoso", role: "mahasiswa" },
  };
}

/* ============================================================
   GET /materi
   Response: [{ id, judul, deskripsi, pengajar }]
   ============================================================ */
export async function mockGetMateri() {
  await delay(500);
  return MOCK_MATERI;
}