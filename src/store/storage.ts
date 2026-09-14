import { supabase, requireSupabase, CONTENT_TABLE, describeSupabaseError } from '../lib/supabase'

/**
 * Single place where site content is read and written.
 *
 * Each content key (recipes, Instagram tiles, settings) is one row in the
 * Supabase `site_content` table: `key text primary key, value jsonb,
 * updated_at timestamptz`. Row-level security lets anyone read and only a
 * signed-in owner write, so the publishable key in the bundle is enough for
 * visitors and the admin relies on the owner's login.
 *
 * When Supabase is not configured (no VITE_SUPABASE_* values), reads return
 * the fallback so the site still renders its seed content, and writes fail
 * with a clear message.
 */

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  if (!supabase) return fallback
  const { data, error } = await supabase.from(CONTENT_TABLE).select('value').eq('key', key).maybeSingle()
  if (error) throw new Error(`Could not load the site content (${error.message}).`)
  return data ? (data.value as T) : fallback
}

export async function writeJSON(key: string, value: unknown): Promise<void> {
  const client = requireSupabase()
  const { error } = await client
    .from(CONTENT_TABLE)
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  if (error) throw new Error(describeSupabaseError(error, 'save your changes'))
}
