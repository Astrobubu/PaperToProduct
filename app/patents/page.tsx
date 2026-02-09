"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Domain } from "@/types";

const DOMAINS: { key: Domain; label: string; icon: string }[] = [
  { key: "energy_storage", label: "Energy Storage", icon: "⚡" },
  { key: "biodegradable_plastics", label: "Biodegradable Plastics", icon: "🌿" },
  { key: "medical_devices", label: "Medical Devices", icon: "🏥" },
  { key: "advanced_materials", label: "Advanced Materials", icon: "🔬" },
  { key: "food_technology", label: "Food Technology", icon: "🍎" },
];

const EXAMPLE_SEARCHES: { query: string; domain: Domain }[] = [
  { query: "solid state battery electrolyte", domain: "energy_storage" },
  { query: "biodegradable food packaging film", domain: "biodegradable_plastics" },
  { query: "implantable glucose monitor", domain: "medical_devices" },
  { query: "carbon nanotube composite", domain: "advanced_materials" },
  { query: "food preservation antimicrobial coating", domain: "food_technology" },
  { query: "lithium sulfur battery cathode", domain: "energy_storage" },
];

export default function PatentSearchPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<Domain>("energy_storage");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query.trim(), domain });
    router.push(`/patents/results?${params.toString()}`);
  };

  const handleExample = (ex: (typeof EXAMPLE_SEARCHES)[0]) => {
    setQuery(ex.query);
    setDomain(ex.domain);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 w-72 h-72 -top-10 -right-10" />
        <div className="blob blob-2 w-96 h-96 top-1/3 -left-32" />
        <div className="blob blob-3 w-64 h-64 bottom-20 right-10" />
        <div className="blob blob-4 blob-small w-48 h-48 top-48 right-1/3" />
      </div>

      <Header />

      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-12 pb-24">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-t-primary mb-3 leading-tight">
            Search &amp; analyze
            <br />
            <span className="text-primary">US patents</span>
          </h1>
          <p className="text-t-secondary text-base max-w-md mx-auto">
            Find patents from the USPTO database, select the ones that matter,
            and let AI extract their key claims.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="animate-slide-up">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
            {/* Query input */}
            <div>
              <label
                htmlFor="patent-query"
                className="block text-sm font-medium text-t-primary mb-1.5"
              >
                Search for patents
              </label>
              <input
                id="patent-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. solid state battery electrolyte"
                className="w-full bg-surface-alt rounded-xl px-4 py-3 text-t-primary placeholder-t-muted border-none focus:outline-none focus:ring-2 focus:ring-primary text-base"
              />
            </div>

            {/* Domain selector */}
            <div>
              <label className="block text-sm font-medium text-t-primary mb-2">
                Domain
              </label>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDomain(d.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                      domain === d.key
                        ? "bg-accent border-primary text-secondary"
                        : "bg-white border-border text-t-secondary hover:border-border-strong"
                    }`}
                  >
                    <span>{d.icon}</span>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!query.trim()}
              className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                query.trim()
                  ? "bg-secondary text-white hover:bg-secondary-light cursor-pointer"
                  : "bg-border text-t-muted cursor-not-allowed"
              }`}
            >
              Search patents
            </button>
          </div>
        </form>

        {/* Example searches */}
        <div className="mt-10">
          <p className="text-center text-t-muted text-sm mb-4">
            Or try an example search
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {EXAMPLE_SEARCHES.map((ex) => (
              <button
                key={ex.query}
                onClick={() => handleExample(ex)}
                className="text-left bg-white rounded-xl p-4 border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">
                    {DOMAINS.find((d) => d.key === ex.domain)?.icon}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-t-primary group-hover:text-secondary transition-colors">
                      {ex.query}
                    </div>
                    <div className="text-xs text-t-muted mt-0.5">
                      {DOMAINS.find((d) => d.key === ex.domain)?.label}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-t-muted text-xs">
            Powered by GPT-5.2 &amp; PatentsView (USPTO)
          </p>
        </div>
      </main>
    </div>
  );
}
