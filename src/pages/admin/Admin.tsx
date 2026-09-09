import { useState, type FormEvent } from 'react'
import RecipesPanel from './RecipesPanel'
import InstagramPanel from './InstagramPanel'
import SettingsPanel from './SettingsPanel'
import { Field, inputClass, primaryButtonClass } from './ui'

// Set VITE_ADMIN_PASSWORD in .env. This is bundled client-side, so it only deters casual visitors.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

type Tab = 'recipes' | 'instagram' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'recipes', label: 'Recipes' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'settings', label: 'Settings' },
]

interface AdminProps {
  /** Leave the admin and return to the public site. */
  onExit: () => void
}

export default function Admin({ onExit }: AdminProps) {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('recipes')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const login = (e: FormEvent) => {
    e.preventDefault()
    if (ADMIN_PASSWORD && pw === ADMIN_PASSWORD) {
      setPwError(false)
      setPw('')
      setAuthed(true)
    } else {
      setPwError(true)
    }
  }

  const backToSite = (
    <button
      onClick={onExit}
      className="inline-flex items-center gap-2 text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.25em] uppercase"
    >
      <span aria-hidden>←</span> Back to site
    </button>
  )

  /* ── Login ──────────────────────────────────────────────────────── */
  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">{backToSite}</div>
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.4em] text-xs uppercase mb-4">Admin Access</p>
            <h1 className="font-display text-4xl italic text-cream">Site Manager</h1>
          </div>
          <form onSubmit={login} className="border border-gold/20 p-8 space-y-6">
            <div>
              <Field label="Password">
                <input
                  type="password"
                  value={pw}
                  onChange={(e) => {
                    setPw(e.target.value)
                    setPwError(false)
                  }}
                  autoFocus
                  placeholder="Enter admin password"
                  className={`${inputClass} ${pwError ? 'border-red-500/60' : ''}`}
                />
              </Field>
              {pwError && <p className="text-red-400/80 text-xs mt-2">Incorrect password. Please try again.</p>}
            </div>
            <button type="submit" disabled={!ADMIN_PASSWORD} className={`${primaryButtonClass} w-full`}>
              Enter
            </button>
          </form>
          {!ADMIN_PASSWORD && (
            <p className="text-center text-cream-muted/40 text-xs mt-6 tracking-wider leading-relaxed">
              Admin access isn't set up yet. Add VITE_ADMIN_PASSWORD to your .env file and restart the dev server.
            </p>
          )}
        </div>
      </main>
    )
  }

  /* ── Panel ──────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          {backToSite}
          <button
            onClick={() => setAuthed(false)}
            className="text-cream-muted/60 hover:text-gold transition-colors text-xs tracking-[0.25em] uppercase"
          >
            Log out
          </button>
        </div>

        <div className="mb-8">
          <p className="text-gold tracking-[0.4em] text-xs uppercase mb-2">Admin Panel</p>
          <h1 className="font-display text-4xl italic text-cream">Home Cooking with Naj</h1>
        </div>

        <nav aria-label="Admin sections" className="flex gap-1 border-b border-gold/10 mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={`px-5 py-3 text-xs tracking-[0.25em] uppercase transition-colors border-b-2 -mb-px ${
                tab === t.id ? 'border-gold text-gold' : 'border-transparent text-cream-muted hover:text-gold'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <p className="text-cream-muted/40 text-xs leading-relaxed mb-10 border border-gold/10 px-4 py-3">
          Heads up: changes made here are saved in this browser only. Until the site has a backend, visitors won't see
          them.
        </p>

        {tab === 'recipes' && <RecipesPanel />}
        {tab === 'instagram' && <InstagramPanel />}
        {tab === 'settings' && <SettingsPanel />}
      </div>
    </main>
  )
}
