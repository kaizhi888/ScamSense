"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ShieldAlert,
  X,
  Flag,
  HelpCircle,
  Check,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { formatRM } from "@/lib/formatters";
import { mockRiskResult } from "@/data/mockRiskResult";

type Props = {
  onProtected: () => void;
};

export default function TngWarning({ onProtected }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="relative min-h-full">
      {/* Simulated TNG transfer screen (background) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: acknowledged ? 0.3 : 1 }}
        className="px-5 pt-2 pb-6"
      >
        {/* TNG header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#0066B3] flex items-center justify-center text-white text-[10px] font-black">
            TNG
          </div>
          <div>
            <div className="text-[13px] font-bold">Touch 'n Go eWallet</div>
            <div className="text-[10px] text-zinc-500">Send money</div>
          </div>
        </div>

        {/* Recipient card */}
        <div className="card p-4 mb-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
            Recipient
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
              ?
            </div>
            <div>
              <div className="text-[14px] font-bold">TNG Account</div>
              <div className="text-[12px] text-zinc-400 font-mono">018-992 1247</div>
            </div>
          </div>
        </div>

        {/* Amount card */}
        <div className="card p-4 mb-3">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
            Amount
          </div>
          <div className="text-3xl font-bold tabular-nums">{formatRM(2500)}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">MYR · Instant transfer</div>
        </div>

        {/* Status (will be replaced once acknowledged) */}
        <div className="card p-3 ring-1 ring-critical/30 bg-critical/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-critical animate-pulse" />
            <span className="text-[12px] font-semibold text-critical">
              Transfer blocked by ScamSense
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1">
            Requires review before this transaction can proceed.
          </div>
        </div>
      </motion.div>

      {/* Warning modal overlay */}
      <AnimatePresence>
        {!acknowledged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-end justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 250 }}
              className="w-full bg-ink-900 border border-critical/30 rounded-t-3xl shadow-glow-critical p-5 pb-7"
            >
              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full bg-white/10 mx-auto mb-4" />

              {/* Critical badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-critical/20 ring-1 ring-critical/40 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-critical" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-critical/30 animate-ping-slow" />
                </div>
                <div>
                  <div className="text-base font-bold text-critical">ScamSense Alert</div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Critical scam risk detected
                  </div>
                </div>
              </div>

              <div className="text-[13px] text-zinc-200 leading-snug mb-3">
                <strong>Do not transfer to this account.</strong> The recent call matches common
                impersonation scam patterns and the recipient is flagged as a suspicious eWallet
                target.
              </div>

              {/* Risk summary */}
              <div className="flex items-center gap-2 rounded-xl bg-critical/10 ring-1 ring-critical/30 p-3 mb-3">
                <AlertTriangle className="w-4 h-4 text-critical shrink-0" strokeWidth={2.5} />
                <div className="flex-1 text-[11px] text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-critical tabular-nums leading-none">
                      {mockRiskResult.riskScore}
                    </span>
                    <span className="text-[10px] text-zinc-400">/ 100</span>
                    <span className="pill bg-critical-soft text-critical ring-1 ring-critical/30 ml-1">
                      {mockRiskResult.riskLevel}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    Authority impersonation · urgent transfer · account-freeze threat
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAcknowledged(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-critical px-6 py-3.5 text-sm font-bold text-white shadow-glow-critical transition hover:bg-critical/90 active:scale-[0.98]"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                  Cancel Transfer
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAcknowledged(true)}
                    className="btn-secondary text-xs"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Report Recipient
                  </button>
                  <button
                    type="button"
                    onClick={() => setAcknowledged(true)}
                    className="btn-secondary text-xs"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Contact TNG
                  </button>
                </div>
              </div>

              <p className="text-center text-[10px] text-zinc-600 mt-3">
                Prototype Simulation — TNG wallet screen is simulated
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acknowledged → Continue */}
      <AnimatePresence>
        {acknowledged && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 bottom-0 px-5 pb-6 z-30"
          >
            <button
              type="button"
              onClick={onProtected}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-safe to-privacy px-6 py-3.5 text-sm font-bold text-white shadow-glow-safe transition hover:opacity-95"
            >
              <Check className="w-4 h-4" strokeWidth={2.5} />
              I Understand
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
