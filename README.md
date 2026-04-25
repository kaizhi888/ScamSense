<div align="center">

<img src="https://img.shields.io/badge/ScamSense-Stop%20Scams%20Before%20Money%20Leaves-FF4444?style=for-the-badge&logo=shield&logoColor=white" alt="ScamSense" />

<br /><br />

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-scamsense.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://scamsense.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20API%20Gateway-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![Alibaba Cloud](https://img.shields.io/badge/Alibaba%20Cloud-OSS%20%2B%20FC-FF6A00?style=for-the-badge&logo=alibabacloud&logoColor=white)](https://alibabacloud.com)

<br />

> ### 🛡️ Stop scam calls **before** money leaves your wallet.
> **Private, on-device AI scam-call protection for Touch 'n Go eWallet users in Malaysia.**

<br />

---

</div>

## 📖 Project Overview

Scam-call fraud is one of the most damaging financial threats in Malaysia. Fraudsters impersonate **PDRM, Bank Negara, banks, customs, delivery companies, and eWallet support teams**, then pressure victims into transferring money urgently under fabricated legal threats.

**ScamSense** intercepts the critical moment **before** money leaves the wallet:

| Step | Action |
|:----:|--------|
| 1️⃣ | Phone detects and monitors unknown calls |
| 2️⃣ | Call audio is transcribed **locally** (speech-to-text, never leaves the device) |
| 3️⃣ | Local **Qwen 2.5** model analyzes the transcript for scam intent |
| 4️⃣ | A **risk score + reason codes** are produced on-device |
| 5️⃣ | **Only anonymized risk metadata** is sent to the cloud — never audio or transcript |
| 6️⃣ | **AWS Lambda** logs the event; **Alibaba Cloud OSS** stores the risk record |
| 7️⃣ | Touch 'n Go eWallet shows a **critical scam warning**, blocking the transfer |

---

## 🎬 Demo Workflow

```
🏠 Home  ──▶  📞 Incoming Call  ──▶  📝 Live Transcript  ──▶  🤖 Local AI Analysis
   ──▶  📊 Risk Score  ──▶  ☁️  AWS + Alibaba Verification  ──▶  ⚠️  TNG Warning
   ──▶  🚫 Transfer Prevented  ──▶  📈 Dashboard / Architecture
```

Each step features a polished **phone-frame UI** with smooth Framer Motion transitions.

---

## ✅ Real vs. Simulated

| ✅ Real (Live) | 🔵 Simulated (Prototype) |
|---|---|
| AWS API Gateway + Lambda + CloudWatch (`ap-southeast-5`, Malaysia) | Phone call recording |
| Alibaba OSS anonymized risk-event upload (`oss-ap-southeast-3`, KL) | On-device speech-to-text |
| Alibaba Function Compute fraud enrichment (optional) | Local Qwen 2.5 inference |
| Next.js `/api/test-cloud` → dual-cloud proxy | Touch 'n Go backend/wallet action |
| Privacy enforcement (banned fields rejected server-side) | Fraud block enforcement |

> The `Prototype Simulation` label is shown in the UI for every mocked step. The Cloud Verification screen displays **real** request IDs, timestamps, and latency for everything that is live.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) · React 18 · TypeScript |
| **Styling** | Tailwind CSS · Custom risk-color design system |
| **Animations** | Framer Motion (transitions, risk meter, waveform) |
| **UI Components** | Lucide React · Recharts |
| **Cloud — AWS** | API Gateway HTTP API · Lambda (Node.js 20.x) · CloudWatch |
| **Cloud — Alibaba** | OSS (preferred) · Function Compute (optional) |
| **Server-side SDK** | ali-oss |

</div>

---

## ☁️ Cloud Architecture

### AWS Integration

```
POST {AWS_RISK_API_URL}
    └─▶ API Gateway (ap-southeast-5)
            └─▶ Lambda: scamsense-risk-event
                    └─▶ CloudWatch Logs: /aws/lambda/scamsense-risk-event
```

- Every "Test Cloud" click writes a `ScamSense risk event:` line with the returned `awsRequestId`.
- Setup guide: [`cloud/aws/README-AWS.md`](./cloud/aws/README-AWS.md)

### Alibaba Cloud Integration

```
POST /api/test-cloud
    └─▶ ali-oss SDK (server-side)
            └─▶ OSS Bucket: scamsense-demo-risk-events (oss-ap-southeast-3)
                    └─▶ Object: risk-events/{eventId}.json
```

- Each object includes metadata: `event-id`, `risk-level`, `risk-score`.
- Optional Function Compute path documented as an alternative.
- Setup guide: [`cloud/alibaba/README-ALIBABA.md`](./cloud/alibaba/README-ALIBABA.md)

---

## 🔒 Privacy Architecture

> **Audio and full transcripts never leave the device.**

```
On-Device                          Cloud (anonymized only)
─────────────────────────         ─────────────────────────────────
📱 Audio recording                 ✅ eventId
📝 Full transcript          ──▶   ✅ timestamp
🤖 Qwen 2.5 inference              ✅ riskScore / riskLevel
                                   ✅ reasonCodes
                                   ✅ targetWallet (masked)
                                   ✅ audioShared: false
                                   ✅ transcriptShared: false
```

- The API route, Lambda, and Function Compute all **reject** payloads containing `audio`, `audioBase64`, `transcript`, or `fullTranscript`.
- The Cloud Verification screen lets you inspect the exact JSON transmitted.

---

## 🤖 On-Device AI Design

ScamSense simulates an **on-device Qwen 2.5** model:

| Variant | Use Case |
|---------|----------|
| **Qwen 2.5 0.5B** | Lightweight — runs on older/entry-level Android phones |
| **Qwen 2.5 1.5B** | Enhanced reasoning — modern flagship devices |

### Risk Scoring Engine (`src/lib/riskEngine.ts`)

| Signal Detected | Score Weight |
|----------------|:------------:|
| 🏛️ Authority impersonation (PDRM / BNM / Bank) | **+25** |
| 💸 Money laundering allegation | **+20** |
| ⏰ Urgent transfer request | **+25** |
| 🔒 Account freeze threat | **+15** |
| 📱 Suspicious eWallet recipient | **+10** |
| ❓ Unknown caller number | **+5** |
| 🔴 **Maximum cap** | **100** |

The engine is **fully deterministic and explainable** — every point of a 94/100 score can be traced to a specific reason code.

---

## 🏆 Hackathon Judging Criteria

<details>
<summary><b>🤖 AI & Intelligent Systems</b></summary>

ScamSense uses simulated local **Qwen 2.5 inference** to detect authority impersonation, urgency signals, legal threats, account-freeze pressure, and suspicious transfer instructions. The risk engine is deterministic, explainable, and has a documented production drop-in path using ONNX Runtime Mobile.

</details>

<details>
<summary><b>⚙️ Technical Implementation</b></summary>

End-to-end prototype with: polished phone-frame mobile UI, 8-step guided workflow, deterministic risk engine, **real AWS API Gateway / Lambda / CloudWatch** integration, **real Alibaba OSS** integration, cloud verification screen with live request IDs and latency metrics, fraud intelligence dashboard, and full architecture diagram.

</details>

<details>
<summary><b>☁️ Multi-Cloud Service Usage</b></summary>

- **AWS**: API Gateway HTTP API → Lambda `scamsense-risk-event` → CloudWatch Logs (region `ap-southeast-5`).
- **Alibaba Cloud**: OSS bucket `scamsense-demo-risk-events` stores risk-event JSON (region `oss-ap-southeast-3`). Function Compute path also implemented.

</details>

<details>
<summary><b>🌍 Impact & Feasibility</b></summary>

Targets the most damaging fraud vector for Malaysian eWallet users. Privacy-first on-device design enables adoption by elderly, low-income, underserved, and unbanked communities — exactly the most-targeted demographics. Works on entry-level Android hardware.

</details>

<details>
<summary><b>🎤 Presentation & Teamwork</b></summary>

Guided step indicator, live cloud status dashboard, copy-payload button on the cloud verification screen, architecture diagram with "Why This Wins" section, and full setup documentation.

</details>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- AWS and/or Alibaba Cloud credentials (see environment setup below)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kaizh888/ScamSense.git
cd ScamSense

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your real cloud credentials

# 4. Start the development server
npm run dev
```

### Available Routes

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | 📱 Mobile demo (phone-frame UI) |
| `http://localhost:3000/dashboard` | 📊 Fraud Intelligence Console |
| `http://localhost:3000/architecture` | 🏗️ Architecture & Pitch Deck |

---

## 🔑 Environment Variables

Copy [`.env.example`](./.env.example) to `.env.local` and fill in your values:

```bash
# AWS — required for real AWS integration
AWS_RISK_API_URL=https://<api-id>.execute-api.ap-southeast-5.amazonaws.com/risk-event
AWS_REGION=ap-southeast-5

# Alibaba Cloud OSS — preferred path
ALIBABA_OSS_REGION=oss-ap-southeast-3
ALIBABA_OSS_BUCKET=scamsense-demo-risk-events
ALIBABA_OSS_ACCESS_KEY_ID=<your-key-id>
ALIBABA_OSS_ACCESS_KEY_SECRET=<your-key-secret>

# Alibaba Function Compute — optional alternative (leave blank to use OSS)
ALIBABA_FRAUD_API_URL=
```

> ⚠️ **Never commit `.env.local`** — it is gitignored. If any variable is missing, the corresponding Cloud Verification card shows **"Failed (not configured)"** with a clear message. The local demo continues to work regardless.

---

## ☁️ Cloud Setup Guides

| Cloud | Guide |
|-------|-------|
| AWS | [`cloud/aws/README-AWS.md`](./cloud/aws/README-AWS.md) |
| Alibaba Cloud | [`cloud/alibaba/README-ALIBABA.md`](./cloud/alibaba/README-ALIBABA.md) |
| OSS Fallback Notes | [`cloud/alibaba/oss-fallback-notes.md`](./cloud/alibaba/oss-fallback-notes.md) |

---

## 🗺️ Roadmap

- [ ] 📱 Native Android `CallScreeningService` for real call interception
- [ ] 🎙️ Real on-device speech-to-text (Whisper.cpp / Vosk — Malay & English)
- [ ] 🧠 Quantized Qwen 2.5 0.5B via ONNX Runtime Mobile
- [ ] 💳 TNG risk-engine API integration (replace simulated wallet warning)
- [ ] 🗃️ Crowd-sourced scam-number reputation database
- [ ] 🌐 Multilingual detection (BM · English · Mandarin · Cantonese · Tamil)
- [ ] 👴 Elderly Protection mode with simplified UI
- [ ] 👨‍👩‍👧 Family Alert mode (caregiver WhatsApp digest of high-risk events)

---

## 📄 License

This project is a prototype built for competition purposes.

---

<div align="center">

### 🏅 Built for

<br />

**TNG Digital FinHack 2026**
*Security & Fraud Track*

<br />

*Protecting Malaysian eWallet users from scam-call fraud — one call at a time.*

<br />

[![Live Demo](https://img.shields.io/badge/🌐%20Try%20it%20Live-scamsense.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://scamsense.netlify.app)

</div>
