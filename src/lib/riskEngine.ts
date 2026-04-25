import type { RiskResult } from "@/data/mockRiskResult";

/**
 * Deterministic prototype risk engine.
 * Maps detected reason codes to weighted contributions, capped at 100.
 *
 * In production this would be replaced by on-device Qwen 2.5 inference
 * over a real call transcript. For demo, we use a transparent rule-based
 * scorer so judges can trace exactly how the score is built.
 */

export type ReasonCode =
  | "AUTHORITY_IMPERSONATION"
  | "MONEY_LAUNDERING_CLAIM"
  | "ACCOUNT_FREEZE_THREAT"
  | "URGENT_TRANSFER_REQUEST"
  | "SUSPICIOUS_EWALLET_RECIPIENT"
  | "UNKNOWN_NUMBER"
  | "FEAR_PRESSURE"
  | "ISOLATION_PRESSURE";

export const REASON_WEIGHTS: Record<ReasonCode, number> = {
  AUTHORITY_IMPERSONATION: 25,
  MONEY_LAUNDERING_CLAIM: 20,
  URGENT_TRANSFER_REQUEST: 25,
  ACCOUNT_FREEZE_THREAT: 15,
  SUSPICIOUS_EWALLET_RECIPIENT: 10,
  UNKNOWN_NUMBER: 5,
  FEAR_PRESSURE: 5,
  ISOLATION_PRESSURE: 5
};

export const REASON_LABELS: Record<ReasonCode, string> = {
  AUTHORITY_IMPERSONATION: "Authority impersonation",
  MONEY_LAUNDERING_CLAIM: "Money laundering claim",
  URGENT_TRANSFER_REQUEST: "Urgent transfer request",
  ACCOUNT_FREEZE_THREAT: "Account freeze threat",
  SUSPICIOUS_EWALLET_RECIPIENT: "Suspicious eWallet recipient",
  UNKNOWN_NUMBER: "Unknown number",
  FEAR_PRESSURE: "Fear pressure",
  ISOLATION_PRESSURE: "Isolation pressure"
};

export function scoreFromReasons(codes: ReasonCode[]): number {
  const total = codes.reduce((sum, code) => sum + (REASON_WEIGHTS[code] ?? 0), 0);
  return Math.min(100, total);
}

export function levelFromScore(score: number): RiskResult["riskLevel"] {
  if (score >= 80) return "Critical";
  if (score >= 60) return "Warning";
  if (score >= 30) return "Suspicious";
  return "Safe";
}

export function levelTone(level: RiskResult["riskLevel"]) {
  switch (level) {
    case "Critical":
      return { color: "#EF4444", token: "critical" };
    case "Warning":
      return { color: "#F97316", token: "warning" };
    case "Suspicious":
      return { color: "#F59E0B", token: "suspicious" };
    case "Safe":
      return { color: "#10B981", token: "safe" };
  }
}

/** Convenience: full pipeline from reason codes → result shape */
export function computeRiskResult(codes: ReasonCode[]): {
  riskScore: number;
  riskLevel: RiskResult["riskLevel"];
} {
  const riskScore = scoreFromReasons(codes);
  const riskLevel = levelFromScore(riskScore);
  return { riskScore, riskLevel };
}
