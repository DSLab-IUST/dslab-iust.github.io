import { createReadStream, cpSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { seoPrerender } from "./seo-prerender";
import { webAppManifestJson } from "./src/lib/manifest";

const repoRoot = resolve(__dirname, "../..");

const MIME: Record<string, string> = {
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".webmanifest": "application/manifest+json",
};

function isInside(root: string, file: string) {
  const rel = relative(root, file);
  return Boolean(rel) && rel !== ".." && !rel.startsWith(`..${sep}`);
}

function serveRepoDir(urlPrefix: string, dir: string) {
  const root = resolve(dir);
  return (server: ViteDevServer) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split("?")[0] ?? "";
      if (url !== urlPrefix && !url.startsWith(`${urlPrefix}/`)) {
        next();
        return;
      }
      const rel = decodeURIComponent(url.slice(urlPrefix.length).replace(/^\/+/, ""));
      if (!rel) {
        next();
        return;
      }
      const file = resolve(root, rel);
      if (!isInside(root, file) || !existsSync(file) || !statSync(file).isFile()) {
        next();
        return;
      }
      const stat = statSync(file);
      res.setHeader("Content-Type", MIME[extname(file).toLowerCase()] || "application/octet-stream");
      res.setHeader("Content-Length", String(stat.size));
      createReadStream(file).pipe(res);
    });
  };
}

function copyRepoStatic(): Plugin {
  const dataDir = resolve(repoRoot, "data");
  const assetsDir = resolve(repoRoot, "assets");

  const sync = () => {
    const publicDir = resolve(__dirname, "public");
    mkdirSync(resolve(publicDir, "data"), { recursive: true });
    mkdirSync(resolve(publicDir, "assets"), { recursive: true });
    if (existsSync(dataDir)) {
      cpSync(dataDir, resolve(publicDir, "data"), { recursive: true });
    }
    if (existsSync(assetsDir)) {
      cpSync(assetsDir, resolve(publicDir, "assets"), { recursive: true });
    }
    writeFileSync(resolve(publicDir, "manifest.webmanifest"), webAppManifestJson(), "utf8");
  };

  return {
    name: "copy-repo-static",
    buildStart: sync,
    configureServer(server) {
      sync();
      serveRepoDir("/data", dataDir)(server);
      serveRepoDir("/assets", assetsDir)(server);
    },
  };
}

export default defineConfig({
  base: "/",
  appType: "spa",
  plugins: [
    copyRepoStatic(),
    react(),
    tailwindcss(),
    seoPrerender(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
