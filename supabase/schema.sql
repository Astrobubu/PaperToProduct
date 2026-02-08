-- PaperToProduct Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Enable pgvector extension
create extension if not exists vector;

-- Research papers cache
create table if not exists papers (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  source text not null,
  title text not null,
  abstract text,
  authors jsonb,
  year integer,
  citation_count integer,
  publication_date date,
  journal text,
  fields_of_study text[],
  pdf_url text,
  external_ids jsonb,
  embedding vector(1536),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Commercial analysis results
create table if not exists paper_analyses (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid references papers(id) on delete cascade,
  domain text not null,
  commercial_score integer check (commercial_score between 1 and 10),
  summary text,
  commercial_potential text,
  key_innovation text,
  materials_mentioned text[],
  processes_mentioned text[],
  estimated_complexity text,
  target_industries text[],
  limitations text,
  raw_analysis jsonb,
  created_at timestamp with time zone default now()
);

-- Search queries log
create table if not exists searches (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  domain text,
  results_count integer,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists papers_source_idx on papers(source);
create index if not exists papers_year_idx on papers(year);
create index if not exists paper_analyses_domain_idx on paper_analyses(domain);
create index if not exists paper_analyses_score_idx on paper_analyses(commercial_score);
create index if not exists paper_analyses_paper_id_idx on paper_analyses(paper_id);

-- Product ideas submitted by users
create table if not exists product_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  domain text not null,
  created_at timestamptz default now()
);

-- AI-generated product solutions
create table if not exists product_solutions (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references product_ideas(id) on delete cascade,
  product_name text,
  product_description text,
  technical_approach text,
  materials_needed text[],
  manufacturing_process text,
  cost_estimate jsonb,
  pricing_strategy text,
  market_opportunity jsonb,
  timeline jsonb,
  challenges_and_risks text[],
  key_insights jsonb,
  paper_count integer,
  raw_response jsonb,
  created_at timestamptz default now()
);

-- Links solutions to the papers they used
create table if not exists solution_papers (
  id uuid primary key default gen_random_uuid(),
  solution_id uuid references product_solutions(id) on delete cascade,
  paper_id uuid references papers(id) on delete cascade
);

-- Indexes for new tables
create index if not exists product_ideas_domain_idx on product_ideas(domain);
create index if not exists product_solutions_idea_idx on product_solutions(idea_id);
create index if not exists solution_papers_solution_idx on solution_papers(solution_id);

-- Enable Row Level Security (allow all for now - tighten in production)
alter table papers enable row level security;
alter table paper_analyses enable row level security;
alter table searches enable row level security;
alter table product_ideas enable row level security;
alter table product_solutions enable row level security;
alter table solution_papers enable row level security;

-- Policies: allow all operations via service role (API routes use service key)
create policy "Allow all for service role" on papers for all using (true);
create policy "Allow all for service role" on paper_analyses for all using (true);
create policy "Allow all for service role" on searches for all using (true);
create policy "Allow all for service role" on product_ideas for all using (true);
create policy "Allow all for service role" on product_solutions for all using (true);
create policy "Allow all for service role" on solution_papers for all using (true);
