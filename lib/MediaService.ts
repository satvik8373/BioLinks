/**
 * MediaService.ts
 * ---------------
 * Central Service for client-side asset handling:
 * - Canvas compression
 * - SHA-256 byte deduplication
 * - Cloudinary unsigned presets
 * - Firebase Storage wallpaper fallbacks
 */

import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinaryUpload'
import { uploadWallpaperFile } from '@/lib/storage'

export class MediaService {
  /**
   * Compress an image file using browser Canvas HTML5 API.
   */
  static async compressImage(file: File, maxDimension = 800, quality = 0.85): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL('image/jpeg', quality))
          } else {
            resolve(e.target?.result as string)
          }
        }
        img.onerror = () => resolve(e.target?.result as string)
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  /**
   * Upload an avatar or gallery photo to Cloudinary CDN with SHA-256 deduplication.
   */
  static async uploadImage(file: File): Promise<string> {
    const error = validateImageFile(file)
    if (error) throw new Error(error)
    const result = await uploadToCloudinary(file)
    return result.photo.url
  }

  /**
   * Upload wallpaper video or large image asset.
   */
  static async uploadWallpaper(
    file: File,
    cardId: string,
    onProgress?: (pct: number) => void
  ): Promise<string> {
    return uploadWallpaperFile(file, cardId, onProgress)
  }
}
