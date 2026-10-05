import { request } from "./api.js";

export async function login({ nimNip, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ nimNip, password }),
  });
}

export async function register({ nimNip, namaLengkap, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ nimNip, namaLengkap, password }),
  });
}