// Frontend/src/services/authService.js
//
// [DIUBAH] register():
//   - BUG UTAMA: sebelumnya signature-nya `{ nim, password }` tapi memakai variabel
//     `konfirmasiPassword` -> ReferenceError, request tidak pernah terkirim.
//   - Sekarang `konfirmasiPassword` ikut diterima dan default-nya = password,
//     jadi cukup satu kolom password di form.

import { request } from './api.js';

import {
  mockGetMe,
  mockLogin,
  mockRegister,
} from '../mocks/mockApi.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';


/* ============================================================
   LOGIN (tidak berubah)
   ============================================================ */
export async function login({ nim, password }) {
  if (USE_MOCK) {
    return mockLogin({ nim, password });
  }

  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      nomor_induk: nim,
      kata_sandi: password,
    }),
  });

  if (!data?.access_token || !data?.pengguna) {
    throw new Error('Response login dari backend tidak sesuai kontrak.');
  }

  return {
    token: data.access_token,
    role: data.pengguna.peran,
    user: data.pengguna,
    expiresIn: data.expires_in,
  };
}


/* ============================================================
   REGISTER (Aktivasi Akun)  <-- DIPERBAIKI
   ============================================================ */
export async function register({
  nim,
  password,
  konfirmasiPassword = password, // [BARU] default = password
}) {
  if (USE_MOCK) {
    return mockRegister({ nim, password, konfirmasiPassword });
  }

  return request('/auth/registrasi', {
    method: 'POST',
    body: JSON.stringify({
      nomor_induk: nim,
      kata_sandi: password,
      konfirmasi_kata_sandi: konfirmasiPassword,
    }),
  });
}


/* ============================================================
   GET ME (tidak berubah)
   ============================================================ */
export async function getMe() {
  if (USE_MOCK) {
    return mockGetMe(localStorage.getItem('token'));
  }

  return request('/auth/me');
}
