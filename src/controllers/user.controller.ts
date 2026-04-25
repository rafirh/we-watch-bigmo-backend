import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "../services/user.service";
import { UpdateMyProfileInput } from "../models/user.model";

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

  async meVisits(request: FastifyRequest, reply: FastifyReply) {
    const result = await userService.getMeVisits(request.user.sub);
    return reply.send(result);
  },

  async updateTodoStatus(
    request: FastifyRequest<{
      Params: { todoId: string };
      Body: { status: boolean };
    }>,
    reply: FastifyReply,
  ) {
    const result = await userService.updateTodoStatus(
      request.params.todoId,
      request.user.sub,
      request.body.status,
    );

    return reply.send(result);
  },

  async getVisitDetail(
    request: FastifyRequest<{ Params: { visitId: string } }>,
    reply: FastifyReply,
  ) {
    const result = await userService.getVisitDetailById(
      request.params.visitId,
      request.user.sub,
    );

    return reply.send(result);
  },

  async getLastVisit(request: FastifyRequest, reply: FastifyReply) {
    const result = await userService.getLastVisit(request.user.sub);
    return reply.send(result);
  },

  async getCurrentTodos(request: FastifyRequest, reply: FastifyReply) {
    const result = await userService.getCurrentTodos(request.user.sub);
    return reply.send(result);
  },

  async updateMyProfile(
    request: FastifyRequest<{ Body: UpdateMyProfileInput }>,
    reply: FastifyReply,
  ) {
    const result = await userService.updateMyProfile(request.user.sub, request.body);
    return reply.send(result);
  },
};
