import { chatRepository } from "../repositories/chat.repository";
import { openaiService } from "./openai.service";
import { env } from "../config/env";
import { ChatMessage } from "../models/chat.model";
import { chatCacheRepository } from "../repositories/chatChace.repository";
import { userRepository } from "../repositories/user.repository";

export const chatService = {
  async sendMessage(
    sessionId: string | null | undefined,
    userMessage: string,
    userId?: string | null,
  ): Promise<{ sessionId: string; response: string }> {
    let history: ChatMessage[] = [];
    let activeSessionId: string;

    if (!sessionId) {
      const session = await chatRepository.createSession(userId);
      const allUserDetail = await userRepository.findMeDetailsById(userId!);

      activeSessionId = session.id;

      const initialSystemMsg: ChatMessage = {
        role: "system",
        content: `User pregnancy details and journey: ${JSON.stringify(allUserDetail)}`,
      };

      await chatCacheRepository.append(activeSessionId, initialSystemMsg);
      history = [initialSystemMsg];
    } else {
      activeSessionId = sessionId;
      history = await chatService.loadHistory(sessionId);

      if (history.length === 0) {
        throw Object.assign(new Error("Session not found"), {
          statusCode: 404,
        });
      }
    }

    const userMsg: ChatMessage = { role: "user", content: userMessage };
    await chatCacheRepository.append(activeSessionId, userMsg);

    const reply = await openaiService.complete([...history, userMsg]);

    const assistantMsg: ChatMessage = { role: "assistant", content: reply };
    await chatCacheRepository.append(activeSessionId, assistantMsg);

    return { sessionId: activeSessionId, response: reply };
  },

  /**
   * Ambil history. Redis dulu (cache), kalau miss → DB → warm Redis.
   */
  async loadHistory(sessionId: string): Promise<ChatMessage[]> {
    const cached = await chatCacheRepository.getAll(sessionId);
    if (cached.length > 0) {
      return cached;
    }

    // Cache miss → cek DB
    const session = await chatRepository.findSession(sessionId);
    if (!session) {
      return []; // session sama sekali gak ada
    }

    const dbMessages = await chatRepository.getMessages(sessionId);
    if (dbMessages.length > 0) {
      // Warm Redis biar request berikutnya cepet
      await chatCacheRepository.appendMany(sessionId, dbMessages);
    }
    return dbMessages;
  },

  /**
   * Endpoint untuk FE buka session yang udah ada.
   */
  async getSessionMessages(
    sessionId: string,
  ): Promise<{ sessionId: string; messages: ChatMessage[] }> {
    const messages = await chatService.loadHistory(sessionId);
    if (messages.length === 0) {
      throw Object.assign(new Error("Session not found"), { statusCode: 404 });
    }
    return { sessionId, messages };
  },
};
