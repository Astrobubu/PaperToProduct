"use client";

import { PatentExtraction } from "@/types";

interface PatentExtractionCardProps {
  extraction: PatentExtraction;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
    "expiring soon": "bg-amber-100 text-amber-700",
    unknown: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[status] || colors.unknown}`}>
      {status}
    </span>
  );
}

export default function PatentExtractionCard({ extraction }: PatentExtractionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-5 animate-slide-up">
      {/* Title + Status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-heading font-semibold text-t-primary text-base leading-snug">
          {extraction.patentTitle}
        </h3>
        <StatusBadge status={extraction.legalStatus} />
      </div>

      {/* Claimed Invention */}
      <div className="mb-4">
        <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
          Claimed Invention
        </div>
        <p className="text-sm text-t-primary leading-relaxed">{extraction.claimedInvention}</p>
      </div>

      {/* Technical Field */}
      <div className="mb-4">
        <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
          Technical Field
        </div>
        <p className="text-sm text-t-secondary leading-relaxed">{extraction.technicalField}</p>
      </div>

      {/* Methodology */}
      <div className="mb-4">
        <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
          How It Works
        </div>
        <p className="text-sm text-t-secondary leading-relaxed">{extraction.methodology}</p>
      </div>

      {/* Key Advantages */}
      {extraction.keyAdvantages.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Key Advantages
          </div>
          <ul className="space-y-1">
            {extraction.keyAdvantages.map((adv, i) => (
              <li key={i} className="text-sm text-t-primary flex gap-2">
                <span className="text-green-600 font-bold mt-0.5">+</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
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

      {/* Commercial Owner & Relevance */}
      <div className="grid sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
        <div>
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Commercial Owner
          </div>
          <p className="text-xs text-t-secondary leading-relaxed">{extraction.commercialOwner}</p>
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
