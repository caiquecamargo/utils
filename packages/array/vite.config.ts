/// <reference types="vitest" />
import typescript from "@rollup/plugin-typescript";
import path from "path";
import ttsc from "ttypescript";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "array",
      fileName: "index.js",
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: true,
      external: ["@caiquecamargo/helpers"],
    },
  },
  plugins: [
    typescript({
      typescript: ttsc,
      sourceMap: true,
      declaration: true,
      outDir: "dist",
      exclude: ["src/**/*.spec.ts"],
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});
