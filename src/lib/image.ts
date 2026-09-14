import { requireSupabase, IMAGES_BUCKET, describeSupabaseError } from './supabase'

/** Folder inside the images bucket; keeps recipe and tile photos apart. */
export type ImageFolder = 'recipes' | 'instagram'

/**
 * Downscale an image in the browser and return it as a JPEG blob, so uploads
 * are a few hundred kilobytes rather than the multi-megabyte phone original.
 */
export async function downscaleImage(file: File, maxSize = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas is not supported in this browser')
    ctx.drawImage(bitmap, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!blob) throw new Error('Could not encode the image')
    return blob
  } finally {
    bitmap.close()
  }
}

/**
 * Upload a photo to the public images bucket and return its URL.
 *
 * Every upload gets a fresh object name (`folder/name-timestamp.jpg`), never
 * overwriting an existing one, so a replaced photo is never served stale from
 * the CDN. Old objects are not deleted; see TODO.md.
 */
export async function uploadImage(blob: Blob, folder: ImageFolder, name: string): Promise<string> {
  const client = requireSupabase()
  const safeName = name.replace(/[^a-z0-9_-]/gi, '').slice(0, 60) || 'photo'
  const path = `${folder}/${safeName}-${Date.now()}.jpg`
  const { error } = await client.storage.from(IMAGES_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw new Error(describeSupabaseError(error, 'upload the photo'))
  return client.storage.from(IMAGES_BUCKET).getPublicUrl(path).data.publicUrl
}
