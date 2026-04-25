export type RiskCloudPayload = {
  eventId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: "safe" | "suspicious" | "warning" | "critical";
  reasonCodes: string[];
  targetWallet: string;
  amount: number;
  currency: string;
  audioShared: false;
  transcriptShared: false;
  riskScoreShared: true;
  demoMode: boolean;
  cloudProviders: ["AWS", "Alibaba Cloud"];
};

export const cloudPayload: RiskCloudPayload = {
  eventId: "scamsense-demo-001",
  timestamp: "2026-01-15T10:30:00+08:00",
  riskScore: 94,
  riskLevel: "critical",
  reasonCodes: [
    "AUTHORITY_IMPERSONATION",
    "MONEY_LAUNDERING_CLAIM",
    "ACCOUNT_FREEZE_THREAT",
    "URGENT_TRANSFER_REQUEST",
    "SUSPICIOUS_EWALLET_RECIPIENT"
  ],
  targetWallet: "masked_tng_018****247",
  amount: 2500,
  currency: "MYR",
  audioShared: false,
  transcriptShared: false,
  riskScoreShared: true,
  demoMode: true,
  cloudProviders: ["AWS", "Alibaba Cloud"]
};

/** Build a fresh payload at runtime (so eventId/timestamp are unique per click) */
export function buildPayload(overrides?: Partial<RiskCloudPayload>): RiskCloudPayload {
  const now = new Date();
  const id = `scamsense-${now.getTime().toString(36)}`;
  return {
    ...cloudPayload,
    eventId: id,
    timestamp: now.toISOString(),
    ...overrides
  };
}
