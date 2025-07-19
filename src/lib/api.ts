// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://blogger-wph-api-production.up.railway.app",
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan token ke setiap request yang memerlukan autentikasi
api.interceptors.request.use(
  (config) => {
    // HANYA JANGAN tambahkan token ke endpoint login/register
    // Untuk endpoint LAINNYA (termasuk /posts), token HARUS ditambahkan.
    // Jadi, kondisi `!config.url.includes('/auth/')` sudah benar.
    // Yang penting adalah `localStorage.getItem('authToken')` benar-benar mengembalikan token.

    if (typeof window !== "undefined" && config.url && !config.url.includes("/auth/")) {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
