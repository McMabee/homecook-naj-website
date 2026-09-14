import type { InstagramPost } from '../types'
import { readJSON, writeJSON } from './storage'

const KEY = 'naj_instagram_posts'

/**
 * Placeholder tiles using Naj's own photos (public/instagram/). Replace them
 * from the admin's Instagram tab and add each post's link so the tile opens
 * the real post. An empty postUrl falls back to the profile.
 */
export const SEED_POSTS: InstagramPost[] = [
  {
    id: 'seed-ig-1',
    imageUrl: '/instagram/chopping.jpg',
    postUrl: '',
    caption: 'Prepping fresh vegetables for a private dinner',
  },
  {
    id: 'seed-ig-2',
    imageUrl: '/instagram/spices.jpg',
    postUrl: '',
    caption: 'The spice drawer, always within reach',
  },
  {
    id: 'seed-ig-3',
    imageUrl: '/instagram/portrait.jpg',
    postUrl: '',
    caption: 'At home in the kitchen',
  },
  {
    id: 'seed-ig-4',
    imageUrl: '/instagram/fridge.jpg',
    postUrl: '',
    caption: 'Stocking up before a weekend of cooking',
  },
]

export function getInstagramPosts(): Promise<InstagramPost[]> {
  return readJSON<InstagramPost[]>(KEY, SEED_POSTS)
}

/** Replaces the whole tile list (order matters: the first tiles are the ones shown). */
export function saveInstagramPosts(posts: InstagramPost[]): Promise<void> {
  return writeJSON(KEY, posts)
}
