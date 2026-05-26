import { z } from "zod";

const nullableString = z.string().nullable();
const nullableNumber = z.number().nullable();
const nullableDate = z.date().nullable();

const motherExaminationSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  beratBadanKg: z.number(),
  beratBadanKeterangan: nullableString,
  lilaCm: z.number(),
  lilaInterpretasi: nullableString,
  lilaKeterangan: nullableString,
  tinggiUteriCm: nullableNumber,
  tinggiUteriInterpretasi: nullableString,
  tinggiUteriKeterangan: nullableString,
  tdSistolik: z.number(),
  tdDiastolik: z.number(),
  tdInterpretasi: nullableString,
  tdKeterangan: nullableString,
  nadi: z.number(),
  nadiInterpretasi: nullableString,
  suhu: z.number(),
  suhuInterpretasi: nullableString,
  pernapasan: z.number(),
  pernapasanInterpretasi: nullableString,
  golonganDarah: z.enum(["A", "B", "AB", "O"]).nullable(),
  rhesus: z.enum(["POSITIF", "NEGATIF"]).nullable(),
  konjungtiva: nullableString,
  sklera: nullableString,
  leher: nullableString,
  gigiMulut: nullableString,
  tht: nullableString,
  dadaJantung: nullableString,
  dadaParu: nullableString,
  perut: nullableString,
  tungkai: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const fetalExaminationSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  djjBpm: z.number().nullable(),
  djjInterpretasi: nullableString,
  djjKeterangan: nullableString,
  jumlahJanin: z.number(),
  presentasi: nullableString,
  kepalaThPap: nullableString,
  taksiranBeratJaninGram: z.number().nullable(),
  taksiranBeratKeterangan: nullableString,
  usgGestationalSacCm: nullableNumber,
  usgCrownRumpLengthCm: nullableNumber,
  usgLetakJanin: nullableString,
  usgKeterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const labExaminationSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  hemoglobinGdL: nullableNumber,
  hemoglobinInterpretasi: nullableString,
  hemoglobinKeterangan: nullableString,
  skriningHiv: z.enum(["REACTIVE", "NON_REACTIVE", "INDETERMINATE"]).nullable(),
  skriningSifilis: z.enum(["REACTIVE", "NON_REACTIVE"]).nullable(),
  skriningHepB: z.enum(["REACTIVE", "NON_REACTIVE"]).nullable(),
  gulaDarahMgdL: nullableNumber,
  gulaDarahInterpretasi: nullableString,
  gulaDarahKeterangan: nullableString,
  proteinUrinMgdL: nullableNumber,
  proteinUrinInterpretasi: nullableString,
  proteinUrinKeterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const fourTMonitoringSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  terlaluMuda: z.boolean(),
  terlaluTua: z.boolean(),
  terlaluRapat: z.boolean(),
  terlaluSering: z.boolean(),
  keterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const supplementaryFoodSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  diberikanMt: z.boolean(),
  jenisMt: nullableString,
  keterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const otherConditionSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  disabilitas: z.boolean(),
  ikutKelasIbuHamil: z.boolean(),
  keterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const followUpPlanSchema = z.object({
  id: z.string(),
  visitId: z.string(),
  urutan: z.number(),
  keterangan: z.string(),
  status: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const todoIdParamSchema = z.object({
  todoId: z.string().uuid(),
});

export const visitIdParamSchema = z.object({
  visitId: z.string().uuid(),
});

export const updateTodoStatusBodySchema = z.object({
  status: z.boolean(),
});

export const todoResponseSchema = followUpPlanSchema;

export const currentTodosResponseSchema = z.array(todoResponseSchema);

const visitWithRelationsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  label: z.enum(["K1M", "K1A", "K2", "K3", "K4", "K5", "K6"]),
  keteranganLabel: nullableString,
  tanggalKunjungan: z.date(),
  trimester: z.enum(["TRIMESTER_1", "TRIMESTER_2", "TRIMESTER_3"]),
  usiaKehamilanMinggu: z.number(),
  faskes: z.string(),
  pemeriksa: z.string(),
  kesanKlinis: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
  motherExamination: motherExaminationSchema.nullable(),
  fetalExamination: fetalExaminationSchema.nullable(),
  labExamination: labExaminationSchema.nullable(),
  fourTMonitoring: fourTMonitoringSchema.nullable(),
  supplementaryFood: supplementaryFoodSchema.nullable(),
  otherCondition: otherConditionSchema.nullable(),
  followUpPlans: z.array(followUpPlanSchema),
});

export const visitDetailResponseSchema = visitWithRelationsSchema;

const userDetailSchema = z.object({
  id: z.string(),
  userId: z.string(),
  noRekamMedis: nullableString,
  jenisKelamin: z.string(),
  tempatLahir: nullableString,
  tanggalLahir: nullableDate,
  namaIbuKandung: nullableString,
  statusPernikahan: nullableString,
  noTelepon: nullableString,
  jalan: nullableString,
  rt: nullableString,
  rw: nullableString,
  kelurahanKode: nullableString,
  kecamatanKode: nullableString,
  kotaKabupaten: nullableString,
  kodeKota: nullableString,
  provinsi: nullableString,
  kodeProvinsi: nullableString,
  kodePos: nullableString,
  negara: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const obstetricHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  gravida: z.number(),
  partus: z.number(),
  abortus: z.number(),
  hpht: z.date(),
  hplTaksiran: z.date(),
  jarakKehamilanBulan: z.number().nullable(),
  jarakKehamilanInterpretasi: nullableString,
  jarakKehamilanKeterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const prePregnancyDataSchema = z.object({
  id: z.string(),
  userId: z.string(),
  beratBadanKg: z.number(),
  tinggiBadanCm: z.number(),
  imt: z.number(),
  imtInterpretasi: nullableString,
  imtKeterangan: nullableString,
  targetKenaikanBbMin: nullableNumber,
  targetKenaikanBbMax: nullableNumber,
  imunisasiTtStatus: z.enum(["T0", "T1", "T2", "T3", "T4", "T5"]),
  merokok: z.boolean(),
  konsumsiAlkohol: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const medicalHistorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  kategori: z.string(),
  nama: z.string(),
  kodeIcd10: nullableString,
  keterangan: nullableString,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const meVisitsResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    nik: z.string(),
    fullName: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.enum(["ADMIN", "USER"]),
    createdAt: z.date(),
    updatedAt: z.date(),
    userDetail: userDetailSchema.nullable(),
    obstetricHistory: obstetricHistorySchema.nullable(),
    prePregnancyData: prePregnancyDataSchema.nullable(),
    medicalHistories: z.array(medicalHistorySchema),
  }),
  visits: z.array(visitWithRelationsSchema),
});

export type MeVisitsResponse = z.infer<typeof meVisitsResponseSchema>;