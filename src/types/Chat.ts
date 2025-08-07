import { Message } from "./Message";

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}