// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Request HTTP ke backend.
 * Otomatis menambahkan Authorization jika ada token di localStorage.
 */
export async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      "Gagal terhubung ke server, periksa koneksi Anda.",
      0
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* body kosong */
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || `Request gagal (${res.status})`,
      res.status
    );
  }

  return data;
}