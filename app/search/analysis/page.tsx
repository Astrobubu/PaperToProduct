"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import PaperExtractionCard from "@/components/PaperExtraction";
import ComparisonTable from "@/components/ComparisonTable";
import { PaperExtraction, Domain } from "@/types";

function AnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get("ids") || "";
  const domain = (searchParams.get("domain") || "energy_storage") as Domain;
  const query = searchParams.get("q") || "";

  const paperIds = ids.split(",").filter(Boolean);

  const [extractions, setExtractions] = useState<PaperExtraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const runExtraction = useCallback(async () => {
    if (paperIds.length === 0) return;
    setLoading(true);
    setError(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (paperIds.length * 5), 90));
    }, 500);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperIds, domain, searchQuery: query }),
      });
      if (!res.ok) throw new Error("Extraction failed");
      const data = await res.json();
      setExtractions(data.extractions || []);
      setProgress(100);
    } catch {
      setError("Failed to analyze papers. Please try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, domain, query]);

  useEffect(() => {
    runExtraction();
  }, [runExtraction]);

  if (!ids) {
    router.push("/search");
    return null;
  }

  return (
    <>
      {/* Navigation */}
      <div className="mb-6 animate-fade-in">
        <button
          onClick={() => router.back()}
          className="text-sm text-t-muted hover:text-t-secondary transition-colors mb-3 flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to results
        </button>
        <h1 className="font-heading font-bold text-xl text-t-primary">
          Analysis of {paperIds.length} paper{paperIds.length !== 1 ? "s" : ""}
        </h1>
        <p className="text-t-muted text-sm mt-1">
          Extracted from paper abstracts. Only data explicitly reported by authors is shown.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16 animate-fade-in">
          <div className="w-full max-w-xs mb-4">
            <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-t-muted text-sm">
              Analyzing {paperIds.length} paper{paperIds.length !== 1 ? "s" : ""}...
            </p>
          </div>
          <p className="text-t-muted text-xs mt-2">
            Each paper is analyzed individually by AI
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
          <button
            onClick={runExtraction}
            className="block mt-2 text-red-800 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && extractions.length > 0 && (
        <div className="space-y-6 animate-slide-up">
          <ComparisonTable extractions={extractions} />

          <div>
            <h2 className="font-heading font-semibold text-t-primary text-lg mb-4">
              Paper Details
            </h2>
            <div className="space-y-4">
              {extractions.map((ext) => (
                <PaperExtractionCard key={ext.paperId} extraction={ext} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 w-72 h-72 -top-10 -right-10" />
        <div className="blob blob-3 w-64 h-64 bottom-20 right-10" />
      </div>

      <Header />

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-6 pb-24">
        <Suspense
          fallback={
            <div className="flex flex-col items-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-t-muted text-sm mt-3">Loading...</p>
            </div>
          }
        >
          <AnalysisContent />
        </Suspense>
      </main>
    </div>
  );
}
