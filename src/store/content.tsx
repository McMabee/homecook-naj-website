import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { InstagramPost, Recipe, SiteSettings } from '../types'
import { isSupabaseConfigured } from '../lib/supabase'
import { getRecipes, SEED_RECIPES } from './recipes'
import { getInstagramPosts, SEED_POSTS } from './instagram'
import { getSettings, DEFAULT_SETTINGS } from './settings'

/**
 * Loads the three site-content documents once, when the app mounts, and
 * shares them with every page. The admin panels push their saved results back
 * in through the setters, so the public pages update without a second fetch.
 *
 * If Supabase is not configured, or the fetch fails, the built-in seed content
 * is shown instead so the site never renders empty.
 */

export type ContentStatus = 'loading' | 'ready' | 'error'

interface ContentData {
  recipes: Recipe[]
  posts: InstagramPost[]
  settings: SiteSettings
}

export interface ContentValue extends ContentData {
  /** 'loading' until the first fetch resolves; 'error' means seed content is showing instead. */
  status: ContentStatus
  error: string | null
  refresh: () => Promise<void>
  setRecipes: (recipes: Recipe[]) => void
  setPosts: (posts: InstagramPost[]) => void
  setSettings: (settings: SiteSettings) => void
}

const SEED_CONTENT: ContentData = { recipes: SEED_RECIPES, posts: SEED_POSTS, settings: DEFAULT_SETTINGS }
const EMPTY_CONTENT: ContentData = { recipes: [], posts: [], settings: DEFAULT_SETTINGS }

const ContentContext = createContext<ContentValue | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContentData>(isSupabaseConfigured ? EMPTY_CONTENT : SEED_CONTENT)
  const [status, setStatus] = useState<ContentStatus>(isSupabaseConfigured ? 'loading' : 'ready')
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return
    try {
      const [recipes, posts, settings] = await Promise.all([getRecipes(), getInstagramPosts(), getSettings()])
      setData({ recipes, posts, settings })
      setError(null)
      setStatus('ready')
    } catch (err) {
      console.error('Could not load site content; showing the built-in seed content instead.', err)
      setData(SEED_CONTENT)
      setError(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<ContentValue>(
    () => ({
      ...data,
      status,
      error,
      refresh,
      setRecipes: (recipes) => setData((prev) => ({ ...prev, recipes })),
      setPosts: (posts) => setData((prev) => ({ ...prev, posts })),
      setSettings: (settings) => setData((prev) => ({ ...prev, settings })),
    }),
    [data, status, error, refresh],
  )

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent(): ContentValue {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>')
  return ctx
}

/** Site settings (social links). The defaults are used until the live values arrive. */
export function useSettings(): SiteSettings {
  return useContent().settings
}
