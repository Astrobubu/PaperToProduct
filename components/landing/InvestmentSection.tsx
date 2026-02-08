export default function InvestmentSection() {
  return (
    <section id="investment" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            The Opportunity
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight mb-3">
            Making the academic and patent world accessible
          </h2>
          <p className="text-t-secondary text-lg max-w-2xl mx-auto">
            Research papers and patents hold billions of dollars in untapped product
            ideas, locked behind jargon, legal language, and paywalls. We translate
            them into plain, buildable specs from day one.
          </p>
        </div>

        {/* Customer Acquisition Strategy */}
        <div className="bg-background rounded-2xl border border-border p-6 md:p-8 mb-8">
          <h3 className="font-heading font-bold text-xl text-t-primary mb-6">
            Customer Acquisition Strategy
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AcqChannel
              title="SEO + Content"
              detail="Target long-tail searches like &quot;how to make solid-state battery&quot; and &quot;expired patent commercialization&quot;. Every search query is a potential landing page."
              metric="40% of traffic"
            />
            <AcqChannel
              title="Community-Led Growth"
              detail="Active presence in maker communities, Reddit (r/engineering, r/startups), Hacker News, and deep tech Discord servers. Free tier drives word of mouth."
              metric="30% of traffic"
            />
            <AcqChannel
              title="Patent Expiry Alerts"
              detail="Weekly newsletter of newly expired patents with commercial potential. Each alert links back to full extraction on the platform. Viral loop built in."
              metric="20% of traffic"
            />
            <AcqChannel
              title="University Partnerships"
              detail="Free institutional access for tech transfer offices. They send their spinout founders to us. Direct pipeline to paying Team customers."
              metric="5% of traffic"
            />
            <AcqChannel
              title="YouTube + Educational"
              detail="&quot;I built a product from an expired patent&quot; content series. Demonstrates the full workflow from discovery to prototype spec."
              metric="5% of traffic"
            />
            <AcqChannel
              title="Product-Led Conversion"
              detail="Free users hit extraction limits naturally. The value is obvious by the third search. 10% conversion target for niche B2B with clear ROI."
              metric="10% free-to-paid"
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Cost Breakdown */}
          <div className="bg-background rounded-2xl border border-border p-6 md:p-8">
            <h3 className="font-heading font-bold text-xl text-t-primary mb-6">
              9-Month Cost Breakdown
            </h3>
            <div className="space-y-0">
              <CostRow
                label="Engineering (3 FTE, 9 months)"
                amount="$375,000"
                detail="Full-stack, ML engineer, data engineer"
              />
              <CostRow
                label="Publisher API Licenses"
                amount="$60,000"
                detail="Elsevier, Springer, IEEE, Wiley, Taylor & Francis"
              />
              <CostRow
                label="Patent Data Acquisition"
                amount="$5,000"
                detail="USPTO bulk processing, EPO/WIPO indexing, storage"
              />
              <CostRow
                label="Data Storage (190TB+)"
                amount="$18,000"
                detail="S3 + Backblaze B2 hot/cold tiering, 9 months"
              />
              <CostRow
                label="GPU Compute (Training + Inference)"
                amount="$12,000"
                detail="Fine-tuning extraction models, ongoing inference"
              />
              <CostRow
                label="Embedding Generation"
                amount="$2,000"
                detail="225M+ abstracts + 12M patent claims vectorized"
              />
              <CostRow
                label="Cloud Infrastructure"
                amount="$15,000"
                detail="Database, hosting, search index, CDN, monitoring"
              />
              <CostRow
                label="OpenAI API (transition period)"
                amount="$5,000"
                detail="GPT-5.2 for paper + patent extraction during Phases 1-2"
              />
              <CostRow
                label="Marketing + Content"
                amount="$15,000"
                detail="SEO tools, content production, community outreach"
              />
              <CostRow
                label="Legal + Misc"
                amount="$6,000"
                detail="IP review, domains, tools, licenses"
                isLast
              />
              <div className="pt-4 mt-4 border-t-2 border-secondary/20">
                <div className="flex justify-between items-baseline">
                  <span className="font-heading font-bold text-lg text-t-primary">
                    Total (9 months)
                  </span>
                  <span className="font-heading font-bold text-2xl text-secondary">
                    $513,000
                  </span>
                </div>
                <p className="text-xs text-t-muted mt-1">
                  With 20% contingency buffer: $616,000
                </p>
              </div>
            </div>
          </div>

          {/* Data Acquisition */}
          <div className="bg-background rounded-2xl border border-border p-6 md:p-8">
            <h3 className="font-heading font-bold text-xl text-t-primary mb-6">
              Data Acquisition Plan
            </h3>
            <div className="space-y-4">
              <DataSource
                name="Semantic Scholar Academic Graph"
                size="~46GB compressed"
                cost="Free"
                detail="225M+ paper metadata, abstracts, citations"
              />
              <DataSource
                name="OpenAlex Full Dataset"
                size="~330GB compressed"
                cost="Free"
                detail="240M+ works, authors, institutions, concepts"
              />
              <DataSource
                name="PubMed Central Open Access"
                size="~50GB"
                cost="Free"
                detail="8M+ full-text biomedical articles"
              />
              <DataSource
                name="Unpaywall Dataset"
                size="~30GB"
                cost="Free"
                detail="Open access status for 100M+ DOIs"
              />
              <DataSource
                name="CORE Aggregator"
                size="~395GB"
                cost="Free"
                detail="Largest collection of open access research"
              />
              <DataSource
                name="Publisher Full-Text APIs"
                size="~189TB"
                cost="$60k/yr"
                detail="Licensed access via Elsevier, Springer, IEEE, Wiley"
                highlighted
              />
              <DataSource
                name="USPTO Bulk Patent Data"
                size="~80GB"
                cost="Free"
                detail="12M+ US patents, full text, claims, expiry dates"
              />
              <DataSource
                name="EPO Open Patent Services"
                size="~40GB"
                cost="Free"
                detail="European patent data, family linkages"
              />
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-t-primary">Total indexed papers</span>
                <span className="font-heading font-bold text-lg text-secondary">225M+</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-sm font-semibold text-t-primary">Total indexed patents</span>
                <span className="font-heading font-bold text-lg text-secondary">12M+</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="text-sm font-semibold text-t-primary">Total raw storage</span>
                <span className="font-heading font-bold text-lg text-secondary">~190TB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Projections */}
        <div className="bg-background rounded-2xl border border-border p-6 md:p-8 mb-8">
          <h3 className="font-heading font-bold text-xl text-t-primary mb-6">
            Revenue Projections
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-semibold text-t-primary p-3 pl-0">Metric</th>
                  <th className="text-center text-sm font-semibold text-t-muted p-3">Month 6</th>
                  <th className="text-center text-sm font-semibold text-t-muted p-3">Month 9</th>
                  <th className="text-center text-sm font-semibold text-t-primary p-3">Month 12</th>
                  <th className="text-center text-sm font-semibold text-t-primary p-3">Month 18</th>
                  <th className="text-center text-sm font-semibold text-t-primary p-3">Month 24</th>
                </tr>
              </thead>
              <tbody>
                <RevenueRow
                  label="Free Users"
                  values={["500", "1,500", "4,000", "15,000", "35,000"]}
                />
                <RevenueRow
                  label="Paid Users"
                  values={["20", "90", "320", "1,200", "3,500"]}
                />
                <RevenueRow
                  label="Conversion Rate"
                  values={["4%", "6%", "8%", "8%", "10%"]}
                />
                <RevenueRow
                  label="Avg. Revenue / User"
                  values={["$20", "$22", "$25", "$28", "$30"]}
                />
                <RevenueRow
                  label="MRR"
                  values={["$400", "$2,000", "$8,000", "$33,600", "$105,000"]}
                  bold
                />
                <RevenueRow
                  label="ARR (annualized)"
                  values={["$4.8k", "$24k", "$96k", "$403k", "$1.26M"]}
                  bold
                  isLast
                />
              </tbody>
            </table>
          </div>
          <p className="text-xs text-t-muted mt-4">
            Both paper and patent search launch in Phase 1, giving early users immediate access to
            expired patents and research data. Conversion ramp assumes product-led growth with free
            tier as primary acquisition channel. Patent discovery drives strong word of mouth.
          </p>
          <div className="mt-6 pt-4 border-t border-border grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-t-muted uppercase tracking-wide mb-1">Break-even</p>
              <p className="font-heading font-bold text-lg text-t-primary">Month 14 - 16</p>
            </div>
            <div>
              <p className="text-xs text-t-muted uppercase tracking-wide mb-1">Gross Margin (at scale)</p>
              <p className="font-heading font-bold text-lg text-t-primary">78 - 85%</p>
            </div>
            <div>
              <p className="text-xs text-t-muted uppercase tracking-wide mb-1">LTV:CAC Target</p>
              <p className="font-heading font-bold text-lg text-t-primary">4:1+</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-4 gap-4">
          <MetricCard label="Total Addressable Market" value="$4.2B" detail="Research analytics, patent intelligence, IP tools" />
          <MetricCard label="Infrastructure Cost at Scale" value="$10k/mo" detail="Own models + storage + compute + patent index" />
          <MetricCard label="Data Moat" value="190TB+" detail="Papers + patents, proprietary index" />
          <MetricCard label="Target Raise" value="$620k" detail="9-month runway, papers + patents from day one" />
        </div>
      </div>
    </section>
  );
}

function CostRow({
  label,
  amount,
  detail,
  isLast = false,
}: {
  label: string;
  amount: string;
  detail: string;
  isLast?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-accent/10 transition-colors ${!isLast ? "border-b border-border/60" : ""}`}>
      <div className="pr-4">
        <p className="text-sm font-medium text-t-primary">{label}</p>
        <p className="text-xs text-t-muted mt-0.5">{detail}</p>
      </div>
      <span className="text-sm font-semibold text-t-primary whitespace-nowrap">{amount}</span>
    </div>
  );
}

function DataSource({
  name,
  size,
  cost,
  detail,
  highlighted = false,
}: {
  name: string;
  size: string;
  cost: string;
  detail: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between p-3 rounded-lg transition-colors ${highlighted ? "bg-accent/20 border border-primary/10 hover:bg-accent/30" : "hover:bg-accent/10"}`}>
      <div className="pr-4">
        <p className="text-sm font-medium text-t-primary">{name}</p>
        <p className="text-xs text-t-muted mt-0.5">{detail}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-semibold text-t-primary">{size}</p>
        <p className={`text-xs mt-0.5 ${cost === "Free" ? "text-primary font-semibold" : "text-t-muted"}`}>
          {cost}
        </p>
      </div>
    </div>
  );
}

function RevenueRow({
  label,
  values,
  bold = false,
  isLast = false,
}: {
  label: string;
  values: string[];
  bold?: boolean;
  isLast?: boolean;
}) {
  return (
    <tr className={`hover:bg-accent/10 transition-colors ${!isLast ? "border-b border-border/50" : ""}`}>
      <td className={`text-sm p-3 pl-0 ${bold ? "font-semibold text-t-primary" : "text-t-secondary"}`}>
        {label}
      </td>
      {values.map((val, i) => (
        <td
          key={i}
          className={`text-center text-sm p-3 ${
            bold ? "font-bold text-secondary" : "text-t-primary"
          }`}
        >
          {val}
        </td>
      ))}
    </tr>
  );
}

function AcqChannel({
  title,
  detail,
  metric,
}: {
  title: string;
  detail: string;
  metric: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 hover:bg-accent/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-t-primary">{title}</h4>
        <span className="text-xs font-bold text-primary bg-accent/30 px-2 py-0.5 rounded-full">
          {metric}
        </span>
      </div>
      <p className="text-xs text-t-secondary leading-relaxed">{detail}</p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="bg-background rounded-xl border border-border p-5 text-center hover:bg-accent/10 transition-colors">
      <p className="text-xs text-t-muted uppercase tracking-wide mb-2">{label}</p>
      <p className="font-heading font-bold text-2xl text-secondary mb-1">{value}</p>
      <p className="text-xs text-t-muted">{detail}</p>
    </div>
  );
}
