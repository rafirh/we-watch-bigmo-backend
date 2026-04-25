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
      select: {
        fullName: true,
        // ── Data Diri yang Relevan Medis ──────────────────
        userDetail: {
          select: {
            tanggalLahir: true,
            statusPernikahan: true,
          },
        },
        // ── Riwayat Obstetri ──────────────────────────────
        obstetricHistory: {
          select: {
            gravida: true,
            partus: true,
            abortus: true,
            hpht: true,
            hplTaksiran: true,
            jarakKehamilanBulan: true,
            jarakKehamilanInterpretasi: true,
            jarakKehamilanKeterangan: true,
          },
        },
        // ── Data Pra Kehamilan ────────────────────────────
        prePregnancyData: {
          select: {
            beratBadanKg: true,
            tinggiBadanCm: true,
            imt: true,
            imtInterpretasi: true,
            imtKeterangan: true,
            targetKenaikanBbMin: true,
            targetKenaikanBbMax: true,
            imunisasiTtStatus: true,
            merokok: true,
            konsumsiAlkohol: true,
          },
        },
        // ── Riwayat Penyakit ──────────────────────────────
        medicalHistories: {
          select: {
            kategori: true,
            nama: true,
            kodeIcd10: true,
            keterangan: true,
          },
        },
        // ── Kunjungan ANC ─────────────────────────────────
        visits: {
          take: 1,
          select: {
            label: true,
            keteranganLabel: true,
            tanggalKunjungan: true,
            trimester: true,
            usiaKehamilanMinggu: true,
            faskes: true,
            kesanKlinis: true,
            // Pemeriksaan Ibu
            motherExamination: {
              select: {
                beratBadanKg: true,
                lilaCm: true,
                lilaInterpretasi: true,
                lilaKeterangan: true,
                tinggiUteriCm: true,
                tinggiUteriInterpretasi: true,
                tinggiUteriKeterangan: true,
                tdSistolik: true,
                tdDiastolik: true,
                tdInterpretasi: true,
                tdKeterangan: true,
                nadi: true,
                nadiInterpretasi: true,
                suhu: true,
                suhuInterpretasi: true,
                pernapasan: true,
                pernapasanInterpretasi: true,
                golonganDarah: true,
                rhesus: true,
                // Pemeriksaan fisik — hanya yang abnormal biasanya dicatat
                konjungtiva: true,
                sklera: true,
                tungkai: true,
              },
            },
            // Pemeriksaan Janin
            fetalExamination: {
              select: {
                djjBpm: true,
                djjInterpretasi: true,
                djjKeterangan: true,
                jumlahJanin: true,
                presentasi: true,
                taksiranBeratJaninGram: true,
                taksiranBeratKeterangan: true,
                usgLetakJanin: true,
                usgKeterangan: true,
              },
            },
            // Lab / 10T
            labExamination: {
              select: {
                hemoglobinGdL: true,
                hemoglobinInterpretasi: true,
                hemoglobinKeterangan: true,
                skriningHiv: true,
                skriningSifilis: true,
                skriningHepB: true,
                gulaDarahMgdL: true,
                gulaDarahInterpretasi: true,
                gulaDarahKeterangan: true,
                proteinUrinMgdL: true,
                proteinUrinInterpretasi: true,
                proteinUrinKeterangan: true,
              },
            },
            // Pemantauan 4T
            fourTMonitoring: {
              select: {
                terlaluMuda: true,
                terlaluTua: true,
                terlaluRapat: true,
                terlaluSering: true,
                keterangan: true,
              },
            },
            // Makanan Tambahan
            supplementaryFood: {
              select: {
                diberikanMt: true,
                jenisMt: true,
              },
            },
            // Rencana Tindak Lanjut
            followUpPlans: {
              select: {
                urutan: true,
                keterangan: true,
                status: true,
              },
              orderBy: { urutan: "asc" },
            },
            // Kondisi Lain
            otherCondition: {
              select: {
                disabilitas: true,
                ikutKelasIbuHamil: true,
                keterangan: true,
              },
            },
          },
          orderBy: { tanggalKunjungan: "asc" },
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
