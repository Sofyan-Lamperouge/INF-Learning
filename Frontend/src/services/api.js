// Wrapper tipis di atas fetch() supaya seluruh pemanggilan API di aplikasi
// punya cara penanganan error yang seragam. Semua file *Service.js
// memakai fungsi ini, jangan panggil fetch() langsung dari komponen/halaman.

const BASE_URL = "/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Backend diharapkan mengirim { message: "..." } pada respons error,
    // sesuai skema 401/422/429 yang sudah disepakati di AC masing-masing story.
    const message = data?.message || "Terjadi kesalahan, silakan coba lagi.";
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
};
