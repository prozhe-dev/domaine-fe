import { defineConfig } from "vite";
import { glob } from "fast-glob";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
  build: {
    outDir: "assets",
    emptyOutDir: false,
    assetsDir: "",
    rollupOptions: {
      input: ["src/theme.ts", "src/theme.css", ...glob.sync(["src/components/**/*", "src/libs/**/*"])],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
