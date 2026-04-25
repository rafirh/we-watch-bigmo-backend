import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/auth.service";
import { RegisterInput, LoginInput } from "../models/user.model";

export const authController = {
  async register(
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply,
  ) {
    const user = await authService.register(request.body);
    return reply.code(201).send(user);
  },

  async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply,
  ) {
    const result = await authService.login(request.server, request.body);
    return reply.send(result);
  },

  async session(request: FastifyRequest, reply: FastifyReply) {
    const user = await authService.getSession(request.user.sub);
    return reply.send(user);
  },
};
