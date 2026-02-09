import { openai } from "./openai";
import { Patent, PatentExtraction, Domain } from "@/types";

function getDomainLabel(domain: Domain): string {
  const labels: Record<Domain, string> = {
    energy_storage: "Energy Storage & Batteries",
    biodegradable_plastics: "Biodegradable Plastics & Sustainable Materials",
    medical_devices: "Medical Devices & Biotech",
    advanced_materials: "Advanced Materials & Nanotechnology",
    food_technology: "Food Technology & Processing",
  };
  return labels[domain] || domain;
}

function getLegalStatus(expirationDate: string | null): string {
  if (!expirationDate) return "unknown";
  const expiry = new Date(expirationDate);
  const now = new Date();
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);

  if (expiry < now) return "expired";
  if (expiry < twoYearsFromNow) return "expiring soon";
  return "active";
}

export async function extractFromPatent(
  patent: Patent,
  domain: Domain,
  searchQuery: string
): Promise<PatentExtraction> {
  const domainLabel = getDomainLabel(domain);
  const legalStatus = getLegalStatus(patent.expirationDate);

  if (!patent.abstract) {
    return {
      patentId: patent.id || patent.patentId,
      patentTitle: patent.title,
      claimedInvention: "No abstract available for this patent.",
      technicalField: "Not reported",
      methodology: "Not reported",
      materials: [],
      keyAdvantages: [],
      limitations: ["Full text not available for analysis."],
      legalStatus,
      commercialOwner: patent.assigneeOrg || "Unknown",
      relevance: "Patent matched search query but abstract is unavailable.",
    };
  }

  const systemPrompt = `You are a patent analyst specializing in ${domainLabel}. Extract ONLY what is explicitly stated in the patent abstract. Translate patent language into plain technical English.

CRITICAL RULES:
- Extract ONLY facts stated in the abstract
- If something is not mentioned, say "not stated in abstract"
- Do NOT add cost estimates, market analysis, or manufacturing advice
- Simplify patent jargon into readable technical language
- Do NOT extrapolate beyond what is claimed

Respond ONLY with valid JSON matching this structure:
{
  "claimedInvention": "1-2 sentences: what is being patented?",
  "technicalField": "The technical domain this patent covers",
  "methodology": "How does the invention work? (methods, processes described)",
  "materials": ["specific materials/compounds/substances mentioned"],
  "keyAdvantages": ["stated advantage 1", "stated advantage 2"],
  "limitations": ["any stated limitations or constraints"],
  "relevance": "How this patent relates to: ${searchQuery}"
}`;

  const userPrompt = `Patent: "${patent.title}" (${patent.patentId})
Assignee: ${patent.assigneeOrg || "unknown"}
Grant Date: ${patent.grantDate || "unknown"}
Type: ${patent.patentType || "unknown"}
Times Cited: ${patent.timesCited}
Abstract: ${patent.abstract}

Extract what this patent actually claims. Do not invent data.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_completion_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`No GPT response for patent: ${patent.title}`);
  }

  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    patentId: patent.id || patent.patentId,
    patentTitle: patent.title,
    claimedInvention: parsed.claimedInvention || "Not reported",
    technicalField: parsed.technicalField || "Not reported",
    methodology: parsed.methodology || "Not reported",
    materials: parsed.materials || [],
    keyAdvantages: parsed.keyAdvantages || [],
    limitations: parsed.limitations || [],
    legalStatus,
    commercialOwner: patent.assigneeOrg || "Unknown",
    relevance: parsed.relevance || "",
  };
}

export async function extractFromPatents(
  patents: Patent[],
  domain: Domain,
  searchQuery: string
): Promise<PatentExtraction[]> {
  const results = await Promise.all(
    patents.map((patent) =>
      extractFromPatent(patent, domain, searchQuery).catch((err) => {
        console.error(`Extraction failed for patent "${patent.title}":`, err);
        return {
          patentId: patent.id || patent.patentId,
          patentTitle: patent.title,
          claimedInvention: "Extraction failed for this patent.",
          technicalField: "N/A",
          methodology: "N/A",
          materials: [],
          keyAdvantages: [],
          limitations: ["Could not process this patent."],
          legalStatus: getLegalStatus(patent.expirationDate),
          commercialOwner: patent.assigneeOrg || "Unknown",
          relevance: "N/A",
        } as PatentExtraction;
      })
    )
  );
  return results;
}
