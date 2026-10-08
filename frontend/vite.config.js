import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssQueryVarsPlugin from "./src/vite/css-var-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [cssQueryVarsPlugin(), react()],
});
