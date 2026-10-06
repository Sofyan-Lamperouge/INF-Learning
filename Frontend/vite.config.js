import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Semua request ke /api → forward ke backend
      // Ganti target sesuai URL backend temanmu
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});