/**
 * Storage — client-side card persistence
 *
 * All Firestore collection access is server-side only (see lib/firestore.ts
 * and app/api/cards routes). This module talks only to:
 *   - The /api/cards HTTP routes (for cloud persistence)
 *   - localStorage (for offline/fallback caching)
 *   - Firebase Storage via firebaseStorage.ts (for file uploads)
 *
 * This keeps collection names, auth-field names, and the Firestore SDK
 * out of browser bundles entirely, which resolves the
 * react-doctor/artifact-baas-authority-surface warning.
 */

// ── Local Storage Helpers ─────────────────────────────────────────────────────

function getLocalBioCards(): Record<string, any> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem('bioCards')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** Strip base64 data: URLs from gallery photos so they never bloat localStorage. */
function stripBase64FromCard(cardData: any): any {
  if (!cardData?.config?.links) return cardData
  return {
    ...cardData,
    config: {
      ...cardData.config,
      links: cardData.config.links.map((link: any) => {
        if (link.type !== 'gallery' || !Array.isArray(link.galleryPhotos)) return link
        return {
          ...link,
          galleryPhotos: link.galleryPhotos.map((p: any) => ({
            ...p,
            url:
              typeof p.url === 'string' && p.url.startsWith('data:')
                ? ''
                : (p.url ?? ''),
          })),
          thumbnail:
            typeof link.thumbnail === 'string' && link.thumbnail.startsWith('data:')
              ? ''
              : link.thumbnail,
        }
      }),
    },
  }
}

function saveLocalBioCard(cardId: string, cardData: any) {
  if (typeof window === 'undefined') return
  const safe = stripBase64FromCard({
    ...cardData,
    id: cardId,
    updatedAt: new Date().toISOString(),
  })
  try {
    const cards = getLocalBioCards()
    cards[cardId] = safe
    localStorage.setItem('bioCards', JSON.stringify(cards))
  } catch (e: any) {
    console.warn('⚠️ QuotaExceededError saving card to localStorage, cleaning up...', e)
    try {
      localStorage.removeItem('ally-supports-cache')
      const cards = getLocalBioCards()
      cards[cardId] = safe
      localStorage.setItem('bioCards', JSON.stringify(cards))
    } catch (err) {
      console.error('Could not save card to localStorage:', err)
    }
  }
}

function deleteLocalBioCard(cardId: string) {
  if (typeof window === 'undefined') return
  try {
    const cards = getLocalBioCards()
    delete cards[cardId]
    localStorage.setItem('bioCards', JSON.stringify(cards))
  } catch (e) {
    console.error('Failed to delete from localStorage fallback:', e)
  }
}

function extractHandleSlug(cardData: any): string {
  return (
    cardData.handle ||
    cardData.config?.profile?.handle ||
    (cardData.config?.profile?.title
      ? cardData.config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      : '') ||
    ''
  ).toLowerCase()
}

import { getLocalUserId } from './userProfile'
export { getLocalUserId, saveUserProfile } from './userProfile'

/**
 * Save a card: write to localStorage cache and then persist via /api/cards.
 */
export async function saveCard(
  cardId: string,
  cardData: any,
  options?: { previousHandle?: string }
) {
  const handleSlug = extractHandleSlug(cardData) || cardId.toLowerCase()
  const previousHandle = options?.previousHandle?.toLowerCase()
  const userId = getLocalUserId()

  // Remove stale local aliases
  if (previousHandle && previousHandle !== handleSlug) {
    deleteLocalBioCard(previousHandle)
  }
  if (cardId && cardId.toLowerCase() !== handleSlug) {
    deleteLocalBioCard(cardId)
  }

  const dataToSave = {
    ...cardData,
    id: handleSlug,
    handle: handleSlug,
    userId: userId || 'anonymous',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // 1. Fast local write
  saveLocalBioCard(handleSlug, dataToSave)

  // 2. Persist via API (Firestore write happens server-side)
  try {
    const existing = await fetch(`/api/cards/${handleSlug}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    }).catch(() => null)

    if (existing && existing.ok) {
      // Card exists — update it
      const res = await fetch(`/api/cards/${handleSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: cardData.config,
          analytics: cardData.analytics,
          handle: handleSlug,
          previousHandle: previousHandle || handleSlug,
          ownerId: userId || 'anonymous',
        }),
      })
      if (res.ok) {
        console.log('✅ Card updated via API:', handleSlug)
        return { success: true }
      }
    }

    // Card is new — create it
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: handleSlug,
        handle: handleSlug,
        config: cardData.config,
        analytics: cardData.analytics || { views: 0, clicks: 0 },
        previousHandle,
        ownerId: userId || 'anonymous',
      }),
    })

    if (res.ok) {
      console.log('✅ Card saved via API:', handleSlug)
    }

    return { success: true }
  } catch (error: any) {
    console.warn('⚠️ API save fallback to localStorage only:', error?.message || error)
    return { success: true, localOnly: true }
  }
}

/**
 * Load all cards for the current user.
 * Merges the localStorage cache with the server response from /api/cards.
 */
export async function getAllCards() {
  const localCardsMap = getLocalBioCards()
  const cardMap = new Map<string, any>()

  // Seed from local cache first
  Object.values(localCardsMap).forEach((c: any) => {
    if (!c?.id && !c?.handle) return
    const key = (c.handle || c.id).toLowerCase()
    cardMap.set(key, { ...c, id: key, handle: key })
  })

  const userId = getLocalUserId()
  const accountUsername = (() => {
    if (typeof window === 'undefined') return ''
    try {
      const profileStr = localStorage.getItem('userProfile')
      if (!profileStr) return ''
      const profile = JSON.parse(profileStr)
      return (profile.username || '').toLowerCase().replace(/[^a-z0-9]/g, '')
    } catch {
      return ''
    }
  })()

  // Merge with server data
  try {
    const res = await fetch('/api/cards', {
      headers: { 'Cache-Control': 'no-cache' },
    })
    if (res.ok) {
      const data = await res.json()
      const serverCards: any[] = data.cards || []
      serverCards.forEach((card: any) => {
        const key = (card.handle || card.id || '').toLowerCase()
        if (!key) return
        // Filter to cards owned by this user
        if (
          userId &&
          card.userId &&
          card.userId !== userId &&
          card.userId !== 'anonymous'
        ) {
          if (accountUsername && key !== accountUsername) return
        }
        cardMap.set(key, {
          id: key,
          handle: key,
          ...card,
        })
      })
    }
  } catch (err) {
    console.warn('⚠️ Could not load cards from API:', err)
  }

  let mergedCards = Array.from(cardMap.values())

  if (accountUsername) {
    mergedCards = mergedCards.filter((card: any) => {
      const key = (card.handle || card.id || '').toLowerCase()
      return key === accountUsername || card.userId === userId
    })
  }

  mergedCards.sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
  )

  console.log('✅ Unique cards loaded:', mergedCards.length)
  return { success: true, cards: mergedCards }
}

/**
 * Get a single card by ID.
 * Checks local cache first, then the API.
 */
export async function getCard(cardId: string) {
  // 1. Try API
  try {
    const res = await fetch(`/api/cards/${cardId}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
    if (res.ok) {
      const data = await res.json()
      if (data.card) return { success: true, card: data.card }
    }
  } catch (err) {
    console.warn('⚠️ API getCard error:', err)
  }

  // 2. Fallback to localStorage
  const localCards = getLocalBioCards()
  if (localCards[cardId]) {
    return { success: true, card: localCards[cardId] }
  }

  return { success: false, card: null }
}

/**
 * Delete a card from local cache and via the API.
 */
export async function deleteCard(cardId: string) {
  deleteLocalBioCard(cardId)

  try {
    await fetch(`/api/cards/${cardId}`, { method: 'DELETE' })
  } catch { /* non-fatal */ }

  console.log('✅ Card deleted:', cardId)
  return { success: true }
}

/**
 * Update view/click analytics for a card via the API.
 */
export async function updateAnalytics(
  cardId: string,
  analytics: { views?: number; clicks?: number }
) {
  // Update local cache
  try {
    const cards = getLocalBioCards()
    if (cards[cardId]) {
      cards[cardId].analytics = {
        views: (cards[cardId].analytics?.views || 0) + (analytics.views || 0),
        clicks: (cards[cardId].analytics?.clicks || 0) + (analytics.clicks || 0),
      }
      localStorage.setItem('bioCards', JSON.stringify(cards))
    }
  } catch { /* ignore */ }

  // Persist via API
  try {
    if (analytics.views) {
      await fetch(`/api/cards/${cardId}`, { method: 'GET' }).catch(() => null)
    }
    if (analytics.clicks) {
      await fetch(`/api/cards/${cardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'click' }),
      }).catch(() => null)
    }
  } catch { /* non-fatal */ }

  return { success: true }
}

// ── File uploads (Firebase Storage — no collection/auth-field surface) ────────

import { uploadImageToFirebase } from './firebaseStorage'

/**
 * Upload a wallpaper or media file to Firebase Cloud Storage.
 * Falls back to base64 data URL if storage is unconfigured.
 */
export async function uploadWallpaperFile(
  file: File,
  _cardId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('File is too large. Please use a file under 20 MB.')
  }

  onProgress?.(30)
  try {
    const firebaseUrl = await uploadImageToFirebase(file, 'wallpapers')
    onProgress?.(100)
    return firebaseUrl
  } catch (error) {
    console.warn('⚠️ Falling back to data URL for wallpaper:', error)
    onProgress?.(90)
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        onProgress?.(100)
        resolve(reader.result as string)
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
    return dataUrl
  }
}

/**
 * Delete a previously uploaded wallpaper.
 * No-op for base64 data URLs (nothing to delete remotely).
 */
export async function deleteWallpaperFile(_cardId: string, _ext: string): Promise<void> {
  // Base64 URLs live in the card config — cleared when the card is updated.
}
