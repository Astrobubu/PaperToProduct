import { Paper } from "@/types";

const BASE_URL = "https://api.semanticscholar.org/graph/v1";
const FIELDS =
  "paperId,title,abstract,year,authors,citationCount,influentialCitationCount,publicationDate,journal,fieldsOfStudy,openAccessPdf,externalIds";

export async function searchSemanticScholar(
  query: string,
  limit: number = 15
): Promise<Paper[]> {
  const url = `${BASE_URL}/paper/search?query=${encodeURIComponent(query)}&fields=${FIELDS}&limit=${limit}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (response.status === 429) {
      console.warn("Semantic Scholar rate limited, returning empty results");
      return [];
    }

    if (!response.ok) {
      console.error(`Semantic Scholar API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.data) return [];

    return data.data.map(normalizePaper).filter((p: Paper) => p.abstract);
  } catch (error) {
    console.error("Semantic Scholar search failed:", error);
    return [];
  }
}

export async function getPaperFromSemanticScholar(
  paperId: string
): Promise<Paper | null> {
  const url = `${BASE_URL}/paper/${paperId}?fields=${FIELDS}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return normalizePaper(data);
  } catch {
    return null;
  }
}

function normalizePaper(paper: Record<string, unknown>): Paper {
  const authors = paper.authors as Array<{ name: string; authorId: string }> | undefined;
  const journal = paper.journal as { name: string } | undefined;
  const openAccessPdf = paper.openAccessPdf as { url: string } | undefined;

  return {
    externalId: paper.paperId as string,
    source: "semantic_scholar",
    title: paper.title as string,
    abstract: (paper.abstract as string) || null,
    authors: authors?.map((a) => ({ name: a.name, id: a.authorId })) || [],
    year: (paper.year as number) || null,
    citationCount: (paper.citationCount as number) || 0,
    publicationDate: (paper.publicationDate as string) || null,
    journal: journal?.name || null,
    fieldsOfStudy: (paper.fieldsOfStudy as string[]) || [],
    pdfUrl: openAccessPdf?.url || null,
    externalIds: (paper.externalIds as Record<string, string>) || null,
  };
}
