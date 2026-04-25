import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authController } from "../controllers/auth.controller";
import {
  registerInputSchema,
  loginInputSchema,
  userResponseSchema,
  loginResponseSchema,
} from "../models/user.model";

export async function authRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        body: registerInputSchema,
        response: { 201: userResponseSchema },
      },
    },
    authController.register,
  );

  r.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: loginInputSchema,
        response: { 200: loginResponseSchema },
      },
    },
    authController.login,
  );

  r.get(
    "/session",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        response: { 200: userResponseSchema },
      },
    },
    authController.session,
  );
}
