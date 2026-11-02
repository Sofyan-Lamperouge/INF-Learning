const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const REQUEST_TIMEOUT_MS = 15_000;

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

  const controller = new AbortController();
  let timedOut = false;

  // Hormati AbortSignal dari pemanggil jika tersedia.
  const externalSignal = options.signal;
  const abortFromExternalSignal = () => controller.abort();

  if (externalSignal?.aborted) {
    controller.abort();
  } else {
    externalSignal?.addEventListener('abort', abortFromExternalSignal);
  }

  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) {
      throw new ApiError(
        'Koneksi terlalu lambat. Periksa jaringan Anda, lalu coba lagi.',
        0,
        error,
      );
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ApiError(
        'Periksa koneksi jaringan Anda, lalu coba registrasi kembali.',
        0,
        error,
      );
    }

    throw new ApiError(
      'Gagal terhubung ke server. Periksa koneksi jaringan Anda dan pastikan backend tersedia.',
      0,
      error,
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener('abort', abortFromExternalSignal);
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

  // Response 204 memang tidak memiliki body.
  // Response sukses lainnya harus mengembalikan JSON.
  if (response.status !== 204 && data === null) {
    throw new ApiError(
      'Server tidak mengembalikan JSON. Periksa VITE_API_BASE_URL.',
      response.status,
    );
  }

  return data;
}

export const api = {
  get(path) {
    return request(path);
  },

  post(path, body) {
    return request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  postFormData(path, body) {
    return request(path, {
      method: 'POST',
      body,
    });
  },

  put(path, body) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  putFormData(path, body) {
    return request(path, {
      method: 'PUT',
      body,
    });
  },

  delete(path) {
    return request(path, {
      method: 'DELETE',
    });
  },
};