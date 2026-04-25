import { prisma } from "../config/prisma";
import { ChatRole } from "../generated/prisma/browser";
import { ChatMessage } from "../models/chat.model";

const toDbRole = (role: ChatMessage["role"]): ChatRole => {
  switch (role) {
    case "system":
      return ChatRole.SYSTEM;
    case "user":
      return ChatRole.USER;
    case "assistant":
      return ChatRole.ASSISTANT;
  }
};

const fromDbRole = (role: ChatRole): ChatMessage["role"] => {
  switch (role) {
    case ChatRole.SYSTEM:
      return "system";
    case ChatRole.USER:
      return "user";
    case ChatRole.ASSISTANT:
      return "assistant";
  }
};

export const chatRepository = {
  async createSession(userId?: string | null) {
    return prisma.chatSession.create({
      data: { userId: userId ?? null },
    });
  },

  async findSession(sessionId: string) {
    return prisma.chatSession.findUnique({ where: { id: sessionId } });
  },

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const rows = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map((r) => ({ role: fromDbRole(r.role), content: r.content }));
  },

  async appendMessages(sessionId: string, messages: ChatMessage[]) {
    if (messages.length === 0) return;
    await prisma.chatMessage.createMany({
      data: messages.map((m) => ({
        sessionId,
        role: toDbRole(m.role),
        content: m.content,
      })),
    });
  },
};
