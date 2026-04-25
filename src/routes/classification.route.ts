import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { classificationController } from "../controllers/classification.controller";
import { classificationResponseSchema } from "../models/classification.model";

export async function classificationRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.addHook("onRequest", app.authenticate);

  r.get(
    "/me/classification",
    {
      schema: {
        tags: ["Classification"],
        security: [{ bearerAuth: [] }],
        response: { 200: classificationResponseSchema },
      },
    },
    classificationController.getMyClassification,
  );
}
