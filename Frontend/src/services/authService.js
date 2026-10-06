// src/services/authService.js

import { request } from "./api.js";
import {
  mockLogin,
  mockRegister,
  mockGetMe,
} from "../mocks/mockApi.js";

// Baca dari .env
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

/* ============================================================
   LOGIN
   ============================================================ */
export async function login({ nimNip, password }) {
  if (USE_MOCK) {
    // Mode development tanpa backend
    return mockLogin({ nimNip, password });
  }

  // Mode production / integrasi backend asli
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ nimNip, password }),
  });
}

/* ============================================================
   REGISTER
   ============================================================ */
export async function register({ namaLengkap, nimNip, password }) {
  if (USE_MOCK) {
    return mockRegister({ namaLengkap, nimNip, password });
  }

  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ namaLengkap, nimNip, password }),
  });
}

/* ============================================================
   GET ME (opsional)
   ============================================================ */
export async function getMe() {
  if (USE_MOCK) {
    const token = localStorage.getItem("token");
    return mockGetMe(token);
  }

  return request("/auth/me");
}