import { prisma } from "../config/prisma";

export const conditionRepository = {
  findByUserId(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        obstetricHistory: {
          select: {
            hpht: true,
            hplTaksiran: true,
          },
        },
        visits: {
          orderBy: { tanggalKunjungan: "desc" },
          select: {
            id: true,
            userId: true,
            label: true,
            keteranganLabel: true,
            tanggalKunjungan: true,
            trimester: true,
            usiaKehamilanMinggu: true,
            faskes: true,
            pemeriksa: true,
            kesanKlinis: true,
          },
        },
      },
    });
  },
};