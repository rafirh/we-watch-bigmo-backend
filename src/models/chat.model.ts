import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const sendMessageInputSchema = z.object({
  sessionId: z.uuid().nullish(),
  message: z.string().min(1).max(4000),
});
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;

// Response POST /chat
export const sendMessageResponseSchema = z.object({
  sessionId: z.uuid(),
  response: z.string(),
});

// Response GET /chat/sessions/:id/messages
export const sessionMessagesResponseSchema = z.object({
  sessionId: z.uuid(),
  messages: z.array(chatMessageSchema),
});

export const sessionIdParamSchema = z.object({
  sessionId: z.uuid(),
});
