// src/mocks/mockApi.js

import { MOCK_USERS, MOCK_MATERI } from './users.js';
import { ApiError } from '../services/api.js';

const DELAY = 800;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ============================================================
   POST /auth/login
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
      nama: user.nama,
      nomor_induk: user.nim,
      peran: user.role,
      status: 'aktif',
    },
    expiresIn: 3600,
  };
}

/* ============================================================
   POST /auth/registrasi (Aktivasi Akun)
   ✅ Validasi konfirmasi kata sandi
   ============================================================ */
export async function mockRegister({
  nim,
  password,
  konfirmasiPassword,
}) {
  await delay(DELAY);

  if (!/^2\d88\d{6}$/.test(nim)) {
    throw new ApiError('Format NIM tidak dikenali', 422);
  }

  if (password !== konfirmasiPassword) {
    throw new ApiError('Konfirmasi kata sandi tidak cocok', 422);
  }

  const exists = MOCK_USERS.some((u) => u.nim === nim);

  if (!exists) {
    throw new ApiError('NIM tidak terdaftar. Hubungi admin.', 404);
  }

  return {
    id: 1,
    peran: 'mahasiswa',
    nomor_induk: nim,
    nama: 'Budi Santoso',
    status: 'aktif',
    dibuat_pada: new Date().toISOString(),
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
    id: 1,
    peran: 'mahasiswa',
    nomor_induk: '2488010071',
    nama: 'Budi Santoso',
    status: 'aktif',
  };
}

/* ============================================================
   GET /materi
   ============================================================ */
export async function mockGetMateri() {
  await delay(500);
  return MOCK_MATERI;
}