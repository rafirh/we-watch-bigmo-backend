import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "../services/user.service";

export const userController = {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const result = await userService.list();
    return reply.send(result);
  },

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    const user = await userService.getById(request.params.id);
    return reply.send(user);
  },

  async deleteById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) {
    await userService.deleteById(request.params.id);
    return reply.code(204).send();
  },
};
