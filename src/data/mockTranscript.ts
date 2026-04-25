export type TranscriptLine = {
  speaker: "Caller" | "User";
  text: string;
  riskTags: string[];
  /** Display delay (ms) for line-by-line reveal animation */
  revealAt: number;
};

export const mockTranscript: TranscriptLine[] = [
  {
    speaker: "Caller",
    text: "Hello, I'm calling from PDRM Malaysia.",
    riskTags: ["authority_impersonation"],
    revealAt: 800
  },
  {
    speaker: "Caller",
    text: "Your IC number has been linked to a money laundering investigation.",
    riskTags: ["legal_threat", "fear_pressure", "money_laundering_claim"],
    revealAt: 2400
  },
  {
    speaker: "Caller",
    text: "If you don't transfer your money out now, your bank account will be frozen permanently.",
    riskTags: ["urgency", "account_freeze_threat", "financial_pressure"],
    revealAt: 4400
  },
  {
    speaker: "Caller",
    text: "Please pay the fine immediately to this Touch 'n Go account: 018-992 1247.",
    riskTags: ["transfer_instruction", "suspicious_recipient", "urgency"],
    revealAt: 6600
  },
  {
    speaker: "Caller",
    text: "Do not tell anyone. This is confidential police business.",
    riskTags: ["isolation_pressure", "authority_impersonation"],
    revealAt: 8800
  }
];

/** Phrases to highlight live in the transcript view */
export const suspiciousPhrases: string[] = [
  "PDRM Malaysia",
  "money laundering",
  "transfer your money",
  "bank account will be frozen",
  "pay the fine",
  "Touch 'n Go account",
  "immediately",
  "Do not tell anyone",
  "confidential police"
];
