/**
 * cloudinaryUpload
 * ----------------
 * All image uploads go to Cloudinary only — no base64, no localStorage fallback.
 *
 * Deduplication: before uploading, we compute a SHA-256 hash of the file bytes
 * and check it against already-uploaded photos. If a match is found we return
 * the existing URL immediately — nothing is re-uploaded to Cloudinary.
 *
 * Delete: calls our server-side /api/cloudinary/delete route which signs the
 * request with the API secret (never exposed to the browser).
 */

const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
const UPLOAD_URL    = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

// ── Types ────────────────────────────────────────────────────────────────────

export interface CloudinaryPhoto {
  id: string         // local unique id (for React keys / ordering)
  public_id: string  // Cloudinary public_id — needed for delete
  url: string        // permanent https://res.cloudinary.com/... CDN URL
  title: string
  hash: string       // SHA-256 hex of file bytes — used for dedup
}

export interface UploadResult {
  photo: CloudinaryPhoto
  duplicate: boolean   // true = file already existed, no upload happened
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Compute SHA-256 hex of a File's bytes using the browser SubtleCrypto API. */
export async function hashFile(file: File): Promise<string> {
  const buf    = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function makeId(): string {
  return 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
}

// ── Validation ───────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_BYTES     = 20 * 1024 * 1024   // 20 MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image type (JPG, PNG, GIF, WebP, SVG)`
  }
  if (file.size > MAX_BYTES) {
    return `"${file.name}" exceeds the 20 MB limit`
  }
  return null   // valid
}

// ── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload one file to Cloudinary.
 *
 * @param file           The image File to upload
 * @param folder         Cloudinary folder (default: 'Biolinks')
 * @param existingPhotos Already-saved photos — used for deduplication
 * @returns              { photo, duplicate }
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'Biolinks',
  existingPhotos: CloudinaryPhoto[] = []
): Promise<UploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars are not configured')
  }

  // 1. Validate
  const validationError = validateImageFile(file)
  if (validationError) throw new Error(validationError)

  // 2. Hash → deduplication check
  const hash    = await hashFile(file)
  const existing = existingPhotos.find(p => p.hash === hash)
  if (existing) {
    // Same file already uploaded — return it as-is
    return { photo: existing, duplicate: true }
  }

  // 3. Upload to Cloudinary
  const form = new FormData()
  form.append('file',           file)
  form.append('upload_preset',  UPLOAD_PRESET)
  form.append('folder',         folder)

  const res = await fetch(UPLOAD_URL, { method: 'POST', body: form })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Cloudinary upload failed (HTTP ${res.status})`)
  }

  const data = await res.json()

  return {
    photo: {
      id:        makeId(),
      public_id: data.public_id,
      url:       data.secure_url,
      title:     file.name.replace(/\.[^.]+$/, '') || 'Photo',
      hash,
    },
    duplicate: false,
  }
}

// ── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete an image from Cloudinary via our server-side API route.
 * The API secret is kept on the server — never exposed to the browser.
 *
 * @param public_id  Cloudinary public_id stored on the photo object
 */
export async function deleteFromCloudinary(public_id: string): Promise<void> {
  if (!public_id) return   // nothing to delete (e.g. URL-added photos)

  const res = await fetch('/api/cloudinary/delete', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ public_id }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    // Log but don't throw — the photo is removed from the UI/Firestore either way
    console.warn('Cloudinary delete warning:', err?.error || res.status)
  }
}
