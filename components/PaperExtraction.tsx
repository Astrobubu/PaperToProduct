"use client";

import { PaperExtraction as PaperExtractionType } from "@/types";

interface PaperExtractionProps {
  extraction: PaperExtractionType;
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  const displayLabel = label.replace(/_/g, " ");
  return (
    <div className="bg-surface-alt rounded-lg px-3 py-2">
      <div className="text-xs text-t-muted capitalize">{displayLabel}</div>
      <div className="text-sm font-medium text-t-primary mt-0.5">{value}</div>
    </div>
  );
}

export default function PaperExtractionCard({ extraction }: PaperExtractionProps) {
  const hasPerformance = Object.keys(extraction.performance).length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 animate-slide-up">
      {/* Title */}
      <h3 className="font-heading font-semibold text-t-primary text-base leading-snug mb-4">
        {extraction.paperTitle}
      </h3>

      {/* Objective */}
      <div className="mb-4">
        <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
          Objective
        </div>
        <p className="text-sm text-t-primary leading-relaxed">{extraction.objective}</p>
      </div>

      {/* Methodology */}
      <div className="mb-4">
        <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
          Methodology
        </div>
        <p className="text-sm text-t-secondary leading-relaxed">{extraction.methodology}</p>
      </div>

      {/* Key Findings */}
      {extraction.keyFindings.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Key Findings
          </div>
          <ul className="space-y-1">
            {extraction.keyFindings.map((finding, i) => (
              <li key={i} className="text-sm text-t-primary flex gap-2">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance Metrics */}
      {hasPerformance && (
        <div className="mb-4">
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-2">
            Performance Metrics
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(extraction.performance).map(([key, value]) => (
              <MetricBadge key={key} label={key} value={value} />
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      {extraction.materials.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Materials
          </div>
          <div className="flex flex-wrap gap-1.5">
            {extraction.materials.map((mat, i) => (
              <span
                key={i}
                className="bg-accent/50 text-secondary text-xs px-2 py-1 rounded-full"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Limitations */}
      {extraction.limitations.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Limitations
          </div>
          <ul className="space-y-1">
            {extraction.limitations.map((lim, i) => (
              <li key={i} className="text-sm text-t-secondary flex gap-2">
                <span className="text-score-medium font-bold mt-0.5">!</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Novelty & Relevance */}
      <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
        <div>
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            What&apos;s New
          </div>
          <p className="text-xs text-t-secondary leading-relaxed">{extraction.novelty}</p>
        </div>
        <div>
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Relevance
          </div>
          <p className="text-xs text-t-secondary leading-relaxed">{extraction.relevance}</p>
        </div>
      </div>
    </div>
  );
}
