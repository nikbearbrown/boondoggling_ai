import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { isAdmin } from '@/lib/admin-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  try {
    const existing = await sql`SELECT * FROM dev_docs WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const current = existing[0]

    const title = body.title ?? current.title
    const description = body.description !== undefined ? body.description : current.description
    const quality_signal = body.quality_signal ?? current.quality_signal
    const build_url = body.build_url !== undefined ? (body.build_url || null) : current.build_url
    const category = body.category ?? current.category
    const published = body.published !== undefined ? body.published : current.published

    let publishedAt = current.published_at
    if (published && !current.published_at) {
      publishedAt = new Date().toISOString()
    }

    const rows = await sql`
      UPDATE dev_docs SET
        title = ${title},
        description = ${description},
        quality_signal = ${quality_signal},
        build_url = ${build_url},
        category = ${category},
        published = ${published},
        published_at = ${publishedAt},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await sql`DELETE FROM dev_docs WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
