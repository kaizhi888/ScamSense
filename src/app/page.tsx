"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import HomeScreen from "@/components/HomeScreen";
import IncomingCall from "@/components/IncomingCall";
import LiveTranscript from "@/components/LiveTranscript";
import LocalAIAnalysis from "@/components/LocalAIAnalysis";
import RiskScoreMeter from "@/components/RiskScoreMeter";
import CloudVerification from "@/components/CloudVerification";
import TngWarning from "@/components/TngWarning";
import ProtectionSummary from "@/components/ProtectionSummary";

type Screen =
  | "home"
  | "incoming"
  | "transcript"
  | "analyzing"
  | "result"
  | "cloud"
  | "warning"
  | "success";

const STEP_INDEX: Record<Screen, number> = {
  home: 0,
  incoming: 1,
  transcript: 2,
  analyzing: 3,
  result: 4,
  cloud: 5,
  warning: 6,
  success: 7
};

const STEP_LABELS = [
  "Home",
  "Call",
  "Transcript",
  "Local AI",
  "Risk",
  "Cloud",
  "TNG Warning",
  "Protected"
];

export default function ScamSensePage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("home");

  const goto = (s: Screen) => () => setScreen(s);

  return (
    <main className="relative min-h-screen w-full">
      {/* Background grain */}
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-16 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Left rail — branding + steps */}
        <aside className="w-full lg:w-[360px] order-2 lg:order-1">
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.06] px-3 py-1 text-[11px] font-semibold text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
              TNG FINHACK 2026 · Security & Fraud
            </div>
            <h1 className="heading-xl">
              Stop scam calls
              <br />
              <span className="bg-gradient-to-r from-privacy via-premium to-safe bg-clip-text text-transparent">
                before money leaves your wallet.
              </span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Private on-device AI scam-call protection. Real multi-cloud risk pipeline:
              audio + transcript stay on the phone, only the risk score is shared.
            </p>
          </div>

          <div className="space-y-2 mb-6">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
              Demo flow
            </div>
            <div className="space-y-1">
              {STEP_LABELS.map((label, i) => {
                const current = STEP_INDEX[screen];
                const state = i < current ? "done" : i === current ? "active" : "pending";
                return (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 text-[12px] py-1 ${
                      state === "active"
                        ? "text-zinc-100 font-semibold"
                        : state === "done"
                        ? "text-zinc-500"
                        : "text-zinc-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        state === "done"
                          ? "bg-safe/20 text-safe ring-1 ring-safe/30"
                          : state === "active"
                          ? "bg-privacy/20 text-privacy ring-1 ring-privacy/30"
                          : "bg-white/[0.04] text-zinc-500 ring-1 ring-white/10"
                      }`}
                    >
                      {state === "done" ? "✓" : i + 1}
                    </div>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-secondary text-xs"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/architecture")}
              className="btn-secondary text-xs"
            >
              Architecture
            </button>
          </div>

          <button
            onClick={() => setScreen("home")}
            className="mt-2 w-full btn-secondary text-xs"
          >
            Restart demo
          </button>

          <div className="mt-4 text-[10px] text-zinc-600 leading-relaxed">
            Real cloud: AWS API Gateway/Lambda/CloudWatch (ap-southeast-5) +
            Alibaba OSS (Function Compute alt). Simulated: phone call recording,
            speech-to-text, local Qwen 2.5 inference, TNG wallet behavior.
          </div>
        </aside>

        {/* Phone — center stage */}
        <div className="order-1 lg:order-2">
          <PhoneFrame>
            <AnimatePresence mode="wait">
              {screen === "home" && (
                <HomeScreen
                  key="home"
                  onStartDemo={goto("incoming")}
                  onTestCloud={goto("cloud")}
                  onViewDashboard={() => router.push("/dashboard")}
                  onViewArchitecture={() => router.push("/architecture")}
                />
              )}
              {screen === "incoming" && (
                <IncomingCall
                  key="incoming"
                  onAnswer={goto("transcript")}
                  onDecline={goto("home")}
                />
              )}
              {screen === "transcript" && (
                <LiveTranscript key="transcript" onAnalyze={goto("analyzing")} />
              )}
              {screen === "analyzing" && (
                <LocalAIAnalysis key="analyzing" onComplete={goto("result")} />
              )}
              {screen === "result" && (
                <RiskScoreMeter key="result" onSendToCloud={goto("cloud")} />
              )}
              {screen === "cloud" && (
                <CloudVerification key="cloud" onContinue={goto("warning")} />
              )}
              {screen === "warning" && (
                <TngWarning key="warning" onProtected={goto("success")} />
              )}
              {screen === "success" && (
                <ProtectionSummary
                  key="success"
                  onDashboard={() => router.push("/dashboard")}
                  onArchitecture={() => router.push("/architecture")}
                  onRestart={goto("home")}
                />
              )}
            </AnimatePresence>
          </PhoneFrame>
        </div>

        {/* Right rail — quick info on lg+ */}
        <aside className="hidden lg:block w-[280px] order-3">
          <div className="card p-4 mb-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
              Privacy guarantee
            </div>
            <ul className="space-y-1.5 text-[11px] text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-safe mt-0.5">✓</span>
                Audio never leaves the phone
              </li>
              <li className="flex items-start gap-2">
                <span className="text-safe mt-0.5">✓</span>
                Transcript never leaves the phone
              </li>
              <li className="flex items-start gap-2">
                <span className="text-safe mt-0.5">✓</span>
                Only risk score + reason codes sent to cloud
              </li>
              <li className="flex items-start gap-2">
                <span className="text-safe mt-0.5">✓</span>
                Local Qwen 2.5 inference (simulated for demo)
              </li>
            </ul>
          </div>

          <div className="card p-4 mb-3">
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
              Cloud verification
            </div>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">AWS</span>
                <span className="text-zinc-200 font-mono">ap-southeast-5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Alibaba OSS</span>
                <span className="text-zinc-200 font-mono">ap-southeast-3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Service</span>
                <span className="text-zinc-200 font-mono">Lambda + OSS</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-zinc-600 leading-relaxed">
            Tap <strong>Start Demo Call</strong> on the phone to begin the full 8-step flow.
          </div>
        </aside>
      </div>
    </main>
  );
}
