"use client";

import { PaperExtraction } from "@/types";

interface ComparisonTableProps {
  extractions: PaperExtraction[];
}

export default function ComparisonTable({ extractions }: ComparisonTableProps) {
  // Collect all unique metric keys across all papers
  const allMetrics = new Set<string>();
  for (const ext of extractions) {
    for (const key of Object.keys(ext.performance)) {
      allMetrics.add(key);
    }
  }

  const metricKeys = Array.from(allMetrics);

  if (metricKeys.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 text-center">
        <p className="text-t-muted text-sm">
          No quantitative metrics were reported across the selected papers.
        </p>
      </div>
    );
  }

  // Truncate long titles for table headers
  const shortTitle = (title: string) =>
    title.length > 40 ? title.slice(0, 37) + "..." : title;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-t-primary text-base">
          Metric Comparison
        </h3>
        <p className="text-xs text-t-muted mt-1">
          Only metrics explicitly reported in each paper are shown. Empty cells mean the paper did not report that metric.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-alt">
              <th className="text-left px-4 py-3 text-xs font-medium text-t-muted uppercase tracking-wide border-b border-border sticky left-0 bg-surface-alt z-10">
                Metric
              </th>
              {extractions.map((ext) => (
                <th
                  key={ext.paperId}
                  className="text-left px-4 py-3 text-xs font-medium text-t-secondary border-b border-border min-w-[180px]"
                  title={ext.paperTitle}
                >
                  {shortTitle(ext.paperTitle)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricKeys.map((metric) => (
              <tr key={metric} className="border-b border-border last:border-b-0 hover:bg-surface-alt/50">
                <td className="px-4 py-3 text-xs font-medium text-t-primary capitalize sticky left-0 bg-white z-10">
                  {metric.replace(/_/g, " ")}
                </td>
                {extractions.map((ext) => (
                  <td key={ext.paperId} className="px-4 py-3 text-xs text-t-secondary">
                    {ext.performance[metric] ? (
                      <span className="text-t-primary font-medium">
                        {ext.performance[metric]}
                      </span>
                    ) : (
                      <span className="text-t-muted">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
