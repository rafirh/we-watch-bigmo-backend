import { consultationRepository } from "../repositories/consultation.repository";
import { consultationCacheRepository } from "../repositories/consultationCache.repository";
import { connectionManager } from "./wsConnection.service";
import { Message, WsServerMessage } from "../models/consultation.model";
import { env } from "../config/env";
import { ConsultationSenderRole, Role } from "../generated/prisma/enums";

const toApiMessage = (m: {
  id: string;
  roomId: string;
  senderId: string;
  senderRole: ConsultationSenderRole;
  content: string;
  readAt: Date | null;
  createdAt: Date;
}): Message => ({
  id: m.id,
  roomId: m.roomId,
  senderId: m.senderId,
  senderRole: m.senderRole,
  content: m.content,
  readAt: m.readAt?.toISOString() ?? null,
  createdAt: m.createdAt.toISOString(),
});

export const consultationService = {
  // -------- request consultation (POST) --------
  async requestConsultation(userId: string) {
    // Idempoten: kalau sudah ada room, kembalikan
    const existing = await consultationRepository.findRoomByUser(userId);
    if (existing) {
      return {
        roomId: existing.id,
        nurse: existing.nurse,
        createdAt: existing.createdAt.toISOString(),
      };
    }

    const nurse = await consultationRepository.findLeastLoadedNurse();
    if (!nurse) {
      throw Object.assign(new Error("No nurse available right now"), {
        statusCode: 503,
      });
    }

    const room = await consultationRepository.createRoom(userId, nurse.id);
    return {
      roomId: room.id,
      nurse: room.nurse,
      createdAt: room.createdAt.toISOString(),
    };
  },

  // -------- list rooms --------
  async listMyRooms(userId: string, role: Role) {
    if (role === Role.NURSE) {
      const rooms = await consultationRepository.listRoomsForNurse(userId);
      return Promise.all(
        rooms.map(async (r) => ({
          id: r.id,
          partner: {
            id: r.user.id,
            fullName: r.user.fullName,
            role: "USER" as const,
          },
          lastMessage: r.messages[0]
            ? {
                content: r.messages[0].content,
                senderId: r.messages[0].senderId,
                createdAt: r.messages[0].createdAt.toISOString(),
              }
            : null,
          unreadCount: await consultationRepository.countUnread(r.id, userId),
        })),
      );
    }

    const room = await consultationRepository.findRoomByUser(userId);
    if (!room) return [];
    return [
      {
        id: room.id,
        partner: {
          id: room.nurse.id,
          fullName: room.nurse.fullName,
          role: "NURSE" as const,
        },
        lastMessage: null, // bisa di-enrich kalau perlu
        unreadCount: await consultationRepository.countUnread(room.id, userId),
      },
    ];
  },

  // -------- get messages (cache-first untuk page pertama) --------
  async getMessages(roomId: string, userId: string, cursor?: string) {
    await consultationService.ensureMember(roomId, userId);

    const limit = 30;

    // Page pertama (no cursor) → coba cache dulu
    if (!cursor) {
      const cached = await consultationCacheRepository.getRecent(roomId);
      if (cached.length > 0) {
        return {
          data: cached.slice(0, limit),
          hasMore: cached.length >= limit,
          nextCursor: null, // page selanjutnya pakai DB
        };
      }
    }

    const decoded = cursor
      ? consultationService.decodeCursor(cursor)
      : undefined;
    const rows = await consultationRepository.listMessages(
      roomId,
      limit,
      decoded,
    );

    const hasMore = rows.length > limit;
    const slice = hasMore ? rows.slice(0, limit) : rows;
    const last = slice[slice.length - 1];

    return {
      data: slice.map(toApiMessage),
      hasMore,
      nextCursor:
        hasMore && last
          ? consultationService.encodeCursor(last.createdAt, last.id)
          : null,
    };
  },

  // -------- handle WS: send message --------
  async handleSendMessage(opts: {
    senderId: string;
    senderRole: Role;
    roomId: string;
    content: string;
    clientMessageId: string;
  }) {
    const room = await consultationService.ensureMember(
      opts.roomId,
      opts.senderId,
    );

    const senderRoleEnum =
      opts.senderRole === Role.NURSE
        ? ConsultationSenderRole.NURSE
        : ConsultationSenderRole.USER;

    const created = await consultationRepository.createMessage({
      roomId: opts.roomId,
      senderId: opts.senderId,
      senderRole: senderRoleEnum,
      content: opts.content,
    });

    const apiMsg = toApiMessage(created);

    // Update cache
    await consultationCacheRepository.pushRecent(opts.roomId, apiMsg);

    connectionManager.send(opts.senderId, {
      type: "message_ack",
      clientMessageId: opts.clientMessageId,
      message: apiMsg,
    });

    const recipientId =
      room.userId === opts.senderId ? room.nurseId : room.userId;
    connectionManager.send(recipientId, { type: "message", message: apiMsg });

    return apiMsg;
  },

  async handleMarkRead(opts: {
    userId: string;
    roomId: string;
    messageId: string;
  }) {
    const room = await consultationService.ensureMember(
      opts.roomId,
      opts.userId,
    );
    const updated = await consultationRepository.markAsRead(opts.messageId);

    const otherUserId =
      room.userId === opts.userId ? room.nurseId : room.userId;
    const event: WsServerMessage = {
      type: "message_read",
      roomId: opts.roomId,
      messageId: opts.messageId,
      readAt: updated.readAt!.toISOString(),
    };
    connectionManager.send(otherUserId, event);
    connectionManager.send(opts.userId, event); // multi-device sync
  },

  async handleTyping(opts: {
    userId: string;
    roomId: string;
    isTyping: boolean;
  }) {
    const room = await consultationService.ensureMember(
      opts.roomId,
      opts.userId,
    );
    const otherUserId =
      room.userId === opts.userId ? room.nurseId : room.userId;
    connectionManager.send(otherUserId, {
      type: "typing",
      roomId: opts.roomId,
      userId: opts.userId,
      isTyping: opts.isTyping,
    });
  },

  async setOnline(userId: string) {
    await consultationCacheRepository.setOnline(userId);
    await consultationService.broadcastPresence(userId, true);
  },

  async setOffline(userId: string) {
    await consultationCacheRepository.setOffline(userId);
    await consultationService.broadcastPresence(userId, false);
  },

  async broadcastPresence(userId: string, online: boolean) {
    const userRoom = await consultationRepository.findRoomByUser(userId);
    if (userRoom) {
      connectionManager.send(userRoom.nurseId, {
        type: "presence",
        userId,
        online,
      });
      return;
    }
    const nurseRooms = await consultationRepository.listRoomsForNurse(userId);
    for (const r of nurseRooms) {
      connectionManager.send(r.userId, { type: "presence", userId, online });
    }
  },

  async ensureMember(roomId: string, userId: string) {
    const room = await consultationRepository.findRoomById(roomId);
    if (!room) {
      throw Object.assign(new Error("Room not found"), { statusCode: 404 });
    }
    if (room.userId !== userId && room.nurseId !== userId) {
      throw Object.assign(new Error("You are not a member of this room"), {
        statusCode: 403,
      });
    }
    return room;
  },

  encodeCursor(createdAt: Date, id: string) {
    return Buffer.from(
      JSON.stringify({ c: createdAt.toISOString(), i: id }),
    ).toString("base64url");
  },

  decodeCursor(cursor: string) {
    try {
      const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString());
      return { createdAt: new Date(parsed.c), id: parsed.i };
    } catch {
      throw Object.assign(new Error("Invalid cursor"), { statusCode: 400 });
    }
  },
};
