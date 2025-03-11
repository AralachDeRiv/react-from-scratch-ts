import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      Didact: path.resolve(__dirname, "Didact"),
    },
  },
});
