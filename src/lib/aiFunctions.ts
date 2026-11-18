import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AiFunction = "financial-chatbot" | "ml-fraud-detection";

function requestError(status: number, details?: string) {
  if (status === 429 || details === "Too many requests. Please wait a moment and try again.") {
    return new Error("The AI service has reached its request limit. Please try again later.");
  }
  if (status === 401) return new Error("Your session couldn’t be verified. Sign in again and retry.");
  if (status === 502 && details) return new Error(details);
  return new Error("The AI service is temporarily unavailable. Please try again.");
}

export async function invokeAi<T>(name: AiFunction, message: string, language: string): Promise<T | null> {
  const body = { message, language };
  if (import.meta.env.DEV && import.meta.env.VITE_LOCAL_AI === "true" &&
      ["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw requestError(401);
    const response = await fetch(`/__local_ai/${name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw requestError(response.status, payload?.error);
    return payload;
  }

  const { data, error } = await supabase.functions.invoke<T>(name, { body });
  if (error instanceof FunctionsHttpError) {
    const response = error.context as Response;
    const payload = await response.json().catch(() => null);
    throw requestError(response.status, payload?.error);
  }
  if (error) throw requestError(503);
  return data;
}
