/**
 * firebaseStorage.ts
 * ------------------
 * Thin re-export kept so existing callers (wallpaper, avatar) don't need
 * to change their import paths.  All uploads go to Cloudinary — no Firebase
 * Storage, no base64 fallback.
 */

import { uploadToCloudinary } from './cloudinaryUpload'

export async function uploadImageToFirebase(
  file: File | string,
  folder = 'Biolinks'
): Promise<string> {
  // Already a remote URL — nothing to do
  if (typeof file === 'string' && file.startsWith('http')) return file
  // Should not receive a data: URL in normal flow, but guard it
  if (typeof file === 'string') {
    throw new Error('uploadImageToFirebase: plain string uploads are no longer supported. Pass a File object.')
  }
  const result = await uploadToCloudinary(file, folder)
  return result.photo.url
}
