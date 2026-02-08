# PaperToProduct MVP — Research-to-Product Platform

## Project Overview

Build a web application that takes product/innovation queries and returns relevant academic research papers analyzed for commercial viability. The MVP focuses on two domains: **energy storage devices** and **biodegradable plastics**.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL with pgvector for embeddings)
- **AI:** OpenAI API (embeddings + GPT-4 for analysis)
- **Research APIs:** Semantic Scholar API, OpenAlex API
- **Deployment:** Vercel

---

## Design System

### Color Palette (Olive Green & Cream - Travel App Style)
```css
:root {
  /* Backgrounds */
  --background: #E8E4DC;        /* Warm cream/taupe background */
  --surface: #FFFFFF;           /* White card backgrounds */
  --surface-alt: #F5F3EF;       /* Slightly off-white for nested elements */
  
  /* Primary - Olive Green */
  --primary: #A3B852;           /* Bright olive/lime green - main CTA */
  --primary-dark: #8BA341;      /* Darker olive for hover states */
  --primary-light: #C5D469;     /* Lighter olive for highlights */
  
  /* Secondary - Deep Forest Green */
  --secondary: #2D4A3E;         /* Deep forest green for accents */
  --secondary-light: #3D5E4F;   /* Lighter forest green */
  
  /* Accent - Soft Yellow-Green */
  --accent-bg: #E8ED9C;         /* Soft yellow-green for highlighted cards */
  --accent-bg-light: #F0F4B8;   /* Lighter version for hover */
  
  /* Text */
  --text-primary: #1A1A1A;      /* Near black for headings */
  --text-secondary: #6B6B6B;    /* Gray for secondary text */
  --text-muted: #9B9B9B;        /* Muted gray for labels */
  --text-on-primary: #FFFFFF;   /* White text on green buttons */
  
  /* Borders & Shadows */
  --border: #E5E5E5;            /* Light gray borders */
  --border-strong: #D0D0D0;     /* Stronger borders when needed */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);
  
  /* Score Colors */
  --score-high: #A3B852;        /* 8-10: Olive green */
  --score-medium: #E8C547;      /* 5-7: Warm yellow */
  --score-low: #9B9B9B;         /* 1-4: Gray */
}
```

### Typography
- **Headings:** `font-family: 'DM Sans', 'Inter', system-ui, sans-serif` — Bold weight (700)
- **Body:** `font-family: 'Inter', system-ui, sans-serif` — Regular (400) and Medium (500)
- **Labels/Tags:** `font-family: 'Inter', system-ui, sans-serif` — Medium weight, slightly smaller

### Border Radius System
```css
--radius-sm: 8px;      /* Small elements, tags, pills */
--radius-md: 12px;     /* Buttons, inputs */
--radius-lg: 16px;     /* Cards */
--radius-xl: 24px;     /* Large cards, hero sections */
--radius-full: 9999px; /* Fully rounded pills, toggles */
```

### Design Principles

**Card Style:**
- Pure white backgrounds (#FFFFFF) on cream page background
- Large border radius (16-24px)
- Subtle shadows, never harsh
- Cards can have highlighted sections with yellow-green accent background (#E8ED9C)
- Generous internal padding (20-24px)

**Buttons:**
- Primary: Olive green (#A3B852) with white text, fully rounded (pill shape)
- Secondary: White with subtle border, dark text
- Active/Selected states: Filled olive green
- Inactive states: White/transparent with gray text

**Tags & Pills:**
- Small rounded pills with icon + text
- Light backgrounds (#F5F3EF) with subtle borders
- Category tags use the soft yellow-green (#E8ED9C) when selected

**Layout:**
- Generous whitespace between elements
- Cards should breathe — don't cram content
- Use the cream background to create depth between card layers
- Subtle separators, never heavy lines

**Visual Hierarchy:**
- Large, bold headings (24-32px)
- Clear section separation
- Use the olive green sparingly for emphasis (CTAs, scores, key metrics)
- Icons should be simple line icons or subtle filled icons

**Highlighted Content Cards:**
- Use the yellow-green accent background (#E8ED9C) for featured or high-scoring items
- These should feel like a "highlighted result" or "top pick"
- Still maintain white internal sections where needed

**Image Treatment (if showing paper thumbnails or researcher photos):**
- Rounded corners matching card radius
- Subtle overlay gradients for text readability
- Small badges/labels positioned in corners

---

## Data Sources & APIs

### 1. Semantic Scholar API (Primary)
- **Base URL:** `https://api.semanticscholar.org/graph/v1`
- **Rate Limit:** 100 requests per 5 minutes (no API key needed for basic use)
- **Endpoints:**
  - `GET /paper/search?query={query}&fields={fields}&limit={limit}`
  - `GET /paper/{paper_id}?fields={fields}`

**Fields to request:**
```
paperId,title,abstract,year,authors,citationCount,influentialCitationCount,
publicationTypes,journal,fieldsOfStudy,s2FieldsOfStudy,publicationDate,
openAccessPdf,externalIds
```

**Example request:**
```bash
curl "https://api.semanticscholar.org/graph/v1/paper/search?query=solid+state+battery+electrolyte&fields=paperId,title,abstract,year,authors,citationCount,openAccessPdf&limit=20"
```

### 2. OpenAlex API (Secondary/Supplementary)
- **Base URL:** `https://api.openalex.org`
- **Rate Limit:** 100,000 requests/day (free, no key required)
- **Polite pool:** Add `mailto` parameter for higher limits

**Endpoints:**
- `GET /works?search={query}&filter={filters}`

**Example request:**
```bash
curl "https://api.openalex.org/works?search=biodegradable+plastic+polymer&filter=publication_year:2020-2024,is_oa:true&per_page=20&mailto=your@email.com"
```

---

## Database Schema (Supabase)

```sql
-- Enable pgvector extension
create extension if not exists vector;

-- Research papers cache
create table papers (
  id uuid primary key default gen_random_uuid(),
  external_id text unique not null,           -- Semantic Scholar or OpenAlex ID
  source text not null,                        -- 'semantic_scholar' or 'openalex'
  title text not null,
  abstract text,
  authors jsonb,                               -- [{name, authorId}]
  year integer,
  citation_count integer,
  publication_date date,
  journal text,
  fields_of_study text[],
  pdf_url text,
  external_ids jsonb,                          -- DOI, ArXiv ID, etc.
  embedding vector(1536),                      -- OpenAI ada-002 embedding
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Commercial analysis results
create table paper_analyses (
  id uuid primary key default gen_random_uuid(),
  paper_id uuid references papers(id) on delete cascade,
  domain text not null,                        -- 'energy_storage' or 'biodegradable_plastics'
  commercial_score integer check (commercial_score between 1 and 10),
  summary text,                                -- 2-3 sentence plain English summary
  commercial_potential text,                   -- What product could this become?
  key_innovation text,                         -- What's new here?
  materials_mentioned text[],
  processes_mentioned text[],
  estimated_complexity text,                   -- 'low', 'medium', 'high'
  target_industries text[],
  limitations text,
  raw_analysis jsonb,                          -- Full LLM response for debugging
  created_at timestamp with time zone default now()
);

-- Search queries log
create table searches (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  domain text,
  results_count integer,
  created_at timestamp with time zone default now()
);

-- Indexes
create index papers_embedding_idx on papers using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index papers_source_idx on papers(source);
create index papers_year_idx on papers(year);
create index paper_analyses_domain_idx on paper_analyses(domain);
create index paper_analyses_score_idx on paper_analyses(commercial_score);
```

---

## Application Structure

```
papertoproduct/
├── app/
│   ├── layout.tsx                 # Root layout with fonts, theme
│   ├── page.tsx                   # Homepage with search
│   ├── search/
│   │   └── page.tsx               # Search results page
│   ├── paper/
│   │   └── [id]/
│   │       └── page.tsx           # Individual paper detail view
│   ├── api/
│   │   ├── search/
│   │   │   └── route.ts           # Main search endpoint
│   │   ├── paper/
│   │   │   └── [id]/
│   │   │       └── route.ts       # Get single paper with analysis
│   │   └── analyze/
│   │       └── route.ts           # Trigger analysis for a paper
│   └── globals.css
├── components/
│   ├── SearchBar.tsx              # Main search input
│   ├── DomainSelector.tsx         # Toggle between domains
│   ├── PaperCard.tsx              # Paper result card
│   ├── CommercialScore.tsx        # Visual score indicator
│   ├── AnalysisPanel.tsx          # Detailed analysis view
│   ├── LoadingState.tsx           # Paper-themed loading
│   └── Header.tsx
├── lib/
│   ├── semantic-scholar.ts        # Semantic Scholar API client
│   ├── openalex.ts                # OpenAlex API client
│   ├── openai.ts                  # OpenAI client (embeddings + analysis)
│   ├── supabase.ts                # Supabase client
│   ├── analyze-paper.ts           # Commercial analysis logic
│   └── search.ts                  # Combined search logic
├── types/
│   └── index.ts                   # TypeScript types
└── public/
    └── (static assets if needed)
```

---

## Core Logic Implementation

### 1. Search Flow (`lib/search.ts`)

```typescript
export async function searchPapers(query: string, domain: 'energy_storage' | 'biodegradable_plastics') {
  // Step 1: Enhance query with domain-specific terms
  const enhancedQuery = enhanceQueryForDomain(query, domain);
  
  // Step 2: Search Semantic Scholar
  const semanticResults = await searchSemanticScholar(enhancedQuery, 15);
  
  // Step 3: Search OpenAlex for additional results
  const openAlexResults = await searchOpenAlex(enhancedQuery, 10);
  
  // Step 4: Deduplicate by DOI
  const combinedResults = deduplicateByDOI([...semanticResults, ...openAlexResults]);
  
  // Step 5: Cache papers in Supabase
  const cachedPapers = await cachePapers(combinedResults);
  
  // Step 6: Check for existing analyses, run new ones if needed
  const papersWithAnalysis = await ensureAnalyses(cachedPapers, domain);
  
  // Step 7: Sort by commercial score
  return papersWithAnalysis.sort((a, b) => b.commercialScore - a.commercialScore);
}

function enhanceQueryForDomain(query: string, domain: string): string {
  const domainTerms = {
    energy_storage: ['battery', 'energy storage', 'electrode', 'electrolyte', 'capacitor', 'charging'],
    biodegradable_plastics: ['biodegradable', 'polymer', 'bioplastic', 'compostable', 'sustainable packaging']
  };
  
  // Add domain context if not already present
  const terms = domainTerms[domain];
  const hasTerms = terms.some(t => query.toLowerCase().includes(t));
  
  if (!hasTerms) {
    return `${query} ${terms[0]}`;
  }
  return query;
}
```

### 2. Semantic Scholar Client (`lib/semantic-scholar.ts`)

```typescript
const BASE_URL = 'https://api.semanticscholar.org/graph/v1';
const FIELDS = 'paperId,title,abstract,year,authors,citationCount,influentialCitationCount,publicationDate,journal,fieldsOfStudy,openAccessPdf,externalIds';

export async function searchSemanticScholar(query: string, limit: number = 20) {
  const url = `${BASE_URL}/paper/search?query=${encodeURIComponent(query)}&fields=${FIELDS}&limit=${limit}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Semantic Scholar API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data.map(normalizePaper);
}

function normalizePaper(paper: any): Paper {
  return {
    externalId: paper.paperId,
    source: 'semantic_scholar',
    title: paper.title,
    abstract: paper.abstract,
    authors: paper.authors?.map(a => ({ name: a.name, id: a.authorId })) || [],
    year: paper.year,
    citationCount: paper.citationCount || 0,
    publicationDate: paper.publicationDate,
    journal: paper.journal?.name,
    fieldsOfStudy: paper.fieldsOfStudy || [],
    pdfUrl: paper.openAccessPdf?.url,
    externalIds: paper.externalIds
  };
}
```

### 3. Commercial Analysis (`lib/analyze-paper.ts`)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzePaperCommercially(paper: Paper, domain: string) {
  const prompt = `You are an expert at identifying commercial potential in academic research. Analyze this research paper for its potential to become a real-world product.

PAPER TITLE: ${paper.title}

ABSTRACT: ${paper.abstract || 'No abstract available'}

DOMAIN: ${domain === 'energy_storage' ? 'Energy Storage Devices' : 'Biodegradable Plastics'}

Provide your analysis in the following JSON format:
{
  "commercial_score": <1-10, where 10 is immediately commercializable>,
  "summary": "<2-3 sentence plain English summary of what this research achieved>",
  "commercial_potential": "<What specific product or improvement could this become? Be concrete.>",
  "key_innovation": "<What's the novel contribution that matters for commercialization?>",
  "materials_mentioned": ["<list of specific materials, chemicals, or compounds mentioned>"],
  "processes_mentioned": ["<list of manufacturing or synthesis processes mentioned>"],
  "estimated_complexity": "<'low', 'medium', or 'high' - how hard would this be to manufacture at scale?>",
  "target_industries": ["<which industries would benefit from this?>"],
  "limitations": "<What are the practical barriers to commercialization mentioned or implied?>"
}

SCORING GUIDELINES:
- 9-10: Ready for commercialization, clear path to product, proven at relevant scale
- 7-8: Strong potential, may need minor development, clear application
- 5-6: Interesting but needs significant development or has unclear market fit
- 3-4: Early stage research, far from practical application
- 1-2: Purely theoretical or not relevant to commercial products

Be realistic and critical. Most papers should score 4-6. Only exceptional papers with clear, immediate applications should score above 7.

Return ONLY valid JSON, no other text.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const analysis = JSON.parse(response.choices[0].message.content);
  
  return {
    paperId: paper.id,
    domain,
    commercialScore: analysis.commercial_score,
    summary: analysis.summary,
    commercialPotential: analysis.commercial_potential,
    keyInnovation: analysis.key_innovation,
    materialsMentioned: analysis.materials_mentioned,
    processesMentioned: analysis.processes_mentioned,
    estimatedComplexity: analysis.estimated_complexity,
    targetIndustries: analysis.target_industries,
    limitations: analysis.limitations,
    rawAnalysis: analysis
  };
}
```

### 4. Main Search API Route (`app/api/search/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { searchPapers } from '@/lib/search';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const domain = searchParams.get('domain') as 'energy_storage' | 'biodegradable_plastics';

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  if (!domain || !['energy_storage', 'biodegradable_plastics'].includes(domain)) {
    return NextResponse.json({ error: 'Valid domain is required' }, { status: 400 });
  }

  try {
    const results = await searchPapers(query, domain);
    
    return NextResponse.json({
      query,
      domain,
      count: results.length,
      papers: results
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
```

---

## UI Components

### Homepage (`app/page.tsx`)

The homepage should have:
1. Cream/taupe background (#E8E4DC) covering the full page
2. A main white card (rounded-2xl) containing the search interface
3. Domain toggle at top (pill-style selector like "One way / Round trip")
4. Large search input with integrated search button
5. Brief tagline above: "Turn research into products" in bold
6. Example searches as clickable rounded pills below the search bar
7. Subtle branding at top

**Example searches to show (as clickable pills):**
- Energy Storage: "solid state battery", "fast charging electrode", "sodium ion battery"
- Biodegradable: "compostable food packaging", "marine degradable polymer", "plant-based plastic film"

**Layout structure:**
```
┌──────────────────────────────────────┐
│  ← Jisir                      ≡  ☆  │  (Header)
├──────────────────────────────────────┤
│                                      │
│        Turn research into            │
│            products                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Energy Storage] [Plastics]   │  │  (Toggle)
│  │                                │  │
│  │  ┌──────────────────────┬───┐ │  │
│  │  │ Search for research..│ 🔍│ │  │  (Search)
│  │  └──────────────────────┴───┘ │  │
│  │                                │  │
│  │  ○ solid state  ○ fast charge │  │  (Example pills)
│  │  ○ sodium ion   ○ compostable │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### Search Results Page (`app/search/page.tsx`)

1. Cream background (#E8E4DC) full page
2. Sticky header with back button and search bar (compact version)
3. Domain chips below header (Hiking/Kayaking style)
4. Results count: "14 Papers found" with filter icon
5. Vertical list of paper cards (not grid - single column for readability)
6. High-scoring papers (7+) get the yellow-green (#E8ED9C) highlight header
7. Each card shows:
   - Score badge (top right, olive green square with rounded corners)
   - Title (bold, 2 lines max)
   - Year and citation count
   - 2-line summary
   - Key innovation as a pill/tag
   - Target industries as small gray pills
   - "View Details" button (olive green, pill-shaped)

**Layout structure:**
```
┌──────────────────────────────────────┐
│  ←  [Search bar...........]  🔍     │  (Sticky header)
├──────────────────────────────────────┤
│  ○ Energy Storage  ○ Plastics       │  (Domain chips)
├──────────────────────────────────────┤
│  14 Papers found              ≡ •   │  (Results count + filter)
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ HIGH POTENTIAL (yellow-green) │  │  (High score card)
│  │ ┌────────────────────────┬──┐ │  │
│  │ │ Paper Title Here      │ 9│ │  │
│  │ │ 2024 • 156 citations  └──┘ │  │
│  │ │ Summary text goes here...  │  │
│  │ │ [Innovation Tag]           │  │
│  │ │ ○ Battery ○ Automotive     │  │
│  │ │ ─────────────────────────  │  │
│  │ │ Complexity: Medium  [View] │  │
│  │ └────────────────────────────┘  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Regular card (white)          │  │  (Normal score card)
│  │ ...                           │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Paper Detail Page (`app/paper/[id]/page.tsx`)

Follows the hotel detail card style from the reference:

1. **Hero section** - Deep forest green (#2D4A3E) header with rounded bottom corners
   - Back arrow
   - Paper title in white
   - Authors in white/70% opacity

2. **Stats card** - White card that slightly overlaps the hero
   - Three-column stat row (like "1km to centre • 2 guests • 10 days")
   - Year | Citations | Score
   - Divider below

3. **Feature pills** - Row of small info pills (like "1 king bed • Free wi-fi • TV")
   - Journal name
   - Fields of study
   - PDF available indicator

4. **Analysis sections** - Clean sections with subtle separators
   - Commercial Potential
   - Key Innovation
   - Materials & Processes (as pills)
   - Target Industries (as pills)
   - Complexity indicator
   - Limitations

5. **Abstract** - Expandable section

6. **CTA row** - Bottom of card
   - "From" label with complexity indicator
   - "View Full Paper" olive green pill button

7. **Researcher contact** - Secondary card below
   - Author names
   - Institutions
   - Link to Google Scholar / institution page

**Layout structure:**
```
┌──────────────────────────────────────┐
│  ←          ↑ share      % discount │  (Header icons)
├──────────────────────────────────────┤
│ ████████████████████████████████████ │
│ ███  [Deep green hero section]  ████ │
│ ███                             ████ │
│ ███  Paper Title Goes Here      ████ │
│ ███  And Can Wrap to Two Lines  ████ │
│ ███                             ████ │
│ ███  Authors: Smith, J et al.   ████ │
│ █████████████████████████████████ ▼▼ │  (Rounded bottom)
│    ┌────────────────────────────┐    │
│    │  2024    │   156    │  9/10│    │  (Stats row)
│    │ Published│ Citations│ Score│    │
│    ├────────────────────────────┤    │
│    │ ○ Nature │ ○ Materials│ PDF│    │  (Feature pills)
│    ├────────────────────────────┤    │
│    │                            │    │
│    │ Commercial Potential       │    │
│    │ This research could become │    │
│    │ a next-gen solid state...  │    │
│    │                            │    │
│    │ Key Innovation             │    │
│    │ Novel electrolyte that...  │    │
│    │                            │    │
│    │ Target Industries          │    │
│    │ ○ EV ○ Grid ○ Consumer     │    │
│    │                            │    │
│    ├────────────────────────────┤    │
│    │ Complexity     [View Paper]│    │
│    │ Medium         (green btn) │    │
│    └────────────────────────────┘    │
└──────────────────────────────────────┘
```

---

## Component Designs

### PaperCard Component

```tsx
// Visual structure - follows the travel card style
<div className="bg-white rounded-2xl shadow-md overflow-hidden">
  {/* Highlighted header for high-scoring papers */}
  {score >= 7 && (
    <div className="bg-[#E8ED9C] px-5 py-3">
      <span className="text-sm font-medium text-[#2D4A3E]">HIGH POTENTIAL</span>
    </div>
  )}
  
  <div className="p-5">
    {/* Score badge - positioned top right */}
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <h3 className="font-bold text-lg text-[#1A1A1A] line-clamp-2">{title}</h3>
      </div>
      <div className="ml-3 w-12 h-12 rounded-xl bg-[#A3B852] flex items-center justify-center">
        <span className="text-white font-bold text-lg">{score}</span>
      </div>
    </div>
    
    {/* Meta info row */}
    <div className="flex gap-4 mb-3">
      <span className="text-sm text-[#6B6B6B]">{year}</span>
      <span className="text-sm text-[#6B6B6B]">•</span>
      <span className="text-sm text-[#6B6B6B]">{citations} citations</span>
    </div>
    
    {/* Summary */}
    <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">{summary}</p>
    
    {/* Key innovation tag */}
    <div className="inline-block bg-[#F5F3EF] rounded-full px-3 py-1.5 mb-4">
      <span className="text-xs font-medium text-[#2D4A3E]">{keyInnovation}</span>
    </div>
    
    {/* Industries row */}
    <div className="flex flex-wrap gap-2 mb-4">
      {industries.map(i => (
        <span className="bg-[#F5F3EF] text-[#6B6B6B] text-xs px-2.5 py-1 rounded-full">
          {i}
        </span>
      ))}
    </div>
    
    {/* Action row */}
    <div className="flex justify-between items-center pt-3 border-t border-[#E5E5E5]">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#9B9B9B]">Complexity:</span>
        <span className="text-xs font-medium text-[#2D4A3E]">{complexity}</span>
      </div>
      <button className="bg-[#A3B852] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#8BA341] transition-colors">
        View Details
      </button>
    </div>
  </div>
</div>
```

### CommercialScore Component

```tsx
// Score display matching the travel app badge style
<div className="flex items-center gap-3">
  {/* Large score badge */}
  <div className={`
    w-16 h-16 rounded-2xl flex items-center justify-center
    ${score >= 8 ? 'bg-[#A3B852]' : score >= 5 ? 'bg-[#E8C547]' : 'bg-[#9B9B9B]'}
  `}>
    <span className="text-white font-bold text-2xl">{score}</span>
  </div>
  
  {/* Score context */}
  <div>
    <div className="text-sm font-medium text-[#1A1A1A]">
      {score >= 8 ? 'High Potential' : score >= 5 ? 'Moderate Potential' : 'Early Stage'}
    </div>
    <div className="text-xs text-[#6B6B6B]">Commercial Score</div>
  </div>
</div>
```

### SearchBar Component

```tsx
// Clean search bar with toggle, matching the "One way / Round trip" style
<div className="bg-white rounded-2xl shadow-md p-4">
  {/* Domain toggle - pill style */}
  <div className="flex justify-center mb-4">
    <div className="bg-[#F5F3EF] rounded-full p-1 inline-flex">
      <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        domain === 'energy_storage' 
          ? 'bg-[#2D4A3E] text-white' 
          : 'text-[#6B6B6B]'
      }`}>
        Energy Storage
      </button>
      <button className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        domain === 'biodegradable_plastics' 
          ? 'bg-[#2D4A3E] text-white' 
          : 'text-[#6B6B6B]'
      }`}>
        Biodegradable Plastics
      </button>
    </div>
  </div>
  
  {/* Search input */}
  <div className="relative">
    <input
      type="text"
      placeholder="Search for research..."
      className="w-full bg-[#F5F3EF] rounded-xl px-4 py-3 pr-24 text-[#1A1A1A] placeholder-[#9B9B9B] border-none focus:outline-none focus:ring-2 focus:ring-[#A3B852]"
    />
    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#A3B852] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#8BA341] transition-colors">
      Search
    </button>
  </div>
</div>
```

### DomainSelector (Alternative Chip Style)

```tsx
// Category chips like the "Hiking / Kayaking / Biking" style
<div className="flex gap-2">
  <button className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
    selected === 'energy_storage'
      ? 'bg-[#E8ED9C] border-[#A3B852] text-[#2D4A3E]'
      : 'bg-white border-[#E5E5E5] text-[#6B6B6B]'
  }`}>
    <BatteryIcon className="w-4 h-4" />
    <span className="text-sm font-medium">Energy Storage</span>
  </button>
  
  <button className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
    selected === 'biodegradable_plastics'
      ? 'bg-[#E8ED9C] border-[#A3B852] text-[#2D4A3E]'
      : 'bg-white border-[#E5E5E5] text-[#6B6B6B]'
  }`}>
    <LeafIcon className="w-4 h-4" />
    <span className="text-sm font-medium">Biodegradable Plastics</span>
  </button>
</div>
```

### Detail Page Layout

```tsx
// Following the hotel detail card style
<div className="min-h-screen bg-[#E8E4DC]">
  {/* Hero section with gradient overlay if paper has image */}
  <div className="bg-[#2D4A3E] px-6 py-8 rounded-b-3xl">
    <button className="text-white mb-4">← Back</button>
    <h1 className="text-white text-2xl font-bold mb-2">{title}</h1>
    <p className="text-white/70 text-sm">{authors.join(', ')}</p>
  </div>
  
  {/* Main content card - overlapping hero */}
  <div className="px-4 -mt-4">
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Quick stats row - like "1km to centre / 2 guests / 10 days" */}
      <div className="flex justify-around py-4 border-b border-[#E5E5E5] mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-[#1A1A1A]">{year}</div>
          <div className="text-xs text-[#9B9B9B]">Published</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#1A1A1A]">{citations}</div>
          <div className="text-xs text-[#9B9B9B]">Citations</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#A3B852]">{score}/10</div>
          <div className="text-xs text-[#9B9B9B]">Score</div>
        </div>
      </div>
      
      {/* Analysis sections */}
      <div className="space-y-4">
        <Section title="Commercial Potential" content={commercialPotential} />
        <Section title="Key Innovation" content={keyInnovation} />
        <Section title="Target Industries" tags={industries} />
        <Section title="Limitations" content={limitations} />
      </div>
      
      {/* CTA */}
      <button className="w-full mt-6 bg-[#A3B852] text-white py-3 rounded-full font-medium hover:bg-[#8BA341] transition-colors">
        View Full Paper
      </button>
    </div>
  </div>
</div>
```

---

## Environment Variables

```env
# .env.local
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Build Order (Step by Step)

### Phase 1: Foundation
1. Initialize Next.js project with TypeScript and Tailwind
2. Set up Supabase project and run schema migrations
3. Configure environment variables
4. Set up the design system (colors, fonts, base components)
5. Create basic layout with header

### Phase 2: Data Layer
6. Build Semantic Scholar API client
7. Build OpenAlex API client
8. Build paper caching logic (save to Supabase)
9. Build OpenAI analysis function
10. Test data pipeline end-to-end via console

### Phase 3: API Routes
11. Create /api/search route
12. Create /api/paper/[id] route
13. Test API routes with curl/Postman

### Phase 4: UI
14. Build SearchBar component
15. Build DomainSelector component
16. Build homepage
17. Build PaperCard component
18. Build CommercialScore component
19. Build search results page
20. Build paper detail page
21. Build loading states

### Phase 5: Polish
22. Implement the cream background with white cards contrast
23. Fine-tune typography - DM Sans for headings, Inter for body
24. Add hover/active states on all interactive elements
25. Add subtle transitions (150-200ms ease)
26. Mobile responsive - stack elements, full-width cards
27. Error handling with styled error states
28. Empty states with olive green illustrations

### Phase 6: Testing & Deploy
27. Test full flow end-to-end
28. Deploy to Vercel
29. Test production deployment

---

## Sample Queries to Test

### Energy Storage
- "solid state battery electrolyte"
- "fast charging lithium ion"
- "sodium ion battery cathode"
- "supercapacitor high energy density"
- "battery recycling lithium recovery"

### Biodegradable Plastics
- "PLA mechanical properties improvement"
- "marine biodegradable packaging"
- "starch based bioplastic"
- "compostable food container"
- "algae based polymer film"

---

## Success Criteria for MVP

The MVP is complete when:
1. User can search for research in both domains
2. Results show with commercial scores and analysis
3. User can view detailed analysis for any paper
4. UI feels polished and paper-themed
5. Response time under 10 seconds for initial search
6. At least 10 relevant papers returned per reasonable query
7. Commercial analysis feels useful and actionable

---

## Notes for Claude Code

- Start with the data pipeline. Get papers flowing before touching UI.
- Use `fetch` with appropriate rate limiting (add delays between API calls)
- Cache aggressively — don't re-analyze papers you've already seen
- The OpenAI analysis is the expensive part. Consider running it async and showing papers immediately, then loading analysis.
- For the paper texture, a subtle CSS noise pattern works fine if you don't want to deal with images.
- Keep the UI simple. This is an MVP. Resist scope creep.
- If Semantic Scholar rate limits you, fall back to OpenAlex only.
