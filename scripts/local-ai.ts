import { createClient } from "@supabase/supabase-js";
import { createAiHandler } from "../supabase/functions/_shared/ai";
import type { Plugin } from "vite";

export function localAi(env: Record<string, string>, url: string, key: string): Plugin {
  const authOptions = { persistSession: false, autoRefreshToken: false };
  const auth = createClient(url, key, { auth: authOptions });
  const deps = {
    getEnv: (name: string) => env[name],
    async authenticate(token: string) {
      const { data: { user }, error } = await auth.auth.getUser(token);
      return error ? null : user?.id ?? null;
    },
    async saveConversation(userId: string, token: string, message: string, response: string) {
      const client = createClient(url, key, {
        auth: authOptions,
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { error } = await client.from("chatbot_conversations").insert({ user_id: userId, message, response });
      if (error) throw error;
    },
  };
  const chat = createAiHandler("financial-chatbot", deps);
  const fraud = createAiHandler("ml-fraud-detection", deps);

  return {
    name: "udyami-local-ai",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__local_ai", async (req, res, next) => {
        const handler = req.url === "/financial-chatbot" ? chat : req.url === "/ml-fraud-detection" ? fraud : null;
        if (!handler) return next();
        if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(req.headers.host ?? "")) {
          res.writeHead(403).end();
          return;
        }

        try {
          const auth = req.headers.authorization;
          const chunks: Buffer[] = [];
          let size = 0;
          if (req.method === "POST" && auth) {
            for await (const chunk of req) {
              size += chunk.length;
              if (size > 64 * 1024) {
                res.writeHead(413).end();
                return;
              }
              chunks.push(chunk);
            }
          }
          const response = await handler(new Request("http://localhost" + req.url, {
            method: req.method,
            headers: auth ? { Authorization: auth } : {},
            body: req.method === "POST" ? Buffer.concat(chunks).toString("utf8") : undefined,
          }));
          res.writeHead(response.status, { "Content-Type": "application/json" }).end(await response.text());
        } catch {
          res.writeHead(503).end();
        }
      });
    },
  };
}
