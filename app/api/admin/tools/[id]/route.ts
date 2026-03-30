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
    const existing = await sql`SELECT * FROM tools WHERE id = ${id}`
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const current = existing[0]

    const name = body.name ?? current.name
    const slug = body.slug ?? current.slug
    const description = body.description !== undefined ? (body.description || null) : current.description
    const tool_type = body.tool_type ?? current.tool_type
    const claude_url = body.claude_url !== undefined ? (body.claude_url || null) : current.claude_url
    const artifact_id = body.artifact_id !== undefined ? (body.artifact_id || null) : current.artifact_id
    const artifact_embed_code = body.artifact_embed_code !== undefined ? (body.artifact_embed_code || null) : current.artifact_embed_code
    const tags = body.tags !== undefined ? (body.tags || []) : (current.tags || [])
    const prompt_text = body.prompt_text !== undefined ? (body.prompt_text || null) : current.prompt_text
    const quality_signal = body.quality_signal ?? current.quality_signal
    const version = body.version ?? current.version
    const published = body.published !== undefined ? body.published : current.published

    if (tool_type === 'prompt' && !prompt_text?.trim()) {
      return NextResponse.json({ error: 'prompt_text is required for prompt-type tools' }, { status: 400 })
    }

    const rows = await sql`
      UPDATE tools SET
        name = ${name}, slug = ${slug}, description = ${description},
        tool_type = ${tool_type}, claude_url = ${claude_url},
        artifact_id = ${artifact_id}, artifact_embed_code = ${artifact_embed_code},
        tags = ${tags}, prompt_text = ${prompt_text}, quality_signal = ${quality_signal},
        version = ${version}, published = ${published}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
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
    await sql`DELETE FROM tools WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
