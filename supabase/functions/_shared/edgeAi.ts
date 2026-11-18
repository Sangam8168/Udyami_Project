import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { createAiHandler, type Feature } from "./ai.ts";

export function createEdgeAiHandler(feature: Feature) {
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return createAiHandler(feature, {
    getEnv: name => Deno.env.get(name),
    async authenticate(token) {
      const { data: { user }, error } = await client.auth.getUser(token);
      return error ? null : user?.id ?? null;
    },
    async saveConversation(userId, _token, message, response) {
      const { error } = await client.from("chatbot_conversations").insert({ user_id: userId, message, response });
      if (error) throw error;
    },
  });
}
