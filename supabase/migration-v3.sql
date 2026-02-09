-- PaperToProduct v3.1: Patent Search + Product Concepts
-- Run this in the Supabase SQL editor

-- patents table
create table if not exists patents (
  id uuid primary key default gen_random_uuid(),
  patent_id text unique not null,
  title text not null,
  abstract text,
  grant_date date,
  filing_date date,
  expiration_date date,
  patent_type text,
  inventors jsonb,
  assignee_org text,
  claims_cited integer default 0,
  times_cited integer default 0,
  cpc_codes text[],
  wipo_field text,
  created_at timestamptz default now()
);

-- patent extractions
create table if not exists patent_extractions (
  id uuid primary key default gen_random_uuid(),
  patent_db_id uuid references patents(id),
  domain text not null,
  raw_extraction jsonb,
  created_at timestamptz default now(),
  unique(patent_db_id, domain)
);

-- product concepts
create table if not exists product_concepts (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  search_query text,
  source_paper_ids uuid[],
  concept jsonb not null,
  created_at timestamptz default now()
);
