// vite.config.ts
import { defineConfig } from "vite";

// TODO : Commenter ici
export default defineConfig({
  resolve: {
    alias: {
      Didact: "/src/Didact", // Ici, l'alias pour Didact
    },
  },
});
