/**
 * Single place where site content is read and written.
 *
 * Today this is the browser's localStorage, which means anything saved in the
 * admin only exists in that browser. When a real backend arrives, swap the
 * bodies of these two functions (or make them async) and the stores built on
 * them (recipes, instagram, settings) keep working.
 */

export class StorageFullError extends Error {
  constructor() {
    super('Browser storage is full. Remove a few photos or use smaller ones, then try again.')
    this.name = 'StorageFullError'
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    if (err instanceof DOMException && /quota/i.test(err.name)) throw new StorageFullError()
    throw err
  }
}
