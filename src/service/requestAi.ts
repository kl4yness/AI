import { useChatStore } from "@/store/chatStore";
import { nanoid } from "nanoid";
import type { Message } from "@/types/Message";

function generateId() {
  return nanoid();
}

export async function requestAI(messages: Message[], chatId: string) {
  const { setIsLoading } = useChatStore.getState();
  setIsLoading(true);
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/horizon-beta",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.message,
        })),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ошибка API: ${res.status} - ${errorText}`);
    }

    const data = await res.json();

    const answer = data.choices[0].message.content;

    useChatStore.getState().addMessage(chatId, {
      id: nanoid(),
      role: "assistant",
      message: answer,
      sendedAt: new Date().toISOString(),
    });
  } finally {
    setIsLoading(false);
  }
}
