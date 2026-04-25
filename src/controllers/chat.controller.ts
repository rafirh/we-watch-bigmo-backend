import { FastifyRequest, FastifyReply } from "fastify";
import { chatService } from "../services/chat.service";
import { SendMessageInput } from "../models/chat.model";

export const chatController = {
  async sendMessage(
    request: FastifyRequest<{ Body: SendMessageInput }>,
    reply: FastifyReply,
  ) {
    const userId = request.user.sub ?? null;

    const result = await chatService.sendMessage(
      request.body.sessionId,
      request.body.message,
      userId,
    );

    return reply.send(result);
  },

  async getSessionMessages(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply,
  ) {
    const result = await chatService.getSessionMessages(
      request.params.sessionId,
    );
    return reply.send(result);
  },
};
