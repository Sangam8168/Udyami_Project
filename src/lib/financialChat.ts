import { invokeAi } from "./aiFunctions";

export type ChatLanguage = "english" | "hindi" | "both";

export async function requestChatReply(message: string, language: ChatLanguage) {
  const data = await invokeAi<{ response: string }>("financial-chatbot", message, language);
  const reply = typeof data?.response === "string" ? data.response.trim() : "";
  if (!reply) throw new Error("The assistant returned an empty reply. Please try again.");
  return reply;
}
