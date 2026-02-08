import Link from "next/link";
import { Check, Minus } from "lucide-react";

interface PricingFeature {
  name: string;
  free: string | boolean;
  researcher: string | boolean;
  team: string | boolean;
}

const FEATURES: PricingFeature[] = [
  { name: "Searches / month", free: "10", researcher: "Unlimited", team: "Unlimited" },
  { name: "Papers per search", free: "15", researcher: "30", team: "30" },
  { name: "AI extractions / month", free: "5", researcher: "100", team: "500" },
  { name: "Comparison tables", free: "1 active", researcher: "Unlimited", team: "Unlimited" },
  { name: "Domains", free: "All 5", researcher: "All 5", team: "All 5" },
  { name: "Export CSV / PDF", free: false, researcher: true, team: true },
  { name: "Search history", free: "7 days", researcher: "90 days", team: "Unlimited" },
  { name: "Team members", free: "1", researcher: "1", team: "Up to 10" },
  { name: "Priority support", free: false, researcher: "Email", team: "Slack + Email" },
  { name: "API access", free: false, researcher: false, team: true },
];

interface TierProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  highlighted?: boolean;
  badge?: string;
}

const TIERS: TierProps[] = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with research discovery",
  },
  {
    name: "Researcher",
    price: "$15",
    period: "/mo",
    description: "For serious research workflows",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "Collaborate across your organization",
  },
];

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-t-muted/40 mx-auto" />;
  return <span className="text-sm text-t-primary">{value}</span>;
}

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Pricing
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight mb-3">
            Simple, transparent pricing
          </h2>
          <p className="text-t-secondary text-lg max-w-lg mx-auto">
            Start free. Upgrade when your research demands it.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-6 flex flex-col ${
                tier.highlighted
                  ? "bg-secondary text-white border-2 border-secondary shadow-lg scale-[1.02]"
                  : "bg-white border border-border"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-sm">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-heading font-bold text-lg mb-1 ${
                    tier.highlighted ? "text-white" : "text-t-primary"
                  }`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`text-sm ${
                    tier.highlighted ? "text-white/70" : "text-t-muted"
                  }`}
                >
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className={`text-4xl font-bold font-heading ${
                    tier.highlighted ? "text-white" : "text-t-primary"
                  }`}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span
                    className={`text-sm ${
                      tier.highlighted ? "text-white/60" : "text-t-muted"
                    }`}
                  >
                    {tier.period}
                  </span>
                )}
              </div>

              <Link
                href="/search"
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                  tier.highlighted
                    ? "bg-white text-secondary hover:bg-white/90"
                    : "bg-secondary text-white hover:bg-secondary-light"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-semibold text-t-primary p-4 pl-6 w-1/3">
                    Feature
                  </th>
                  {TIERS.map((tier) => (
                    <th
                      key={tier.name}
                      className={`text-center text-sm font-semibold p-4 w-[22%] ${
                        tier.highlighted ? "text-primary" : "text-t-primary"
                      }`}
                    >
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, i) => (
                  <tr
                    key={feature.name}
                    className={i < FEATURES.length - 1 ? "border-b border-border/50" : ""}
                  >
                    <td className="text-sm text-t-secondary p-4 pl-6">
                      {feature.name}
                    </td>
                    <td className="text-center p-4">
                      <FeatureValue value={feature.free} />
                    </td>
                    <td className="text-center p-4 bg-primary/[0.03]">
                      <FeatureValue value={feature.researcher} />
                    </td>
                    <td className="text-center p-4">
                      <FeatureValue value={feature.team} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
