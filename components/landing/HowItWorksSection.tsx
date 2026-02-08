import { Search, CheckSquare, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    number: "01",
    title: "Search",
    description:
      "Enter your question and pick a domain. Search 225M+ research papers and 12M+ patents at once. Find expired patents ready for commercialization alongside the latest published research.",
  },
  {
    icon: CheckSquare,
    number: "02",
    title: "Select",
    description:
      "Browse papers and patents with abstracts, claims, citations, and expiry dates. Pick what matters to your project. No limit on how many you select.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Extract",
    description:
      "GPT-5.2 reads each paper and patent, pulling out objectives, methods, materials, metrics, and claims. Translates dense academic and legal language into plain, buildable specs.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            How It Works
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight">
            From question to actionable data in three steps
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative group">
              {/* Connector line (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px border-t-2 border-dashed border-border" />
              )}

              <div className="relative bg-white rounded-2xl p-8 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full">
                {/* Number badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent text-secondary text-xs font-bold flex items-center justify-center">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-surface-alt flex items-center justify-center mb-5 group-hover:bg-accent/50 transition-colors">
                  <step.icon className="w-6 h-6 text-secondary" strokeWidth={1.5} />
                </div>

                <h3 className="font-heading font-bold text-xl text-t-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-t-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
