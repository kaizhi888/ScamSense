"use client";

import { motion } from "framer-motion";
import { Signal, Wifi, BatteryFull } from "lucide-react";
import { cn } from "@/lib/formatters";

type PhoneFrameProps = {
  children: React.ReactNode;
  /** Hide notch/status bar (e.g. for landing modes) */
  bare?: boolean;
  className?: string;
};

export default function PhoneFrame({ children, bare = false, className }: PhoneFrameProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Outer bezel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto w-[390px] h-[844px] rounded-[54px] bg-ink-900 phone-shadow p-[14px] overflow-hidden"
      >
        {/* Inner screen */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-ink-950">
          {/* Notch / Dynamic Island */}
          {!bare && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-[28px] w-[110px] rounded-full bg-black/95 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
            </div>
          )}

          {/* Status bar */}
          {!bare && (
            <div className="absolute top-0 left-0 right-0 z-40 px-7 pt-[14px] flex items-center justify-between text-[11px] font-semibold text-white pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
                <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
                <BatteryFull className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </div>
          )}

          {/* Screen content with safe-area top padding so it sits below the notch */}
          <div className={cn("relative w-full h-full overflow-y-auto overflow-x-hidden", !bare && "pt-12")}>
            {children}
          </div>
        </div>

        {/* Bezel reflections */}
        <div className="pointer-events-none absolute inset-0 rounded-[54px] ring-1 ring-white/[0.04]" />
      </motion.div>
    </div>
  );
}
