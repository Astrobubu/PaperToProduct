import { NextRequest, NextResponse } from "next/server";
import { generateProductConcept } from "@/lib/generate-product-concept";
import { supabaseAdmin } from "@/lib/supabase";
import { Domain, Paper, PaperExtraction } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paperIds, domain, searchQuery, extractions: preExtracted } = body as {
      paperIds: string[];
      domain: Domain;
      searchQuery: string;
      extractions?: PaperExtraction[];
    };

    if (!paperIds?.length) {
      return NextResponse.json({ error: "No paper IDs provided" }, { status: 400 });
    }

    if (!domain || !searchQuery) {
      return NextResponse.json({ error: "Domain and searchQuery are required" }, { status: 400 });
    }

    // Fetch papers from Supabase
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

    // Use pre-computed extractions if provided, otherwise skip (concept gen uses abstracts directly)
    const extractions = preExtracted || [];

    // Generate product concept
    const concept = await generateProductConcept(papers, extractions, domain, searchQuery);

    // Cache the product concept
    await supabaseAdmin.from("product_concepts").insert({
      domain,
      search_query: searchQuery,
      source_paper_ids: paperIds,
      concept,
    });

    return NextResponse.json({ concept });
  } catch (error) {
    console.error("Product concept error:", error);
    return NextResponse.json(
      { error: "Product concept generation failed. Please try again." },
      { status: 500 }
    );
  }
}
