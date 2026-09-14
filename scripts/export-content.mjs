// Saves the site_content rows to a dated JSON file under backups/content/.
//
//   npm run content:export
//
// Uses only the publishable key. The rows are publicly readable by design (the
// public site reads them the same way), so the export needs no elevated access.
// See "Content backup and recovery" in the README.

import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

/** The keys the stores in src/store/ write; a key is absent until the admin first saves that section. */
const EXPECTED_KEYS = ['chef_recipes', 'naj_instagram_posts', 'naj_settings']

const env = loadEnv('development', process.cwd(), '')
const supabaseUrl = env.VITE_SUPABASE_URL
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !publishableKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env (see .env.example).')
}

const supabase = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false } })

const { data, error } = await supabase.from('site_content').select('*').order('key')
if (error) throw error

const missing = EXPECTED_KEYS.filter((key) => !data.some((row) => row.key === key))
if (missing.length > 0) {
  console.warn(
    `Warning: expected ${EXPECTED_KEYS.length} site_content rows but found ${data.length}. ` +
      `Missing: ${missing.join(', ')}. (A key only exists once the admin has saved that section; ` +
      'until then the site shows the seed content from src/store/ for it.)',
  )
}

const exportedAt = new Date().toISOString()
const safeTimestamp = exportedAt.replace(/[:.]/g, '-')
const directory = path.join(process.cwd(), 'backups', 'content')
await mkdir(directory, { recursive: true })

const filename = path.join(directory, `site-content-${safeTimestamp}.json`)
await writeFile(filename, JSON.stringify({ exportedAt, rowCount: data.length, rows: data }, null, 2), 'utf8')

console.log(`Exported ${data.length} row${data.length === 1 ? '' : 's'} to:`)
console.log(path.relative(process.cwd(), filename))
for (const row of data) {
  const count = Array.isArray(row.value) ? ` (${row.value.length} items)` : ''
  console.log(`  ${row.key}${count}, last saved ${row.updated_at}`)
}
