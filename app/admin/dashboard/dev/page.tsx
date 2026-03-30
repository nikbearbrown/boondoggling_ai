'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Upload, Trash2, Pencil, Eye, EyeOff, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'

interface DevDoc {
  id: string
  title: string
  slug: string
  description: string | null
  blob_url: string
  build_url: string | null
  quality_signal: string
  category: string | null
  methodology: string | null
  submitted_by: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

const CATEGORIES = ['www', 'agents', 'games']
const CATEGORY_LABELS: Record<string, string> = { www: 'WWW', agents: 'Agents', games: 'Games' }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function DevAdminPage() {
  const [drafts, setDrafts] = useState<DevDoc[]>([])
  const [published, setPublished] = useState<DevDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadSlug, setUploadSlug] = useState('')
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadCategory, setUploadCategory] = useState('www')
  const [uploadSubmittedBy, setUploadSubmittedBy] = useState('')
  const [uploadBuildUrl, setUploadBuildUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [slugManual, setSlugManual] = useState(false)

  // Publish inline form
  const [publishingId, setPublishingId] = useState<string | null>(null)
  const [publishQuality, setPublishQuality] = useState('community')
  const [publishBuildUrl, setPublishBuildUrl] = useState('')
  const [publishAuditNotes, setPublishAuditNotes] = useState('')
  const [publishSaving, setPublishSaving] = useState(false)

  // Edit inline form
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editQuality, setEditQuality] = useState('')
  const [editBuildUrl, setEditBuildUrl] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Section collapse
  const [draftsOpen, setDraftsOpen] = useState(true)
  const [publishedOpen, setPublishedOpen] = useState(true)

  function clearMessages() {
    setError('')
    setSuccess('')
  }

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/dev')
      if (!res.ok) throw new Error('Failed to load dev docs')
      const data = await res.json()
      setDrafts((data as DevDoc[]).filter(d => !d.published).sort((a, b) => b.created_at.localeCompare(a.created_at)))
      setPublished((data as DevDoc[]).filter(d => d.published).sort((a, b) => (b.published_at || b.created_at).localeCompare(a.published_at || a.created_at)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading docs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocs()
  }, [fetchDocs])

  // --- Upload ---

  function handleTitleChange(value: string) {
    setUploadTitle(value)
    if (!slugManual) {
      setUploadSlug(slugify(value))
    }
  }

  async function handleUpload() {
    if (!uploadFile || !uploadTitle || !uploadSlug || !uploadDesc || !uploadCategory) {
      setError('Please fill in all required fields and select a file')
      return
    }
    setUploading(true)
    clearMessages()
    try {
      const fd = new FormData()
      fd.append('file', uploadFile)
      fd.append('title', uploadTitle)
      fd.append('slug', uploadSlug)
      fd.append('description', uploadDesc)
      fd.append('category', uploadCategory)
      if (uploadSubmittedBy) fd.append('submitted_by', uploadSubmittedBy)
      if (uploadBuildUrl) fd.append('build_url', uploadBuildUrl)

      const res = await fetch('/api/dev/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setSuccess('Draft created')
      setUploadFile(null)
      setUploadTitle('')
      setUploadSlug('')
      setUploadDesc('')
      setUploadCategory('www')
      setUploadSubmittedBy('')
      setUploadBuildUrl('')
      setSlugManual(false)
      // Reset file input
      const fileInput = document.getElementById('dev-file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      fetchDocs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload error')
    } finally {
      setUploading(false)
    }
  }

  // --- Publish ---

  function openPublish(doc: DevDoc) {
    setPublishingId(doc.id)
    setPublishQuality('community')
    setPublishBuildUrl(doc.build_url || '')
    setPublishAuditNotes('')
    clearMessages()
  }

  async function confirmPublish(id: string) {
    setPublishSaving(true)
    clearMessages()
    try {
      const res = await fetch(`/api/admin/dev/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: true,
          quality_signal: publishQuality,
          build_url: publishBuildUrl || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')
      setSuccess('Document published')
      setPublishingId(null)
      fetchDocs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish error')
    } finally {
      setPublishSaving(false)
    }
  }

  // --- Decline (hard delete) ---

  async function declineDoc(id: string, title: string) {
    if (!confirm(`Decline and delete "${title}"? This removes the DB record. The Blob file must be cleaned up manually.`)) return
    clearMessages()
    try {
      const res = await fetch(`/api/admin/dev/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Delete failed')
      }
      setSuccess('Document declined and removed')
      fetchDocs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete error')
    }
  }

  // --- Unpublish ---

  async function unpublishDoc(id: string) {
    if (!confirm('Unpublish this document?')) return
    clearMessages()
    try {
      const res = await fetch(`/api/admin/dev/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: false }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Unpublish failed')
      }
      setSuccess('Document unpublished')
      fetchDocs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unpublish error')
    }
  }

  // --- Edit ---

  function openEdit(doc: DevDoc) {
    setEditingId(doc.id)
    setEditTitle(doc.title)
    setEditDesc(doc.description || '')
    setEditQuality(doc.quality_signal)
    setEditBuildUrl(doc.build_url || '')
    setEditCategory(doc.category || 'www')
    clearMessages()
  }

  async function saveEdit(id: string) {
    setEditSaving(true)
    clearMessages()
    try {
      const res = await fetch(`/api/admin/dev/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
          quality_signal: editQuality,
          build_url: editBuildUrl || null,
          category: editCategory,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSuccess('Document updated')
      setEditingId(null)
      fetchDocs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error')
    } finally {
      setEditSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tighter">Dev Docs</h2>
        <p className="text-sm text-muted-foreground">
          Upload, review, and publish developer documentation.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">{success}</div>
      )}

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Draft
          </CardTitle>
          <CardDescription>Upload an HTML file as a draft dev doc for review.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dev-file-input">HTML File</Label>
              <input
                id="dev-file-input"
                type="file"
                accept=".html"
                onChange={e => setUploadFile(e.target.files?.[0] || null)}
                className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-input file:bg-background file:text-sm file:font-medium file:cursor-pointer hover:file:bg-accent"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={uploadTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Musinique Build Guide"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={uploadSlug}
                onChange={e => { setSlugManual(true); setUploadSlug(e.target.value) }}
                placeholder="e.g. musinique-build-guide"
              />
              <p className="text-xs text-muted-foreground">Lowercase, numbers, hyphens only</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={uploadDesc}
              onChange={e => setUploadDesc(e.target.value)}
              placeholder="Brief description of the document"
              rows={2}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Submitted By (optional)</Label>
              <Input
                value={uploadSubmittedBy}
                onChange={e => setUploadSubmittedBy(e.target.value)}
                placeholder="e.g. bear@bearbrown.co"
              />
            </div>
            <div className="space-y-2">
              <Label>Build URL (optional)</Label>
              <Input
                value={uploadBuildUrl}
                onChange={e => setUploadBuildUrl(e.target.value)}
                placeholder="e.g. https://example.vercel.app"
              />
            </div>
          </div>
          <Button onClick={handleUpload} disabled={uploading} className="gap-2">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload Draft'}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          {/* Draft Queue */}
          <section>
            <button
              onClick={() => setDraftsOpen(!draftsOpen)}
              className="flex items-center gap-2 text-xl font-bold tracking-tighter mb-4 hover:text-foreground/80 transition-colors"
            >
              {draftsOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              Draft Queue ({drafts.length})
            </button>
            {draftsOpen && (
              drafts.length === 0 ? (
                <p className="text-muted-foreground text-sm">No drafts pending review.</p>
              ) : (
                <div className="grid gap-3">
                  {drafts.map(doc => (
                    <Card key={doc.id}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 py-4">
                        <div className="space-y-1 min-w-0 flex-1">
                          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                            {doc.title}
                            {doc.category && (
                              <Badge variant="secondary" className="text-xs">
                                {CATEGORY_LABELS[doc.category] || doc.category}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">Draft</Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-3 text-xs">
                            {doc.submitted_by && <span>by {doc.submitted_by}</span>}
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a href={doc.blob_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                          <Button size="sm" onClick={() => openPublish(doc)} className="gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            Publish
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => declineDoc(doc.id, doc.title)} className="gap-1">
                            <Trash2 className="h-3.5 w-3.5" />
                            Decline
                          </Button>
                        </div>
                      </CardHeader>

                      {/* Publish inline form */}
                      {publishingId === doc.id && (
                        <CardContent className="border-t pt-4 space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Quality Signal</Label>
                              <select
                                value={publishQuality}
                                onChange={e => setPublishQuality(e.target.value)}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                              >
                                <option value="community">Community</option>
                                <option value="featured">Featured</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Build URL (optional)</Label>
                              <Input
                                value={publishBuildUrl}
                                onChange={e => setPublishBuildUrl(e.target.value)}
                                placeholder="https://example.vercel.app"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Audit report (paste from Claude)</Label>
                            <Textarea
                              value={publishAuditNotes}
                              onChange={e => setPublishAuditNotes(e.target.value)}
                              placeholder="Paste your Doc Audit Prompt report here before publishing."
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => confirmPublish(doc.id)} disabled={publishSaving}>
                              {publishSaving ? 'Publishing...' : 'Confirm Publish'}
                            </Button>
                            <Button variant="outline" onClick={() => setPublishingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )
            )}
          </section>

          {/* Published Docs */}
          <section>
            <button
              onClick={() => setPublishedOpen(!publishedOpen)}
              className="flex items-center gap-2 text-xl font-bold tracking-tighter mb-4 hover:text-foreground/80 transition-colors"
            >
              {publishedOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              Published ({published.length})
            </button>
            {publishedOpen && (
              published.length === 0 ? (
                <p className="text-muted-foreground text-sm">No published docs yet.</p>
              ) : (
                <div className="grid gap-3">
                  {published.map(doc => (
                    <Card key={doc.id}>
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 py-4">
                        <div className="space-y-1 min-w-0 flex-1">
                          <CardTitle className="text-base flex items-center gap-2 flex-wrap">
                            {doc.title}
                            {doc.category && (
                              <Badge variant="secondary" className="text-xs">
                                {CATEGORY_LABELS[doc.category] || doc.category}
                              </Badge>
                            )}
                            {doc.methodology === 'gru' && (
                              <Badge variant="default" className="text-xs bg-[var(--bb-4)] text-white">
                                Built with Gru
                              </Badge>
                            )}
                            <Badge
                              variant={doc.quality_signal === 'featured' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {doc.quality_signal === 'featured' ? 'Featured' : 'Community'}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-3 text-xs">
                            {doc.published_at && <span>Published {new Date(doc.published_at).toLocaleDateString()}</span>}
                            {doc.build_url && (
                              <a
                                href={doc.build_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Live Build &rarr;
                              </a>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <a href={doc.blob_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                          <Button variant="outline" size="sm" onClick={() => openEdit(doc)} className="gap-1">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => unpublishDoc(doc.id)} className="gap-1">
                            <EyeOff className="h-3.5 w-3.5" />
                            Unpublish
                          </Button>
                        </div>
                      </CardHeader>

                      {/* Edit inline form */}
                      {editingId === doc.id && (
                        <CardContent className="border-t pt-4 space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Title</Label>
                              <Input
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Category</Label>
                              <select
                                value={editCategory}
                                onChange={e => setEditCategory(e.target.value)}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                              >
                                {CATEGORIES.map(c => (
                                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                              value={editDesc}
                              onChange={e => setEditDesc(e.target.value)}
                              rows={2}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label>Quality Signal</Label>
                              <select
                                value={editQuality}
                                onChange={e => setEditQuality(e.target.value)}
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                              >
                                <option value="community">Community</option>
                                <option value="featured">Featured</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label>Build URL</Label>
                              <Input
                                value={editBuildUrl}
                                onChange={e => setEditBuildUrl(e.target.value)}
                                placeholder="https://example.vercel.app"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => saveEdit(doc.id)} disabled={editSaving}>
                              {editSaving ? 'Saving...' : 'Save'}
                            </Button>
                            <Button variant="outline" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )
            )}
          </section>
        </>
      )}
    </div>
  )
}
