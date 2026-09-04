import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { seoPrerender } from "./seo-prerender";

const repoRoot = resolve(__dirname, "../..");

function copyRepoStatic(): Plugin {
  const sync = () => {
    const publicDir = resolve(__dirname, "public");
    mkdirSync(resolve(publicDir, "data"), { recursive: true });
    mkdirSync(resolve(publicDir, "assets"), { recursive: true });

    const dataDir = resolve(repoRoot, "data");
    const assetsDir = resolve(repoRoot, "assets");
    if (existsSync(dataDir)) {
      cpSync(dataDir, resolve(publicDir, "data"), { recursive: true });
    }
    if (existsSync(assetsDir)) {
      cpSync(assetsDir, resolve(publicDir, "assets"), { recursive: true });
    }
  };

  return {
    name: "copy-repo-static",
    buildStart: sync,
    configureServer() {
      sync();
    },
  };
}

export default defineConfig({
  base: "/",
  appType: "spa",
  plugins: [copyRepoStatic(), react(), tailwindcss(), seoPrerender()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
