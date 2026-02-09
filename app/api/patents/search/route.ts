import { NextRequest, NextResponse } from "next/server";
import { searchPatents } from "@/lib/search-patents";
import { Domain } from "@/types";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const domain = searchParams.get("domain") as Domain | null;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const validDomains = [
    "energy_storage",
    "biodegradable_plastics",
    "medical_devices",
    "advanced_materials",
    "food_technology",
  ];
  if (!domain || !validDomains.includes(domain)) {
    return NextResponse.json(
      { error: "Valid domain is required" },
      { status: 400 }
    );
  }

  try {
    const results = await searchPatents(query, domain);

    return NextResponse.json({
      query,
      domain,
      count: results.length,
      patents: results,
    });
  } catch (error) {
    console.error("Patent search error:", error);
    return NextResponse.json(
      { error: "Patent search failed. Please try again." },
      { status: 500 }
    );
  }
}
