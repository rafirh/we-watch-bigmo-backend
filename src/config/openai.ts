import OpenAI from "openai";
import { env } from "./env";

export const openai = new OpenAI({
  baseURL: `${env.OPENAI_API_URL}/api/v1/`,
  apiKey: env.OPENAI_API_KEY,
});
