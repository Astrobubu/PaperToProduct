export default function LogosSection() {
  const logos = [
    { name: "Semantic Scholar", abbr: "S2" },
    { name: "OpenAlex", abbr: "OA" },
    { name: "USPTO", abbr: "US" },
    { name: "EPO", abbr: "EU" },
    { name: "GPT-5.2", abbr: "GP" },
  ];

  return (
    <section className="py-12 md:py-16 border-y border-border/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-medium text-t-muted mb-8 tracking-wide uppercase">
          Powered by leading research and patent infrastructure
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2.5 text-t-muted/70 hover:text-t-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-surface-alt border border-border/60 flex items-center justify-center">
                <span className="text-[10px] font-bold tracking-tighter">{logo.abbr}</span>
              </div>
              <span className="text-sm font-medium">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
