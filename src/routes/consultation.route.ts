import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { consultationController } from "../controllers/consultation.controller";
import {
  requestConsultationResponseSchema,
  consultationRoomSummarySchema,
  messagesPageSchema,
  roomIdParamSchema,
} from "../models/consultation.model";

export async function consultationRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.addHook("onRequest", app.authenticate);

  r.post(
    "/request",
    {
      schema: {
        tags: ["Consultation"],
        security: [{ bearerAuth: [] }],
        response: { 201: requestConsultationResponseSchema },
      },
    },
    consultationController.requestConsultation,
  );

  r.get(
    "/rooms",
    {
      schema: {
        tags: ["Consultation"],
        security: [{ bearerAuth: [] }],
        response: { 200: z.array(consultationRoomSummarySchema) },
      },
    },
    consultationController.listRooms,
  );

  r.get(
    "/rooms/:roomId/messages",
    {
      schema: {
        tags: ["Consultation"],
        security: [{ bearerAuth: [] }],
        params: roomIdParamSchema,
        querystring: z.object({ cursor: z.string().optional() }),
        response: { 200: messagesPageSchema },
      },
    },
    consultationController.getMessages,
  );
}
