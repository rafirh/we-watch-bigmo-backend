import { conditionRepository } from "../repositories/condition.repository";
import { ConditionsResponse } from "../models/condition.model";

const TOTAL_PREGNANCY_DAYS = 280;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

function toUtcStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function calculatePregnancyProgress(hpht: Date | null): number {
  if (!hpht) {
    return 0;
  }

  const hphtUtc = toUtcStart(hpht);
  const nowUtc = toUtcStart(new Date());
  const elapsedDays = Math.floor((nowUtc.getTime() - hphtUtc.getTime()) / ONE_DAY_IN_MS);
  const rawProgress = (elapsedDays / TOTAL_PREGNANCY_DAYS) * 100;

  return Number(Math.max(0, Math.min(100, rawProgress)).toFixed(2));
}

export const conditionService = {
  async getMyConditions(userId: string): Promise<ConditionsResponse> {
    const data = await conditionRepository.findByUserId(userId);
    if (!data) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    const hpht = data.obstetricHistory?.hpht ?? null;
    const hplTaksiran = data.obstetricHistory?.hplTaksiran ?? null;

    return {
      pregnancyProgress: calculatePregnancyProgress(hpht),
      hpht,
      hplTaksiran,
      visits: data.visits,
    };
  },
};