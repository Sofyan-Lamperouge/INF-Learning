import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Sesuaikan target proxy dengan alamat server Backend saat development.
// Ini membuat panggilan fetch("/api/...") di frontend otomatis diteruskan
// ke server Backend tanpa masalah CORS saat kalian coding bersamaan.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080", // ganti sesuai port server Backend kalian
        changeOrigin: true,
      },
    },
  },
});
