import { prisma } from "../config/prisma";
import { Prisma, User } from "../generated/prisma/client";

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByNik(nik: string) {
    return prisma.user.findUnique({ where: { nik } });
  },

  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  findByIdentifier(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  },

  findMeDetailsById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        userDetail: true,
        obstetricHistory: true,
        prePregnancyData: true,
        medicalHistories: true,
        visits: {
          select: {
            trimester: true,
            tanggalKunjungan: true,
            supplementaryFood: true,
            keteranganLabel: true,
            label: true,
            otherCondition: true,
            labExamination: true,
            motherExamination: true,
          },
        },
      },
    });
  },

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  findAll(skip = 0, take = 50) {
    return prisma.$transaction([
      prisma.user.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
      prisma.user.count(),
    ]);
  },

  findMeWithVisits(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        userDetail: true,
        obstetricHistory: true,
        prePregnancyData: true,
        medicalHistories: true,
        visits: {
          orderBy: { tanggalKunjungan: "desc" },
          include: {
            motherExamination: true,
            fetalExamination: true,
            labExamination: true,
            fourTMonitoring: true,
            supplementaryFood: true,
            otherCondition: true,
            followUpPlans: {
              orderBy: { urutan: "asc" },
            },
          },
        },
      },
    });
  },

  async updateTodoStatus(todoId: string, userId: string, status: boolean) {
    const todo = await prisma.followUpPlan.findFirst({
      where: {
        id: todoId,
        visit: {
          userId,
        },
      },
    });

    if (!todo) {
      return null;
    }

    return prisma.followUpPlan.update({
      where: { id: todoId },
      data: { status },
    });
  },

  findVisitDetailById(visitId: string, userId: string) {
    return prisma.visit.findFirst({
      where: {
        id: visitId,
        userId,
      },
      include: {
        motherExamination: true,
        fetalExamination: true,
        labExamination: true,
        fourTMonitoring: true,
        supplementaryFood: true,
        otherCondition: true,
        followUpPlans: {
          orderBy: { urutan: "asc" },
        },
      },
    });
  },

  findLastVisitByUserId(userId: string) {
    return prisma.visit.findFirst({
      where: { userId },
      orderBy: [
        { tanggalKunjungan: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        motherExamination: true,
        fetalExamination: true,
        labExamination: true,
        fourTMonitoring: true,
        supplementaryFood: true,
        otherCondition: true,
        followUpPlans: {
          orderBy: { urutan: "asc" },
        },
      },
    });
  },

  updateMyProfile(userId: string, data: { fullName: string; username: string }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        username: data.username,
      },
    });
  },

  deleteById(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
