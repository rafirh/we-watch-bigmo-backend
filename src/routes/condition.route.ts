import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { conditionController } from "../controllers/condition.controller";
import { conditionsResponseSchema } from "../models/condition.model";

export async function conditionRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Conditions"],
        security: [{ bearerAuth: [] }],
        response: { 200: conditionsResponseSchema },
      },
    },
    conditionController.getMyConditions,
  );
}