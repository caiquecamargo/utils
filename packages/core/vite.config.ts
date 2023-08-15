/// <reference types="vitest" />
import typescript from "@rollup/plugin-typescript";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: false,
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "core",
      fileName: (format) => `index.${format == "es" ? "mjs" : format}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      treeshake: true,
      external: [],
    },
  },
  plugins: [
    typescript({
      declaration: true,
      outDir: "dist",
      exclude: ["src/**/*.spec.ts"],
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});
