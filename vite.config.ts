// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      Didact: "/src/Didact", // Ici, l'alias pour Didact
    },
  },
});
