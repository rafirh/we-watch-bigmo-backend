import { redis } from "../config/redis";
import { env } from "../config/env";
import { Message } from "../models/consultation.model";

const recentKey = (roomId: string) => `consult:room:${roomId}:recent`;
const presenceKey = "consult:presence";

export const consultationCacheRepository = {
  async getRecent(roomId: string): Promise<Message[]> {
    const raw = await redis.lrange(recentKey(roomId), 0, -1);
    return raw.map((r) => JSON.parse(r) as Message);
  },

  async pushRecent(roomId: string, message: Message): Promise<void> {
    const key = recentKey(roomId);
    await redis
      .multi()
      .lpush(key, JSON.stringify(message))
      .ltrim(key, 0, env.CONSULTATION_RECENT_MESSAGES_LIMIT - 1)
      .expire(key, 60 * 60 * 24 * 7) // 7 hari, di-refresh tiap pesan
      .exec();
  },

  async invalidateRecent(roomId: string): Promise<void> {
    await redis.del(recentKey(roomId));
  },

  async setOnline(userId: string): Promise<void> {
    await redis.sadd(presenceKey, userId);
  },

  async setOffline(userId: string): Promise<void> {
    await redis.srem(presenceKey, userId);
  },

  async isOnline(userId: string): Promise<boolean> {
    const result = await redis.sismember(presenceKey, userId);
    return result === 1;
  },
};
