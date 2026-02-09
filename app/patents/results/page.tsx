"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import PatentList from "@/components/PatentList";
import { Patent, Domain } from "@/types";

function PatentResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const domain = (searchParams.get("domain") || "energy_storage") as Domain;

  const [patents, setPatents] = useState<Patent[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatents = useCallback(async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ q: query, domain });
      const res = await fetch(`/api/patents/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setPatents(data.patents || []);
    } catch {
      setError("Failed to search patents. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, domain]);

  useEffect(() => {
    fetchPatents();
  }, [fetchPatents]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === patents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(patents.map((p) => p.id || p.patentId)));
    }
  };

  const handleAnalyze = () => {
    if (selectedIds.size === 0) return;
    // Stash selected patent titles for real progress display
    const selectedPatents = patents
      .filter((p) => selectedIds.has(p.id || p.patentId))
      .map((p) => ({ id: p.id || p.patentId, title: p.title }));
    sessionStorage.setItem("selectedItems", JSON.stringify(selectedPatents));

    const ids = Array.from(selectedIds).join(",");
    const params = new URLSearchParams({ ids, domain, q: query });
    router.push(`/patents/analysis?${params.toString()}`);
  };

  if (!query) {
    router.push("/patents");
    return null;
  }

  return (
    <>
      {/* Search info */}
      <div className="mb-6 animate-fade-in">
        <button
          onClick={() => router.push("/patents")}
          className="text-sm text-t-muted hover:text-t-secondary transition-colors mb-3 flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to patent search
        </button>
        <h1 className="font-heading font-bold text-xl text-t-primary">
          Patent results for &ldquo;{query}&rdquo;
        </h1>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-t-muted text-sm mt-3">Searching patents...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <span className="text-sm text-t-secondary">
                {patents.length} patents found
              </span>
              {patents.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-xs text-primary hover:text-primary-dark font-medium"
                >
                  {selectedIds.size === patents.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={selectedIds.size === 0}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedIds.size > 0
                  ? "bg-secondary text-white hover:bg-secondary-light cursor-pointer"
                  : "bg-border text-t-muted cursor-not-allowed"
              }`}
            >
              Analyze {selectedIds.size > 0 ? `${selectedIds.size} selected` : "selected"}
            </button>
          </div>

          {/* Patent list */}
          {patents.length > 0 ? (
            <PatentList
              patents={patents}
              selectedIds={selectedIds}
              onToggle={handleToggle}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-t-muted text-sm">
                No patents found. Try a different search query or check that the PatentsView API key is configured.
              </p>
            </div>
          )}

          {/* Sticky bottom bar on mobile */}
          {selectedIds.size > 0 && (
            <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-border p-4 z-50">
              <button
                onClick={handleAnalyze}
                className="w-full py-3 rounded-xl text-sm font-semibold bg-secondary text-white"
              >
                Analyze {selectedIds.size} patent{selectedIds.size !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function PatentResultsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob blob-2 w-96 h-96 top-1/3 -left-32" />
        <div className="blob blob-4 blob-small w-48 h-48 top-48 right-1/3" />
      </div>

      <Header />

      <main className="relative z-10 max-w-3xl mx-auto px-4 pt-6 pb-24">
        <Suspense
          fallback={
            <div className="flex flex-col items-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-t-muted text-sm mt-3">Loading...</p>
            </div>
          }
        >
          <PatentResultsContent />
        </Suspense>
      </main>
    </div>
  );
}
