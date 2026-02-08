import { Paper } from "@/types";

const BASE_URL = "https://api.openalex.org";

export async function searchOpenAlex(
  query: string,
  limit: number = 10
): Promise<Paper[]> {
  const currentYear = new Date().getFullYear();
  const url = `${BASE_URL}/works?search=${encodeURIComponent(query)}&filter=publication_year:${currentYear - 5}-${currentYear},is_oa:true&per_page=${limit}&sort=cited_by_count:desc&mailto=papertoproduct@example.com`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`OpenAlex API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.results) return [];

    return data.results.map(normalizePaper).filter((p: Paper) => p.abstract);
  } catch (error) {
    console.error("OpenAlex search failed:", error);
    return [];
  }
}

function normalizePaper(work: Record<string, unknown>): Paper {
  const authorships = work.authorships as Array<{
    author: { display_name: string; id: string };
  }> | undefined;

  const primaryLocation = work.primary_location as {
    source?: { display_name: string };
  } | undefined;

  const openAccess = work.open_access as { oa_url: string } | undefined;
  const ids = work.ids as Record<string, string> | undefined;
  const biblio = work.biblio as { volume?: string; issue?: string } | undefined;
  const concepts = work.concepts as Array<{ display_name: string }> | undefined;

  // Reconstruct abstract from inverted index if available
  let abstract: string | null = null;
  const invertedIndex = work.abstract_inverted_index as Record<string, number[]> | undefined;
  if (invertedIndex) {
    const words: [string, number][] = [];
    for (const [word, positions] of Object.entries(invertedIndex)) {
      for (const pos of positions) {
        words.push([word, pos]);
      }
    }
    words.sort((a, b) => a[1] - b[1]);
    abstract = words.map((w) => w[0]).join(" ");
  }

  return {
    externalId: (work.id as string)?.replace("https://openalex.org/", "") || "",
    source: "openalex",
    title: (work.title as string) || "Untitled",
    abstract,
    authors:
      authorships?.map((a) => ({
        name: a.author.display_name,
        id: a.author.id,
      })) || [],
    year: (work.publication_year as number) || null,
    citationCount: (work.cited_by_count as number) || 0,
    publicationDate: (work.publication_date as string) || null,
    journal:
      primaryLocation?.source?.display_name ||
      (biblio ? `Vol ${biblio.volume}` : null),
    fieldsOfStudy:
      concepts?.slice(0, 5).map((c) => c.display_name) || [],
    pdfUrl: openAccess?.oa_url || null,
    externalIds: ids
      ? {
          doi: ids.doi || "",
          openalex: ids.openalex || "",
        }
      : null,
  };
}
