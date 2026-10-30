// Frontend/src/services/api.js
//
// [DIUBAH]
//  1. Endpoint publik (/auth/login, /auth/registrasi) TIDAK mengirim header Authorization,
//     supaya token lama di localStorage tidak ikut terkirim.
//  2. Content-Type JSON hanya dipasang kalau body berupa string (aman untuk FormData/upload).
//  3. Jika server menjawab 200 tapi bukan JSON (mis. HTML dari `serve` karena
//     VITE_API_BASE_URL salah), sekarang dilempar ApiError, bukan diam-diam sukses.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const PUBLIC_PATHS = ['/auth/login', '/auth/registrasi'];

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function request(path, options = {}) {
  const isPublic = PUBLIC_PATHS.includes(path);
  const token = isPublic ? null : localStorage.getItem('token');

  const headers = {
    ...(typeof options.body === 'string'
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new ApiError(
      'Gagal terhubung ke server. Pastikan Backend sedang berjalan.',
      0,
      error
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401 && !isPublic) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  if (!response.ok) {
    let message = `Request gagal (${response.status})`;

    if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item) => (item.msg || '').replace(/^Value error,\s*/, ''))
        .join(', ');
    } else if (data?.detail) {
      message = data.detail;
    } else if (data?.message) {
      message = data.message;
    }

    throw new ApiError(message, response.status, data);
  }

  // 204 (mis. DELETE) memang tidak punya body. Selain itu, body wajib JSON.
  if (response.status !== 204 && data === null) {
    throw new ApiError(
      'Server tidak mengembalikan JSON. Periksa VITE_API_BASE_URL.',
      response.status
    );
  }

  return data;
}

export const api = {
  get(path) {
    return request(path);
  },

  post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
  },

  postFormData(path, body) {
    return request(path, { method: 'POST', body });
  },

  put(path, body) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) });
  },

  putFormData(path, body) {
    return request(path, { method: 'PUT', body });
  },

  delete(path) {
    return request(path, { method: 'DELETE' });
  },
};