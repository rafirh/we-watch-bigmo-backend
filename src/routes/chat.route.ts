import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { chatController } from "../controllers/chat.controller";
import {
  sendMessageInputSchema,
  sendMessageResponseSchema,
  sessionMessagesResponseSchema,
  sessionIdParamSchema,
} from "../models/chat.model";

export async function chatRoutes(app: FastifyInstance) {
  const r = app.withTypeProvider<ZodTypeProvider>();

  r.post(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Chat"],
        body: sendMessageInputSchema,
        security: [{ bearerAuth: [] }],
        response: { 200: sendMessageResponseSchema },
      },
    },
    chatController.sendMessage,
  );

  r.get(
    "/sessions/:sessionId/messages",
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ["Chat"],
        params: sessionIdParamSchema,
        security: [{ bearerAuth: [] }],
        response: { 200: sessionMessagesResponseSchema },
      },
    },
    chatController.getSessionMessages,
  );
}
