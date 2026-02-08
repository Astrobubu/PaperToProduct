"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob blob-1 w-[500px] h-[500px] -top-40 -right-40 opacity-30" />
        <div className="blob blob-2 w-[600px] h-[600px] top-20 -left-60 opacity-20" />
        <div className="blob blob-4 blob-small w-48 h-48 top-1/2 right-1/4 opacity-20" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/50 border border-primary/20 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-secondary uppercase">
            Research to product platform
          </span>
        </div>

        <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-t-primary mb-6 tracking-tight">
          Turn papers and patents{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">into real products</span>
            <span className="absolute -bottom-1 left-0 w-full h-3 bg-accent/60 -z-0 rounded-sm" />
          </span>
        </h1>

        <p className="text-t-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Search 225M+ research papers and 12M+ patents. Find expired patents
          ready for commercialization. GPT-5.2 extracts what matters from both.
          A tool for builders who turn published knowledge into products.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/search"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-secondary text-white font-semibold rounded-xl hover:bg-secondary-light transition-all duration-200 shadow-md hover:shadow-lg text-base"
          >
            Start Searching Free
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center px-7 py-3.5 bg-white border border-border text-t-secondary font-semibold rounded-xl hover:border-border-strong hover:text-t-primary transition-all duration-200 text-base"
          >
            See How It Works
          </a>
        </div>
      </div>
    </section>
  );
}
