import { Patent, Author } from "@/types";

const BASE_URL = "https://search.patentsview.org/api/v1/patent/";

function getApiKey(): string {
  return process.env.PATENTSVIEW_API_KEY || "";
}

export async function searchPatentsView(
  query: string,
  limit: number = 20
): Promise<Patent[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("PatentsView API key not configured, returning empty results");
    return [];
  }

  const params = new URLSearchParams({
    q: JSON.stringify({ _text_any: { patent_abstract: query } }),
    f: JSON.stringify([
      "patent_id",
      "patent_title",
      "patent_abstract",
      "patent_date",
      "patent_type",
      "patent_num_times_cited_by_us_patents",
      "inventors.inventor_name_first",
      "inventors.inventor_name_last",
      "assignees.assignee_organization",
      "cpc_current.cpc_group_id",
    ]),
    s: JSON.stringify([{ patent_num_times_cited_by_us_patents: "desc" }]),
    o: JSON.stringify({ size: limit }),
  });

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      headers: {
        "X-Api-Key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (response.status === 429) {
      console.warn("PatentsView rate limited, returning empty results");
      return [];
    }

    if (!response.ok) {
      console.error(`PatentsView API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (!data.patents) return [];

    return data.patents
      .map(normalizePatent)
      .filter((p: Patent) => p.abstract);
  } catch (error) {
    console.error("PatentsView search failed:", error);
    return [];
  }
}

function normalizePatent(raw: Record<string, unknown>): Patent {
  const inventors = (raw.inventors as Array<Record<string, string>>) || [];
  const assignees = (raw.assignees as Array<Record<string, string>>) || [];
  const cpcs = (raw.cpc_current as Array<Record<string, string>>) || [];

  const patentId = raw.patent_id as string;
  const grantDate = (raw.patent_date as string) || null;
  const filingDate: string | null = null;
  const patentType = (raw.patent_type as string) || null;

  const authorList: Author[] = inventors.map((inv) => ({
    name: `${inv.inventor_name_first || ""} ${inv.inventor_name_last || ""}`.trim(),
  }));

  const cpcCodes = cpcs.map((c) => c.cpc_group_id).filter(Boolean);
  const assigneeOrg = assignees[0]?.assignee_organization || null;

  // Calculate expiration: utility = filing + 20 years, design = grant + 15 years
  let expirationDate: string | null = null;
  if (patentType === "design" && grantDate) {
    expirationDate = addYears(grantDate, 15);
  } else if (filingDate) {
    expirationDate = addYears(filingDate, 20);
  }

  return {
    patentId,
    title: (raw.patent_title as string) || "Untitled Patent",
    abstract: (raw.patent_abstract as string) || null,
    grantDate,
    filingDate,
    expirationDate,
    patentType,
    inventors: authorList,
    assigneeOrg,
    claimsCited: 0,
    timesCited: (raw.patent_num_times_cited_by_us_patents as number) || 0,
    cpcCodes,
    wipoField: null,
  };
}

function addYears(dateStr: string, years: number): string {
  const date = new Date(dateStr);
  date.setFullYear(date.getFullYear() + years);
  return date.toISOString().split("T")[0];
}
