import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { localAi } from "./scripts/local-ai";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const aiEnv = command === "serve"
    ? loadEnv(mode, path.join(__dirname, "supabase"), ["GROQ_", "GEMINI_"])
    : {};
  const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = loadEnv(mode, __dirname, "VITE_SUPABASE_");
  const useLocalAi = Boolean(aiEnv.GROQ_API_KEY && VITE_SUPABASE_URL && VITE_SUPABASE_PUBLISHABLE_KEY);

  return {
    define: { "import.meta.env.VITE_LOCAL_AI": JSON.stringify(String(useLocalAi)) },
    server: { host: "::", port: 8080 },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      useLocalAi && localAi(aiEnv, VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY),
    ].filter(Boolean),
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  };
});
