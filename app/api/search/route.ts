import { NextRequest, NextResponse } from "next/server";
import { searchPapers } from "@/lib/search";
import { Domain } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const domain = searchParams.get("domain") as Domain | null;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const validDomains = ["energy_storage", "biodegradable_plastics", "medical_devices", "advanced_materials", "food_technology"];
  if (!domain || !validDomains.includes(domain)) {
    return NextResponse.json(
      { error: "Valid domain is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchPapers(query, domain);

    return NextResponse.json({
      query,
      domain,
      count: results.length,
      papers: results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
