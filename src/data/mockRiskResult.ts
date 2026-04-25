export type RiskFactor = {
  label: string;
  level: "Low" | "Medium" | "High" | "Critical";
  contribution: number;
};

export type RiskResult = {
  riskScore: number;
  riskLevel: "Safe" | "Suspicious" | "Warning" | "Critical";
  verdict: string;
  confidence: number;
  reasonCodes: string[];
  factors: RiskFactor[];
  explanation: string;
  recommendation: string;
  recommendedActions: string[];
  privacy: {
    audioUploaded: boolean;
    transcriptUploaded: boolean;
    riskScoreShared: boolean;
  };
};

export const mockRiskResult: RiskResult = {
  riskScore: 94,
  riskLevel: "Critical",
  verdict: "Likely Scam Call Detected",
  confidence: 0.96,
  reasonCodes: [
    "AUTHORITY_IMPERSONATION",
    "MONEY_LAUNDERING_CLAIM",
    "ACCOUNT_FREEZE_THREAT",
    "URGENT_TRANSFER_REQUEST",
    "SUSPICIOUS_EWALLET_RECIPIENT"
  ],
  factors: [
    { label: "Authority impersonation", level: "High", contribution: 25 },
    { label: "Money laundering claim", level: "High", contribution: 20 },
    { label: "Account freeze threat", level: "High", contribution: 15 },
    { label: "Urgent transfer request", level: "Critical", contribution: 25 },
    { label: "Suspicious eWallet recipient", level: "Critical", contribution: 10 },
    { label: "Unknown number", level: "Medium", contribution: 5 }
  ],
  explanation:
    "The caller impersonated an authority figure, created urgency, threatened account freezing, claimed money laundering involvement, and requested immediate transfer to a third-party Touch 'n Go account.",
  recommendation: "Block transfer and warn user immediately.",
  recommendedActions: [
    "Do not transfer money",
    "Block the number",
    "Report to Touch 'n Go support",
    "Verify directly through official PDRM or Touch 'n Go channels"
  ],
  privacy: {
    audioUploaded: false,
    transcriptUploaded: false,
    riskScoreShared: true
  }
};

/** Map for risk level → color token */
export const riskLevelTone: Record<RiskResult["riskLevel"], string> = {
  Safe: "safe",
  Suspicious: "suspicious",
  Warning: "warning",
  Critical: "critical"
};
