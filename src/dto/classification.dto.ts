import { RiskLevel } from "../generated/prisma/enums";

export type RiskLevelString = "low risk" | "mid risk" | "high risk";

export function toDbRisk(risk: RiskLevelString): RiskLevel {
  switch (risk) {
    case "low risk":
      return RiskLevel.LOW_RISK;
    case "mid risk":
      return RiskLevel.MID_RISK;
    case "high risk":
      return RiskLevel.HIGH_RISK;
  }
}

export function fromDbRisk(risk: RiskLevel): RiskLevelString {
  switch (risk) {
    case RiskLevel.LOW_RISK:
      return "low risk";
    case RiskLevel.MID_RISK:
      return "mid risk";
    case RiskLevel.HIGH_RISK:
      return "high risk";
  }
}

export function calculateAge(
  birthDate: Date,
  today: Date = new Date(),
): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
