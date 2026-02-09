import RoadmapSection from "@/components/landing/RoadmapSection";
import InvestmentSection from "@/components/landing/InvestmentSection";
import Link from "next/link";

export default function InvestmentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple back nav */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <path d="M12 6v7" />
                <path d="M9 10l3 3 3-3" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg text-t-primary">
              PaperToProduct
            </span>
          </Link>
          <span className="mx-3 text-t-muted">/</span>
          <span className="text-sm font-medium text-t-secondary">
            Investment & Roadmap
          </span>
        </div>
      </header>

      <RoadmapSection />
      <InvestmentSection />
    </div>
  );
}
