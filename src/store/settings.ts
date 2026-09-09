import { useState } from 'react'
import type { SiteSettings } from '../types'
import { readJSON, writeJSON } from './storage'

const KEY = 'naj_settings'

export const DEFAULT_SETTINGS: SiteSettings = {
  instagramHandle: 'homecookingwithnaj',
  facebookUrl: 'https://www.facebook.com/homecookingwithnaj/',
}

export function getSettings(): SiteSettings {
  const stored = readJSON<Partial<SiteSettings>>(KEY, {})
  return { ...DEFAULT_SETTINGS, ...stored }
}

export function saveSettings(settings: SiteSettings): void {
  writeJSON(KEY, settings)
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

/** Reads site settings once when the component mounts. */
export function useSettings(): SiteSettings {
  const [settings] = useState(getSettings)
  return settings
}
