import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-secondary-dark" />
      <div className="absolute inset-0 opacity-10">
        <div className="blob blob-1 w-[500px] h-[500px] -top-32 -right-32" />
        <div className="blob blob-2 w-[400px] h-[400px] bottom-0 -left-20" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 md:px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white tracking-tight mb-4">
          Your next product is buried in a paper or patent.
          <br />
          Find it faster.
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
          Search papers and patents. Select what matters. Extract buildable specs. Free to start.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-secondary font-bold rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
        >
          Try PaperToProduct Free
          <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
