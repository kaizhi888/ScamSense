"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { mockRiskResult, type RiskResult } from "@/data/mockRiskResult";
import { levelTone } from "@/lib/riskEngine";
import { ArrowRight, Lock } from "lucide-react";

type Props = {
  result?: RiskResult;
  onSendToCloud: () => void;
};

/** Animated risk meter — circular gradient with score number that counts up. */
function RiskRing({ score, color }: { score: number; color: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(score * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = 80;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (display / 100) * circumference;

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg width="200" height="200" className="-rotate-90">
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      {/* Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
          Risk score
        </div>
        <div className="text-6xl font-bold tabular-nums" style={{ color }}>
          {display}
        </div>
        <div className="text-[10px] text-zinc-500 font-semibold">/ 100</div>
      </div>
    </div>
  );
}

export default function RiskScoreMeter({ result = mockRiskResult, onSendToCloud }: Props) {
  const tone = levelTone(result.riskLevel);
  const Icon =
    result.riskLevel === "Critical" || result.riskLevel === "Warning"
      ? ShieldAlert
      : result.riskLevel === "Suspicious"
      ? AlertTriangle
      : ShieldCheck;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full px-5 pt-2 pb-6"
    >
      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${tone.color}33` }}
      />

      {/* Header */}
      <div className="relative mb-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
          AI Verdict
        </div>
        <div className="text-xl font-bold tracking-tight">Scam Analysis Result</div>
      </div>

      {/* Risk meter */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-3"
      >
        <RiskRing score={result.riskScore} color={tone.color} />
        <div className="text-center mt-2">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1"
            style={{
              backgroundColor: `${tone.color}22`,
              color: tone.color,
              borderColor: `${tone.color}44`
            }}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
            {result.riskLevel} · {result.verdict}
          </div>
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-3 mb-3"
      >
        <div className="text-[11px] text-zinc-300 leading-relaxed">{result.explanation}</div>
      </motion.div>

      {/* Risk factors */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-3 mb-3"
      >
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
          <Activity className="w-3 h-3" />
          Risk factors
        </div>
        <div className="space-y-1.5">
          {result.factors.map((f, i) => (
            <FactorRow key={i} label={f.label} level={f.level} />
          ))}
        </div>
      </motion.div>

      {/* Recommended actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-3 mb-3"
      >
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
          Recommended actions
        </div>
        <ul className="space-y-1.5">
          {result.recommendedActions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-[12px]">
              <div className="w-1 h-1 rounded-full bg-critical mt-2 shrink-0" />
              <span className="text-zinc-300">{a}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-2"
      >
        <button
          type="button"
          onClick={onSendToCloud}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-privacy to-premium px-6 py-3.5 text-sm font-bold text-white shadow-glow-privacy transition hover:opacity-95 active:scale-[0.98]"
        >
          Send Risk Score to Cloud
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <Lock className="w-3 h-3" />
          Audio and transcript will not be uploaded
        </div>
      </motion.div>
    </motion.div>
  );
}

function FactorRow({
  label,
  level
}: {
  label: string;
  level: "Low" | "Medium" | "High" | "Critical";
}) {
  const map = {
    Low: { color: "#10B981", w: 25 },
    Medium: { color: "#F59E0B", w: 50 },
    High: { color: "#F97316", w: 75 },
    Critical: { color: "#EF4444", w: 100 }
  } as const;
  const { color, w } = map[level];
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 text-[11px] text-zinc-300 font-medium">{label}</div>
      <div className="w-20 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${w}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="w-14 text-right text-[10px] font-bold" style={{ color }}>
        {level}
      </div>
    </div>
  );
}
