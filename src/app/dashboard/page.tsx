"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Cloud,
  Database,
  Lock,
  RefreshCw,
  Smartphone,
  Network,
  Copy
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";
import { sendRiskEventToCloud, type DualCloudResponse } from "@/lib/cloudClient";
import { buildPayload } from "@/data/cloudPayload";
import { formatRM, formatTime, shortId } from "@/lib/formatters";

type Alert = {
  id: string;
  timestamp: string;
  riskScore: number;
  riskLevel: "Critical" | "Warning" | "Suspicious" | "Safe";
  reasonCodes: string[];
  awsStatus: "ok" | "fail" | "pending";
  alibabaStatus: "ok" | "fail" | "pending";
};

const initialAlerts: Alert[] = [
  {
    id: "scamsense-demo-001",
    timestamp: new Date(Date.now() - 3 * 60_000).toISOString(),
    riskScore: 94,
    riskLevel: "Critical",
    reasonCodes: ["AUTHORITY_IMPERSONATION", "MONEY_LAUNDERING_CLAIM", "ACCOUNT_FREEZE_THREAT"],
    awsStatus: "ok",
    alibabaStatus: "ok"
  },
  {
    id: "scamsense-demo-002",
    timestamp: new Date(Date.now() - 14 * 60_000).toISOString(),
    riskScore: 72,
    riskLevel: "Warning",
    reasonCodes: ["URGENT_TRANSFER_REQUEST", "SUSPICIOUS_EWALLET_RECIPIENT"],
    awsStatus: "ok",
    alibabaStatus: "ok"
  },
  {
    id: "scamsense-demo-003",
    timestamp: new Date(Date.now() - 38 * 60_000).toISOString(),
    riskScore: 41,
    riskLevel: "Suspicious",
    reasonCodes: ["UNKNOWN_NUMBER", "URGENCY"],
    awsStatus: "ok",
    alibabaStatus: "ok"
  }
];

const scamCategories = [
  { name: "PDRM impersonation", value: 38 },
  { name: "Account freeze threat", value: 27 },
  { name: "Money laundering", value: 19 },
  { name: "Investment scam", value: 12 },
  { name: "Parcel/customs", value: 9 },
  { name: "Mule eWallet", value: 7 }
];

export default function DashboardPage() {
  const router = useRouter();
  const [alerts] = useState<Alert[]>(initialAlerts);
  const [cloud, setCloud] = useState<DualCloudResponse | null>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function testCloud() {
    setTesting(true);
    const r = await sendRiskEventToCloud(buildPayload());
    setCloud(r);
    setTesting(false);
  }

  async function copyPayload() {
    await navigator.clipboard.writeText(JSON.stringify(buildPayload(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  useEffect(() => {
    testCloud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalEvents = alerts.length;
  const critical = alerts.filter((a) => a.riskLevel === "Critical").length;
  const avgScore = Math.round(alerts.reduce((s, a) => s + a.riskScore, 0) / Math.max(1, alerts.length));
  const prevented = 2500;

  return (
    <main className="relative min-h-screen w-full">
      <div className="absolute inset-0 grain pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex items-start justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.06] px-3 py-1 text-[11px] font-semibold text-zinc-300 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
              Live · multi-cloud
            </div>
            <h1 className="heading-lg">ScamSense Fraud Intelligence Console</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Real-time risk events from on-device ScamSense clients
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push("/")} className="btn-secondary text-xs">
              <Smartphone className="w-3.5 h-3.5" />
              Mobile demo
            </button>
            <button onClick={() => router.push("/architecture")} className="btn-secondary text-xs">
              <Network className="w-3.5 h-3.5" />
              Architecture
            </button>
          </div>
        </header>

        {/* Privacy banner */}
        <div className="card p-3 mb-5 ring-1 ring-privacy/20 flex items-center gap-2">
          <Lock className="w-4 h-4 text-privacy" strokeWidth={2.5} />
          <span className="text-[12px] text-zinc-300">
            <strong>Privacy compliance:</strong> No transcripts stored. No call audio uploaded. Risk metadata only.
          </span>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-5">
          <Metric icon={TrendingUp} tone="privacy" label="Total events" value={String(totalEvents)} sub="today" />
          <Metric icon={AlertTriangle} tone="critical" label="Critical" value={String(critical)} sub="scam attempts" />
          <Metric icon={ShieldCheck} tone="safe" label="Avg risk" value={`${avgScore}/100`} sub="score" />
          <Metric icon={DollarSign} tone="safe" label="Prevented" value={formatRM(prevented)} sub="this week" />
          <Metric icon={Cloud} tone="premium" label="AWS events" value={String(totalEvents)} sub="processed" />
          <Metric icon={Database} tone="premium" label="Alibaba events" value={String(totalEvents)} sub="enriched" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-5">
            {/* Categories chart */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Scam categories (7d)
                  </div>
                  <h2 className="heading-md">Top fraud patterns</h2>
                </div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scamCategories} layout="vertical" margin={{ left: 12, right: 12 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="rgba(255,255,255,0.6)"
                      fontSize={11}
                      width={170}
                      tick={{ fill: "#cbd5e1" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#10121C",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 10,
                        fontSize: 12
                      }}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {scamCategories.map((_, i) => (
                        <Cell key={i} fill={["#EF4444", "#F97316", "#F59E0B", "#A78BFA", "#3B82F6", "#10B981"][i]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerts table */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Recent alerts
                  </div>
                  <h2 className="heading-md">Live risk events</h2>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-500 border-b border-white/[0.05]">
                      <th className="font-semibold py-2 pr-3">Timestamp</th>
                      <th className="font-semibold py-2 pr-3">Score</th>
                      <th className="font-semibold py-2 pr-3">Level</th>
                      <th className="font-semibold py-2 pr-3">Reasons</th>
                      <th className="font-semibold py-2 pr-3">AWS</th>
                      <th className="font-semibold py-2 pr-3">Alibaba</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((a) => (
                      <tr key={a.id} className="border-b border-white/[0.04] last:border-0">
                        <td className="py-2.5 pr-3 text-zinc-400 font-mono text-[11px]">
                          {formatTime(a.timestamp)}
                        </td>
                        <td className="py-2.5 pr-3 font-bold tabular-nums">{a.riskScore}</td>
                        <td className="py-2.5 pr-3">
                          <RiskBadge level={a.riskLevel} />
                        </td>
                        <td className="py-2.5 pr-3 text-zinc-400 text-[10px]">
                          {a.reasonCodes.slice(0, 2).join(" · ")}
                          {a.reasonCodes.length > 2 && ` +${a.reasonCodes.length - 2}`}
                        </td>
                        <td className="py-2.5 pr-3">
                          <CloudDot status={a.awsStatus} />
                        </td>
                        <td className="py-2.5 pr-3">
                          <CloudDot status={a.alibabaStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-5">
            {/* Cloud status panel */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                    Live connectivity
                  </div>
                  <h2 className="heading-md">Multi-cloud status</h2>
                </div>
                <button onClick={testCloud} disabled={testing} className="btn-secondary text-xs">
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? "animate-spin" : ""}`} />
                  Test
                </button>
              </div>

              {/* AWS */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-[#FF9900]" strokeWidth={2.5} />
                  <span className="text-[12px] font-bold">AWS</span>
                  <CloudPill ok={cloud?.aws.ok} loading={testing} />
                </div>
                <ServiceRow label="API Gateway" ok={cloud?.aws.ok} text="HTTP API · ap-southeast-5" />
                <ServiceRow label="Lambda" ok={cloud?.aws.ok} text="Risk event ingestion" />
                <ServiceRow label="CloudWatch" ok={cloud?.aws.ok} text="Logging active" />
                {cloud?.aws.ok && (
                  <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {shortId((cloud.aws as any).data?.awsRequestId || "—")}
                  </div>
                )}
              </div>

              {/* Alibaba */}
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-[#FF6A00]" strokeWidth={2.5} />
                  <span className="text-[12px] font-bold">Alibaba Cloud</span>
                  <CloudPill ok={cloud?.alibaba.ok} loading={testing} />
                </div>
                <ServiceRow label="OSS" ok={cloud?.alibaba.ok} text="Anonymized risk store" />
                <ServiceRow label="Function Compute" ok={cloud?.alibaba.ok} text="Fraud rule alt path" />
                <ServiceRow label="Pattern enrichment" ok={cloud?.alibaba.ok} text="Active" />
                {cloud?.alibaba.ok && (
                  <div className="mt-2 text-[10px] text-zinc-500 font-mono">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {shortId((cloud.alibaba as any).data?.objectKey || (cloud.alibaba as any).data?.requestId || "—")}
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card p-5">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-3">
                Quick actions
              </div>
              <div className="space-y-2">
                <button onClick={testCloud} className="w-full btn-primary text-xs">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Test cloud now
                </button>
                <button onClick={copyPayload} className="w-full btn-secondary text-xs">
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied!" : "Copy demo payload"}
                </button>
                <button onClick={() => router.push("/")} className="w-full btn-secondary text-xs">
                  <Smartphone className="w-3.5 h-3.5" />
                  Open mobile demo
                </button>
                <button onClick={() => router.push("/architecture")} className="w-full btn-secondary text-xs">
                  <Network className="w-3.5 h-3.5" />
                  View architecture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  tone,
  label,
  value,
  sub
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  tone: "safe" | "critical" | "privacy" | "premium";
  label: string;
  value: string;
  sub: string;
}) {
  const toneClass: Record<typeof tone, string> = {
    safe: "text-safe",
    critical: "text-critical",
    privacy: "text-privacy",
    premium: "text-premium"
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-zinc-500 font-semibold">
        <Icon className={`w-3 h-3 ${toneClass[tone]}`} strokeWidth={2.5} />
        {label}
      </div>
      <div className="text-2xl font-bold mt-1 tabular-nums">{value}</div>
      <div className="text-[10px] text-zinc-500 mt-0.5">{sub}</div>
    </motion.div>
  );
}

function RiskBadge({ level }: { level: Alert["riskLevel"] }) {
  const map: Record<Alert["riskLevel"], string> = {
    Critical: "bg-critical-soft text-critical ring-critical/30",
    Warning: "bg-warning-soft text-warning ring-warning/30",
    Suspicious: "bg-suspicious-soft text-suspicious ring-suspicious/30",
    Safe: "bg-safe-soft text-safe ring-safe/30"
  };
  return (
    <span className={`pill ring-1 ${map[level]}`}>
      <div className="w-1 h-1 rounded-full bg-current" />
      {level}
    </span>
  );
}

function CloudDot({ status }: { status: "ok" | "fail" | "pending" }) {
  const map: Record<typeof status, string> = {
    ok: "bg-safe",
    fail: "bg-critical",
    pending: "bg-zinc-500"
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px]">
      <span className={`w-1.5 h-1.5 rounded-full ${map[status]}`} />
      <span className="text-zinc-400">{status === "ok" ? "Logged" : status === "fail" ? "Failed" : "Pending"}</span>
    </span>
  );
}

function CloudPill({ ok, loading }: { ok: boolean | undefined; loading: boolean }) {
  if (loading) return <span className="pill bg-privacy-soft text-privacy ring-1 ring-privacy/30">Calling</span>;
  if (ok) return <span className="pill bg-safe-soft text-safe ring-1 ring-safe/30">Online</span>;
  if (ok === false) return <span className="pill bg-critical-soft text-critical ring-1 ring-critical/30">Failed</span>;
  return <span className="pill bg-white/[0.04] text-zinc-400 ring-1 ring-white/10">Idle</span>;
}

function ServiceRow({ label, ok, text }: { label: string; ok: boolean | undefined; text: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] py-1">
      <div className="flex items-center gap-2">
        <span className={`w-1 h-1 rounded-full ${ok ? "bg-safe" : ok === false ? "bg-critical" : "bg-zinc-500"}`} />
        <span className="text-zinc-300 font-semibold">{label}</span>
      </div>
      <span className="text-zinc-500">{text}</span>
    </div>
  );
}
