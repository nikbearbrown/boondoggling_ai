# CLAUDE.md — Boondoggling.ai

> **Boondoggling.ai** — AI tools, content, and resources. An open-source platform from Bear Brown & Company.

## Who this site is for
Boondoggling.ai is a hub for interactive AI tools, educational content, dev documentation, and curated resources.

Primary audiences:
- Developers building with AI who need structured references and docs
- Educators deploying AI in classroom and workshop settings
- Creators using AI tools in creative and editorial workflows
- General public interested in practical AI tools and resources

Brand voice: Clear, direct, practical. No hype, no jargon for its own sake.

## Tech stack
- Next.js 15 (App Router)
- React 19
- Deployed on Vercel
- Tailwind CSS + @tailwindcss/typography (for prose article rendering)
- TypeScript (strict mode)
- next-themes for dark/light mode
- Vercel Blob (@vercel/blob) for image uploads
- Neon (serverless PostgreSQL via @neondatabase/serverless)
- Tiptap (ProseMirror-based rich text editor for blog)
- D3.js (data visualizations embedded in blog posts)
- Recharts (chart components)
- adm-zip (server-side Substack ZIP parsing)
- YouTube Data API v3 (video import)

## Author
**Nik Bear Brown**, Bear Brown & Company.

## Site structure
1. `/` — Home (platform intro + section overview + audiences + CTA + contact)
2. `/about` — About page (what the platform offers, author, contact)
3. `/tools` — Tools directory (card grid, hybrid filesystem + Neon)
4. `/tools/[slug]` — Artifact tool embed page (full-viewport iframe)
5. `/dev` — Dev docs browser (searchable card grid, filesystem-driven)
6. `/dev/[slug]` — Full-viewport iframe of a dev doc HTML file
7. `/notes` — Notes browser (searchable card grid, grouped by folder, filesystem-driven)
8. `/notes/[...slug]` — Full-viewport iframe of a note HTML file
9. `/books` — Books browser (searchable card grid, filesystem-driven via `book.json`)
10. `/books/[slug]` — Book detail page with metadata and TOC
11. `/books/[slug]/[...chapter]` — Full-viewport iframe of a book chapter
12. `/blog` — Blog feed: published posts newest first
13. `/blog/[slug]` — Individual blog post with prose content
14. `/videos` — Video directory with pagination and tag filtering
15. `/substack` — Newsletter hub: card grid of all Substack sections
16. `/substack/[section]` — Section page with article list
17. `/substack/[section]/[slug]` — Full article with attribution
18. `/privacy` — Privacy Policy
19. `/privacy/cookies` — Cookie Policy
20. `/terms-of-service` — Terms of Service
21. `/admin/login` — Admin login page (password form)
22. `/admin/dashboard` — Admin dashboard (protected via middleware + `admin_session` cookie)
23. `/admin/dashboard/blog` — Manage blog posts (list, create, edit, delete, bulk ops, import/export)
24. `/admin/dashboard/blog/new` — New post editor
25. `/admin/dashboard/blog/[id]/edit` — Edit existing post
26. `/admin/dashboard/blog/import` — Import posts (Substack ZIP or blog export ZIP)
27. `/admin/dashboard/tools` — Manage tools (link and artifact types)
28. `/admin/dashboard/substack` — Manage Substack sections & import ZIP archives
29. `/admin/dashboard/notes` — Notes sync management
30. `/admin/dashboard/videos` — Video management (CRUD, YouTube import, bulk ops)
31. `/admin/dashboard/dev` — Dev docs sync management

## Persistent layout (every page)

### Header (`/components/Header/Header.tsx`)
- Logo: text-based "Boondoggling.ai" in bold tracking-tighter
- Nav: Blog, Books, Dev, Notes, Tools, Videos
- Social buttons: GitHub, Substack, YouTube, Spotify
- Dark/light mode toggle (ThemeToggle component)
- Mobile hamburger menu with backdrop (lg breakpoint)
- Sticky, z-50, backdrop-blur

### Footer (`/components/Footer/Footer.tsx`)
Four-column grid layout:
- **Company Info:** Boondoggling.ai, 30 N Gould St Ste N, Sheridan, WY 82801, bear@bearbrown.co
- **Platform:** Tools, Blog, About
- **Connect:** GitHub, Substack, Bear Brown & Co, YouTube, Spotify
- **Legal:** Privacy Policy, Cookie Policy, Terms of Service
- Bottom bar: copyright + MIT License + attribution links

### Root layout (`/app/layout.tsx`)
- ThemeProvider: defaultTheme="light", enableSystem
- Inter font
- Header + main + Footer
- Vercel Analytics
- Optional Google Analytics (via NEXT_PUBLIC_GA_ID)

## Tools system

### Database (`tools` table in Neon PostgreSQL)
```sql
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tool_type TEXT DEFAULT 'link',  -- 'link' | 'artifact'
  claude_url TEXT,
  chatgpt_url TEXT,
  artifact_id TEXT,
  artifact_embed_code TEXT,
  tags TEXT[],
  prompt_text TEXT,
  quality_signal TEXT DEFAULT 'community',
  version TEXT DEFAULT '1.0',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tool types
- **link** — External URL tool (database-driven). Card clicks open URL in new tab.
- **artifact** — HTML file in `public/artifacts/` (filesystem-driven). Card clicks go to `/tools/[slug]` which renders the file in a full-viewport iframe.

### Adding a new artifact tool
1. Build the HTML file with `<title>`, `<meta name="description">`, and `<meta name="keywords">` tags
2. Drop into `public/artifacts/`
3. Push to main — Vercel deploys and it appears on `/tools` automatically

### Custom filter tags
- `public/artifacts/filters.json` — curated tag list for the tools page filter bar

## Notes system

### Structure
Notes are organized into subdirectories under `public/notes/`, each folder representing a collection.

### Adding new notes
1. Create or choose a folder under `public/notes/`
2. Build the HTML file with `<title>`, `<meta name="description">`, and `<meta name="keywords">` tags
3. Drop into the appropriate folder — appears automatically

## Books system

### Structure
Books are organized into subdirectories under `public/books/`, one folder per book. Each contains:
- `book.json` — Metadata (title, subtitle, authors, publisher, ISBN, ASIN, series, description, keywords, categories, cover, amazonUrl, relatedCourse, license, parts with chapters)
- `*.html` — Chapter files with standard meta tags
- Optional `cover.jpg`

### Adding a new book
1. Create a folder under `public/books/`
2. Add a `book.json` with metadata
3. Add chapter HTML files — appears automatically

## Dev Docs system

### Database (`dev_docs` table in Neon PostgreSQL)
```sql
CREATE TABLE IF NOT EXISTS dev_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  blob_url TEXT NOT NULL,
  build_url TEXT,
  quality_signal TEXT DEFAULT 'community',
  category TEXT,
  methodology TEXT,
  submitted_by TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Adding new dev docs (filesystem)
1. Build the HTML doc with `<title>`, `<meta name="description">`, and `<meta name="keywords">` tags
2. Drop into `public/dev/` — appears automatically

### Migrations
- `scripts/migration-001-dev-docs-and-columns.sql` — creates dev_docs table, adds tools columns, videos blob_url + CHECK constraint, RLS policies

## Blog system

### Database (`blog_posts` table in Neon PostgreSQL)
```sql
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  byline TEXT,
  cover_image TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### API routes
- `GET/POST /api/admin/blog` — admin: list all / create post
- `GET/PUT/DELETE /api/admin/blog/[id]` — admin: get / update / delete
- `GET /api/blog` — public: list published posts
- `GET /api/blog/[slug]` — public: single published post
- `POST /api/admin/blog/import-substack` — import Substack ZIP as drafts
- `POST /api/admin/blog/import-json` — import blog export ZIP as drafts
- `GET /api/admin/blog/export?tags=a,b` — export matching posts as ZIP
- `POST /api/admin/upload` — upload image to Vercel Blob

### Blog Editor (`/components/BlogEditor/BlogEditor.tsx`)
Tiptap rich text editor with toolbar: Bold, Italic, Underline, Strikethrough, Code, H2, H3, Lists, Blockquote, Links, Images, YouTube embeds, D3 Viz placeholders. Preview mode with D3 hydration.

### Blog viz system
- `lib/viz/registry.ts` — maps `data-viz` names to lazy-loaded render functions
- `lib/viz/ai-adoption-bars.ts` — D3 horizontal bar chart
- `lib/viz/ai-ecosystem-graph.ts` — D3 force-directed graph
- `components/BlogVizHydrator/BlogVizHydrator.tsx` — hydrates `[data-viz]` elements

## Videos system

### Database (`videos` table in Neon PostgreSQL)
```sql
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT,
  blob_url TEXT,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT video_source_required CHECK (youtube_id IS NOT NULL OR blob_url IS NOT NULL)
);
```

### YouTube integration (`lib/youtube.ts`)
- `parseYouTubeInput(input)` — extract channel ID, playlist ID, or @handle from URLs
- `fetchChannelPlaylists(channelId)` — list all playlists for a channel
- `fetchYouTubeVideos(input)` — main entry point, returns videos ready for import

### API routes
- `GET/POST /api/admin/videos` — admin: list all / create video
- `PUT/DELETE /api/admin/videos/[id]` — admin: update / delete video
- `POST /api/admin/videos/import-youtube` — import from YouTube channel/playlist
- `POST /api/admin/videos/youtube-playlists` — browse channel playlists
- `POST /api/admin/videos/bulk-update` — bulk publish/unpublish by IDs or tag
- `POST /api/admin/videos/bulk-delete` — bulk delete by IDs or tag
- `GET /api/videos` — public: paginated videos with pinned + tag filter

### Admin UI (`/app/admin/dashboard/videos/page.tsx`)
- Video list with tag filter, bulk select, publish/unpublish/delete
- YouTube Import dialog (channel URL, @handle, playlist)
- Playlist Browser dialog (discover and import playlists)
- Create/Edit dialog with special tag quick-add buttons

## Substack import system

### Database (Neon PostgreSQL)
Two tables: `substack_sections` and `substack_articles`.

### ZIP parser (`lib/substack-parser.ts`)
Server-side parser using adm-zip. Reads `posts.csv` + HTML files from a Substack export ZIP.

### API routes (admin-protected)
- `GET/POST /api/admin/substack/sections` — list & create sections
- `PUT/DELETE /api/admin/substack/sections/[id]` — update & delete sections
- `POST /api/admin/substack/upload` — parse ZIP, upsert articles

## Theming (Boondoggling.ai palette)

The color palette lives in three places that must stay in sync:
- `lib/theme.ts` — TypeScript source of truth
- `public/theme.json` — machine-readable for doc generators
- `app/globals.css` — CSS variables (`--bb-1` through `--bb-8`)

### Current palette
| Var | Hex | Role |
|-----|-----|------|
| bb1 | #0D0D0D | soot black — primary text |
| bb2 | #4A4A4A | iron grey — primary accent |
| bb3 | #8B0000 | dried-ink red — danger/emphasis |
| bb4 | #8B7536 | cold brass — highlight/callout |
| bb5 | #2F2F2F | charcoal — secondary accent |
| bb6 | #6B6B5E | tarnished pewter — muted accent |
| bb7 | #9C9680 | aged ledger tan — borders |
| bb8 | #E8E0D0 | parchment — page background |

### To rebrand
1. Edit hex values in all three files
2. The entire site repaints — no component changes needed
3. WCAG AA contrast minimum for all text/background combinations

## Authentication & Middleware

- `middleware.ts` — protects `/admin/dashboard/*`, validates `admin_session` cookie via HMAC-SHA256
- `lib/admin-auth.ts` — `isAdmin()` helper, `generateSessionToken()`, constant-time comparison
- Login flow: POST password to `/api/admin/login` → sets httpOnly cookie (7-day expiry) → redirects to dashboard

## SEO
- `app/sitemap.ts` — dynamic sitemap: static pages + all dynamic routes from Neon
- `app/robots.ts` — allows all, disallows `/admin/` and `/api/`, points to sitemap

## Shared utilities
- `lib/utils.ts` — `cn()` class merger + `getReadingTime()`
- `lib/html-meta.ts` — `scanHtmlDir()` + `scanHtmlSubdirs()` for filesystem content
- `lib/book-meta.ts` — `scanBooks()` for book directory scanning
- `lib/db.ts` — Neon PostgreSQL client with lazy initialization via Proxy

## Environment variables
```
DATABASE_URL=                    # Neon PostgreSQL connection string
ADMIN_PASSWORD=                  # Password for /admin/login
NEXT_PUBLIC_SITE_URL=            # Base URL for sitemap/canonicals
BLOB_READ_WRITE_TOKEN=           # Vercel Blob token for image uploads
YOUTUBE_API_KEY=                 # YouTube Data API v3 key
NEXT_PUBLIC_GA_ID=               # Google Analytics (optional)
```

## Project structure (key paths)

```
app/
  page.tsx                          # Home
  about/page.tsx                    # About
  blog/page.tsx                     # Blog feed
  blog/BlogFeed.tsx                 # Client component: search + post cards
  blog/[slug]/page.tsx              # Individual blog post
  books/page.tsx                    # Books browser
  books/BooksBrowser.tsx            # Client component: search + card grid
  books/[slug]/page.tsx             # Book detail with TOC
  books/[slug]/[...chapter]/page.tsx # Chapter iframe viewer
  dev/page.tsx                      # Dev docs browser
  dev/DevBrowser.tsx                # Client component: search + tag filter
  dev/[slug]/page.tsx               # Dev doc iframe
  notes/page.tsx                    # Notes browser
  notes/NotesBrowser.tsx            # Client component: search + grouped cards
  notes/[...slug]/page.tsx          # Note iframe
  tools/[slug]/page.tsx             # Tool page
  videos/page.tsx                   # Videos page
  videos/VideosBrowser.tsx          # Client component: pagination + tag filter
  substack/page.tsx                 # Newsletter hub
  substack/[section]/page.tsx       # Section article list
  substack/[section]/[slug]/page.tsx # Full article
  privacy/page.tsx                  # Privacy Policy
  privacy/cookies/page.tsx          # Cookie Policy
  terms-of-service/page.tsx         # Terms of Service
  admin/dashboard/
    layout.tsx                      # Admin layout with tab nav
    page.tsx                        # Overview
    blog/page.tsx                   # Blog management
    blog/new/page.tsx               # New post editor
    blog/[id]/edit/page.tsx         # Edit post editor
    blog/import/page.tsx            # Import page
    tools/page.tsx                  # Tools manager
    substack/page.tsx               # Substack manager
    notes/page.tsx                  # Notes sync
    videos/page.tsx                 # Videos manager (YouTube import, bulk ops)
    dev/page.tsx                    # Dev docs sync
  api/admin/
    login/route.ts                  # POST: validate password, set session cookie
    blog/route.ts                   # GET/POST blog posts
    blog/[id]/route.ts              # GET/PUT/DELETE blog post
    blog/import-substack/route.ts   # POST: Substack ZIP → blog drafts
    blog/import-json/route.ts       # POST: blog export ZIP → blog drafts
    blog/export/route.ts            # GET: export posts as ZIP
    tools/route.ts                  # GET/POST tools
    tools/[id]/route.ts             # PUT/DELETE tool
    tools/sync-artifacts/route.ts   # POST: scan filesystem for artifacts
    videos/route.ts                 # GET/POST videos
    videos/[id]/route.ts            # PUT/DELETE video
    videos/import-youtube/route.ts  # POST: import from YouTube
    videos/youtube-playlists/route.ts # POST: browse channel playlists
    videos/bulk-update/route.ts     # POST: bulk publish/unpublish
    videos/bulk-delete/route.ts     # POST: bulk delete
    substack/sections/route.ts      # GET/POST sections
    substack/sections/[id]/route.ts # PUT/DELETE section
    substack/upload/route.ts        # POST ZIP import
    notes/sync/route.ts             # POST: sync notes
    dev/sync/route.ts               # POST: sync dev docs
    upload/route.ts                 # POST: image upload to Vercel Blob
  api/blog/route.ts                 # GET published posts (public)
  api/blog/[slug]/route.ts          # GET single post (public)
  api/videos/route.ts               # GET videos (public, paginated)
  sitemap.ts                        # Dynamic sitemap generator
  robots.ts                         # Robots.txt generator
middleware.ts                       # Auth middleware
components/
  Header/Header.tsx                 # Sticky header
  Footer/Footer.tsx                 # 4-column footer
  BlogEditor/BlogEditor.tsx         # Tiptap rich text editor
  BlogVizHydrator/BlogVizHydrator.tsx # D3 viz hydration
  ThemeToggle.tsx                   # Dark/light toggle
  theme-provider.tsx                # next-themes wrapper
  ui/                               # shadcn/ui components
lib/
  utils.ts                          # cn() + getReadingTime()
  html-meta.ts                      # HTML metadata scanner
  book-meta.ts                      # Book metadata scanner
  admin-auth.ts                     # Admin session auth
  substack-parser.ts                # Substack ZIP parser
  db.ts                             # Neon PostgreSQL client
  youtube.ts                        # YouTube API client
  theme.ts                          # Color palette definition
  viz/                              # D3 visualization renderers
```

## Deployment
- Push to main → auto-deploys to Vercel
- Domain: boondoggling.ai

## What NOT to do
- Do not use localStorage — use React state or sessionStorage
- Do not add analytics or tracking beyond what's already present
- Keep public nav to six items: Blog, Books, Dev, Notes, Tools, Videos
- Do not commit .env.local or credentials to git

## Standing Instructions

After every session, always:
1. Update CLAUDE.md to reflect any changes made
2. Commit and push all changes to main with a descriptive commit message

## License & Attribution

- **License:** MIT License, Copyright (c) 2026 Nik Bear Brown
- **Attribution links:** All pages include footer links to bearbrown.co and The Skepticism AI Substack
- **Persistence requirement:** This attribution must be preserved in all forks and deployments
