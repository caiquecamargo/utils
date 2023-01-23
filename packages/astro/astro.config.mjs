import { defineConfig } from "astro/config";
import Icons from "unplugin-icons/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [],
  vite: {
    plugins: [
      Icons({
        compiler: "vue3",
        autoInstall: true,
        scale: 2,
      }),
    ],
  },
});
