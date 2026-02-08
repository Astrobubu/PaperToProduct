"use client";

import { useState } from "react";
import { PaperWithAnalysis } from "@/types";

interface PaperListProps {
  papers: PaperWithAnalysis[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}

function PaperCard({
  paper,
  selected,
  onToggle,
}: {
  paper: PaperWithAnalysis;
  selected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const authors = paper.authors.slice(0, 2).map((a) => a.name);
  const authorStr =
    authors.join(", ") + (paper.authors.length > 2 ? ` +${paper.authors.length - 2}` : "");

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
            {paper.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-t-muted">
            {authorStr && <span>{authorStr}</span>}
            {paper.year && (
              <span className="bg-surface-alt px-1.5 py-0.5 rounded">{paper.year}</span>
            )}
            {paper.citationCount > 0 && (
              <span>{paper.citationCount} citations</span>
            )}
            {paper.journal && (
              <span className="truncate max-w-[200px]">{paper.journal}</span>
            )}
          </div>

          {/* Abstract */}
          {paper.abstract && (
            <div className="mt-2">
              <p
                className={`text-xs text-t-secondary leading-relaxed ${
                  expanded ? "" : "line-clamp-2"
                }`}
              >
                {paper.abstract}
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-primary hover:text-primary-dark font-medium mt-1"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </div>
          )}

          {/* PDF link */}
          {paper.pdfUrl && (
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-secondary hover:text-secondary-light font-medium mt-2"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaperList({ papers, selectedIds, onToggle }: PaperListProps) {
  return (
    <div className="space-y-3">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id || paper.externalId}
          paper={paper}
          selected={selectedIds.has(paper.id || paper.externalId)}
          onToggle={() => onToggle(paper.id || paper.externalId)}
        />
      ))}
    </div>
  );
}
