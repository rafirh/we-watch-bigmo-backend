import { FastifyRequest, FastifyReply } from "fastify";
import { conditionService } from "../services/condition.service";

export const conditionController = {
  async getMyConditions(request: FastifyRequest, reply: FastifyReply) {
    const result = await conditionService.getMyConditions(request.user.sub);
    return reply.send(result);
  },
};