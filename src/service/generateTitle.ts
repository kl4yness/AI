import { useChatStore } from "@/store/chatStore";
import type { Message } from "@/types/Message";

export async function generateTitle(messages: Message[], chatId: string) {
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
        content: `Сделай краткий и понятный тайтл для чата с данным запросом, на языке на котором он написан. Чтоб человек понял в чем суть диалога, вот сам запрос -  ${m.message}`,
      })),
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Ошибка API: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  const answer = data.choices[0].message.content;

  useChatStore.getState().setChatTitle(chatId, answer);
}
