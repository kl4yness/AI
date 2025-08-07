export interface Message {
  id: string,
  message: string,
  role: "user" | "assistant" | "system",
  sendedAt: string
}