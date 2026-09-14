// Restores site_content rows from a backups/content/site-content-*.json export.
//
//   npm run content:restore -- backups/content/site-content-<timestamp>.json --dry-run
//   npm run content:restore -- backups/content/site-content-<timestamp>.json
//
// Writing needs the project's SECRET key (sb_secret_...), because row-level
// security only lets a signed-in owner write. Put it in .env.local as
//
//   SUPABASE_SECRET_KEY=sb_secret_...
//
// with no VITE_ prefix, so Vite never bakes it into the public site, and remove
// it again when the restore is done. Never commit it or add it to the host's
// build environment. See "Content backup and recovery" in the README.

import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const EXPECTED_KEYS = ['chef_recipes', 'naj_instagram_posts', 'naj_settings']

// Returning from main() rather than calling process.exit() lets Node flush
// stdout first; under `npm run` on Windows, process.exit() can drop the last lines.
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const file = args.find((arg) => !arg.startsWith('--'))

  if (!file) {
    console.error('Usage: npm run content:restore -- <backups/content/site-content-....json> [--dry-run]')
    process.exitCode = 1
    return
  }

  const env = loadEnv('development', process.cwd(), '')

  if (env.VITE_SUPABASE_SECRET_KEY) {
    throw new Error(
      'VITE_SUPABASE_SECRET_KEY is set. Never give the secret key a VITE_ prefix: Vite would bake it ' +
        'into the public site. Rename it to SUPABASE_SECRET_KEY, and rotate the key if the site was built with it.',
    )
  }

  const supabaseUrl = env.VITE_SUPABASE_URL
  const secretKey = env.SUPABASE_SECRET_KEY
  if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL in .env.local.')
  if (secretKey && secretKey.startsWith('sb_publishable_')) {
    throw new Error('SUPABASE_SECRET_KEY holds the publishable key. Writes need the secret key (sb_secret_...).')
  }

  // Read and validate the export before touching the network.
  const backupPath = path.resolve(file)
  const backup = JSON.parse(await readFile(backupPath, 'utf8'))
  const rows = Array.isArray(backup?.rows) ? backup.rows : null
  if (!rows) throw new Error(`${file} does not look like a content export (no "rows" array).`)
  if (rows.length === 0) throw new Error(`${file} holds no rows; nothing to restore.`)
  for (const row of rows) {
    if (typeof row?.key !== 'string' || row.value === undefined) {
      throw new Error(`${file} has a row without a key or value: ${JSON.stringify(row).slice(0, 120)}`)
    }
  }

  console.log(
    `${dryRun ? 'Dry run: would restore' : 'Restoring'} ${rows.length} row${rows.length === 1 ? '' : 's'} ` +
      `from ${path.relative(process.cwd(), backupPath)} (exported ${backup.exportedAt ?? 'unknown'}):`,
  )
  for (const row of rows) {
    const size = Array.isArray(row.value) ? `${row.value.length} items` : `${JSON.stringify(row.value).length} chars`
    const note = EXPECTED_KEYS.includes(row.key) ? '' : '  <- not one of the keys the site uses'
    console.log(`  ${row.key}: ${size}, saved ${row.updated_at ?? 'unknown'}${note}`)
  }
  const missing = EXPECTED_KEYS.filter((key) => !rows.some((row) => row.key === key))
  if (missing.length > 0) {
    console.warn(`Note: the export has no row for ${missing.join(', ')}; the site keeps showing its seed content for those.`)
  }

  if (dryRun) {
    console.log('Dry run: nothing was written.')
    return
  }

  if (!secretKey) {
    throw new Error('Missing SUPABASE_SECRET_KEY in .env.local. Add it (no VITE_ prefix) for the restore, then remove it.')
  }

  const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const restoredAt = new Date().toISOString()
  const { error } = await supabase
    .from('site_content')
    .upsert(rows.map(({ key, value }) => ({ key, value, updated_at: restoredAt })), { onConflict: 'key' })
  if (error) throw error

  // Read back so the console shows what the site will now serve.
  const { data: after, error: readError } = await supabase.from('site_content').select('key, updated_at').order('key')
  if (readError) throw readError
  console.log('Restored. site_content now holds:')
  for (const row of after) console.log(`  ${row.key}, updated ${row.updated_at}`)
  console.log('Reload the public site and check recipes, Instagram tiles, the Facebook URL and the photos.')
  console.log('Then remove SUPABASE_SECRET_KEY from .env.local.')
}

await main()
