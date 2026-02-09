"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProductConceptCard from "@/components/ProductConceptCard";
import ExtractionProgress, { ProgressItem } from "@/components/ExtractionProgress";
import { ProductConcept, PaperExtraction, Domain } from "@/types";

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get("ids") || "";
  const domain = (searchParams.get("domain") || "energy_storage") as Domain;
  const query = searchParams.get("q") || "";

  const paperIds = ids.split(",").filter(Boolean);

  const [concept, setConcept] = useState<ProductConcept | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);
  const [phase, setPhase] = useState<string>("Extracting papers");
  const hasRun = useRef(false);

  // Load paper titles from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("selectedItems");
    const conceptStep: ProgressItem = {
      id: "__concept__",
      title: "Generate product concept",
      status: "waiting",
    };

    if (stored) {
      try {
        const items: { id: string; title: string }[] = JSON.parse(stored);
        setProgressItems([
          ...paperIds.map((id) => ({
            id,
            title: items.find((i) => i.id === id)?.title || `Paper ${id.slice(0, 8)}...`,
            status: "waiting" as const,
          })),
          conceptStep,
        ]);
      } catch {
        setProgressItems([
          ...paperIds.map((id, i) => ({
            id,
            title: `Paper ${i + 1}`,
            status: "waiting" as const,
          })),
          conceptStep,
        ]);
      }
    } else {
      setProgressItems([
        ...paperIds.map((id, i) => ({
          id,
          title: `Paper ${i + 1}`,
          status: "waiting" as const,
        })),
        conceptStep,
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const generateConcept = useCallback(async () => {
    if (paperIds.length === 0 || hasRun.current) return;
    hasRun.current = true;
    setLoading(true);
    setError(null);
    setPhase("Extracting papers");
    const allExtractions: PaperExtraction[] = [];

    // Phase 1: Extract each paper one by one
    for (let i = 0; i < paperIds.length; i++) {
      const paperId = paperIds[i];

      setProgressItems((prev) =>
        prev.map((item) =>
          item.id === paperId ? { ...item, status: "extracting" } : item
        )
      );

      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paperIds: [paperId],
            domain,
            searchQuery: query,
          }),
        });

        if (!res.ok) throw new Error("Extraction failed");
        const data = await res.json();
        const extraction = data.extractions?.[0];

        if (extraction) {
          allExtractions.push(extraction);
          setProgressItems((prev) =>
            prev.map((item) =>
              item.id === paperId
                ? { ...item, status: "done", title: extraction.paperTitle || item.title }
                : item
            )
          );
        } else {
          setProgressItems((prev) =>
            prev.map((item) =>
              item.id === paperId ? { ...item, status: "error" } : item
            )
          );
        }
      } catch {
        setProgressItems((prev) =>
          prev.map((item) =>
            item.id === paperId ? { ...item, status: "error" } : item
          )
        );
      }
    }

    // Phase 2: Generate product concept
    setPhase("Generating concept");
    setProgressItems((prev) =>
      prev.map((item) =>
        item.id === "__concept__" ? { ...item, status: "extracting" } : item
      )
    );

    try {
      const res = await fetch("/api/product-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperIds,
          domain,
          searchQuery: query,
          extractions: allExtractions,
        }),
      });

      if (!res.ok) throw new Error("Concept generation failed");
      const data = await res.json();
      setConcept(data.concept || null);
      setProgressItems((prev) =>
        prev.map((item) =>
          item.id === "__concept__" ? { ...item, status: "done" } : item
        )
      );
    } catch {
      setProgressItems((prev) =>
        prev.map((item) =>
          item.id === "__concept__" ? { ...item, status: "error" } : item
        )
      );
      setError("Failed to generate product concept. Please try again.");
    }

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, domain, query]);

  useEffect(() => {
    if (progressItems.length > 0 && !hasRun.current) {
      generateConcept();
    }
  }, [progressItems, generateConcept]);

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
          Product Concept
        </h1>
        <p className="text-t-muted text-sm mt-1">
          Generated from {paperIds.length} selected paper{paperIds.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {/* Loading with real progress */}
      {loading && progressItems.length > 0 && (
        <div className="py-8">
          <ExtractionProgress items={progressItems} phase={phase} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
          <button
            onClick={() => {
              hasRun.current = false;
              setConcept(null);
              setProgressItems((prev) => prev.map((i) => ({ ...i, status: "waiting" as const })));
              generateConcept();
            }}
            className="block mt-2 text-red-800 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Result */}
      {!loading && !error && concept && (
        <div className="animate-slide-up">
          <ProductConceptCard concept={concept} />
        </div>
      )}
    </>
  );
}

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 w-72 h-72 -top-10 -right-10" />
        <div className="blob blob-3 w-64 h-64 bottom-20 right-10" />
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
          <ProductContent />
        </Suspense>
      </main>
    </div>
  );
}
