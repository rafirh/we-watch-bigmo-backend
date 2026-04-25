import { prisma } from "../config/prisma";
import { RiskLevel } from "../generated/prisma/enums";

export const classificationRepository = {
  async findByUserId(userId: string) {
    return prisma.userMaternalClassification.findUnique({
      where: { userId },
    });
  },

  async upsert(data: {
    userId: string;
    visitId: string;
    riskLevel: RiskLevel;
    explanation: string;
    probabilities: { low: number; mid: number; high: number };
  }) {
    return prisma.userMaternalClassification.upsert({
      where: { userId: data.userId },
      create: {
        userId: data.userId,
        visitId: data.visitId,
        riskLevel: data.riskLevel,
        explanation: data.explanation,
        probLowRisk: data.probabilities.low,
        probMidRisk: data.probabilities.mid,
        probHighRisk: data.probabilities.high,
      },
      update: {
        visitId: data.visitId,
        riskLevel: data.riskLevel,
        explanation: data.explanation,
        probLowRisk: data.probabilities.low,
        probMidRisk: data.probabilities.mid,
        probHighRisk: data.probabilities.high,
      },
    });
  },

  /**
   * Ambil last visit + relasi yang dibutuhkan untuk klasifikasi.
   * Kalau ada field yang belum diisi (motherExamination/labExamination null),
   * service yang putuskan harus error atau pakai fallback.
   */
  async findLastVisitWithVitals(userId: string) {
    return prisma.visit.findFirst({
      where: { userId },
      orderBy: { tanggalKunjungan: "desc" },
      include: {
        motherExamination: true,
        labExamination: true,
      },
    });
  },

  async findUserBirthDate(userId: string) {
    const detail = await prisma.userDetail.findUnique({
      where: { userId },
      select: { tanggalLahir: true },
    });
    return detail?.tanggalLahir ?? null;
  },
};
