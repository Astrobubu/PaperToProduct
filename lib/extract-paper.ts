import { openai } from "./openai";
import { Paper, PaperExtraction, Domain } from "@/types";

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

export async function extractFromPaper(
  paper: Paper,
  domain: Domain,
  searchQuery: string
): Promise<PaperExtraction> {
  const domainLabel = getDomainLabel(domain);

  if (!paper.abstract) {
    return {
      paperId: paper.id || paper.externalId,
      paperTitle: paper.title,
      objective: "No abstract available for this paper.",
      methodology: "Not reported in abstract",
      materials: [],
      keyFindings: ["Abstract not available — cannot extract findings."],
      performance: {},
      limitations: ["Full text not available for analysis."],
      novelty: "Cannot determine from available data.",
      relevance: "Paper matched search query but abstract is unavailable.",
    };
  }

  const systemPrompt = `You are a research paper analyst specializing in ${domainLabel}. Your job is to extract ONLY what is explicitly stated in the paper's abstract. Do NOT invent, estimate, or speculate on anything not directly stated.

CRITICAL RULES:
- Extract ONLY facts stated in the abstract
- If a metric is not mentioned, do NOT guess it — leave it out
- Use the exact numbers and units from the abstract
- If the abstract is vague, say "not reported in abstract"
- Do NOT add cost estimates, market analysis, or manufacturing advice
- Do NOT extrapolate beyond what the authors wrote

Respond ONLY with valid JSON matching this structure:
{
  "objective": "1-2 sentences: what were the authors trying to do?",
  "methodology": "How did they do it? (methods, techniques, approaches mentioned)",
  "materials": ["specific materials/compounds/substances mentioned"],
  "keyFindings": ["actual result 1 with numbers if available", "actual result 2", ...],
  "performance": {"metric_name": "value with units", ...},
  "limitations": ["what the authors say doesn't work or needs more research"],
  "novelty": "What's new compared to prior work, as stated by authors",
  "relevance": "How this paper connects to the search query: ${searchQuery}"
}

For the "performance" field: only include metrics that have actual measured values in the abstract. Use descriptive keys like "tensile_strength", "efficiency", "degradation_time", etc. If no quantitative metrics are reported, use an empty object {}.`;

  const userPrompt = `Paper: "${paper.title}" (${paper.year || "year unknown"}, ${paper.citationCount} citations)
Journal: ${paper.journal || "unknown"}
Abstract: ${paper.abstract}

Extract what this paper actually reports. Do not invent data.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`No GPT response for paper: ${paper.title}`);
  }

  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    paperId: paper.id || paper.externalId,
    paperTitle: paper.title,
    objective: parsed.objective || "Not reported",
    methodology: parsed.methodology || "Not reported",
    materials: parsed.materials || [],
    keyFindings: parsed.keyFindings || [],
    performance: parsed.performance || {},
    limitations: parsed.limitations || [],
    novelty: parsed.novelty || "Not reported",
    relevance: parsed.relevance || "",
  };
}

export async function extractFromPapers(
  papers: Paper[],
  domain: Domain,
  searchQuery: string
): Promise<PaperExtraction[]> {
  const results = await Promise.all(
    papers.map((paper) =>
      extractFromPaper(paper, domain, searchQuery).catch((err) => {
        console.error(`Extraction failed for "${paper.title}":`, err);
        return {
          paperId: paper.id || paper.externalId,
          paperTitle: paper.title,
          objective: "Extraction failed for this paper.",
          methodology: "N/A",
          materials: [],
          keyFindings: ["AI extraction encountered an error."],
          performance: {},
          limitations: ["Could not process this paper."],
          novelty: "N/A",
          relevance: "N/A",
        } as PaperExtraction;
      })
    )
  );
  return results;
}
