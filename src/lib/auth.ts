import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthState {
  /** False until the stored session (if any) has been read from the browser. */
  ready: boolean
  session: Session | null
  /** True after arriving from a password-reset email, until a new password is set. */
  recovery: boolean
  clearRecovery: () => void
}

/**
 * Tracks the Supabase Auth session. Use it once, near the top of the tree,
 * and pass the result down: it owns the single auth listener, which is also
 * how the site notices a password-reset link (the PASSWORD_RECOVERY event).
 */
export function useAuth(): AuthState {
  const [ready, setReady] = useState(!supabase)
  const [session, setSession] = useState<Session | null>(null)
  const [recovery, setRecovery] = useState(false)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setReady(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      setReady(true)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
      if (event === 'SIGNED_OUT') setRecovery(false)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return { ready, session, recovery, clearRecovery: () => setRecovery(false) }
}
