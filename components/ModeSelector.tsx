"use client";

import { DiscoveryMode } from "@/types";

interface ModeSelectorProps {
  mode: DiscoveryMode;
  onChange: (mode: DiscoveryMode) => void;
}

export default function ModeSelector({ mode, onChange }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange("explore")}
        className={`text-left rounded-xl p-4 border-2 transition-all duration-150 ${
          mode === "explore"
            ? "border-primary bg-accent/30 shadow-sm"
            : "border-border bg-white hover:border-border-strong"
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={mode === "explore" ? "text-primary" : "text-t-muted"}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <span className={`text-sm font-semibold ${mode === "explore" ? "text-secondary" : "text-t-primary"}`}>
            Explore
          </span>
        </div>
        <p className="text-xs text-t-muted leading-relaxed">
          Browse papers and extract factual data from each one.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onChange("product")}
        className={`text-left rounded-xl p-4 border-2 transition-all duration-150 ${
          mode === "product"
            ? "border-primary bg-accent/30 shadow-sm"
            : "border-border bg-white hover:border-border-strong"
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={mode === "product" ? "text-primary" : "text-t-muted"}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className={`text-sm font-semibold ${mode === "product" ? "text-secondary" : "text-t-primary"}`}>
            Paper to Product
          </span>
        </div>
        <p className="text-xs text-t-muted leading-relaxed">
          Select papers and generate an AI product concept.
        </p>
      </button>
    </div>
  );
}
