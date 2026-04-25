import { FastifyRequest, FastifyReply } from "fastify";
import { classificationService } from "../services/classification.service";

export const classificationController = {
  async getMyClassification(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const result = await classificationService.getOrCompute(userId);
    return reply.send(result);
  },
};
