"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { mockTranscript, suspiciousPhrases, type TranscriptLine } from "@/data/mockTranscript";
import { formatDuration } from "@/lib/formatters";

type Props = {
  onAnalyze: () => void;
};

/** Live waveform: 24 bars with random heights animating */
function Waveform() {
  const bars = Array.from({ length: 24 });
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {bars.map((_, i) => (
        <div
          key={i}
          className="w-[3px] bg-gradient-to-t from-privacy to-premium rounded-full wave-bar"
          style={{
            height: `${20 + Math.sin(i * 0.7) * 60 + 30}%`,
            animationDelay: `${(i % 6) * 0.12}s`
          }}
        />
      ))}
    </div>
  );
}

/** Highlights known suspicious phrases inline */
function HighlightedText({ text }: { text: string }) {
  const parts: { text: string; suspicious: boolean }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    const lower = remaining.toLowerCase();
    let earliest = -1;
    let phrase = "";
    for (const p of suspiciousPhrases) {
      const idx = lower.indexOf(p.toLowerCase());
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        phrase = remaining.slice(idx, idx + p.length);
      }
    }
    if (earliest === -1) {
      parts.push({ text: remaining, suspicious: false });
      break;
    }
    if (earliest > 0) {
      parts.push({ text: remaining.slice(0, earliest), suspicious: false });
    }
    parts.push({ text: phrase, suspicious: true });
    remaining = remaining.slice(earliest + phrase.length);
  }
  return (
    <>
      {parts.map((p, i) =>
        p.suspicious ? (
          <span
            key={i}
            className="inline-block bg-critical/20 text-critical-foreground rounded px-1 py-0.5 mx-0.5 font-semibold ring-1 ring-critical/30"
            style={{ color: "#fca5a5" }}
          >
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

export default function LiveTranscript({ onAnalyze }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [revealed, setRevealed] = useState<TranscriptLine[]>([]);
  const [showAnalyze, setShowAnalyze] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Reveal transcript lines progressively
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    mockTranscript.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setRevealed((curr) => [...curr, line]);
          if (i === mockTranscript.length - 1) {
            setTimeout(() => setShowAnalyze(true), 600);
          }
        }, line.revealAt)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [revealed]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-full flex flex-col px-5 pt-2 pb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            Active call
          </div>
          <div className="text-base font-bold tracking-tight">+60 11-2847 9931</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
            Duration
          </div>
          <div className="text-base font-bold tabular-nums">{formatDuration(elapsed)}</div>
        </div>
      </div>

      {/* Waveform card */}
      <div className="card p-3 mb-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-privacy/5 via-transparent to-premium/5" />
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-privacy/20 ring-1 ring-privacy/30 flex items-center justify-center">
              <Mic className="w-4 h-4 text-privacy" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-critical animate-pulse" />
          </div>
          <div className="flex-1">
            <Waveform />
          </div>
        </div>

        <div className="relative mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
          <div className="flex items-center gap-1 text-safe">
            <ShieldCheck className="w-3 h-3" /> Listening privately
          </div>
          <div className="flex items-center gap-1 text-privacy">
            <Mic className="w-3 h-3" /> STT on-device
          </div>
          <div className="flex items-center gap-1 text-premium">
            <Lock className="w-3 h-3" /> Stays on phone
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={containerRef}
        className="flex-1 card p-3 overflow-y-auto space-y-2.5"
        style={{ minHeight: 0 }}
      >
        <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold mb-1">
          Live transcript
        </div>

        <AnimatePresence>
          {revealed.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex gap-2"
            >
              <div className="shrink-0 w-7 h-7 rounded-lg bg-critical/20 ring-1 ring-critical/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-critical">SCM</span>
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-zinc-500 font-semibold">{line.speaker}</div>
                <div className="text-[13px] leading-snug text-zinc-200 mt-0.5">
                  <HighlightedText text={line.text} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {revealed.length < mockTranscript.length && (
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 pl-9">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="w-1 h-1 rounded-full bg-zinc-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
            transcribing locally...
          </div>
        )}
      </div>

      {/* Action */}
      <AnimatePresence>
        {showAnalyze && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3"
          >
            <button
              type="button"
              onClick={onAnalyze}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-privacy to-premium px-6 py-3.5 text-sm font-bold text-white shadow-glow-privacy transition hover:opacity-95 active:scale-[0.98]"
            >
              Analyze Call Now
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-[10px] text-zinc-600 mt-2">
        Prototype Simulation — transcript is demo data
      </p>
    </motion.div>
  );
}
