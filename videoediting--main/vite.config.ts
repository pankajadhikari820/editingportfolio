import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { handleCreatorQuery } from "./api/_youtube.ts";

function localCreatorApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: "local-creator-api",
    configureServer(server) {
      server.middlewares.use("/api/creator", async (req, res, next) => {
        if (req.method !== "GET") {
          next();
          return;
        }
        try {
          const url = new URL(req.url ?? "", "http://localhost");
          const handle = url.searchParams.get("handle") ?? undefined;
          const channelId = url.searchParams.get("channelId") ?? undefined;
          const result = await handleCreatorQuery({ handle, channelId }, apiKey);

          res.statusCode = result.status;
          for (const [k, v] of Object.entries(result.headers)) {
            res.setHeader(k, v);
          }
          res.end(JSON.stringify(result.body));
        } catch {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify({
              error: "Local API middleware error.",
              code: "UPSTREAM_ERROR",
            })
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const youtubeApiKey = env.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;

  return {
    plugins: [react(), tailwindcss(), localCreatorApiPlugin(youtubeApiKey)],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});
