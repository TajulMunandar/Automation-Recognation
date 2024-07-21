import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Membuat server dapat diakses dari luar container
    port: 5173, // Pastikan port ini sesuai dengan yang dipetakan
  },
});
