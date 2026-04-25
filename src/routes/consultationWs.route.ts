import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  wsClientMessageSchema,
  WsServerMessage,
} from "../models/consultation.model";
import { connectionManager } from "../services/wsConnection.service";
import { consultationService } from "../services/consultation.service";
import { env } from "../config/env";
import "@fastify/websocket";

export async function consultationWsRoutes(app: FastifyInstance) {
  app.get("/ws/consultation", { websocket: true }, async (socket, request) => {
    const tokenSchema = z.object({ token: z.string().min(1) });
    const parsedQuery = tokenSchema.safeParse(request.query);
    if (!parsedQuery.success) {
      socket.send(JSON.stringify({ type: "error", message: "Token required" }));
      return socket.close(4401, "Unauthorized");
    }

    let payload: {
      sub: string;
      role: "USER" | "NURSE" | "ADMIN";
      username: string;
    };
    try {
      payload = app.jwt.verify(parsedQuery.data.token);
    } catch {
      socket.send(JSON.stringify({ type: "error", message: "Invalid token" }));
      return socket.close(4401, "Unauthorized");
    }

    const userId = payload.sub;

    connectionManager.add(userId, socket);
    await consultationService.setOnline(userId);

    const send = (msg: WsServerMessage) => socket.send(JSON.stringify(msg));

    send({ type: "connected", userId });

    const heartbeat = setInterval(() => {
      try {
        if (socket.readyState === socket.OPEN) socket.ping();
      } catch {
        /* noop */
      }
    }, env.WS_HEARTBEAT_INTERVAL_MS);

    socket.on("message", async (raw: any) => {
      let parsed;
      try {
        parsed = wsClientMessageSchema.safeParse(JSON.parse(raw.toString()));
      } catch {
        return send({ type: "error", message: "Invalid JSON" });
      }
      if (!parsed.success) {
        return send({ type: "error", message: "Invalid message format" });
      }

      const data = parsed.data;
      try {
        switch (data.type) {
          case "send_message":
            await consultationService.handleSendMessage({
              senderId: userId,
              senderRole: payload.role as any,
              roomId: data.roomId,
              content: data.content,
              clientMessageId: data.clientMessageId,
            });
            break;
          case "mark_read":
            await consultationService.handleMarkRead({
              userId,
              roomId: data.roomId,
              messageId: data.messageId,
            });
            break;
          case "typing":
            await consultationService.handleTyping({
              userId,
              roomId: data.roomId,
              isTyping: data.isTyping,
            });
            break;
          case "ping":
            send({ type: "pong" });
            break;
        }
      } catch (err: any) {
        send({ type: "error", message: err?.message ?? "Internal error" });
      }
    });

    socket.on("close", async () => {
      clearInterval(heartbeat);
      const wentOffline = connectionManager.remove(userId, socket);
      if (wentOffline) await consultationService.setOffline(userId);
    });
  });
}
