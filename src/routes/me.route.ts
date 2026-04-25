import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { userController } from "../controllers/user.controller";
import {
  updateMyProfileInputSchema,
  userResponseSchema,
} from "../models/user.model";
import {
  meVisitsResponseSchema,
  visitIdParamSchema,
  visitDetailResponseSchema,
} from "../models/visit.model";

export async function meRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.get(
    "/visits",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        response: { 200: meVisitsResponseSchema },
      },
    },
    userController.meVisits,
  );

  r.get(
    "/visits/:visitId",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: visitIdParamSchema,
        response: { 200: visitDetailResponseSchema },
      },
    },
    userController.getVisitDetail,
  );

  r.put(
    "/profile",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        body: updateMyProfileInputSchema,
        response: { 200: userResponseSchema },
      },
    },
    userController.updateMyProfile,
  );
}