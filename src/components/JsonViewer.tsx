"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { cn } from "@/lib/formatters";

type Props = {
  data: unknown;
  title?: string;
  defaultOpen?: boolean;
  className?: string;
};

export default function JsonViewer({ data, title = "Payload", defaultOpen = false, className }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const json = JSON.stringify(data, null, 2);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={cn("card overflow-hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.03] transition"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
          {open ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
          <span>{title}</span>
          <span className="text-[10px] text-zinc-500 font-mono">JSON</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-safe" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </button>
      {open && (
        <pre className="px-4 pb-4 text-[11px] leading-relaxed text-zinc-300 font-mono overflow-x-auto">
          {json}
        </pre>
      )}
    </div>
  );
}
