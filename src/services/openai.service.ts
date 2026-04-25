import { openai } from "../config/openai";
import { env } from "../config/env";
import { ChatMessage } from "../models/chat.model";

export const openaiService = {
  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_completion_tokens: 2048,
      temperature: 0.3,
    });

    const reply = response.choices[0]?.message?.content;
    if (!reply) {
      throw Object.assign(new Error("Empty response from OpenAI"), {
        statusCode: 502,
      });
    }
    return reply;
  },
};
