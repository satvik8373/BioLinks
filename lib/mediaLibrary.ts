/**
 * mediaLibrary.ts
 * ---------------
 * Per-user isolated persistent media library manager with duplicate prevention.
 * Each user's uploads are stored separately under `user_media_library_${userId}`
 */

import { getLocalUserId } from './userProfile'

export interface MediaItem {
  id: string
  url: string
  name: string
  createdAt: number
  userId?: string
  category?: 'uploaded' | 'preset'
}

const LOCAL_STORAGE_PREFIX = 'user_media_library_'

// Default stock presets shared across all users
export const PRESET_LIBRARY: MediaItem[] = [
  {
    id: 'preset-1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    name: 'Abstract Fluid Dark',
    createdAt: Date.now() - 100000,
    category: 'preset',
  },
  {
    id: 'preset-2',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80',
    name: 'Gradient Pastel Wave',
    createdAt: Date.now() - 200000,
    category: 'preset',
  },
  {
    id: 'preset-3',
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    name: 'Neon Cyber Grid',
    createdAt: Date.now() - 300000,
    category: 'preset',
  },
  {
    id: 'preset-4',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    name: 'Tropical Beach Sun',
    createdAt: Date.now() - 400000,
    category: 'preset',
  },
]

export function getCurrentUserId(): string {
  if (typeof window === 'undefined') return 'default_user'
  return getLocalUserId() || 'default_user'
}

export function getUserMediaLibrary(targetUserId?: string): MediaItem[] {
  if (typeof window === 'undefined') return []

  const userId = targetUserId || getCurrentUserId()
  const key = `${LOCAL_STORAGE_PREFIX}${userId}`

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed: MediaItem[] = JSON.parse(stored)
      // Filter out duplicate entries by URL and name
      const uniqueItems: MediaItem[] = []
      const seenUrls = new Set<string>()

      for (const item of parsed) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url)
          uniqueItems.push({ ...item, userId, category: 'uploaded' })
        }
      }
      return uniqueItems
    }
  } catch (err) {
    console.error(`Failed to load media library for user ${userId}:`, err)
  }

  return []
}

export function saveMediaToLibrary(url: string, name?: string, targetUserId?: string): MediaItem[] {
  if (typeof window === 'undefined' || !url) return []

  const userId = targetUserId || getCurrentUserId()
  const key = `${LOCAL_STORAGE_PREFIX}${userId}`
  const current = getUserMediaLibrary(userId)

  // Deduplicate by URL
  if (current.some(item => item.url === url)) {
    return current
  }

  const itemName = name || `Upload ${new Date().toLocaleDateString()}`

  // If a temporary data: URL with the same name exists and we now have an http cloud URL, replace the temporary data: URL
  const existingTempIndex = current.findIndex(item => item.name === itemName && item.url.startsWith('data:'))
  
  let updated: MediaItem[]
  if (existingTempIndex !== -1 && url.startsWith('http')) {
    updated = [...current]
    updated[existingTempIndex] = {
      ...updated[existingTempIndex],
      url,
      createdAt: Date.now(),
    }
  } else {
    const cleaned = url.startsWith('http')
      ? current.filter(item => !(item.name === itemName && item.url.startsWith('data:')))
      : current

    const newItem: MediaItem = {
      id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url,
      name: itemName,
      createdAt: Date.now(),
      userId,
      category: 'uploaded',
    }
    updated = [newItem, ...cleaned]
  }

  try {
    localStorage.setItem(key, JSON.stringify(updated))
  } catch (err) {
    console.warn(`LocalStorage limit reached for media library key ${key}:`, err)
  }

  return updated
}

export function removeFromMediaLibrary(idOrUrl: string, targetUserId?: string): MediaItem[] {
  if (typeof window === 'undefined') return []

  const userId = targetUserId || getCurrentUserId()
  const key = `${LOCAL_STORAGE_PREFIX}${userId}`
  const current = getUserMediaLibrary(userId)

  const updated = current.filter(item => item.id !== idOrUrl && item.url !== idOrUrl)

  try {
    localStorage.setItem(key, JSON.stringify(updated))
  } catch (err) {
    console.error(`Failed to remove item from media library for key ${key}:`, err)
  }

  return updated
}
