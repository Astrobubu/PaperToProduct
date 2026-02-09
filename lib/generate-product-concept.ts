import { openai } from "./openai";
import { Paper, PaperExtraction, ProductConcept, Domain } from "@/types";

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

export async function generateProductConcept(
  papers: Paper[],
  extractions: PaperExtraction[],
  domain: Domain,
  searchQuery: string
): Promise<ProductConcept> {
  const domainLabel = getDomainLabel(domain);

  const paperSummaries = papers.map((paper, i) => {
    const ext = extractions.find((e) => e.paperId === paper.id || e.paperId === paper.externalId);
    return `Paper ${i + 1}: "${paper.title}" (${paper.year || "year unknown"})
Abstract: ${paper.abstract || "N/A"}
${ext ? `Extracted objective: ${ext.objective}
Key findings: ${ext.keyFindings.join("; ")}
Materials: ${ext.materials.join(", ")}
Limitations: ${ext.limitations.join("; ")}` : ""}`;
  }).join("\n\n");

  const systemPrompt = `You are a product strategist converting academic research into product concepts for ${domainLabel}. Unlike extraction tasks, you MAY make reasonable inferences and suggestions based on the research.

RULES:
- Base your concept on the actual research provided
- You MAY suggest reasonable applications and approaches
- Clearly distinguish facts from your suggestions
- Do NOT invent specific costs, market sizes, or revenue projections
- Do NOT claim certainty about manufacturing feasibility
- Be creative but grounded in the science

Respond ONLY with valid JSON matching this structure:
{
  "productName": "A concise, descriptive product name",
  "productDescription": "2-3 sentences describing the product concept",
  "targetMarket": "Who would use this and why",
  "requiredMaterials": ["material1", "material2"],
  "manufacturingApproach": "How this could be manufactured (1-2 sentences)",
  "estimatedComplexity": "low" | "medium" | "high",
  "potentialApplications": ["application1", "application2"],
  "keyAdvantages": ["advantage1", "advantage2"],
  "risks": ["risk1", "risk2"],
  "researchGaps": ["what still needs to be figured out"]
}`;

  const userPrompt = `Based on the following ${papers.length} research paper(s) about "${searchQuery}", generate a product concept.

${paperSummaries}

Create a realistic product concept that builds on this research. Be specific but honest about unknowns.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.5,
    max_completion_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No GPT response for product concept generation");
  }

  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(jsonStr);

  return {
    sourceIds: papers.map((p) => p.id || p.externalId),
    productName: parsed.productName || "Unnamed Product",
    productDescription: parsed.productDescription || "",
    targetMarket: parsed.targetMarket || "",
    requiredMaterials: parsed.requiredMaterials || [],
    manufacturingApproach: parsed.manufacturingApproach || "",
    estimatedComplexity: parsed.estimatedComplexity || "medium",
    potentialApplications: parsed.potentialApplications || [],
    keyAdvantages: parsed.keyAdvantages || [],
    risks: parsed.risks || [],
    researchGaps: parsed.researchGaps || [],
  };
}
