import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração padrão do Vite para o Simulador do Leopoldo'H.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: "dist" },
});
