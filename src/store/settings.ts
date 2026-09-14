import type { SiteSettings } from '../types'
import { readJSON, writeJSON } from './storage'

const KEY = 'naj_settings'

export const DEFAULT_SETTINGS: SiteSettings = {
  instagramHandle: 'homecookingwithnaj',
  facebookUrl: 'https://www.facebook.com/homecookingwithnaj/',
}

export async function getSettings(): Promise<SiteSettings> {
  const stored = await readJSON<Partial<SiteSettings>>(KEY, {})
  return { ...DEFAULT_SETTINGS, ...stored }
}

export function saveSettings(settings: SiteSettings): Promise<void> {
  return writeJSON(KEY, settings)
}

/** Accepts "@handle", "handle", or a full instagram.com URL and returns the bare handle. */
export function normalizeHandle(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@+/, '')
    .replace(/[/?#].*$/, '')
}

export function instagramUrl(handle: string): string {
  return `https://www.instagram.com/${normalizeHandle(handle)}/`
}

// Components read settings through useSettings() in ./content, which shares
// one fetch across the whole site.
