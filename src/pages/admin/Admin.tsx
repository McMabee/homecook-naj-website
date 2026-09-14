import { useState, type FormEvent, type ReactNode } from 'react'
import RecipesPanel from './RecipesPanel'
import InstagramPanel from './InstagramPanel'
import SettingsPanel from './SettingsPanel'
import { Field, Notice, inputClass, primaryButtonClass } from './ui'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useContent } from '../../store/content'
import type { AuthState } from '../../lib/auth'

type Tab = 'recipes' | 'instagram' | 'settings'

const TABS: { id: Tab; label: string }[] = [
  { id: 'recipes', label: 'Recipes' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'settings', label: 'Settings' },
]

interface AdminProps {
  auth: AuthState
  /** Leave the admin and return to the public site. */
  onExit: () => void
}

/**
 * The owner's admin. Access is a Supabase Auth login; the sign-in state here
 * only decides what to show, while the database and storage policies are what
 * actually stop anyone else from writing.
 */
export default function Admin({ auth, onExit }: AdminProps) {
  const [tab, setTab] = useState<Tab>('recipes')
  const content = useContent()

  const backToSite = (
    <button
      onClick={onExit}
      className="inline-flex items-center gap-2 text-cream-muted hover:text-gold transition-colors text-xs tracking-[0.25em] uppercase"
    >
      <span aria-hidden>←</span> Back to site
    </button>
  )

  if (!auth.ready) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <p className="text-cream-muted/60 text-xs tracking-[0.3em] uppercase">Loading…</p>
      </main>
    )
  }

  if (!auth.session) return <LoginScreen backToSite={backToSite} />

  if (auth.recovery) return <NewPasswordScreen backToSite={backToSite} onDone={auth.clearRecovery} />

  /* ── Panel ──────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-10">
          {backToSite}
          <div className="flex items-center gap-5 min-w-0">
            <span className="text-cream-muted/50 text-xs truncate">{auth.session.user.email}</span>
            <button
              onClick={() => void supabase?.auth.signOut()}
              className="text-cream-muted/60 hover:text-gold transition-colors text-xs tracking-[0.25em] uppercase shrink-0"
            >
              Log out
            </button>
          </div>
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
          Changes you save here are published to the live site straight away. There is no undo, so keep one admin tab
          open at a time.
        </p>

        {content.status === 'loading' ? (
          <p className="text-cream-muted/60 text-xs tracking-[0.3em] uppercase py-10 text-center">Loading content…</p>
        ) : content.status === 'error' ? (
          // The panels edit whole lists, so saving on top of fallback data would overwrite the live content.
          <div className="space-y-4">
            <Notice tone="error">
              The live content could not be loaded, so saving now could overwrite what visitors see. {content.error}
            </Notice>
            <button type="button" onClick={() => void content.refresh()} className={primaryButtonClass}>
              Try again
            </button>
          </div>
        ) : (
          <>
            {tab === 'recipes' && <RecipesPanel />}
            {tab === 'instagram' && <InstagramPanel />}
            {tab === 'settings' && <SettingsPanel />}
          </>
        )}
      </div>
    </main>
  )
}

/* ── Shared frame for the sign-in screens ─────────────────────────── */

function AuthFrame({ backToSite, title, children }: { backToSite: ReactNode; title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8">{backToSite}</div>
        <div className="text-center mb-10">
          <p className="text-gold tracking-[0.4em] text-xs uppercase mb-4">Admin Access</p>
          <h1 className="font-display text-4xl italic text-cream">{title}</h1>
        </div>
        {children}
      </div>
    </main>
  )
}

/* ── Login / forgot password ──────────────────────────────────────── */

function LoginScreen({ backToSite }: { backToSite: ReactNode }) {
  const [screen, setScreen] = useState<'login' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const signIn = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    setBusy(true)
    setError(null)
    setInfo(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) {
      setError(
        /invalid login credentials/i.test(error.message)
          ? 'Incorrect email or password. Please try again.'
          : error.message,
      )
    }
    // On success the auth listener in useAuth() picks up the session and this screen goes away.
  }

  const sendReset = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    setBusy(true)
    setError(null)
    setInfo(null)
    const redirectTo = `${window.location.origin}${window.location.pathname}`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
    setBusy(false)
    if (error) setError(error.message)
    else setInfo('If that address has an account, a reset link is on its way. Open it on this device to choose a new password.')
  }

  const switchScreen = (next: 'login' | 'reset') => {
    setScreen(next)
    setError(null)
    setInfo(null)
  }

  const emailField = (
    <Field label="Email">
      <input
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
        placeholder="you@example.com"
        className={inputClass}
      />
    </Field>
  )

  return (
    <AuthFrame backToSite={backToSite} title={screen === 'login' ? 'Site Manager' : 'Reset Password'}>
      {screen === 'login' ? (
        <form onSubmit={signIn} className="border border-gold/20 p-8 space-y-6">
          {emailField}
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`${inputClass} ${error ? 'border-red-500/60' : ''}`}
            />
          </Field>
          {error && <Notice tone="error">{error}</Notice>}
          <button type="submit" disabled={!isSupabaseConfigured || busy} className={`${primaryButtonClass} w-full`}>
            {busy ? 'Signing in…' : 'Enter'}
          </button>
          <button
            type="button"
            onClick={() => switchScreen('reset')}
            className="block w-full text-center text-cream-muted/50 hover:text-gold transition-colors text-xs tracking-wider"
          >
            Forgot your password?
          </button>
        </form>
      ) : (
        <form onSubmit={sendReset} className="border border-gold/20 p-8 space-y-6">
          <p className="text-cream-muted/60 text-sm leading-relaxed">
            Enter the email you sign in with and we will send a link to choose a new password.
          </p>
          {emailField}
          {error && <Notice tone="error">{error}</Notice>}
          {info && <Notice tone="success">{info}</Notice>}
          <button type="submit" disabled={!isSupabaseConfigured || busy} className={`${primaryButtonClass} w-full`}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
          <button
            type="button"
            onClick={() => switchScreen('login')}
            className="block w-full text-center text-cream-muted/50 hover:text-gold transition-colors text-xs tracking-wider"
          >
            Back to sign in
          </button>
        </form>
      )}
      {!isSupabaseConfigured && (
        <p className="text-center text-cream-muted/40 text-xs mt-6 tracking-wider leading-relaxed">
          Admin access isn't set up yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env.local file and
          restart the dev server.
        </p>
      )}
    </AuthFrame>
  )
}

/* ── Choose a new password after a reset link ─────────────────────── */

function NewPasswordScreen({ backToSite, onDone }: { backToSite: ReactNode; onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase || busy) return
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(error.message)
    else onDone()
  }

  return (
    <AuthFrame backToSite={backToSite} title="New Password">
      <form onSubmit={submit} className="border border-gold/20 p-8 space-y-6">
        <Field label="New password">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className={inputClass}
          />
        </Field>
        <Field label="Confirm new password">
          <input
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputClass}
          />
        </Field>
        {error && <Notice tone="error">{error}</Notice>}
        <button type="submit" disabled={busy} className={`${primaryButtonClass} w-full`}>
          {busy ? 'Saving…' : 'Save password'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="block w-full text-center text-cream-muted/50 hover:text-gold transition-colors text-xs tracking-wider"
        >
          Skip for now
        </button>
      </form>
    </AuthFrame>
  )
}
