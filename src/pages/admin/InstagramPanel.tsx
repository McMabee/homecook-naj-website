import { useState, type FormEvent } from 'react'
import type { InstagramPost } from '../../types'
import { getInstagramPosts, saveInstagramPosts } from '../../store/instagram'
import { useSettings } from '../../store/settings'
import {
  Field,
  ImageField,
  Notice,
  Section,
  errorMessage,
  inputClass,
  primaryButtonClass,
  ghostButtonClass,
  outlineButtonClass,
  dangerButtonClass,
} from './ui'

/** Keep in sync with MAX_TILES in components/InstagramFeed.tsx */
const MAX_TILES = 8
const INSTAGRAM_POST_URL = /^https?:\/\/(www\.)?instagram\.com\//i

interface PostForm {
  imageUrl: string
  postUrl: string
  caption: string
}

const EMPTY_FORM: PostForm = { imageUrl: '', postUrl: '', caption: '' }

export default function InstagramPanel() {
  const settings = useSettings()
  const [posts, setPosts] = useState<InstagramPost[]>(getInstagramPosts)
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [editing, setEditing] = useState<InstagramPost | null>(null)
  const [form, setForm] = useState<PostForm>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const persist = (next: InstagramPost[]): boolean => {
    try {
      saveInstagramPosts(next)
      setPosts(next)
      setError(null)
      return true
    } catch (err) {
      setError(errorMessage(err))
      return false
    }
  }

  const move = (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 0 || target >= posts.length) return
    const next = [...posts]
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    persist(next)
  }

  const openNew = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError(null)
    setMode('form')
  }

  const openEdit = (p: InstagramPost) => {
    setEditing(p)
    setForm({ imageUrl: p.imageUrl, postUrl: p.postUrl, caption: p.caption })
    setError(null)
    setMode('form')
  }

  const remove = (id: string) => {
    if (persist(posts.filter((p) => p.id !== id))) setDeleteConfirm(null)
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    const postUrl = form.postUrl.trim()
    if (!form.imageUrl) {
      setError('Add a photo first, either by uploading one or pasting an image URL.')
      return
    }
    if (postUrl && !INSTAGRAM_POST_URL.test(postUrl)) {
      setError('The post link should be an instagram.com address, for example https://www.instagram.com/p/ABC123/')
      return
    }
    const post: InstagramPost = {
      id: editing?.id ?? `ig-${Date.now()}`,
      imageUrl: form.imageUrl,
      postUrl,
      caption: form.caption.trim(),
    }
    const next = editing ? posts.map((p) => (p.id === post.id ? post : p)) : [post, ...posts]
    if (persist(next)) setMode('list')
  }

  /* ── List ─────────────────────────────────────────────────────── */
  if (mode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl italic text-cream">Instagram Tiles</h2>
            <p className="text-cream-muted/60 text-sm mt-1 leading-relaxed">
              Shown in the “Fresh from the Kitchen” section on the home page. The first {MAX_TILES} appear, in this
              order.
            </p>
          </div>
          <button onClick={openNew} className={primaryButtonClass}>
            + Add Tile
          </button>
        </div>

        {error && <Notice tone="error">{error}</Notice>}

        {posts.length === 0 ? (
          <div className="border border-gold/15 py-20 text-center">
            <p className="font-display text-2xl italic text-cream-muted">No tiles yet.</p>
            <p className="text-cream-muted/50 text-sm mt-2">The Instagram section is hidden until you add one.</p>
          </div>
        ) : (
          <div className="space-y-px bg-gold/10">
            {posts.map((p, i) => {
              const hidden = i >= MAX_TILES
              return (
                <div key={p.id} className={`bg-charcoal flex items-center gap-4 p-4 ${hidden ? 'opacity-50' : ''}`}>
                  <img src={p.imageUrl} alt="" className="w-16 h-16 object-cover shrink-0 bg-obsidian" />
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm truncate">
                      {p.caption || <span className="text-cream-muted/40 italic">No caption</span>}
                    </p>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-cream-muted/50 mt-1 truncate">
                      {p.postUrl ? p.postUrl.replace(/^https?:\/\/(www\.)?/, '') : `Links to @${settings.instagramHandle}`}
                      {hidden && ' · not shown (over the limit)'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className={`${outlineButtonClass} px-3`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === posts.length - 1}
                      aria-label="Move down"
                      className={`${outlineButtonClass} px-3`}
                    >
                      ↓
                    </button>
                    <button onClick={() => openEdit(p)} className={outlineButtonClass}>
                      Edit
                    </button>
                    {deleteConfirm === p.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => remove(p.id)}
                          className="text-xs tracking-widest uppercase text-red-400 border border-red-500/30 px-3 py-2 hover:bg-red-500/10 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-cream-muted border border-cream/10 px-3 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(p.id)} className={dangerButtonClass}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  /* ── Form ─────────────────────────────────────────────────────── */
  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl italic text-cream">{editing ? 'Edit Tile' : 'New Tile'}</h2>
        <button
          type="button"
          onClick={() => setMode('list')}
          className="text-cream-muted hover:text-gold transition-colors text-xs tracking-widest uppercase"
        >
          ← Back to tiles
        </button>
      </div>

      <Section title="Photo" description="Square photos look best. Save the image from the post, or upload any photo.">
        <ImageField value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
      </Section>

      <Section title="Details">
        <div className="space-y-5">
          <Field
            label="Instagram post link"
            hint="Open the post on Instagram, copy the address from the browser bar, and paste it here. Leave empty to link to the profile instead."
          >
            <input
              type="url"
              value={form.postUrl}
              onChange={(e) => setForm({ ...form, postUrl: e.target.value })}
              placeholder="https://www.instagram.com/p/..."
              className={inputClass}
            />
          </Field>
          <Field label="Caption" hint="A short line shown on hover. It also describes the photo for screen readers.">
            <input
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="e.g. Grazing table for a 40th birthday in Oakville"
              maxLength={140}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex gap-4">
        <button type="submit" className={`${primaryButtonClass} flex-1 py-4`}>
          {editing ? 'Save Changes' : 'Add Tile'}
        </button>
        <button type="button" onClick={() => setMode('list')} className={ghostButtonClass}>
          Cancel
        </button>
      </div>
    </form>
  )
}
