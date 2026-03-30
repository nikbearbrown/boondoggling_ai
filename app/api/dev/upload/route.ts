import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  // Auth check
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()

  const file = formData.get('file') as File | null
  const title = formData.get('title') as string | null
  const slug = formData.get('slug') as string | null
  const description = formData.get('description') as string | null
  const category = formData.get('category') as string | null
  const submitted_by = (formData.get('submitted_by') as string | null) || null
  const build_url = (formData.get('build_url') as string | null) || null

  if (!file || !title || !slug || !description || !category) {
    return NextResponse.json(
      { error: 'Missing required fields: file, title, slug, description, category' },
      { status: 400 },
    )
  }

  if (!['www', 'agents', 'games'].includes(category)) {
    return NextResponse.json(
      { error: 'Category must be www, agents, or games' },
      { status: 400 },
    )
  }

  // --- Validation 1: Content-type check ---
  const isHtmlType = file.type === 'text/html'
  const isOctetWithHtmlExt =
    file.type === 'application/octet-stream' && file.name.endsWith('.html')
  if (!isHtmlType && !isOctetWithHtmlExt) {
    return NextResponse.json({ error: 'File must be an HTML file' }, { status: 400 })
  }

  // --- Validation 2: Size check (500kb) ---
  if (file.size > 512000) {
    return NextResponse.json({ error: 'File too large (max 500kb)' }, { status: 400 })
  }

  // --- Validation 3: HTML signature check ---
  const buffer = await file.arrayBuffer()
  const head = new TextDecoder().decode(buffer.slice(0, 100)).toLowerCase()
  if (!head.includes('<!doctype') && !head.includes('<html')) {
    return NextResponse.json({ error: 'Invalid HTML file' }, { status: 400 })
  }

  // --- Validation 4: Slug format check ---
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug must be lowercase letters, numbers, and hyphens only' },
      { status: 400 },
    )
  }

  // --- Validation 5: Slug uniqueness check ---
  try {
    const existing = await sql`SELECT id FROM dev_docs WHERE slug = ${slug}`
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 })
    }
  } catch (error) {
    console.error('[dev/upload] Slug uniqueness check failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // --- Step A: Upload to Vercel Blob ---
  let blobUrl: string
  try {
    const blob = await put(`dev-docs/${slug}.html`, buffer, {
      contentType: 'text/html',
      access: 'public',
    })
    blobUrl = blob.url
  } catch (error) {
    console.error('[dev/upload] Blob upload failed:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  // --- Step B: INSERT into dev_docs ---
  try {
    const rows = await sql`
      INSERT INTO dev_docs (title, slug, description, blob_url, build_url, category, submitted_by, published, quality_signal)
      VALUES (${title}, ${slug}, ${description}, ${blobUrl}, ${build_url}, ${category}, ${submitted_by}, false, 'community')
      RETURNING id
    `
    return NextResponse.json(
      { id: rows[0].id, slug, blob_url: blobUrl },
      { status: 201 },
    )
  } catch (error) {
    console.error('[dev/upload] INSERT failed — orphaned blob:', {
      orphaned_blob_url: blobUrl,
      slug,
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(
      { error: 'Upload failed — please try again' },
      { status: 500 },
    )
  }
}
