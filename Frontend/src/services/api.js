import { sesi } from "../utils/storage.js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";
const REQUEST_TIMEOUT_MS = 15_000;
// Upload file (maks. 10 MB) butuh waktu lebih lama dari request biasa.
const UPLOAD_TIMEOUT_MS = 60_000;

const PUBLIC_PATHS = ["/auth/login", "/auth/registrasi"];

// Kode untuk kegagalan di level jaringan (status 0).
// Penyebabnya dibedakan karena artinya berbeda:
// - OFFLINE / NETWORK: permintaan hampir pasti tidak sampai ke server.
// - TIMEOUT: server mungkin sudah memproses permintaan sebelum balasannya tiba,
//   jadi hasilnya belum pasti.
// - ABORTED: dibatalkan oleh pemanggil (mis. komponen ditutup), bukan masalah jaringan.
export const NETWORK_CODE = {
  TIMEOUT: "TIMEOUT",
  OFFLINE: "OFFLINE",
  NETWORK: "NETWORK",
  ABORTED: "ABORTED",
};

export class ApiError extends Error {
  constructor(message, status = 0, details = null, code = "") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

export async function request(path, options = {}) {
  // timeoutMs dipisahkan dari opsi fetch supaya tidak ikut dikirim ke fetch().
  const { timeoutMs = REQUEST_TIMEOUT_MS, ...fetchOptions } = options;

  const isPublic = PUBLIC_PATHS.includes(path);
  const token = isPublic ? null : sesi.getItem("token");

  const headers = {
    ...(typeof fetchOptions.body === "string"
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...fetchOptions.headers,
  };

  const controller = new AbortController();
  let timedOut = false;

  // Hormati AbortSignal dari pemanggil jika tersedia.
  const externalSignal = fetchOptions.signal;
  const abortFromExternalSignal = () => controller.abort();

  if (externalSignal?.aborted) {
    controller.abort();
  } else {
    externalSignal?.addEventListener("abort", abortFromExternalSignal);
  }

  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    // Dibatalkan oleh pemanggil, bukan masalah jaringan.
    if (externalSignal?.aborted && !timedOut) {
      throw new ApiError(
        "Permintaan dibatalkan.",
        0,
        error,
        NETWORK_CODE.ABORTED,
      );
    }

    if (timedOut) {
      throw new ApiError(
        "Koneksi terlalu lambat. Periksa jaringan Anda, lalu coba lagi.",
        0,
        error,
        NETWORK_CODE.TIMEOUT,
      );
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ApiError(
        "Koneksi internet terputus. Periksa jaringan Anda, lalu coba lagi.",
        0,
        error,
        NETWORK_CODE.OFFLINE,
      );
    }

    throw new ApiError(
      "Gagal terhubung ke server. Periksa koneksi jaringan Anda dan pastikan backend tersedia.",
      0,
      error,
      NETWORK_CODE.NETWORK,
    );
  } finally {
    window.clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", abortFromExternalSignal);
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401 && !isPublic) {
    sesi.removeItem("token");
    sesi.removeItem("role");
  }

  if (!response.ok) {
    let message = `Request gagal (${response.status})`;

    if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item) => (item.msg || "").replace(/^Value error,\s*/, ""))
        .join(", ");
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
      "Server tidak mengembalikan JSON. Periksa VITE_API_BASE_URL.",
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
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // Upload diberi batas waktu lebih panjang.
  postFormData(path, body) {
    return request(path, {
      method: "POST",
      body,
      timeoutMs: UPLOAD_TIMEOUT_MS,
    });
  },

  put(path, body) {
    return request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  // Upload diberi batas waktu lebih panjang.
  putFormData(path, body) {
    return request(path, {
      method: "PUT",
      body,
      timeoutMs: UPLOAD_TIMEOUT_MS,
    });
  },

  delete(path) {
    return request(path, {
      method: "DELETE",
    });
  },
};