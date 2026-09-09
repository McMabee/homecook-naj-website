import { useState, type FormEvent } from 'react'
import type { SiteSettings } from '../../types'
import { getSettings, saveSettings, normalizeHandle, instagramUrl } from '../../store/settings'
import { Field, Notice, Section, errorMessage, inputClass, primaryButtonClass } from './ui'

export default function SettingsPanel() {
  const [form, setForm] = useState<SiteSettings>(getSettings)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    const next: SiteSettings = {
      instagramHandle: normalizeHandle(form.instagramHandle),
      facebookUrl: form.facebookUrl.trim(),
    }
    if (!next.instagramHandle) {
      setError('Please enter an Instagram handle.')
      return
    }
    try {
      saveSettings(next)
      setForm(next)
      setError(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const previewHandle = normalizeHandle(form.instagramHandle) || 'yourhandle'

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <Section
        title="Social Links"
        description="Used by the footer, the contact page, and the Instagram section on the home page."
      >
        <div className="space-y-5">
          <Field label="Instagram handle" hint={`Links will open ${instagramUrl(previewHandle)}`}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-sm pointer-events-none">@</span>
              <input
                value={form.instagramHandle}
                onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })}
                placeholder="homecookingwithnaj"
                autoComplete="off"
                spellCheck={false}
                className={`${inputClass} pl-9`}
              />
            </div>
          </Field>
          <Field label="Facebook page URL">
            <input
              type="url"
              value={form.facebookUrl}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              placeholder="https://www.facebook.com/yourpage/"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {error && <Notice tone="error">{error}</Notice>}

      <button
        type="submit"
        className={`${primaryButtonClass} ${saved ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''}`}
      >
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </form>
  )
}
