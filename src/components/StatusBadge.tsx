"use client";

import { CheckCircle2, XCircle, Loader2, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/formatters";

export type StatusTone = "safe" | "suspicious" | "warning" | "critical" | "privacy" | "premium" | "neutral";
export type StatusKind = "ok" | "fail" | "loading" | "warn" | "info" | "shield";

type Props = {
  tone?: StatusTone;
  kind?: StatusKind;
  label: string;
  sublabel?: string;
  className?: string;
};

const toneClass: Record<StatusTone, string> = {
  safe: "bg-safe-soft text-safe ring-safe/30",
  suspicious: "bg-suspicious-soft text-suspicious ring-suspicious/30",
  warning: "bg-warning-soft text-warning ring-warning/30",
  critical: "bg-critical-soft text-critical ring-critical/30",
  privacy: "bg-privacy-soft text-privacy ring-privacy/30",
  premium: "bg-premium-soft text-premium ring-premium/30",
  neutral: "bg-white/[0.04] text-zinc-300 ring-white/10"
};

export default function StatusBadge({ tone = "neutral", kind, label, sublabel, className }: Props) {
  const Icon = (() => {
    switch (kind) {
      case "ok":
        return CheckCircle2;
      case "fail":
        return XCircle;
      case "loading":
        return Loader2;
      case "warn":
        return AlertTriangle;
      case "shield":
        return Shield;
      default:
        return null;
    }
  })();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 backdrop-blur",
        toneClass[tone],
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn("w-3.5 h-3.5", kind === "loading" && "animate-spin")}
          strokeWidth={2.5}
        />
      )}
      <span>{label}</span>
      {sublabel && <span className="text-[10px] opacity-70 font-medium">· {sublabel}</span>}
    </div>
  );
}
