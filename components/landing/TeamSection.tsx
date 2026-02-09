import { Linkedin, Github, Mail } from "lucide-react";

const TEAM = [
  {
    name: "Ahmad Hasan",
    role: "Co-Founder",
    bio: "Full-stack engineer turning research into buildable products. Obsessed with making academic knowledge accessible to builders and entrepreneurs.",
    initials: "AH",
    color: "bg-secondary",
  },
  {
    name: "Mohammad AbdulRaheem",
    role: "Co-Founder",
    bio: "Engineering mind with a passion for deep tech commercialization. Bridging the gap between scientific discoveries and real-world applications.",
    initials: "MA",
    color: "bg-primary",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
            The Team
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-t-primary tracking-tight mb-3">
            Built by builders
          </h2>
          <p className="text-t-secondary text-lg max-w-2xl mx-auto">
            We believe the next wave of products will come from people who can
            read a paper, decode a patent, and ship something real.
          </p>
        </div>

        {/* Team cards */}
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl border border-border p-6 md:p-8 hover:shadow-md transition-shadow text-center"
            >
              {/* Avatar */}
              <div
                className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center mx-auto mb-5`}
              >
                <span className="font-heading font-bold text-2xl text-white">
                  {member.initials}
                </span>
              </div>

              <h3 className="font-heading font-bold text-xl text-t-primary mb-1">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-primary mb-4">
                {member.role}
              </p>
              <p className="text-sm text-t-secondary leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
