import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userController } from "../controllers/user.controller";
import {
  userResponseSchema,
  userListResponseSchema,
  userIdParamSchema,
} from "../models/user.model";
import z from "zod";

export async function userRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/",
    {
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        response: { 200: userListResponseSchema },
      },
    },
    userController.list,
  );

  r.get(
    "/:id",
    {
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: userIdParamSchema,
        response: { 200: userResponseSchema },
      },
    },
    userController.getById,
  );

  r.delete(
    "/:id",
    {
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: userIdParamSchema,
        response: { 204: z.null() },
      },
    },
    userController.deleteById,
  );
}
