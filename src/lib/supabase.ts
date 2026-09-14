import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The one Supabase client for the whole site.
 *
 * Both values come from .env.local and are baked into the bundle at build time. The
 * publishable key is safe to ship: every read and write is checked by the
 * row-level security policies in the Supabase project, and only a signed-in
 * owner passes the write policies.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** Null when the environment variables are missing; the site then runs on its built-in seed content. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

export const isSupabaseConfigured = supabase !== null

/** Table holding one JSON document per content key (see src/store/storage.ts). */
export const CONTENT_TABLE = 'site_content'

/** Public bucket that admin photo uploads go to (see src/lib/image.ts). */
export const IMAGES_BUCKET = 'images'

export class NotConfiguredError extends Error {
  constructor() {
    super(
      'The site backend is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local and restart or rebuild.',
    )
    this.name = 'NotConfiguredError'
  }
}

/** Use for writes, which cannot fall back to seed data. */
export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new NotConfiguredError()
  return supabase
}

/** Turns a Supabase or PostgREST error into a sentence the admin can act on. */
export function describeSupabaseError(err: unknown, action: string): string {
  const e = err as { code?: string; message?: string; status?: number; statusCode?: string | number } | null
  const message = e?.message ?? String(err)
  const status = Number(e?.status ?? e?.statusCode)
  if (e?.code === '42501' || status === 401 || status === 403 || /row-level security|JWT/i.test(message)) {
    return `You need to be signed in to ${action}. Log out and back in, then try again.`
  }
  if (status === 413 || /maximum allowed size|too large/i.test(message)) {
    return 'That photo is too large. Try a smaller image.'
  }
  return `Could not ${action} (${message}).`
}
