import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" makes the built app work from any sub-folder (GitHub Pages: /aws-visual-architecture-mastery/visual-app/)
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
