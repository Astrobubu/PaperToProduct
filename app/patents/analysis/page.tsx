"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import PatentExtractionCard from "@/components/PatentExtractionCard";
import ExtractionProgress, { ProgressItem } from "@/components/ExtractionProgress";
import { PatentExtraction, Domain } from "@/types";

function PatentAnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get("ids") || "";
  const domain = (searchParams.get("domain") || "energy_storage") as Domain;
  const query = searchParams.get("q") || "";

  const patentIds = ids.split(",").filter(Boolean);

  const [extractions, setExtractions] = useState<PatentExtraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const hasRun = useRef(false);

  // Load patent titles from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedItems");
    if (stored) {
      try {
        const items: { id: string; title: string }[] = JSON.parse(stored);
        setProgressItems(
          patentIds.map((id) => ({
            id,
            title: items.find((i) => i.id === id)?.title || `Patent ${id.slice(0, 8)}...`,
            status: "waiting" as const,
          }))
        );
      } catch {
        setProgressItems(
          patentIds.map((id, i) => ({
            id,
            title: `Patent ${i + 1}`,
            status: "waiting" as const,
          }))
        );
      }
    } else {
      setProgressItems(
        patentIds.map((id, i) => ({
          id,
          title: `Patent ${i + 1}`,
          status: "waiting" as const,
        }))
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const runExtraction = useCallback(async () => {
    if (patentIds.length === 0 || hasRun.current) return;
    hasRun.current = true;
    setLoading(true);
    setError(null);
    const results: PatentExtraction[] = [];

    for (let i = 0; i < patentIds.length; i++) {
      const patentId = patentIds[i];

      setProgressItems((prev) =>
        prev.map((item) =>
          item.id === patentId ? { ...item, status: "extracting" } : item
        )
      );

      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patentIds: [patentId],
            domain,
            searchQuery: query,
          }),
        });

        if (!res.ok) throw new Error("Extraction failed");
        const data = await res.json();
        const extraction = data.patentExtractions?.[0];

        if (extraction) {
          results.push(extraction);
          setProgressItems((prev) =>
            prev.map((item) =>
              item.id === patentId
                ? { ...item, status: "done", title: extraction.patentTitle || item.title }
                : item
            )
          );
        } else {
          setProgressItems((prev) =>
            prev.map((item) =>
              item.id === patentId ? { ...item, status: "error" } : item
            )
          );
        }
      } catch {
        setProgressItems((prev) =>
          prev.map((item) =>
            item.id === patentId ? { ...item, status: "error" } : item
          )
        );
      }

      setExtractions([...results]);
    }

    if (results.length === 0) {
      setError("Failed to analyze patents. Please try again.");
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, domain, query]);

  useEffect(() => {
    if (progressItems.length > 0 && !hasRun.current) {
      runExtraction();
    }
  }, [progressItems, runExtraction]);

  if (!ids) {
    router.push("/patents");
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
          Analysis of {patentIds.length} patent{patentIds.length !== 1 ? "s" : ""}
        </h1>
        <p className="text-t-muted text-sm mt-1">
          Extracted from patent abstracts. Only claims explicitly stated are shown.
        </p>
      </div>

      {/* Loading with real progress */}
      {loading && progressItems.length > 0 && (
        <div className="py-8">
          <ExtractionProgress items={progressItems} phase="Extracting patents" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
          <button
            onClick={() => {
              hasRun.current = false;
              setExtractions([]);
              setProgressItems((prev) => prev.map((i) => ({ ...i, status: "waiting" as const })));
              runExtraction();
            }}
            className="block mt-2 text-red-800 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && extractions.length > 0 && (
        <div className="space-y-6 animate-slide-up">
          <div>
            <h2 className="font-heading font-semibold text-t-primary text-lg mb-4">
              Patent Details
            </h2>
            <div className="space-y-4">
              {extractions.map((ext) => (
                <PatentExtractionCard key={ext.patentId} extraction={ext} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PatentAnalysisPage() {
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
          <PatentAnalysisContent />
        </Suspense>
      </main>
    </div>
  );
}
