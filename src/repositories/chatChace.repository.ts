import { redis } from "../config/redis";
import { env } from "../config/env";
import { ChatMessage } from "../models/chat.model";

const keyOf = (sessionId: string) => `chat:session:${sessionId}`;

export const chatCacheRepository = {
  async exists(sessionId: string): Promise<boolean> {
    const result = await redis.exists(keyOf(sessionId));
    return result === 1;
  },

  async getAll(sessionId: string): Promise<ChatMessage[]> {
    const raw = await redis.lrange(keyOf(sessionId), 0, -1);
    return raw.map((item) => JSON.parse(item) as ChatMessage);
  },

  async append(sessionId: string, message: ChatMessage): Promise<void> {
    const key = keyOf(sessionId);
    // Pakai pipeline supaya RPUSH + EXPIRE jadi 1 round-trip
    await redis
      .multi()
      .rpush(key, JSON.stringify(message))
      .expire(key, env.CHAT_SESSION_TTL_SECONDS)
      .exec();
  },

  async appendMany(sessionId: string, messages: ChatMessage[]): Promise<void> {
    if (messages.length === 0) return;
    const key = keyOf(sessionId);
    const payload = messages.map((m) => JSON.stringify(m));
    await redis
      .multi()
      .rpush(key, ...payload)
      .expire(key, env.CHAT_SESSION_TTL_SECONDS)
      .exec();
  },

  async delete(sessionId: string): Promise<void> {
    await redis.del(keyOf(sessionId));
  },
};
