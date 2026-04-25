import { classificationRepository } from "../repositories/classification.repository";
import { classificationApiRepository } from "../repositories/classificationApi.repository";
import { classificationCacheRepository } from "../repositories/classificationCache.repository";
import { openaiService } from "./openai.service";
import { calculateAge, toDbRisk } from "../dto/classification.dto";
import { ClassificationResponse } from "../models/classification.model";

export const classificationService = {
  async getOrCompute(userId: string): Promise<ClassificationResponse> {
    const visit =
      await classificationRepository.findLastVisitWithVitals(userId);

    if (!visit) {
      return {
        visitId: null,
        riskLevel: "low risk",
        explanation:
          "Belum ada data kunjungan ANC yang tercatat. Klasifikasi risiko akan tersedia setelah Anda melakukan pemeriksaan kehamilan pertama. Silakan kunjungi fasilitas kesehatan terdekat untuk pemeriksaan rutin.",
        probabilities: { "low risk": 0, "mid risk": 0, "high risk": 0 },
        cached: false,
        hasVisit: false,
        evaluatedAt: new Date().toISOString(),
      };
    }

    const cached = await classificationCacheRepository.get(userId);
    if (cached && cached.visitId === visit.id) {
      return {
        visitId: cached.visitId,
        riskLevel: cached.riskLevel,
        explanation: cached.explanation,
        probabilities: cached.probabilities,
        hasVisit: true,
        cached: true,
        evaluatedAt: cached.evaluatedAt,
      };
    }

    const mother = visit.motherExamination;
    const lab = visit.labExamination;
    if (!mother) {
      throw Object.assign(
        new Error("Mother examination data is missing for the latest visit."),
        { statusCode: 422 },
      );
    }
    if (!lab || lab.gulaDarahMgdL == null) {
      throw Object.assign(
        new Error("Blood sugar data is missing for the latest visit."),
        { statusCode: 422 },
      );
    }

    const birthDate = await classificationRepository.findUserBirthDate(userId);
    if (!birthDate) {
      throw Object.assign(
        new Error("User birth date is required. Please complete your profile."),
        { statusCode: 422 },
      );
    }

    const age = calculateAge(birthDate);
    const gulaDarah = lab.gulaDarahMgdL / 10;

    const apiResponse = await classificationApiRepository.predict({
      Age: age,
      SystolicBP: mother.tdSistolik,
      DiastolicBP: mother.tdDiastolik,
      BS: gulaDarah,
      BodyTemp: mother.suhu,
      HeartRate: mother.nadi,
    });

    const explanation = await openaiService.explainClassification(apiResponse, {
      age,
      systolicBP: mother.tdSistolik,
      diastolicBP: mother.tdDiastolik,
      bs: lab.gulaDarahMgdL,
      bodyTemp: mother.suhu,
      heartRate: mother.nadi,
    });

    await classificationRepository.upsert({
      userId,
      visitId: visit.id,
      riskLevel: toDbRisk(apiResponse.risk_level),
      explanation,
      probabilities: {
        low: apiResponse.probabilities["low risk"],
        mid: apiResponse.probabilities["mid risk"],
        high: apiResponse.probabilities["high risk"],
      },
    });

    const evaluatedAt = new Date().toISOString();
    await classificationCacheRepository.set(userId, {
      visitId: visit.id,
      riskLevel: apiResponse.risk_level,
      explanation,
      probabilities: apiResponse.probabilities,
      evaluatedAt,
    });

    return {
      visitId: visit.id,
      riskLevel: apiResponse.risk_level,
      explanation,
      probabilities: apiResponse.probabilities,
      cached: false,
      hasVisit: true,
      evaluatedAt,
    };
  },
};
