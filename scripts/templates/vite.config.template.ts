/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "index.ts"),
      name: "{{name}}",
      fileName: (format) => `index.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: true,
      external: [],
    },
  },
  plugins: [
    dts({
      entryRoot: ".",
    }),
  ],
  test: {
    environment: "happy-dom",
  },
});