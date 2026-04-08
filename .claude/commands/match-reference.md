# match-reference

Compare this project against the canonical reference site at `/Users/bear/Documents/nikbearbrown_com` and produce a full feature gap analysis.

## What to do

1. **Scan this project's routes** — list all pages under `app/` (public routes + admin routes)
2. **Scan nikbearbrown_com's routes** — list all pages under `/Users/bear/Documents/nikbearbrown_com/app/`
3. **Scan this project's components** — list `components/` contents
4. **Scan nikbearbrown_com's components** — list `/Users/bear/Documents/nikbearbrown_com/components/`
5. **Scan this project's lib/** and **nikbearbrown_com's lib/**
6. **Scan this project's API routes** and **nikbearbrown_com's API routes**
7. **Check package.json of both** for dependency differences

## Output format

Produce a structured gap report with four sections:

### A. Routes present in nikbearbrown_com but MISSING here
For each missing route, note:
- Route path
- What it does (1 sentence)
- Porting complexity: Low / Medium / High

### B. Components present in nikbearbrown_com but MISSING here
Same format.

### C. API endpoints present in nikbearbrown_com but MISSING here
Same format.

### D. Dependencies in nikbearbrown_com but MISSING here
List package name + purpose.

### E. Routes/features present HERE but NOT in nikbearbrown_com
(Things this project has innovated beyond the reference)

## Context

- `nikbearbrown_com` is the canonical reference site — it has all mature functionality
- This project may want to selectively port features from the reference
- Both are Next.js 15 + React 19 + Tailwind + Neon PostgreSQL sites
- The reference site is at: `/Users/bear/Documents/nikbearbrown_com`
- Do NOT suggest porting content specific to Nik Bear Brown personally (bio, courses about his classes, etc.) — only reusable platform features

After the analysis, ask the user which features they want to port and offer to implement them.
