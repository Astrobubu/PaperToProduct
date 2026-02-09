import { Patent, Domain } from "@/types";
import { searchPatentsView } from "./patentsview";
import { supabaseAdmin } from "./supabase";

// Reuse the same domain enhancement logic as paper search
function enhanceQueryForDomain(query: string, domain: Domain): string {
  const domainTerms: Record<Domain, string[]> = {
    energy_storage: ["battery", "energy storage", "electrode", "electrolyte", "capacitor", "charging"],
    biodegradable_plastics: ["biodegradable", "polymer", "bioplastic", "compostable", "sustainable packaging"],
    medical_devices: ["medical device", "biomedical", "implant", "diagnostic", "therapeutic"],
    advanced_materials: ["nanomaterial", "composite", "alloy", "metamaterial", "coating"],
    food_technology: ["food processing", "preservation", "fermentation", "nutraceutical", "encapsulation"],
  };

  const terms = domainTerms[domain];
  const hasTerms = terms.some((t) => query.toLowerCase().includes(t));

  if (!hasTerms) {
    return `${query} ${terms[0]}`;
  }
  return query;
}

export async function searchPatents(
  query: string,
  domain: Domain
): Promise<Patent[]> {
  const enhancedQuery = enhanceQueryForDomain(query, domain);

  const results = await searchPatentsView(enhancedQuery, 20);

  // Cache patents in Supabase
  const cached = await cachePatents(results);

  // Log search
  await supabaseAdmin.from("searches").insert({
    query,
    domain,
    results_count: cached.length,
  });

  return cached;
}

async function cachePatents(patents: Patent[]): Promise<Patent[]> {
  const cached: Patent[] = [];

  for (const patent of patents) {
    const { data: existing } = await supabaseAdmin
      .from("patents")
      .select("id")
      .eq("patent_id", patent.patentId)
      .single();

    if (existing) {
      cached.push({ ...patent, id: existing.id });
      continue;
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("patents")
      .insert({
        patent_id: patent.patentId,
        title: patent.title,
        abstract: patent.abstract,
        grant_date: patent.grantDate,
        filing_date: patent.filingDate,
        expiration_date: patent.expirationDate,
        patent_type: patent.patentType,
        inventors: patent.inventors,
        assignee_org: patent.assigneeOrg,
        claims_cited: patent.claimsCited,
        times_cited: patent.timesCited,
        cpc_codes: patent.cpcCodes,
        wipo_field: patent.wipoField,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to cache patent:", error.message);
      cached.push({ ...patent, id: `temp-${patent.patentId}` });
    } else if (inserted) {
      cached.push({ ...patent, id: inserted.id });
    }
  }

  return cached;
}
