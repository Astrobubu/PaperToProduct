import { Rocket, Database, Cpu } from "lucide-react";


const PHASES = [
  {
    icon: Rocket,
    phase: "Phase 1",
    period: "Months 1 - 3",
    title: "Papers + Patents MVP",
    status: "Current",
    statusColor: "bg-primary text-white",
    items: [
      "Paper search via Semantic Scholar + OpenAlex APIs",
      "Patent search via USPTO and EPO open data (12M+ US patents, European patent families)",
      "Expired patent discovery engine for commercialization opportunities",
      "Per-paper and per-patent extraction powered by GPT-5.2",
      "Launch free tier with both paper and patent search from day one",
    ],
  },
  {
    icon: Database,
    phase: "Phase 2",
    period: "Months 4 - 6",
    title: "Full Data Acquisition",
    status: "Planned",
    statusColor: "bg-accent text-secondary",
    items: [
      "Ingest Semantic Scholar + OpenAlex bulk datasets (225M+ papers)",
      "Ingest full USPTO bulk patent data and EPO/WIPO international databases",
      "License publisher APIs: Elsevier, Springer, IEEE, Wiley for full-text access",
      "Build proprietary search index covering 190TB+ of papers and patents",
      "Cross-reference patents with academic papers for prior art mapping",
    ],
  },
  {
    icon: Cpu,
    phase: "Phase 3",
    period: "Months 7 - 9",
    title: "Own Models & Scale",
    status: "Planned",
    statusColor: "bg-accent text-secondary",
    items: [
      "Fine-tune specialized extraction models for both papers and patent language",
      "Deploy inference on dedicated GPU cluster, replace OpenAI dependency",
      "Full-text extraction beyond abstracts and patent claims",
      "Launch paid tiers and API access for institutions",
    ],
  },
];

export default function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Roadmap
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight mb-3">
            Papers and patents from day one
          </h2>
          <p className="text-t-secondary text-lg max-w-2xl mx-auto">
            Both paper search and patent search launch together in Phase 1.
            Proprietary data ingestion by month six. Own models and full
            infrastructure by month nine.
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {PHASES.map((phase, i) => (
              <div key={phase.phase} className="relative pl-16 md:pl-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 w-12 md:w-16 flex items-center justify-center z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-sm">
                    <phase.icon className="w-5 h-5 text-secondary" strokeWidth={2} />
                  </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-border p-6 md:p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-heading font-bold text-sm text-primary">
                      {phase.phase}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${phase.statusColor}`}
                    >
                      {phase.status}
                    </span>
                    <span className="text-xs text-t-muted">{phase.period}</span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-t-primary mb-4">
                    {phase.title}
                  </h3>

                  <ul className="space-y-2.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-t-secondary py-1.5 px-2 -mx-2 rounded-lg hover:bg-accent/10 transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Connecting line segment highlight */}
                {i < PHASES.length - 1 && (
                  <div className="absolute left-6 md:left-8 top-[4.5rem] bottom-0 w-px">
                    <div className="w-full h-full bg-gradient-to-b from-primary/30 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
