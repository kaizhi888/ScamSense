"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Copy,
  ArrowRight,
  Lock,
  Database,
  Zap
} from "lucide-react";
import JsonViewer from "./JsonViewer";
import { sendRiskEventToCloud, type DualCloudResponse } from "@/lib/cloudClient";
import { buildPayload, type RiskCloudPayload } from "@/data/cloudPayload";
import { shortId } from "@/lib/formatters";

type Props = {
  onContinue: () => void;
};

type Status = "idle" | "loading" | "done";

export default function CloudVerification({ onContinue }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState<DualCloudResponse | null>(null);
  const [payload, setPayload] = useState<RiskCloudPayload>(() => buildPayload());
  const [copied, setCopied] = useState(false);

  async function runCloud() {
    setStatus("loading");
    const fresh = buildPayload();
    setPayload(fresh);
    const result = await sendRiskEventToCloud(fresh);
    setResponse(result);
    setStatus("done");
  }

  // Auto-trigger on mount
  useEffect(() => {
    runCloud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* */
    }
  }

  const awsOk = response?.aws.ok;
  const aliOk = response?.alibaba.ok;
  const bothOk = awsOk && aliOk;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full px-5 pt-2 pb-6"
    >
      {/* Header */}
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
          Privacy-first cloud
        </div>
        <div className="text-xl font-bold tracking-tight">Real Multi-Cloud Verification</div>
        <div className="text-[11px] text-zinc-400 mt-1 leading-snug">
          Risk metadata sent. Audio and transcript stayed on-device.
        </div>
      </div>

      {/* AWS Card */}
      <CloudCard
        provider="AWS"
        accent="#FF9900"
        icon={<AwsLogo />}
        title="AWS Risk Event Ingestion"
        subtitle="API Gateway → Lambda → CloudWatch"
        region="ap-southeast-5 (Malaysia)"
        status={status}
        ok={awsOk}
        data={response?.aws}
      />

      {/* Alibaba Card */}
      <CloudCard
        provider="Alibaba Cloud"
        accent="#FF6A00"
        icon={<AliLogo />}
        title="Alibaba Fraud Rule Enrichment"
        subtitle="Function Compute / OSS"
        region="ap-southeast-3 (Kuala Lumpur)"
        status={status}
        ok={aliOk}
        data={response?.alibaba}
      />

      {/* Privacy block */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-3 mb-3 ring-1 ring-privacy/20"
      >
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-privacy font-semibold mb-2">
          <Lock className="w-3 h-3" /> Privacy confirmation
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <PrivacyRow label="Audio shared" value="No" ok />
          <PrivacyRow label="Transcript shared" value="No" ok />
          <PrivacyRow label="Risk score shared" value="Yes" />
          <PrivacyRow label="Reason codes" value="Yes" />
        </div>
      </motion.div>

      {/* Payload viewer */}
      <JsonViewer data={payload} title="Transmitted payload" defaultOpen={false} className="mb-3" />

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          type="button"
          onClick={runCloud}
          disabled={status === "loading"}
          className="btn-secondary text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${status === "loading" ? "animate-spin" : ""}`} />
          Test Cloud Again
        </button>
        <button type="button" onClick={copyPayload} className="btn-secondary text-xs">
          <Copy className="w-3.5 h-3.5" />
          {copied ? "Copied!" : "Copy Payload"}
        </button>
      </div>

      <motion.button
        type="button"
        onClick={onContinue}
        disabled={status === "loading"}
        whileTap={{ scale: 0.98 }}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-critical to-warning px-6 py-3.5 text-sm font-bold text-white shadow-glow-critical transition hover:opacity-95 disabled:opacity-50"
      >
        Continue to Touch 'n Go Warning
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </motion.button>

      <p className="text-center text-[10px] text-zinc-500 mt-3">
        {bothOk
          ? "Cloud verification completed · Risk metadata only transmitted"
          : status === "loading"
          ? "Calling real AWS + Alibaba endpoints..."
          : "Local protection still works even without cloud connectivity"}
      </p>
    </motion.div>
  );
}

function CloudCard({
  provider,
  accent,
  icon,
  title,
  subtitle,
  region,
  status,
  ok,
  data
}: {
  provider: string;
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  region: string;
  status: Status;
  ok: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}) {
  const isLoading = status === "loading";
  const isDone = status === "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden mb-3"
    >
      <div className="p-3 flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}15`, color: accent, border: `1px solid ${accent}33` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-bold text-zinc-100">{title}</span>
            <StatusPill loading={isLoading} ok={ok} />
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</div>
          <div className="text-[10px] text-zinc-500 mt-0.5">{region}</div>
        </div>
      </div>

      {isDone && data && (
        <div className="border-t border-white/[0.05] px-3 py-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px]">
          {ok ? (
            <>
              <KV k="Status" v={data.data?.status || "processed"} />
              <KV k="Service" v={data.data?.service || "—"} />
              <KV
                k="Request ID"
                v={shortId(
                  data.data?.awsRequestId || data.data?.requestId || data.data?.objectKey || "—"
                )}
                mono
              />
              <KV k="Latency" v={`${data.latencyMs}ms`} />
              <KV k="Processed at" v={shortTime(data.data?.processedAt)} cls="col-span-2" />
              {data.data?.message && (
                <KV k="Message" v={data.data.message} cls="col-span-2 text-zinc-400" />
              )}
            </>
          ) : (
            <KV k="Error" v={data.error || "Unknown"} cls="col-span-2 text-critical" />
          )}
        </div>
      )}
    </motion.div>
  );
}

function StatusPill({ loading, ok }: { loading: boolean; ok: boolean | undefined }) {
  if (loading) {
    return (
      <span className="pill bg-privacy-soft text-privacy ring-1 ring-privacy/30">
        <Loader2 className="w-3 h-3 animate-spin" /> Calling
      </span>
    );
  }
  if (ok) {
    return (
      <span className="pill bg-safe-soft text-safe ring-1 ring-safe/30">
        <CheckCircle2 className="w-3 h-3" /> Connected
      </span>
    );
  }
  return (
    <span className="pill bg-critical-soft text-critical ring-1 ring-critical/30">
      <XCircle className="w-3 h-3" /> Failed
    </span>
  );
}

function KV({ k, v, mono = false, cls = "" }: { k: string; v: string; mono?: boolean; cls?: string }) {
  return (
    <div className={cls}>
      <div className="text-[9px] uppercase tracking-wide text-zinc-500 font-semibold">{k}</div>
      <div className={`text-[11px] text-zinc-200 ${mono ? "font-mono" : ""} truncate`}>{v}</div>
    </div>
  );
}

function PrivacyRow({ label, value, ok = false }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-privacy-soft/30 ring-1 ring-privacy/20 px-2.5 py-1.5">
      <span className="text-[10px] text-zinc-300 font-medium">{label}</span>
      <span className={`text-[10px] font-bold ${ok ? "text-safe" : "text-privacy"}`}>{value}</span>
    </div>
  );
}

function shortTime(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString();
  } catch {
    return iso;
  }
}

function AwsLogo() {
  return <Cloud className="w-5 h-5" strokeWidth={2.5} />;
}

function AliLogo() {
  return <Database className="w-5 h-5" strokeWidth={2.5} />;
}
