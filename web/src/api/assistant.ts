import { apiRequest } from "./client";

// The Tripwise Assistant is an AI agent: the backend sends the conversation to a
// large language model and returns the model's reply.
export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface AssistantReply {
  conversationId: string;
  message: ChatMessage;
}

/** Sends the whole conversation to the AI assistant and returns its reply. */
export function sendAssistantMessage(
  conversationId: string,
  messages: ChatMessage[],
): Promise<AssistantReply> {
  return apiRequest<AssistantReply>("/api/assistant/chat", {
    method: "POST",
    body: {
      conversationId,
      messages: messages.map(({ role, content }) => ({ role, content })),
    },
  });
}
