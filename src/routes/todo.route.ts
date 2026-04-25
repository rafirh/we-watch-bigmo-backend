import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userController } from "../controllers/user.controller";
import {
  todoIdParamSchema,
  updateTodoStatusBodySchema,
  todoResponseSchema,
} from "../models/visit.model";

export async function todoRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.put(
    "/:todoId",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: todoIdParamSchema,
        body: updateTodoStatusBodySchema,
        response: { 200: todoResponseSchema },
      },
    },
    userController.updateTodoStatus,
  );
}