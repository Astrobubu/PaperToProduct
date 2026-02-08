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
