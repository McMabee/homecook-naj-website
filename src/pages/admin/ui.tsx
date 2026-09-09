import { useRef, useState, type ReactNode } from 'react'
import { fileToDataUrl } from '../../lib/image'

export const inputClass =
  'w-full bg-obsidian border border-cream/10 text-cream px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-cream/20'
export const labelClass = 'block text-[10px] tracking-[0.3em] uppercase text-gold mb-2'

export const primaryButtonClass =
  'bg-gold text-obsidian px-6 py-3 text-xs tracking-[0.25em] uppercase font-medium hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed'
export const ghostButtonClass =
  'border border-cream/10 text-cream-muted text-xs tracking-[0.25em] uppercase px-6 py-3 hover:border-gold hover:text-gold transition-colors'
export const outlineButtonClass =
  'text-xs tracking-widest uppercase text-gold border border-gold/30 px-4 py-2 hover:bg-gold hover:text-obsidian transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold'
export const dangerButtonClass =
  'text-xs tracking-widest uppercase text-cream-muted/40 border border-cream/10 px-4 py-2 hover:text-red-400 hover:border-red-500/30 transition-all duration-200'

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Something went wrong. Please try again.'
}

export function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <div className="border border-gold/10 p-8">
      <h2 className={`font-display text-xl italic text-gold ${description ? 'mb-2' : 'mb-6'}`}>{title}</h2>
      {description && <p className="text-cream-muted/60 text-sm leading-relaxed mb-6">{description}</p>}
      {children}
    </div>
  )
}

/** Label wrapped around a single control so clicking the label focuses it. */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {hint && <span className="block text-cream-muted/40 text-xs leading-relaxed mt-2">{hint}</span>}
    </label>
  )
}

export function Notice({ tone, children }: { tone: 'error' | 'success' | 'info'; children: ReactNode }) {
  const toneClass =
    tone === 'error'
      ? 'border-red-500/30 bg-red-500/5 text-red-300/90'
      : tone === 'success'
        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300/90'
        : 'border-gold/20 bg-gold/5 text-cream-muted'
  return (
    <p role={tone === 'error' ? 'alert' : undefined} className={`border text-sm px-5 py-4 leading-relaxed ${toneClass}`}>
      {children}
    </p>
  )
}

/** Image picker: paste a URL or upload a file (downscaled and stored as a data URL). */
export function ImageField({
  label = 'Photo',
  value,
  onChange,
}: {
  label?: string
  value: string
  onChange: (value: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isUpload = value.startsWith('data:')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      onChange(await fileToDataUrl(file))
    } catch {
      setError("Couldn't read that file. Try a JPG or PNG.")
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex gap-2">
        <input
          value={isUpload ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isUpload ? 'Uploaded photo (paste a URL to replace it)' : 'Paste an image URL, or upload a file'}
          className={`${inputClass} flex-1`}
        />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={outlineButtonClass}>
          {busy ? 'Reading…' : 'Upload'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="text-red-400/80 text-xs mt-2">{error}</p>}
      {value && (
        <div className="mt-3 flex items-start gap-4">
          <img
            key={value}
            src={value}
            alt=""
            className="h-32 w-48 object-cover opacity-80 bg-obsidian"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-cream-muted/50 hover:text-red-400 tracking-widest uppercase transition-colors"
          >
            Remove
          </button>
        </div>
      )}
      <p className="text-cream-muted/40 text-xs mt-2">Uploads are resized to 900px on the long edge before saving.</p>
    </div>
  )
}
