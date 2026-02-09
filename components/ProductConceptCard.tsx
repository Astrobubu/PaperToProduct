"use client";

import { ProductConcept } from "@/types";

interface ProductConceptCardProps {
  concept: ProductConcept;
}

function ComplexityBar({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: { color: "bg-green-500", width: "w-1/3", label: "Low Complexity" },
    medium: { color: "bg-amber-500", width: "w-2/3", label: "Medium Complexity" },
    high: { color: "bg-red-500", width: "w-full", label: "High Complexity" },
  };
  const c = config[level];
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-t-muted uppercase tracking-wide">
          Estimated Complexity
        </span>
        <span className="text-xs font-medium text-t-secondary">{c.label}</span>
      </div>
      <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
        <div className={`h-full ${c.color} ${c.width} rounded-full transition-all`} />
      </div>
    </div>
  );
}

export default function ProductConceptCard({ concept }: ProductConceptCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden animate-slide-up">
      {/* Disclaimer banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5">
        <p className="text-xs text-amber-700 font-medium">
          AI-generated product concept based on selected research. Facts from papers are combined with reasonable inferences.
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Product name */}
        <div>
          <h2 className="font-heading font-bold text-2xl text-t-primary leading-tight">
            {concept.productName}
          </h2>
          <p className="text-sm text-t-secondary leading-relaxed mt-2">
            {concept.productDescription}
          </p>
        </div>

        {/* Target Market */}
        <div>
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Target Market
          </div>
          <p className="text-sm text-t-primary leading-relaxed">{concept.targetMarket}</p>
        </div>

        {/* Materials */}
        {concept.requiredMaterials.length > 0 && (
          <div>
            <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-2">
              Required Materials
            </div>
            <div className="flex flex-wrap gap-1.5">
              {concept.requiredMaterials.map((mat, i) => (
                <span
                  key={i}
                  className="bg-accent/50 text-secondary text-xs px-2.5 py-1 rounded-full font-medium"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Manufacturing */}
        <div>
          <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
            Manufacturing Approach
          </div>
          <p className="text-sm text-t-secondary leading-relaxed">{concept.manufacturingApproach}</p>
        </div>

        {/* Complexity */}
        <ComplexityBar level={concept.estimatedComplexity} />

        {/* Applications */}
        {concept.potentialApplications.length > 0 && (
          <div>
            <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
              Potential Applications
            </div>
            <ul className="space-y-1">
              {concept.potentialApplications.map((app, i) => (
                <li key={i} className="text-sm text-t-primary flex gap-2">
                  <span className="text-primary font-bold mt-0.5">-</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Advantages */}
        {concept.keyAdvantages.length > 0 && (
          <div>
            <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
              Key Advantages
            </div>
            <ul className="space-y-1">
              {concept.keyAdvantages.map((adv, i) => (
                <li key={i} className="text-sm text-t-primary flex gap-2">
                  <span className="text-green-600 font-bold mt-0.5">+</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {concept.risks.length > 0 && (
          <div>
            <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
              Risks
            </div>
            <ul className="space-y-1">
              {concept.risks.map((risk, i) => (
                <li key={i} className="text-sm text-t-secondary flex gap-2">
                  <span className="text-red-500 font-bold mt-0.5">!</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Research Gaps */}
        {concept.researchGaps.length > 0 && (
          <div>
            <div className="text-xs font-medium text-t-muted uppercase tracking-wide mb-1">
              Research Gaps
            </div>
            <ul className="space-y-1">
              {concept.researchGaps.map((gap, i) => (
                <li key={i} className="text-sm text-t-muted flex gap-2">
                  <span className="text-t-muted font-bold mt-0.5">?</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
