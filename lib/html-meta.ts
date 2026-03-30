import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'

export interface HtmlDocMeta {
  slug: string
  filename: string
  title: string
  description: string
  tags: string[]
}

export interface GroupedHtmlDocs {
  folder: string
  folderTitle: string
  docs: HtmlDocMeta[]
}

function extractTag(html: string, pattern: RegExp): string | null {
  const match = html.match(pattern)
  return match ? match[1].trim() : null
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function scanHtmlDir(dir: string): HtmlDocMeta[] {
  let files: string[]
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.html')).sort()
  } catch {
    return []
  }

  return files.map(filename => {
    const slug = filename.replace('.html', '')
    let title = titleCase(slug)
    let description = ''
    let tags: string[] = []

    try {
      const html = readFileSync(join(dir, filename), 'utf-8')
      const t = extractTag(html, /<title[^>]*>([^<]+)<\/title>/i)
      if (t) title = t
      const d = extractTag(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
        ?? extractTag(html, /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)
      if (d) description = d
      const k = extractTag(html, /<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i)
        ?? extractTag(html, /<meta\s+content=["']([^"']+)["']\s+name=["']keywords["']/i)
      if (k) tags = k.split(',').map(t => t.trim()).filter(Boolean)
    } catch {}

    return { slug, filename, title, description, tags }
  })
}

export function scanHtmlSubdirs(dir: string): GroupedHtmlDocs[] {
  let entries: string[]
  try {
    entries = readdirSync(dir).sort()
  } catch {
    return []
  }

  const groups: GroupedHtmlDocs[] = []

  for (const entry of entries) {
    const fullPath = join(dir, entry)
    try {
      if (!statSync(fullPath).isDirectory()) continue
    } catch {
      continue
    }

    const docs = scanHtmlDir(fullPath).map(doc => ({
      ...doc,
      slug: `${entry}/${doc.slug}`,
    }))

    if (docs.length > 0) {
      groups.push({
        folder: entry,
        folderTitle: titleCase(entry),
        docs: docs.sort((a, b) => a.title.localeCompare(b.title)),
      })
    }
  }

  return groups
}

export interface DevDocMeta {
  title: string
  description: string
  slug: string
  path: string
  category: string
  methodology: string | null
  source: 'filesystem'
}

/**
 * Scan /public/dev/ for dev docs organized by category subdirectories.
 *
 * Expected structure:
 *   public/dev/WWW/          → category 'www'
 *   public/dev/WWW/gru/      → category 'www', methodology 'gru'
 *   public/dev/Agents/       → category 'agents'
 *   public/dev/Agents/gru/   → category 'agents', methodology 'gru'
 *   public/dev/Games/        → category 'games'
 *   ...
 *
 * Handles missing subdirectories gracefully. Callable at build time.
 */
export function scanDevDocs(dir: string): DevDocMeta[] {
  let entries: string[]
  try {
    entries = readdirSync(dir).sort()
  } catch {
    return []
  }

  const results: DevDocMeta[] = []

  for (const entry of entries) {
    const categoryDir = join(dir, entry)
    try {
      if (!statSync(categoryDir).isDirectory()) continue
    } catch {
      continue
    }

    const category = entry.toLowerCase()

    // Scan HTML files directly in the category directory (non-Gru)
    const categoryFiles = scanHtmlFilesFlat(categoryDir)
    for (const file of categoryFiles) {
      const fileSlug = file.filename.replace('.html', '').toLowerCase()
      results.push({
        title: file.title,
        description: file.description,
        slug: `${category}/${fileSlug}`,
        path: `/dev/${entry}/${file.filename}`,
        category,
        methodology: null,
        source: 'filesystem',
      })
    }

    // Scan gru/ subdirectory if it exists
    const gruDir = join(categoryDir, 'gru')
    if (existsSync(gruDir)) {
      try {
        if (statSync(gruDir).isDirectory()) {
          const gruFiles = scanHtmlFilesFlat(gruDir)
          for (const file of gruFiles) {
            const fileSlug = file.filename.replace('.html', '').toLowerCase()
            results.push({
              title: file.title,
              description: file.description,
              slug: `${category}/gru/${fileSlug}`,
              path: `/dev/${entry}/gru/${file.filename}`,
              category,
              methodology: 'gru',
              source: 'filesystem',
            })
          }
        }
      } catch {}
    }
  }

  return results
}

/** Scan a single directory for HTML files and extract metadata. */
function scanHtmlFilesFlat(dir: string): { filename: string; title: string; description: string }[] {
  let files: string[]
  try {
    files = readdirSync(dir).filter(f => f.endsWith('.html')).sort()
  } catch {
    return []
  }

  return files.map(filename => {
    let title = titleCase(filename.replace('.html', ''))
    let description = ''

    try {
      const html = readFileSync(join(dir, filename), 'utf-8')
      const t = extractTag(html, /<title[^>]*>([^<]+)<\/title>/i)
      if (t) title = t
      const d = extractTag(html, /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
        ?? extractTag(html, /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i)
      if (d) description = d
    } catch {}

    return { filename, title, description }
  })
}
