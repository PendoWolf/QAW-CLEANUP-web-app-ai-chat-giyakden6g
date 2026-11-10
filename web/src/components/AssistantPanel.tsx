import { useState, type FormEvent } from "react";
import { errorStatus, trackEvent } from "../analytics/pendo";
import { sendAssistantMessage, type ChatMessage } from "../api/assistant";

const SUGGESTED_PROMPTS = [
  "Suggest a 3-day itinerary for my next trip",
  "What should I pack for a week in Iceland?",
  "Find a cheaper alternative to Paris in spring",
];

function newConversationId(): string {
  return crypto.randomUUID();
}

/**
 * AI chat panel for the Tripwise Assistant, an LLM-powered travel agent.
 * Each prompt the user sends goes to the Tripwise API with the conversation so
 * far; the assistant's reply is appended when the API answers.
 */
export function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [conversationId, setConversationId] = useState(newConversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (text: string, isSuggestedPrompt = false) => {
    const prompt = text.trim();
    if (prompt === "" || thinking) return;
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: prompt };
    const conversation = [...messages, userMessage];
    setMessages(conversation);
    setDraft("");
    setError(null);
    setThinking(true);
    const startedAt = performance.now();
    try {
      const reply = await sendAssistantMessage(conversationId, conversation);
      setMessages((current) => [...current, reply.message]);
      // The AI assistant answered. Only the prompt's length is sent, never its text.
      trackEvent("assistant_reply_received", {
        conversationId,
        messageCount: conversation.length + 1,
        userTurnCount: conversation.filter((message) => message.role === "user").length,
        isSuggestedPrompt,
        promptLength: prompt.length,
        replyLength: reply.message.content.length,
        responseTimeMs: Math.round(performance.now() - startedAt),
      });
    } catch (e) {
      setError((e as Error).message);
      // The assistant chat API call failed.
      trackEvent("assistant_reply_failed", {
        conversationId,
        messageCount: conversation.length,
        isSuggestedPrompt,
        errorStatus: errorStatus(e),
        errorMessage: (e as Error).message.slice(0, 100),
        responseTimeMs: Math.round(performance.now() - startedAt),
      });
    } finally {
      setThinking(false);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void send(draft);
  };

  const startNewChat = () => {
    setConversationId(newConversationId());
    setMessages([]);
    setError(null);
  };

  return (
    <aside className="assistant" aria-label="Tripwise Assistant">
      <header>
        <h2>Tripwise Assistant</h2>
        <div>
          <button type="button" className="secondary" onClick={startNewChat}>
            New chat
          </button>
          <button type="button" className="secondary" onClick={onClose} aria-label="Close assistant">
            ✕
          </button>
        </div>
      </header>

      <ol className="messages" aria-live="polite">
        {messages.length === 0 && (
          <li className="hint">
            Ask me anything about planning a trip.
            <div className="suggestions">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button key={prompt} type="button" className="secondary" onClick={() => void send(prompt, true)}>
                  {prompt}
                </button>
              ))}
            </div>
          </li>
        )}
        {messages.map((message) => (
          <li key={message.id} className={`message ${message.role}`}>
            {message.content}
          </li>
        ))}
        {thinking && <li className="message assistant">Thinking…</li>}
      </ol>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <label className="sr-only" htmlFor="assistant-input">
          Message the assistant
        </label>
        <textarea
          id="assistant-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the assistant"
          rows={2}
        />
        <button type="submit" disabled={draft.trim() === "" || thinking}>
          Send
        </button>
      </form>
    </aside>
  );
}
