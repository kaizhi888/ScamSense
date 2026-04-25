"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Smartphone,
  Cpu,
  Mic,
  FileText,
  Cloud,
  Database,
  ShieldCheck,
  ArrowRight,
  Lock,
  Zap,
  Activity,
  LayoutDashboard,
  Network as NetIcon
} from "lucide-react";

export default function ArchitecturePage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen w-full">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <header className="flex items-start justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.06] px-3 py-1 text-[11px] font-semibold text-zinc-300 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-premium animate-pulse" />
              System architecture
            </div>
            <h1 className="heading-lg">ScamSense Multi-Cloud Architecture</h1>
            <p className="text-zinc-400 text-sm mt-1">
              On-device AI inference + privacy-preserving multi-cloud risk pipeline
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push("/")} className="btn-secondary text-xs">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile demo
            </button>
            <button onClick={() => router.push("/dashboard")} className="btn-secondary text-xs">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
          </div>
        </header>

        {/* Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          {/* Phone */}
          <Pillar
            tone="privacy"
            title="On-device (phone)"
            icon={<Smartphone className="w-5 h-5" strokeWidth={2.5} />}
            chips={[
              { icon: Mic, label: "Unknown call · STT (sim)" },
              { icon: FileText, label: "Local transcript" },
              { icon: Cpu, label: "Qwen 2.5 0.5B / 1.5B (sim)" },
              { icon: Activity, label: "Risk score generated" },
              { icon: Lock, label: "Audio + transcript stay on phone" }
            ]}
          />

          <Arrow label="Risk score + reason codes only" />

          {/* AWS */}
          <Pillar
            tone="warning"
            title="AWS · ap-southeast-5"
            icon={<Cloud className="w-5 h-5" strokeWidth={2.5} />}
            chips={[
              { icon: Zap, label: "API Gateway HTTP API" },
              { icon: Cpu, label: "Lambda fn: risk-event" },
              { icon: Activity, label: "CloudWatch Logs" },
              { icon: ShieldCheck, label: "Validates payload schema" }
            ]}
            footer="POST /risk-event → enriched response"
          />

          {/* Alibaba */}
          <Pillar
            tone="premium"
            title="Alibaba Cloud · ap-southeast-3"
            icon={<Database className="w-5 h-5" strokeWidth={2.5} />}
            chips={[
              { icon: Database, label: "OSS bucket: scamsense-demo-risk-events" },
              { icon: Activity, label: "Anonymized risk-event JSON" },
              { icon: Cpu, label: "Function Compute (alt path)" },
              { icon: ShieldCheck, label: "Fraud rule enrichment" }
            ]}
            footer="PutObject → object key returned"
          />
        </div>

        {/* Privacy band */}
        <div className="card p-4 mb-8 ring-1 ring-privacy/20">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-privacy" strokeWidth={2.5} />
            <span className="text-[12px] font-semibold text-privacy uppercase tracking-wider">
              Privacy boundary
            </span>
          </div>
          <div className="text-[12px] text-zinc-300 leading-relaxed">
            Audio waveforms and the full transcript <strong>never leave the user's phone</strong>.
            Only deterministic risk metadata (score, level, reason codes, masked recipient,
            amount, timestamp) is transmitted across the privacy boundary. Both AWS and Alibaba
            receive the <em>same</em> anonymized payload and the user can audit the JSON in the
            Cloud Verification screen.
          </div>
        </div>

        {/* TNG flow */}
        <div className="card p-5 mb-8">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-3">
            Touch 'n Go integration (simulated)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <FlowStep
              n={1}
              title="Risk score → TNG risk engine"
              desc="TNG receives score + reason codes only. Audio and transcript are never seen by TNG."
            />
            <FlowStep
              n={2}
              title="Transfer warning"
              desc="If risk score crosses threshold, TNG shows a critical-scam alert and pauses the transaction."
            />
            <FlowStep
              n={3}
              title="Block / report flow"
              desc="User can cancel transfer, block the number, and report the recipient to TNG fraud team."
            />
          </div>
        </div>

        {/* Why this wins */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-safe" strokeWidth={2.5} />
            <h2 className="heading-md">Why ScamSense wins</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Reason
              title="Solves a real, urgent Malaysian problem"
              text="Scam-call fraud cost Malaysians RM 1.2B+ in 2023. ScamSense intervenes at the only moment that matters: before the transfer button is pressed."
            />
            <Reason
              title="Privacy-first by design"
              text="Audio + transcript never leave the device. Cloud sees risk metadata only. Aligns with PDPA and Bank Negara fraud framework."
            />
            <Reason
              title="Lightweight local AI"
              text="Qwen 2.5 0.5B / 1.5B runs on older smartphones. Critical for elderly, low-income, and underserved users — exactly the scam-fraud target group."
            />
            <Reason
              title="Real multi-cloud, not theatre"
              text="AWS API Gateway/Lambda/CloudWatch handles ingestion. Alibaba OSS stores anonymized events with auditable object keys. Both verifiable in their consoles."
            />
            <Reason
              title="Direct eWallet protection"
              text="Risk metadata flows into the TNG risk engine to block the transfer before money leaves the wallet. Other tools warn after the loss."
            />
            <Reason
              title="Inclusion-grade impact"
              text="Elderly users, foreign workers, and unbanked communities are disproportionately scammed. ScamSense protects without requiring extra steps."
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Pillar({
  tone,
  title,
  icon,
  chips,
  footer
}: {
  tone: "privacy" | "warning" | "premium";
  title: string;
  icon: React.ReactNode;
  chips: { icon: React.ComponentType<{ className?: string; strokeWidth?: number | string }>; label: string }[];
  footer?: string;
}) {
  const toneClass: Record<typeof tone, string> = {
    privacy: "ring-privacy/30",
    warning: "ring-warning/30",
    premium: "ring-premium/30"
  };
  const accentClass: Record<typeof tone, string> = {
    privacy: "text-privacy bg-privacy-soft",
    warning: "text-warning bg-warning-soft",
    premium: "text-premium bg-premium-soft"
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 ring-1 ${toneClass[tone]}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accentClass[tone]}`}>
          {icon}
        </div>
        <div>
          <div className="text-[12px] font-bold">{title}</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {chips.map(({ icon: I, label }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.05] px-2.5 py-1.5 text-[11px] text-zinc-200"
          >
            <I className="w-3 h-3 text-zinc-400" strokeWidth={2.5} />
            {label}
          </div>
        ))}
      </div>
      {footer && (
        <div className="mt-3 text-[10px] text-zinc-500 font-mono border-t border-white/[0.05] pt-2">
          {footer}
        </div>
      )}
    </motion.div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center text-zinc-500">
      <ArrowRight className="w-6 h-6 text-privacy" strokeWidth={2.5} />
      <div className="text-[10px] mt-1 text-center max-w-[120px] leading-tight">{label}</div>
    </div>
  );
}

function FlowStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full bg-privacy-soft text-privacy ring-1 ring-privacy/30 flex items-center justify-center text-[10px] font-bold">
          {n}
        </div>
        <span className="text-[12px] font-bold">{title}</span>
      </div>
      <div className="text-[11px] text-zinc-400 leading-snug">{desc}</div>
    </div>
  );
}

function Reason({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <NetIcon className="w-3 h-3 text-safe" strokeWidth={2.5} />
        <span className="text-[12px] font-bold">{title}</span>
      </div>
      <div className="text-[11px] text-zinc-400 leading-snug">{text}</div>
    </div>
  );
}
