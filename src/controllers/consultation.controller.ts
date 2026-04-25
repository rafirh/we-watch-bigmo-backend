import { FastifyRequest, FastifyReply } from "fastify";
import { consultationService } from "../services/consultation.service";

export const consultationController = {
  async requestConsultation(request: FastifyRequest, reply: FastifyReply) {
    const result = await consultationService.requestConsultation(
      request.user.sub,
    );
    return reply.code(201).send(result);
  },

  async listRooms(request: FastifyRequest, reply: FastifyReply) {
    const rooms = await consultationService.listMyRooms(
      request.user.sub,
      request.user.role,
    );
    return reply.send(rooms);
  },

  async getMessages(
    request: FastifyRequest<{
      Params: { roomId: string };
      Querystring: { cursor?: string };
    }>,
    reply: FastifyReply,
  ) {
    const result = await consultationService.getMessages(
      request.params.roomId,
      request.user.sub,
      request.query.cursor,
    );
    return reply.send(result);
  },
};
