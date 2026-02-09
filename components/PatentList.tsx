"use client";

import { useState } from "react";
import { Patent } from "@/types";

interface PatentListProps {
  patents: Patent[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

function getExpiryStatus(expirationDate: string | null): {
  label: string;
  color: string;
} {
  if (!expirationDate) return { label: "Unknown", color: "text-t-muted" };
  const expiry = new Date(expirationDate);
  const now = new Date();
  const twoYears = new Date();
  twoYears.setFullYear(twoYears.getFullYear() + 2);

  if (expiry < now) return { label: "Expired", color: "text-red-600" };
  if (expiry < twoYears) return { label: "Expiring soon", color: "text-amber-600" };
  return { label: "Active", color: "text-green-600" };
}

function PatentCard({
  patent,
  selected,
  onToggle,
}: {
  patent: Patent;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const inventors = patent.inventors.slice(0, 2).map((a) => a.name);
  const inventorStr =
    inventors.join(", ") +
    (patent.inventors.length > 2 ? ` +${patent.inventors.length - 2}` : "");
  const expiry = getExpiryStatus(patent.expirationDate);

  // Format patent ID for display: US-11234567-B2 -> US 11,234,567 B2
  const formatPatentId = (id: string) => {
    return id.replace(/-/g, " ");
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 p-4 transition-all duration-150 ${
        selected
          ? "border-primary shadow-sm"
          : "border-transparent shadow-sm hover:shadow-md"
      }`}
    >
      <div className="flex gap-3">
        {/* Checkbox */}
        <div className="pt-0.5 flex-shrink-0">
          <button
            onClick={onToggle}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              selected
                ? "bg-primary border-primary"
                : "border-border-strong hover:border-primary"
            }`}
          >
            {selected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6L5 9L10 3"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="font-medium text-t-primary text-sm leading-snug cursor-pointer hover:text-secondary transition-colors"
            onClick={onToggle}
          >
            {patent.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-t-muted">
            <span className="font-mono bg-surface-alt px-1.5 py-0.5 rounded text-xs">
              {formatPatentId(patent.patentId)}
            </span>
            {patent.assigneeOrg && (
              <span className="font-medium text-t-secondary">{patent.assigneeOrg}</span>
            )}
            {patent.grantDate && (
              <span>Granted: {patent.grantDate}</span>
            )}
            <span className={`font-medium ${expiry.color}`}>
              {expiry.label}
            </span>
            {patent.timesCited > 0 && (
              <span>{patent.timesCited} times cited</span>
            )}
          </div>

          {/* CPC codes */}
          {patent.cpcCodes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {patent.cpcCodes.slice(0, 4).map((code, i) => (
                <span
                  key={i}
                  className="bg-surface-alt text-t-muted text-[10px] px-1.5 py-0.5 rounded font-mono"
                >
                  {code}
                </span>
              ))}
              {patent.cpcCodes.length > 4 && (
                <span className="text-[10px] text-t-muted">
                  +{patent.cpcCodes.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Inventors */}
          {inventorStr && (
            <div className="mt-1.5 text-xs text-t-muted">
              Inventors: {inventorStr}
            </div>
          )}

          {/* Abstract */}
          {patent.abstract && (
            <div className="mt-2">
              <p
                className={`text-xs text-t-secondary leading-relaxed ${
                  expanded ? "" : "line-clamp-2"
                }`}
              >
                {patent.abstract}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-primary hover:text-primary-dark font-medium mt-1"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PatentList({
  patents,
  selectedIds,
  onToggle,
}: PatentListProps) {
  return (
    <div className="space-y-3">
      {patents.map((patent) => (
        <PatentCard
          key={patent.id || patent.patentId}
          patent={patent}
          selected={selectedIds.has(patent.id || patent.patentId)}
          onToggle={() => onToggle(patent.id || patent.patentId)}
        />
      ))}
    </div>
  );
}
