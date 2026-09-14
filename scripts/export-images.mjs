// Downloads every file in the public `images` bucket into backups/images/,
// keeping the bucket's folder layout (recipes/..., instagram/...).
//
//   npm run images:export
//
// Uses only the publishable key: the bucket is public-read by design. Files
// already present locally are skipped, which is safe because an upload never
// overwrites an existing object (each one gets a new name), so a local copy can
// never be stale. See "Content backup and recovery" in the README.

import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'
import { access, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BUCKET = 'images'
const PAGE = 100

const env = loadEnv('development', process.cwd(), '')
const supabaseUrl = env.VITE_SUPABASE_URL
const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !publishableKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local (see .env.example).')
}

const supabase = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false } })
const bucket = supabase.storage.from(BUCKET)

/** Lists every object under `prefix`, descending into folders (entries with a null id). */
async function listAll(prefix = '') {
  const files = []
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await bucket.list(prefix, {
      limit: PAGE,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (error) throw error
    for (const entry of data) {
      const objectPath = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.id === null) {
        files.push(...(await listAll(objectPath)))
      } else if (entry.name !== '.emptyFolderPlaceholder') {
        files.push({ path: objectPath, size: entry.metadata?.size ?? null })
      }
    }
    if (data.length < PAGE) return files
  }
}

// Returning from main() rather than calling process.exit() lets Node flush
// stdout first; under `npm run` on Windows, process.exit() can drop the last lines.
async function main() {
  const directory = path.join(process.cwd(), 'backups', BUCKET)
  await mkdir(directory, { recursive: true })

  const files = await listAll()
  if (files.length === 0) {
    console.log(
      `The ${BUCKET} bucket lists no files. Either nothing has been uploaded from the admin yet, ` +
        'or the bucket is missing its "anyone may select" policy on storage.objects (see TODO.md, step 5).',
    )
    return
  }

  let downloaded = 0
  let skipped = 0
  let bytes = 0
  for (const file of files) {
    const destination = path.join(directory, ...file.path.split('/'))
    if (!destination.startsWith(directory + path.sep)) {
      throw new Error(`Refusing to write outside backups/: ${file.path}`)
    }

    const exists = await access(destination).then(
      () => true,
      () => false,
    )
    if (exists) {
      skipped += 1
      continue
    }

    const url = bucket.getPublicUrl(file.path).data.publicUrl
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Could not download ${file.path}: HTTP ${response.status}`)
    const body = Buffer.from(await response.arrayBuffer())
    await mkdir(path.dirname(destination), { recursive: true })
    await writeFile(destination, body)
    downloaded += 1
    bytes += body.length
    console.log(`  ${file.path} (${(body.length / 1024).toFixed(0)} KB)`)
  }

  console.log(
    `Downloaded ${downloaded} file${downloaded === 1 ? '' : 's'} (${(bytes / 1024 / 1024).toFixed(1)} MB) to ` +
      `${path.relative(process.cwd(), directory)}; ${skipped} already present.`,
  )
}

await main()
