import Image from "next/image";
import { Battery, Leaf, Stethoscope, Atom, Utensils } from "lucide-react";

const DOMAINS = [
  {
    name: "Energy Storage",
    description: "Batteries, supercapacitors, electrolytes, and energy conversion materials",
    icon: Battery,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
    large: true,
  },
  {
    name: "Biodegradable Plastics",
    description: "Bioplastics, compostable films, and sustainable polymer blends",
    icon: Leaf,
    large: false,
  },
  {
    name: "Medical Devices",
    description: "Implants, biosensors, diagnostics, and biomedical engineering",
    icon: Stethoscope,
    large: false,
  },
  {
    name: "Advanced Materials",
    description: "Nanomaterials, composites, coatings, and functional surfaces",
    icon: Atom,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
    large: true,
  },
  {
    name: "Food Technology",
    description: "Encapsulation, fermentation, nutraceuticals, and food processing",
    icon: Utensils,
    large: false,
  },
];

export default function DomainGridSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Domains
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight">
            Five domains, one platform
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOMAINS.map((domain) => (
            <div
              key={domain.name}
              className={`relative group rounded-2xl border border-border overflow-hidden bg-white hover:border-primary/30 hover:shadow-md transition-all duration-300 ${
                domain.large ? "md:col-span-2 md:row-span-1" : ""
              }`}
            >
              {domain.image ? (
                /* Large card with image */
                <div className="relative h-56 md:h-64">
                  <Image
                    src={domain.image}
                    alt={domain.name}
                    fill
                    loading="lazy"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2.5 mb-2">
                      <domain.icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
                      <h3 className="font-heading font-bold text-xl text-white">
                        {domain.name}
                      </h3>
                    </div>
                    <p className="text-white/70 text-sm">{domain.description}</p>
                  </div>
                </div>
              ) : (
                /* Small card without image */
                <div className="p-6 h-full flex flex-col justify-between min-h-[160px]">
                  <div className="w-11 h-11 rounded-lg bg-surface-alt flex items-center justify-center mb-4 group-hover:bg-accent/40 transition-colors">
                    <domain.icon className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-t-primary mb-1.5">
                      {domain.name}
                    </h3>
                    <p className="text-t-secondary text-sm leading-relaxed">
                      {domain.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
