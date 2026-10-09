// src/mocks/mockApi.js
// Mock API — meniru respons backend untuk development.
// Aktif hanya jika VITE_USE_MOCK=true.

import { MOCK_USERS, MOCK_MATERI } from './users.js';
import { ApiError } from '../services/api.js';

const DELAY = 800;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================================================
   POST /auth/login
   Request:  { nim, password }
   Response: { token, role, user, expiresIn }
   ============================================================ */
export async function mockLogin({ nim, password }) {
  await delay(DELAY);

  const user = MOCK_USERS.find(
    (u) => u.nim === nim && u.password === password
  );

  if (!user) {
    throw new ApiError('NIM atau password salah', 401);
  }

  return {
    token: 'mock-token-' + Date.now(),
    role: user.role,
    user: {
      id: user.id,
      namaLengkap: user.namaLengkap,
      nim: user.nim,
      role: user.role,
    },
    expiresIn: 3600,
  };
}

/* ============================================================
   POST /auth/register
   Request:  { namaLengkap, nim, password }
   Response: { message, user }
   ============================================================ */
export async function mockRegister({ namaLengkap, nim, password }) {
  await delay(DELAY);

  const exists = MOCK_USERS.some((u) => u.nim === nim);
  if (exists) {
    throw new ApiError('NIM sudah terdaftar', 409);
  }

  return {
    message: 'Registrasi berhasil',
    user: { namaLengkap, nim },
  };
}

/* ============================================================
   GET /auth/me
   ============================================================ */
export async function mockGetMe(token) {
  await delay(400);

  if (!token || !token.startsWith('mock-token-')) {
    throw new ApiError('Token tidak valid', 401);
  }

  return {
    user: { namaLengkap: 'Budi Santoso', role: 'mahasiswa' },
  };
}

/* ============================================================
   GET /materi
   ============================================================ */
export async function mockGetMateri() {
  await delay(500);
  return MOCK_MATERI;
}