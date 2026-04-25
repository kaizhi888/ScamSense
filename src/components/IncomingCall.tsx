"use client";

import { motion } from "framer-motion";
import { Phone, PhoneOff, ShieldCheck, MapPin, AlertCircle } from "lucide-react";

type Props = {
  onAnswer: () => void;
  onDecline: () => void;
};

export default function IncomingCall({ onAnswer, onDecline }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full flex flex-col bg-gradient-to-b from-ink-900 via-ink-950 to-black px-6 pt-8 pb-10"
    >
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-critical/20 blur-3xl pointer-events-none" />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative text-center"
      >
        <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-semibold">
          Incoming call
        </div>
      </motion.div>

      {/* Caller block */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative flex-1 flex flex-col items-center justify-center"
      >
        {/* Pulsing avatar */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-critical/30 animate-ping-slow" />
          <div className="absolute -inset-3 rounded-full bg-critical/20 animate-pulse-slow" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-white/10 flex items-center justify-center shadow-2xl">
            <AlertCircle className="w-12 h-12 text-zinc-300" strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-2xl font-bold tracking-tight text-white">
          +60 11-2847 9931
        </div>
        <div className="mt-1.5 text-sm text-zinc-400">Unknown Caller</div>

        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
          <MapPin className="w-3 h-3" />
          Malaysia · Mobile network
        </div>

        {/* Risk hint */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-warning-soft text-warning ring-1 ring-warning/30 px-3 py-1.5 text-xs font-semibold backdrop-blur"
        >
          <div className="relative">
            <div className="w-1.5 h-1.5 rounded-full bg-warning" />
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-warning animate-ping-slow" />
          </div>
          ScamSense ready · monitoring available
        </motion.div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative space-y-3"
      >
        <button
          type="button"
          onClick={onAnswer}
          className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-safe to-privacy px-6 py-4 text-sm font-bold text-white shadow-glow-safe transition hover:opacity-95 active:scale-[0.98]"
        >
          <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
          Answer with ScamSense
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAnswer}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-safe px-5 py-4 text-sm font-semibold text-white transition hover:bg-safe/90 active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" strokeWidth={2.5} />
            Answer
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-critical px-5 py-4 text-sm font-semibold text-white transition hover:bg-critical/90 active:scale-[0.98]"
          >
            <PhoneOff className="w-4 h-4" strokeWidth={2.5} />
            Decline
          </button>
        </div>

        <p className="text-center text-[10px] text-zinc-600 mt-2">
          Prototype Simulation — phone call UI only
        </p>
      </motion.div>
    </motion.div>
  );
}
