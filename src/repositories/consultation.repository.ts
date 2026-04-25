import { prisma } from "../config/prisma";
import { ConsultationSenderRole, Role } from "../generated/prisma/enums";

export const consultationRepository = {
  findRoomByUser(userId: string) {
    return prisma.consultationRoom.findUnique({
      where: { userId },
      include: {
        nurse: { select: { id: true, fullName: true, username: true } },
      },
    });
  },

  findRoomById(roomId: string) {
    return prisma.consultationRoom.findUnique({ where: { id: roomId } });
  },

  listRoomsForNurse(nurseId: string) {
    return prisma.consultationRoom.findMany({
      where: { nurseId },
      include: {
        user: { select: { id: true, fullName: true, role: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });
  },

  createRoom(userId: string, nurseId: string) {
    return prisma.consultationRoom.create({
      data: { userId, nurseId },
      include: {
        nurse: { select: { id: true, fullName: true, username: true } },
      },
    });
  },

  // ----- NURSE ASSIGNMENT -----
  /**
   * Auto-assign: ambil nurse dengan jumlah room paling sedikit.
   * Tie-breaker: yang paling lama gak dapet user baru (createdAt asc).
   */
  async findLeastLoadedNurse() {
    const nurses = await prisma.user.findMany({
      where: { role: Role.NURSE },
      include: { _count: { select: { nurseConsultations: true } } },
    });
    if (nurses.length === 0) return null;

    nurses.sort(
      (a, b) => a._count.nurseConsultations - b._count.nurseConsultations,
    );
    return nurses[0];
  },

  // ----- MESSAGES -----
  createMessage(data: {
    roomId: string;
    senderId: string;
    senderRole: ConsultationSenderRole;
    content: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const msg = await tx.consultationMessage.create({ data });
      await tx.consultationRoom.update({
        where: { id: data.roomId },
        data: { updatedAt: new Date() },
      });
      return msg;
    });
  },

  /**
   * Cursor-based pagination (createdAt desc, then id desc as tie-breaker).
   * Cursor = base64({createdAt, id})
   */
  listMessages(
    roomId: string,
    limit: number,
    cursor?: { createdAt: Date; id: string },
  ) {
    return prisma.consultationMessage.findMany({
      where: {
        roomId,
        ...(cursor && {
          OR: [
            { createdAt: { lt: cursor.createdAt } },
            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
          ],
        }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1, // +1 untuk hasMore detection
    });
  },

  markAsRead(messageId: string) {
    return prisma.consultationMessage.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  },

  countUnread(roomId: string, userId: string) {
    return prisma.consultationMessage.count({
      where: {
        roomId,
        readAt: null,
        senderId: { not: userId }, // pesan yang dikirim *bukan oleh* user ini
      },
    });
  },
};
