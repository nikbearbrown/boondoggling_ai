import Link from 'next/link'
import { join } from 'path'
import { sql } from '@/lib/db'
import { scanDevDocs } from '@/lib/html-meta'

export const dynamic = 'force-dynamic'

function DocNotFound() {
  return (
    <div className="container px-4 md:px-6 mx-auto py-24">
      <div className="max-w-lg mx-auto text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tighter">Document Not Found</h1>
        <p className="text-muted-foreground">
          This document could not be loaded. If you submitted this document, please contact us.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/dev"
            className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            &larr; Back to Docs
          </Link>
          <a
            href="mailto:bear@bearbrown.co"
            className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium bg-black text-white shadow hover:bg-gray-800 dark:border dark:border-input dark:bg-background dark:text-foreground dark:shadow-sm dark:hover:bg-accent dark:hover:text-accent-foreground transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugStr = slug.join('/')

  // Check filesystem
  const fsDocs = scanDevDocs(join(process.cwd(), 'public', 'dev'))
  const fsDoc = fsDocs.find(d => d.slug === slugStr)
  if (fsDoc) {
    return {
      title: `${fsDoc.title} - Dev Docs`,
      description: fsDoc.description || fsDoc.title,
    }
  }

  // Check DB
  try {
    const rows = await sql`SELECT title, description FROM dev_docs WHERE slug = ${slugStr} AND published = true`
    if (rows.length > 0) {
      return {
        title: `${rows[0].title} - Dev Docs`,
        description: rows[0].description || rows[0].title,
      }
    }
  } catch {}

  return { title: 'Dev Docs - Boondoggling.ai' }
}

export default async function DevDocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugStr = slug.join('/')

  // 1. Check filesystem docs first
  const fsDocs = scanDevDocs(join(process.cwd(), 'public', 'dev'))
  const fsDoc = fsDocs.find(d => d.slug === slugStr)

  if (fsDoc) {
    return (
      <div className="flex flex-col w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="w-full border-b bg-background">
          <div className="container px-4 md:px-6 mx-auto py-4">
            <Link
              href="/dev"
              className="text-sm text-muted-foreground hover:text-foreground mb-1 inline-block"
            >
              &larr; Back to Docs
            </Link>
            <h1 className="text-2xl font-bold tracking-tighter">{fsDoc.title}</h1>
            {fsDoc.description && (
              <p className="text-sm text-muted-foreground mt-1">{fsDoc.description}</p>
            )}
          </div>
        </div>
        <div className="flex-1 w-full">
          <iframe
            src={fsDoc.path}
            title={fsDoc.title}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            width="100%"
            className="border-none"
            style={{ minHeight: 'calc(100vh - 12rem)', width: '100%', border: 'none' }}
          />
        </div>
      </div>
    )
  }

  // 2. Check DB docs
  let dbDoc: { title: string; description: string | null; blob_url: string; build_url: string | null } | null = null
  try {
    const rows = await sql`
      SELECT title, description, blob_url, build_url
      FROM dev_docs
      WHERE slug = ${slugStr} AND published = true
    `
    if (rows.length > 0) {
      dbDoc = rows[0] as typeof dbDoc
    }
  } catch {}

  if (!dbDoc) {
    return <DocNotFound />
  }

  // 3. Verify blob URL is reachable (HEAD request)
  let blobReachable = true
  try {
    const res = await fetch(dbDoc.blob_url, { method: 'HEAD' })
    if (res.status === 404 || res.status >= 500) {
      blobReachable = false
    }
  } catch {
    blobReachable = false
  }

  if (!blobReachable) {
    return <DocNotFound />
  }

  return (
    <div className="flex flex-col w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      <div className="w-full border-b bg-background">
        <div className="container px-4 md:px-6 mx-auto py-4 flex items-center justify-between">
          <div>
            <Link
              href="/dev"
              className="text-sm text-muted-foreground hover:text-foreground mb-1 inline-block"
            >
              &larr; Back to Docs
            </Link>
            <h1 className="text-2xl font-bold tracking-tighter">{dbDoc.title}</h1>
            {dbDoc.description && (
              <p className="text-sm text-muted-foreground mt-1">{dbDoc.description}</p>
            )}
          </div>
          {dbDoc.build_url && (
            <a
              href={dbDoc.build_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium bg-black text-white shadow hover:bg-gray-800 dark:border dark:border-input dark:bg-background dark:text-foreground dark:shadow-sm dark:hover:bg-accent dark:hover:text-accent-foreground transition-colors"
            >
              Live Build &rarr;
            </a>
          )}
        </div>
      </div>
      <div className="flex-1 w-full">
        <iframe
          src={dbDoc.blob_url}
          title={dbDoc.title}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          width="100%"
          className="border-none"
          style={{ minHeight: 'calc(100vh - 12rem)', width: '100%', border: 'none' }}
        />
      </div>
    </div>
  )
}
