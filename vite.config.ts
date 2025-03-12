import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";
import { glob } from "fast-glob";

export default defineConfig({
  build: {
    outDir: "assets",
    emptyOutDir: false,
    assetsDir: "",
    rollupOptions: {
      input: {
        theme: "src/theme.ts",
        "theme.css": "src/theme.css",
        ...Object.fromEntries(glob.sync("src/components/**/*").map((file) => [path.parse(file).name, file])),
        ...Object.fromEntries(glob.sync("src/libs/**/*").map((file) => [path.parse(file).name, file])),
      },
      output: {
        dir: "assets",
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
