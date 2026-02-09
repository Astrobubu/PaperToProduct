import { NextRequest, NextResponse } from "next/server";
import { extractFromPapers } from "@/lib/extract-paper";
import { extractFromPatents } from "@/lib/extract-patent";
import { supabaseAdmin } from "@/lib/supabase";
import { Domain, Paper, Patent } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paperIds, patentIds, domain, searchQuery } = body as {
      paperIds?: string[];
      patentIds?: string[];
      domain: Domain;
      searchQuery: string;
    };

    if (!domain || !searchQuery) {
      return NextResponse.json({ error: "Domain and searchQuery are required" }, { status: 400 });
    }

    // Handle patent extraction
    if (patentIds?.length) {
      const { data: patentsData, error: fetchError } = await supabaseAdmin
        .from("patents")
        .select("*")
        .in("id", patentIds);

      if (fetchError || !patentsData?.length) {
        return NextResponse.json(
          { error: "Failed to fetch patents" },
          { status: 500 }
        );
      }

      const patents: Patent[] = patentsData.map((row: Record<string, unknown>) => ({
        id: row.id as string,
        patentId: row.patent_id as string,
        title: row.title as string,
        abstract: row.abstract as string | null,
        grantDate: row.grant_date as string | null,
        filingDate: row.filing_date as string | null,
        expirationDate: row.expiration_date as string | null,
        patentType: row.patent_type as string | null,
        inventors: (row.inventors as Patent["inventors"]) || [],
        assigneeOrg: row.assignee_org as string | null,
        claimsCited: (row.claims_cited as number) || 0,
        timesCited: (row.times_cited as number) || 0,
        cpcCodes: (row.cpc_codes as string[]) || [],
        wipoField: row.wipo_field as string | null,
      }));

      const patentExtractions = await extractFromPatents(patents, domain, searchQuery);

      // Cache patent extractions
      for (const extraction of patentExtractions) {
        if (extraction.patentId.startsWith("temp-")) continue;

        await supabaseAdmin
          .from("patent_extractions")
          .upsert(
            {
              patent_db_id: extraction.patentId,
              domain,
              raw_extraction: extraction,
            },
            { onConflict: "patent_db_id,domain" }
          );
      }

      return NextResponse.json({ patentExtractions });
    }

    // Handle paper extraction (existing logic)
    if (!paperIds?.length) {
      return NextResponse.json({ error: "No paper IDs or patent IDs provided" }, { status: 400 });
    }

    const { data: papersData, error: fetchError } = await supabaseAdmin
      .from("papers")
      .select("*")
      .in("id", paperIds);

    if (fetchError || !papersData?.length) {
      return NextResponse.json(
        { error: "Failed to fetch papers" },
        { status: 500 }
      );
    }

    const papers: Paper[] = papersData.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      externalId: row.external_id as string,
      source: row.source as "semantic_scholar" | "openalex",
      title: row.title as string,
      abstract: row.abstract as string | null,
      authors: (row.authors as Paper["authors"]) || [],
      year: row.year as number | null,
      citationCount: (row.citation_count as number) || 0,
      publicationDate: row.publication_date as string | null,
      journal: row.journal as string | null,
      fieldsOfStudy: (row.fields_of_study as string[]) || [],
      pdfUrl: row.pdf_url as string | null,
      externalIds: row.external_ids as Record<string, string> | null,
    }));

    const extractions = await extractFromPapers(papers, domain, searchQuery);

    // Cache extractions in paper_analyses table
    for (const extraction of extractions) {
      if (extraction.paperId.startsWith("temp-")) continue;

      await supabaseAdmin
        .from("paper_analyses")
        .upsert(
          {
            paper_id: extraction.paperId,
            domain,
            summary: extraction.objective,
            key_innovation: extraction.novelty,
            materials_mentioned: extraction.materials,
            limitations: extraction.limitations.join("; "),
            raw_analysis: extraction,
            commercial_score: 0,
            commercial_potential: "",
            processes_mentioned: [],
            estimated_complexity: "medium",
            target_industries: [],
          },
          { onConflict: "paper_id,domain" }
        );
    }

    return NextResponse.json({ extractions });
  } catch (error) {
    console.error("Extract error:", error);
    return NextResponse.json(
      { error: "Extraction failed. Please try again." },
      { status: 500 }
    );
  }
}
