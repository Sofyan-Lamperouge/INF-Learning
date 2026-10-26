import { request } from './api.js';

import {
  mockGetMe,
  mockLogin,
  mockRegister,
} from '../mocks/mockApi.js';

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true';


/* ============================================================
   LOGIN
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
    throw new Error(
      'Response login dari backend tidak sesuai kontrak.'
    );
  }

  return {
    token: data.access_token,
    role: data.pengguna.peran,
    user: data.pengguna,
    expiresIn: data.expires_in,
  };
}


/* ============================================================
   REGISTER (Aktivasi Akun)
   ============================================================ */
export async function register({ nim, password }) {
  if (USE_MOCK) {
    return mockRegister({ nim, password });
  }

  return request('/auth/registrasi', {
    method: 'POST',
    body: JSON.stringify({
      nomor_induk: nim,
      kata_sandi: password,
    }),
  });
}

/* ============================================================
   GET ME
   ============================================================ */
export async function getMe() {
  if (USE_MOCK) {
    return mockGetMe(localStorage.getItem('token'));
  }

  return request('/auth/me');
}