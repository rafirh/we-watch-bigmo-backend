import { z } from "zod";

// === REST ===
export const requestConsultationResponseSchema = z.object({
  roomId: z.string(),
  nurse: z.object({
    id: z.string(),
    fullName: z.string(),
    username: z.string(),
  }),
  createdAt: z.string(),
});

export const consultationRoomSummarySchema = z.object({
  id: z.string(),
  partner: z.object({
    id: z.string(),
    fullName: z.string(),
    role: z.enum(["USER", "NURSE"]),
  }),
  lastMessage: z
    .object({
      content: z.string(),
      senderId: z.string(),
      createdAt: z.string(),
    })
    .nullable(),
  unreadCount: z.number(),
});

export const messageSchema = z.object({
  id: z.string(),
  roomId: z.string(),
  senderId: z.string(),
  senderRole: z.enum(["USER", "NURSE"]),
  content: z.string(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

export const messagesPageSchema = z.object({
  data: z.array(messageSchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
});

export const roomIdParamSchema = z.object({
  roomId: z.string(),
});

// === WebSocket protocol ===
export const wsClientMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("send_message"),
    roomId: z.string(),
    content: z.string().min(1).max(4000),
    clientMessageId: z.string(), // untuk ack
  }),
  z.object({
    type: z.literal("mark_read"),
    roomId: z.string(),
    messageId: z.string(),
  }),
  z.object({
    type: z.literal("typing"),
    roomId: z.string(),
    isTyping: z.boolean(),
  }),
  z.object({ type: z.literal("ping") }),
]);
export type WsClientMessage = z.infer<typeof wsClientMessageSchema>;

export type WsServerMessage =
  | { type: "connected"; userId: string }
  | { type: "message"; message: Message }
  | { type: "message_ack"; clientMessageId: string; message: Message }
  | { type: "message_read"; roomId: string; messageId: string; readAt: string }
  | { type: "typing"; roomId: string; userId: string; isTyping: boolean }
  | { type: "presence"; userId: string; online: boolean }
  | { type: "error"; message: string }
  | { type: "pong" };
