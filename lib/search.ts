import { Paper, PaperWithAnalysis, Domain } from "@/types";
import { searchSemanticScholar } from "./semantic-scholar";
import { searchOpenAlex } from "./openalex";
import { supabaseAdmin } from "./supabase";

export async function searchPapers(
  query: string,
  domain: Domain
): Promise<PaperWithAnalysis[]> {
  // Step 1: Enhance query with domain-specific terms
  const enhancedQuery = enhanceQueryForDomain(query, domain);

  // Step 2: Search both APIs in parallel
  const [semanticResults, openAlexResults] = await Promise.all([
    searchSemanticScholar(enhancedQuery, 15),
    searchOpenAlex(enhancedQuery, 10),
  ]);

  // Step 3: Deduplicate by DOI
  const combinedResults = deduplicateByDOI([
    ...semanticResults,
    ...openAlexResults,
  ]);

  // Step 4: Cache papers in Supabase
  const cachedPapers = await cachePapers(combinedResults);

  // Step 5: Log the search
  await logSearch(query, domain, cachedPapers.length);

  // Step 6: Get existing analyses or return papers without them
  const papersWithAnalysis = await attachExistingAnalyses(cachedPapers, domain);

  // Step 7: Sort by commercial score (papers with analyses first, then by score)
  return papersWithAnalysis.sort((a, b) => {
    const scoreA = a.analysis?.commercialScore || 0;
    const scoreB = b.analysis?.commercialScore || 0;
    return scoreB - scoreA;
  });
}

function enhanceQueryForDomain(query: string, domain: Domain): string {
  const domainTerms: Record<Domain, string[]> = {
    energy_storage: [
      "battery",
      "energy storage",
      "electrode",
      "electrolyte",
      "capacitor",
      "charging",
    ],
    biodegradable_plastics: [
      "biodegradable",
      "polymer",
      "bioplastic",
      "compostable",
      "sustainable packaging",
    ],
    medical_devices: [
      "medical device",
      "biomedical",
      "implant",
      "diagnostic",
      "therapeutic",
    ],
    advanced_materials: [
      "nanomaterial",
      "composite",
      "alloy",
      "metamaterial",
      "coating",
    ],
    food_technology: [
      "food processing",
      "preservation",
      "fermentation",
      "nutraceutical",
      "encapsulation",
    ],
  };

  const terms = domainTerms[domain];
  const hasTerms = terms.some((t) => query.toLowerCase().includes(t));

  if (!hasTerms) {
    return `${query} ${terms[0]}`;
  }
  return query;
}

function deduplicateByDOI(papers: Paper[]): Paper[] {
  const seen = new Map<string, Paper>();
  const noDoi: Paper[] = [];

  for (const paper of papers) {
    const doi = paper.externalIds?.doi || paper.externalIds?.DOI;
    if (doi) {
      // Prefer Semantic Scholar entries (typically richer metadata)
      if (!seen.has(doi) || paper.source === "semantic_scholar") {
        seen.set(doi, paper);
      }
    } else {
      // Check title-based dedup for papers without DOI
      const titleKey = paper.title.toLowerCase().trim();
      const exists = Array.from(seen.values()).some(
        (p) => p.title.toLowerCase().trim() === titleKey
      );
      if (!exists && !noDoi.some((p) => p.title.toLowerCase().trim() === titleKey)) {
        noDoi.push(paper);
      }
    }
  }

  return [...Array.from(seen.values()), ...noDoi];
}

async function cachePapers(
  papers: Paper[]
): Promise<(Paper & { id: string })[]> {
  const cached: (Paper & { id: string })[] = [];

  for (const paper of papers) {
    // Check if paper already exists
    const { data: existing } = await supabaseAdmin
      .from("papers")
      .select("id")
      .eq("external_id", paper.externalId)
      .single();

    if (existing) {
      cached.push({ ...paper, id: existing.id });
      continue;
    }

    // Insert new paper
    const { data: inserted, error } = await supabaseAdmin
      .from("papers")
      .insert({
        external_id: paper.externalId,
        source: paper.source,
        title: paper.title,
        abstract: paper.abstract,
        authors: paper.authors,
        year: paper.year,
        citation_count: paper.citationCount,
        publication_date: paper.publicationDate,
        journal: paper.journal,
        fields_of_study: paper.fieldsOfStudy,
        pdf_url: paper.pdfUrl,
        external_ids: paper.externalIds,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to cache paper:", error.message);
      // Generate a temporary ID so the paper still appears
      cached.push({ ...paper, id: `temp-${paper.externalId}` });
    } else if (inserted) {
      cached.push({ ...paper, id: inserted.id });
    }
  }

  return cached;
}

async function attachExistingAnalyses(
  papers: (Paper & { id: string })[],
  domain: Domain
): Promise<PaperWithAnalysis[]> {
  const paperIds = papers
    .filter((p) => !p.id.startsWith("temp-"))
    .map((p) => p.id);

  // Fetch all existing analyses in one query
  const { data: analyses } = await supabaseAdmin
    .from("paper_analyses")
    .select("*")
    .in("paper_id", paperIds)
    .eq("domain", domain);

  const analysisMap = new Map(
    (analyses || []).map((a: Record<string, unknown>) => [
      a.paper_id as string,
      {
        id: a.id as string,
        paperId: a.paper_id as string,
        domain: a.domain as Domain,
        commercialScore: a.commercial_score as number,
        summary: a.summary as string,
        commercialPotential: a.commercial_potential as string,
        keyInnovation: a.key_innovation as string,
        materialsMentioned: (a.materials_mentioned as string[]) || [],
        processesMentioned: (a.processes_mentioned as string[]) || [],
        estimatedComplexity: a.estimated_complexity as "low" | "medium" | "high",
        targetIndustries: (a.target_industries as string[]) || [],
        limitations: a.limitations as string,
        rawAnalysis: (a.raw_analysis as Record<string, unknown>) || {},
      },
    ])
  );

  return papers.map((paper) => ({
    ...paper,
    analysis: analysisMap.get(paper.id) || null,
  }));
}

async function logSearch(query: string, domain: Domain, count: number) {
  await supabaseAdmin.from("searches").insert({
    query,
    domain,
    results_count: count,
  });
}

