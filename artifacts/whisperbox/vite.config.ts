import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import http from "node:http";

const port = Number(process.env.PORT ?? "3000");
const basePath = process.env.BASE_PATH ?? "/";

const API_PORT = 8080;
const USERNAME_RE = /^\/@[a-zA-Z0-9_]{3,32}([?#].*)?$/;

function ogProfileProxy() {
  return {
    name: "og-profile-proxy",
    configureServer(server: import("vite").ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.method === "GET" && USERNAME_RE.test(req.url ?? "")) {
          const proxyReq = http.request(
            {
              hostname: "localhost",
              port: API_PORT,
              path: req.url,
              method: "GET",
              headers: { ...req.headers, host: `localhost:${API_PORT}` },
            },
            (proxyRes) => {
              res.writeHead(proxyRes.statusCode ?? 200, proxyRes.headers);
              proxyRes.pipe(res);
            },
          );
          proxyReq.on("error", () => next());
          req.pipe(proxyReq);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  define: {
    "import.meta.env.VITE_CLERK_PUBLISHABLE_KEY": JSON.stringify(
      process.env.CLERK_PUBLISHABLE_KEY ??
        process.env.VITE_CLERK_PUBLISHABLE_KEY ??
        "",
    ),
    "import.meta.env.VITE_CLERK_PROXY_URL": JSON.stringify(
      process.env.CLERK_PROXY_URL ?? process.env.VITE_CLERK_PROXY_URL ?? "",
    ),
  },
  plugins: [
    ogProfileProxy(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets",
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
