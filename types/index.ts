export type Domain = "energy_storage" | "biodegradable_plastics" | "medical_devices" | "advanced_materials" | "food_technology";

export interface Author {
  name: string;
  id?: string;
}

export interface Paper {
  id?: string;
  externalId: string;
  source: "semantic_scholar" | "openalex";
  title: string;
  abstract: string | null;
  authors: Author[];
  year: number | null;
  citationCount: number;
  publicationDate: string | null;
  journal: string | null;
  fieldsOfStudy: string[];
  pdfUrl: string | null;
  externalIds: Record<string, string> | null;
}

export interface PaperAnalysis {
  id?: string;
  paperId: string;
  domain: Domain;
  commercialScore: number;
  summary: string;
  commercialPotential: string;
  keyInnovation: string;
  materialsMentioned: string[];
  processesMentioned: string[];
  estimatedComplexity: "low" | "medium" | "high";
  targetIndustries: string[];
  limitations: string;
  rawAnalysis: Record<string, unknown>;
}

export interface PaperWithAnalysis extends Paper {
  analysis: PaperAnalysis | null;
}

export interface SearchResponse {
  query: string;
  domain: Domain;
  count: number;
  papers: PaperWithAnalysis[];
}

// v3: What the AI extracts from a single paper — real data only
export interface PaperExtraction {
  id?: string;
  paperId: string;
  paperTitle: string;
  objective: string;
  methodology: string;
  materials: string[];
  keyFindings: string[];
  performance: Record<string, string>;
  limitations: string[];
  novelty: string;
  relevance: string;
}

export interface ExtractResponse {
  extractions: PaperExtraction[];
}

// v3.1: Discovery modes
export type DiscoveryMode = "explore" | "product";

// v3.1: Patent types
export interface Patent {
  id?: string;
  patentId: string;
  title: string;
  abstract: string | null;
  grantDate: string | null;
  filingDate: string | null;
  expirationDate: string | null;
  patentType: string | null;
  inventors: Author[];
  assigneeOrg: string | null;
  claimsCited: number;
  timesCited: number;
  cpcCodes: string[];
  wipoField: string | null;
}

export interface PatentExtraction {
  patentId: string;
  patentTitle: string;
  claimedInvention: string;
  technicalField: string;
  methodology: string;
  materials: string[];
  keyAdvantages: string[];
  limitations: string[];
  legalStatus: string;
  commercialOwner: string;
  relevance: string;
}

export interface ProductConcept {
  sourceIds: string[];
  productName: string;
  productDescription: string;
  targetMarket: string;
  requiredMaterials: string[];
  manufacturingApproach: string;
  estimatedComplexity: "low" | "medium" | "high";
  potentialApplications: string[];
  keyAdvantages: string[];
  risks: string[];
  researchGaps: string[];
}

export interface PatentSearchResponse {
  query: string;
  domain: Domain;
  count: number;
  patents: Patent[];
}
