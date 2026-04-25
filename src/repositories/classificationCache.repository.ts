import { redis } from "../config/redis";
import { env } from "../config/env";
import { RiskLevelString } from "../dto/classification.dto";

export interface ClassificationCacheEntry {
  visitId: string;
  riskLevel: RiskLevelString;
  explanation: string;
  probabilities: {
    "low risk": number;
    "mid risk": number;
    "high risk": number;
  };
  evaluatedAt: string;
}

const keyOf = (userId: string) => `classification:user:${userId}`;

export const classificationCacheRepository = {
  async get(userId: string): Promise<ClassificationCacheEntry | null> {
    const raw = await redis.get(keyOf(userId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ClassificationCacheEntry;
    } catch {
      // corrupt — bersihkan supaya gak nyangkut
      await redis.del(keyOf(userId));
      return null;
    }
  },

  async set(userId: string, entry: ClassificationCacheEntry): Promise<void> {
    await redis.set(
      keyOf(userId),
      JSON.stringify(entry),
      "EX",
      env.CLASSIFICATION_CACHE_TTL_SECONDS,
    );
  },

  async delete(userId: string): Promise<void> {
    await redis.del(keyOf(userId));
  },
};
