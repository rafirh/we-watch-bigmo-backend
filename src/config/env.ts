import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  APP_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("1d"),
  ADMIN_EMAIL: z.email().min(1),
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_USERNAME: z.string().min(3),

  OPENAI_API_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  CHAT_SESSION_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7),

  CLASSIFICATION_API_URL: z.url(),
  CLASSIFICATION_CACHE_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
