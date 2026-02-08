import Image from "next/image";

const FEATURES = [
  {
    badge: "Structured extraction",
    title: "Every paper and patent broken down into what you need to build",
    description:
      "From papers: objectives, methodology, materials, performance metrics with units. From patents: claims, methods, materials, and expiry status. Each gets its own structured extraction card so you can assess what is viable for your next product.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    imageAlt: "Data comparison dashboard",
    reversed: false,
  },
  {
    badge: "Cross-source comparison",
    title: "Compare findings across papers and patents together",
    description:
      "Put papers and patents into one comparison table. See which materials hit the best performance numbers, which expired patents are ready to commercialize, and where published research validates a patent's claims.",
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&q=80",
    imageAlt: "Research analysis visualization",
    reversed: true,
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Features
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight">
            From papers and patents to product decisions
          </h2>
        </div>

        {/* Feature rows */}
        <div className="space-y-20 md:space-y-28">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${
                feature.reversed ? "md:[direction:rtl]" : ""
              }`}
            >
              {/* Image */}
              <div className={`${feature.reversed ? "md:[direction:ltr]" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-border/50">
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={600}
                    height={400}
                    loading="lazy"
                    className="w-full h-auto object-cover aspect-[3/2]"
                  />
                </div>
              </div>

              {/* Copy */}
              <div className={`${feature.reversed ? "md:[direction:ltr]" : ""}`}>
                <div className="inline-flex items-center px-3 py-1 bg-accent/40 rounded-full mb-4">
                  <span className="text-xs font-semibold text-secondary">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-2xl md:text-3xl text-t-primary mb-4 tracking-tight leading-tight">
                  {feature.title}
                </h3>

                <p className="text-t-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
