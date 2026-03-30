'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Search, X } from 'lucide-react'

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

const CATEGORY_LABELS: Record<string, string> = {
  www: 'WWW',
  agents: 'Agents',
  games: 'Games',
}

const CATEGORY_ORDER = ['www', 'agents', 'games']

export default function DevBrowser({ docs }: { docs: DevDoc[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return docs
    const q = query.toLowerCase()
    return docs.filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
    )
  }, [docs, query])

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, DevDoc[]>()
    for (const doc of filtered) {
      const cat = doc.category || 'other'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(doc)
    }

    // Sort categories: known order first, then alphabetical for unknown
    const entries = Array.from(map.entries())
    entries.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a[0])
      const bi = CATEGORY_ORDER.indexOf(b[0])
      const aIdx = ai >= 0 ? ai : 999
      const bIdx = bi >= 0 ? bi : 999
      if (aIdx !== bIdx) return aIdx - bIdx
      return a[0].localeCompare(b[0])
    })

    return entries
  }, [filtered])

  return (
    <>
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search docs..."
          className="w-full pl-10 pr-10 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Grouped cards */}
      {grouped.length === 0 ? (
        <p className="text-muted-foreground">
          {query ? 'No docs match your search.' : 'No docs yet.'}
        </p>
      ) : (
        <div className="space-y-12">
          {grouped.map(([category, categoryDocs]) => (
            <section key={category}>
              <h2 className="text-xl font-bold tracking-tighter mb-4">
                {CATEGORY_LABELS[category] || category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryDocs.map(doc => (
                  <Link key={doc.slug} href={`/dev/${doc.slug}`}>
                    <Card className="h-full hover:border-foreground/20 transition-colors cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                          {doc.title}
                        </CardTitle>
                        {doc.description && (
                          <CardDescription className="line-clamp-2">
                            {doc.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <Badge variant="secondary" className="text-[10px]">
                            {CATEGORY_LABELS[doc.category] || doc.category}
                          </Badge>
                          {doc.methodology === 'gru' && (
                            <Badge variant="default" className="text-[10px] bg-[var(--bb-4)] text-white">
                              Built with Gru
                            </Badge>
                          )}
                          <Badge
                            variant={doc.quality_signal === 'featured' ? 'default' : 'outline'}
                            className="text-[10px]"
                          >
                            {doc.quality_signal === 'featured' ? 'Featured' : 'Community'}
                          </Badge>
                          {doc.build_url && (
                            <a
                              href={doc.build_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-primary hover:underline ml-auto"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Live Build &rarr;
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
