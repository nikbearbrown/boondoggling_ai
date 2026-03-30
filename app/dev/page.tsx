import { join } from 'path'
import type { Metadata } from 'next'
import { sql } from '@/lib/db'
import { scanDevDocs } from '@/lib/html-meta'
import DevBrowser from './DevBrowser'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Dev Docs - Boondoggling.ai',
  description: 'Developer documentation, guides, and reference materials.',
}

interface DevDoc {
  title: string
  description: string
  slug: string
  path: string
  category: string
  methodology: string | null
  quality_signal: string
  build_url: string | null
  source: 'filesystem' | 'db'
}

export default async function DevPage() {
  // 1. Filesystem docs
  const fsDocs = scanDevDocs(join(process.cwd(), 'public', 'dev'))
  const filesystemDocs: DevDoc[] = fsDocs.map(doc => ({
    title: doc.title,
    description: doc.description,
    slug: doc.slug,
    path: doc.path,
    category: doc.category,
    methodology: doc.methodology,
    quality_signal: 'featured',
    build_url: null,
    source: 'filesystem',
  }))

  // 2. DB docs (published only)
  let dbDocs: DevDoc[] = []
  try {
    const rows = await sql`
      SELECT title, description, slug, blob_url, category, methodology,
             quality_signal, build_url, published_at
      FROM dev_docs
      WHERE published = true
      ORDER BY published_at DESC NULLS LAST
    `
    dbDocs = rows.map(r => ({
      title: r.title,
      description: r.description || '',
      slug: r.slug,
      path: r.blob_url,
      category: (r.category || '').toLowerCase(),
      methodology: r.methodology || null,
      quality_signal: r.quality_signal || 'community',
      build_url: r.build_url || null,
      source: 'db' as const,
    }))
  } catch (err) {
    console.error('[dev/page] Failed to fetch DB docs:', err)
  }

  // 3. Merge, deduplicate by slug (filesystem wins)
  const slugSet = new Set(filesystemDocs.map(d => d.slug))
  const uniqueDbDocs = dbDocs.filter(d => !slugSet.has(d.slug))
  const allDocs = [...filesystemDocs, ...uniqueDbDocs]

  // 4. Sort: featured first, then by source (filesystem first), then alphabetical
  allDocs.sort((a, b) => {
    const aFeatured = a.quality_signal === 'featured' ? 0 : 1
    const bFeatured = b.quality_signal === 'featured' ? 0 : 1
    if (aFeatured !== bFeatured) return aFeatured - bFeatured
    return a.title.localeCompare(b.title)
  })

  return (
    <div className="container px-4 md:px-6 mx-auto py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">Dev Docs</h1>
        <p className="text-muted-foreground mb-10">
          Developer documentation, guides, and reference materials.
        </p>
        <DevBrowser docs={allDocs} />
      </div>
    </div>
  )
}
