-- PaperToProduct v2 Migration
-- Run this in Supabase SQL Editor to add the new tables

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

-- Indexes
create index if not exists product_ideas_domain_idx on product_ideas(domain);
create index if not exists product_solutions_idea_idx on product_solutions(idea_id);
create index if not exists solution_papers_solution_idx on solution_papers(solution_id);

-- RLS
alter table product_ideas enable row level security;
alter table product_solutions enable row level security;
alter table solution_papers enable row level security;

create policy "Allow all for service role" on product_ideas for all using (true);
create policy "Allow all for service role" on product_solutions for all using (true);
create policy "Allow all for service role" on solution_papers for all using (true);
