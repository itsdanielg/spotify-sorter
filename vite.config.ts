import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tsConfigPaths(), tailwindcss()],
  server: { port: 3000, strictPort: true, host: true },
  preview: { port: 8080, strictPort: true, host: true }
});
