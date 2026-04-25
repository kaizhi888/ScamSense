"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Shield,
  Mic,
  FileText,
  Cloud,
  Database,
  PhoneOff,
  Flag,
  Bell,
  LayoutDashboard,
  Network,
  RotateCcw
} from "lucide-react";
import { formatRM } from "@/lib/formatters";

type Props = {
  onDashboard: () => void;
  onArchitecture: () => void;
  onRestart: () => void;
};

export default function ProtectionSummary({ onDashboard, onArchitecture, onRestart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full px-5 pt-2 pb-6"
    >
      {/* Hero glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-safe/20 blur-3xl pointer-events-none" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center pt-4 mb-6"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", damping: 14, stiffness: 220 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-safe/20 ring-2 ring-safe/40 shadow-glow-safe mb-3"
        >
          <CheckCircle2 className="w-10 h-10 text-safe" strokeWidth={2.5} />
        </motion.div>

        <div className="text-2xl font-bold tracking-tight">Transfer Prevented</div>
        <div className="text-[13px] text-zinc-400 mt-1">
          You may have avoided losing{" "}
          <span className="font-bold text-safe">{formatRM(2500)}</span>
        </div>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-4 mb-3"
      >
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2.5">
          Protection summary
        </div>
        <div className="space-y-2">
          <Row icon={Shield} label="Scam attempt stopped" value="Critical (94)" tone="critical" />
          <Row icon={CheckCircle2} label="Money protected" value={formatRM(2500)} tone="safe" />
          <Row icon={Mic} label="Audio shared" value="No" tone="privacy" />
          <Row icon={FileText} label="Transcript shared" value="No" tone="privacy" />
          <Row icon={Cloud} label="AWS event logged" value="Yes" tone="safe" />
          <Row icon={Database} label="Alibaba enrichment" value="Yes" tone="safe" />
        </div>
      </motion.div>

      {/* User actions card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-4 mb-4"
      >
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
          Actions taken
        </div>
        <div className="space-y-1.5">
          <ActionRow icon={PhoneOff} label="Number blocked" />
          <ActionRow icon={Flag} label="Recipient reported" />
          <ActionRow icon={Bell} label="Fraud team notified" />
        </div>
      </motion.div>

      {/* Footer CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="space-y-2"
      >
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onDashboard} className="btn-secondary text-xs">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
          <button onClick={onArchitecture} className="btn-secondary text-xs">
            <Network className="w-3.5 h-3.5" />
            Architecture
          </button>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-privacy to-premium px-6 py-3.5 text-sm font-bold text-white shadow-glow-privacy transition hover:opacity-95 active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
          Restart Demo
        </button>
      </motion.div>
    </motion.div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: "safe" | "critical" | "privacy" | "premium";
}) {
  const toneClass: Record<typeof tone, string> = {
    safe: "text-safe",
    critical: "text-critical",
    privacy: "text-privacy",
    premium: "text-premium"
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[12px] text-zinc-300">
        <Icon className={`w-3.5 h-3.5 ${toneClass[tone]}`} strokeWidth={2.5} />
        {label}
      </div>
      <div className={`text-[12px] font-bold ${toneClass[tone]}`}>{value}</div>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-zinc-300">
      <div className="w-5 h-5 rounded-md bg-safe/20 ring-1 ring-safe/30 flex items-center justify-center">
        <Icon className="w-3 h-3 text-safe" strokeWidth={2.5} />
      </div>
      {label}
    </div>
  );
}
