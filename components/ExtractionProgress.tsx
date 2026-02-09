"use client";

export type ItemStatus = "waiting" | "extracting" | "done" | "error";

export interface ProgressItem {
  id: string;
  title: string;
  status: ItemStatus;
}

interface ExtractionProgressProps {
  items: ProgressItem[];
  phase?: string;
}

function StatusIcon({ status }: { status: ItemStatus }) {
  switch (status) {
    case "done":
      return (
        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case "extracting":
      return (
        <div className="w-5 h-5 flex-shrink-0">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    case "error":
      return (
        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
      );
  }
}

export default function ExtractionProgress({ items, phase }: ExtractionProgressProps) {
  const completed = items.filter((i) => i.status === "done").length;
  const total = items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in">
      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs text-t-muted">
          {completed} of {total} complete
        </span>
        {phase && (
          <span className="text-xs text-primary font-medium">{phase}</span>
        )}
      </div>

      {/* Item list */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
              item.status === "extracting"
                ? "bg-accent/30 border border-primary/20"
                : item.status === "done"
                ? "bg-green-50/50"
                : item.status === "error"
                ? "bg-red-50/50"
                : "bg-surface-alt/50"
            }`}
          >
            <StatusIcon status={item.status} />
            <span
              className={`text-sm leading-snug truncate ${
                item.status === "extracting"
                  ? "text-t-primary font-medium"
                  : item.status === "done"
                  ? "text-t-secondary"
                  : item.status === "error"
                  ? "text-red-600"
                  : "text-t-muted"
              }`}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
