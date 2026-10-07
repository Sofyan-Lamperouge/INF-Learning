import { request } from './api.js';

import {
  mockGetMe,
  mockLogin,
  mockRegister,
} from '../mocks/mockApi.js';

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true';


export async function login({
  nimNip,
  password,
}) {
  if (USE_MOCK) {
    return mockLogin({
      nimNip,
      password,
    });
  }

  const data = await request(
    '/auth/login',
    {
      method: 'POST',

      body: JSON.stringify({
        nomor_induk: nimNip,
        kata_sandi: password,
      }),
    }
  );

  if (
    !data?.access_token ||
    !data?.pengguna
  ) {
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


export async function register({
  namaLengkap,
  nimNip,
  email,
  password,
  konfirmasiPassword,
}) {
  if (USE_MOCK) {
    return mockRegister({
      namaLengkap,
      nimNip,
      email,
      password,
      konfirmasiPassword,
    });
  }

  return request(
    '/auth/registrasi',
    {
      method: 'POST',

      body: JSON.stringify({
        nama: namaLengkap,
        nomor_induk: nimNip,
        email,
        kata_sandi: password,
        konfirmasi_kata_sandi:
          konfirmasiPassword,
      }),
    }
  );
}


export async function getMe() {
  if (USE_MOCK) {
    return mockGetMe(
      localStorage.getItem('token')
    );
  }

  return request('/auth/me');
}