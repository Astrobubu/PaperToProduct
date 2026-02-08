import Image from "next/image";

const PERSONAS = [
  {
    title: "Product Builders",
    description: "Find expired patents and proven research methods you can commercialize. Go from discovery to buildable spec in a single session.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    imageAlt: "Builder working on a prototype in a lab",
  },
  {
    title: "R&D Teams",
    description: "Compare materials and methods across papers and patents. Identify which techniques are viable at scale, spot limitations, and shortlist what to test.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80",
    imageAlt: "Engineer reviewing technical data",
  },
  {
    title: "Deep Tech Founders",
    description: "Validate your technology thesis with real data from published papers and patent claims. Find what is already proven before committing resources.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    imageAlt: "Startup team collaborating on strategy",
  },
];

export default function UseCasesSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            Who This Is For
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight">
            Built for teams turning science into products
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PERSONAS.map((persona) => (
            <div
              key={persona.title}
              className="group rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-background"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={persona.image}
                  alt={persona.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-t-primary mb-2">
                  {persona.title}
                </h3>
                <p className="text-t-secondary text-sm leading-relaxed">
                  {persona.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
