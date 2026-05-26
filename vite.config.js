import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** GitHub Pages 项目站 base，由 CI 注入 VITE_BASE=/仓库名/ */
function normalizePagesBase(base) {
  if (!base) return "/";
  return base.endsWith("/") ? base : `${base}/`;
}

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const pagesBase = normalizePagesBase(process.env.VITE_BASE);

export default defineConfig({
  base: isGitHubPages ? pagesBase : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@motion-tuning": path.resolve(__dirname, "src/motion-tuning/index.js"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        assetLibrary: path.resolve(__dirname, "asset-library/index.html"),
        maxDepthVideo: path.resolve(__dirname, "max-depth-video.html"),
      },
    },
  },
});
