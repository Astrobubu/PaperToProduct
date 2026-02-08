"use client";

import { Domain } from "@/types";

const DOMAINS: { key: Domain; label: string }[] = [
  { key: "energy_storage", label: "Energy Storage" },
  { key: "biodegradable_plastics", label: "Biodegradable Plastics" },
  { key: "medical_devices", label: "Medical Devices" },
  { key: "advanced_materials", label: "Advanced Materials" },
  { key: "food_technology", label: "Food Technology" },
];

interface DomainSelectorProps {
  selected: Domain;
  onChange: (domain: Domain) => void;
  variant?: "pill" | "chip";
}

export default function DomainSelector({
  selected,
  onChange,
  variant = "pill",
}: DomainSelectorProps) {
  if (variant === "chip") {
    return (
      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <button
            key={d.key}
            onClick={() => onChange(d.key)}
            className={`px-4 py-2 rounded-full border transition-all duration-150 text-sm font-medium ${
              selected === d.key
                ? "bg-accent border-primary text-secondary"
                : "bg-white border-border text-t-secondary hover:border-border-strong"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="bg-surface-alt rounded-full p-1 inline-flex flex-wrap gap-1">
        {DOMAINS.map((d) => (
          <button
            key={d.key}
            onClick={() => onChange(d.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-150 ${
              selected === d.key
                ? "bg-secondary text-white shadow-sm"
                : "text-t-secondary hover:text-t-primary"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
