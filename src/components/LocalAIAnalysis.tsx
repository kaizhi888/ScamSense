"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Lock, ShieldCheck, Loader2, Check, ArrowRight } from "lucide-react";

type Props = {
  onComplete: () => void;
};

const STEPS = [
  "Loading local Qwen 2.5 model weights",
  "Tokenizing transcript (on-device)",
  "Detecting authority impersonation",
  "Detecting urgency and financial pressure",
  "Extracting risk signals",
  "Calculating risk score"
];

export default function LocalAIAnalysis({ onComplete }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const total = 5400; // ~5.4s total
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setProgress(t);
      const idx = Math.min(STEPS.length - 1, Math.floor(t * STEPS.length));
      setStepIndex(idx);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full flex flex-col px-5 pt-2 pb-6"
    >
      {/* Header */}
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
          On-device intelligence
        </div>
        <div className="text-xl font-bold tracking-tight">Local AI Analysis</div>
      </div>

      {/* Model card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 mb-3 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-premium/15 blur-3xl" />
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-privacy to-premium flex items-center justify-center shadow-glow-privacy">
            <Cpu className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold">Qwen 2.5</span>
              <span className="pill-premium">0.5B</span>
              <span className="text-[10px] text-zinc-500">/ 1.5B optional</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              Lightweight on-device scam-detection model. Optimized for older smartphones.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Privacy shield */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-3 mb-3 ring-1 ring-privacy/20"
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold text-privacy mb-2">
          <Lock className="w-3.5 h-3.5" />
          Privacy shield active
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          <PrivacyChip ok label="Audio on-device" />
          <PrivacyChip ok label="Transcript on-device" />
          <PrivacyChip ok label="Risk score only" />
        </div>
      </motion.div>

      {/* Steps */}
      <div className="flex-1 card p-4 space-y-2.5">
        {STEPS.map((s, i) => {
          const status: "done" | "active" | "pending" =
            i < stepIndex ? "done" : i === stepIndex ? (done ? "done" : "active") : "pending";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: status === "pending" ? 0.4 : 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ring-1 ${
                  status === "done"
                    ? "bg-safe-soft text-safe ring-safe/30"
                    : status === "active"
                    ? "bg-privacy-soft text-privacy ring-privacy/30"
                    : "bg-white/[0.04] text-zinc-500 ring-white/10"
                }`}
              >
                {status === "done" ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : status === "active" ? (
                  <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2.5} />
                ) : (
                  <span className="text-[9px] font-bold">{i + 1}</span>
                )}
              </div>
              <span
                className={`text-[12px] ${
                  status === "active"
                    ? "text-zinc-100 font-semibold"
                    : status === "done"
                    ? "text-zinc-400"
                    : "text-zinc-500"
                }`}
              >
                {s}
              </span>
            </motion.div>
          );
        })}

        {/* Progress bar */}
        <div className="mt-4 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-privacy to-premium"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
          <span>Inference progress</span>
          <span className="tabular-nums">{Math.round(progress * 100)}%</span>
        </div>
      </div>

      {/* CTA */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <button
              type="button"
              onClick={onComplete}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-critical to-warning px-6 py-3.5 text-sm font-bold text-white shadow-glow-critical transition hover:opacity-95 active:scale-[0.98]"
            >
              View Risk Result
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-[10px] text-zinc-600 mt-2">
        Prototype Simulation — local model inference is simulated for demo
      </p>
    </motion.div>
  );
}

function PrivacyChip({ ok, label }: { ok?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-privacy-soft/40 ring-1 ring-privacy/20 px-1.5 py-1">
      <ShieldCheck className={`w-3 h-3 ${ok ? "text-privacy" : "text-zinc-500"}`} strokeWidth={2.5} />
      <span className="text-[9px] font-semibold text-privacy">{label}</span>
    </div>
  );
}
