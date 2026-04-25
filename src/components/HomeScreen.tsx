"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  Phone,
  Cloud,
  LayoutDashboard,
  Network,
  Cpu,
  Lock,
  Zap
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatRM } from "@/lib/formatters";

type Props = {
  onStartDemo: () => void;
  onTestCloud: () => void;
  onViewDashboard: () => void;
  onViewArchitecture: () => void;
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function HomeScreen({
  onStartDemo,
  onTestCloud,
  onViewDashboard,
  onViewArchitecture
}: Props) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative min-h-full px-5 pt-3 pb-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-privacy to-premium flex items-center justify-center shadow-glow-privacy">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight">ScamSense</div>
            <div className="text-[10px] text-zinc-500 font-medium">Private AI Protection</div>
          </div>
        </div>
        <StatusBadge tone="safe" kind="ok" label="Active" />
      </motion.div>

      {/* Hero protection card */}
      <motion.div
        variants={item}
        className="relative card overflow-hidden p-5 mb-4"
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-safe/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-privacy/20 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-safe" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-safe animate-ping-slow" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Protected
            </span>
          </div>
          <div className="text-[22px] font-bold leading-tight">
            You're shielded from
            <br />
            <span className="bg-gradient-to-r from-safe to-privacy bg-clip-text text-transparent">
              scam call fraud
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">
                <Cpu className="w-3 h-3" /> Local AI
              </div>
              <div className="text-sm font-bold mt-0.5">Qwen 2.5 active</div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">
                <Lock className="w-3 h-3" /> Cloud sync
              </div>
              <div className="text-sm font-bold mt-0.5">Risk score only</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-2 mb-4">
        <StatCard label="Calls scanned" value="3" sub="today" tone="privacy" />
        <StatCard label="Scams blocked" value="1" sub="critical risk" tone="critical" />
        <StatCard label="Loss prevented" value={formatRM(2500)} sub="this week" tone="safe" />
        <StatCard label="Privacy" value="On-device" sub="audio never sent" tone="premium" />
      </motion.div>

      {/* Connection badges */}
      <motion.div variants={item} className="flex flex-wrap gap-1.5 mb-5">
        <Pill icon={Cpu} label="Local Qwen 2.5" />
        <Pill icon={Cloud} label="AWS connected" />
        <Pill icon={Cloud} label="Alibaba connected" />
        <Pill icon={Zap} label="TNG workflow" />
      </motion.div>

      {/* Primary CTA */}
      <motion.div variants={item} className="mb-2.5">
        <button
          type="button"
          onClick={onStartDemo}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-critical to-warning px-6 py-4 text-sm font-bold text-white shadow-glow-critical transition hover:opacity-95 active:scale-[0.98]"
        >
          <Phone className="w-4 h-4" strokeWidth={2.5} />
          Start Demo Call
        </button>
      </motion.div>

      {/* Secondary CTAs */}
      <motion.div variants={item} className="grid grid-cols-3 gap-2">
        <SecondaryButton icon={Cloud} label="Test Cloud" onClick={onTestCloud} />
        <SecondaryButton icon={LayoutDashboard} label="Dashboard" onClick={onViewDashboard} />
        <SecondaryButton icon={Network} label="Architecture" onClick={onViewArchitecture} />
      </motion.div>

      {/* Footer label */}
      <motion.p
        variants={item}
        className="mt-5 text-[10px] text-center text-zinc-500"
      >
        TNG FINHACK 2026 · Security & Fraud Track
      </motion.p>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone
}: {
  label: string;
  value: string;
  sub: string;
  tone: "safe" | "privacy" | "critical" | "premium";
}) {
  const dot: Record<typeof tone, string> = {
    safe: "bg-safe",
    privacy: "bg-privacy",
    critical: "bg-critical",
    premium: "bg-premium"
  };
  return (
    <div className="card p-3">
      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-semibold uppercase tracking-wide">
        <div className={`w-1 h-1 rounded-full ${dot[tone]}`} />
        {label}
      </div>
      <div className="text-base font-bold mt-1">{value}</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">{sub}</div>
    </div>
  );
}

function Pill({
  icon: Icon,
  label
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-zinc-300">
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {label}
    </div>
  );
}

function SecondaryButton({
  icon: Icon,
  label,
  onClick
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card card-hover py-3 px-2 flex flex-col items-center justify-center gap-1 text-zinc-200 active:scale-[0.97] transition"
    >
      <Icon className="w-4 h-4" strokeWidth={2.5} />
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
