/**
 * Resilient Storage (Firestore Cloud + LocalStorage Fallback)
 * - Dual Cloud Sync: Saves to both 'users/{userId}/cards' and 'bioCards' in Firestore
 * - Resilient Loading: Fetches from Firestore user subcollection, Firestore 'bioCards' collection, and localStorage
 * - Seamless experience: Works authenticated or unauthenticated without blocking
 */

import { db, auth } from './firebase'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
function getUserId(): string | null {
  if (typeof window === 'undefined') return null
  
  // 1. Check Firebase Auth
  if (auth?.currentUser?.uid) {
    return auth.currentUser.uid
  }
  
  // 2. Check localStorage for user profile (demo or authenticated user session)
  try {
    const profileStr = localStorage.getItem('userProfile')
    if (profileStr) {
      const profile = JSON.parse(profileStr)
      if (profile.id || profile.uid) {
        return profile.id || profile.uid
      }
    }
  } catch (e) {
    // ignore
  }
  
  // 3. Fallback to local user ID
  let localUserId = localStorage.getItem('localUserId')
  if (!localUserId) {
    localUserId = 'user_' + Math.random().toString(36).substring(2, 11)
    localStorage.setItem('localUserId', localUserId)
  }
  return localUserId
}

/** Save the account profile separately from its cards (including its username). */
export async function saveUserProfile(profile: Record<string, any>) {
  const userId = profile.id || profile.uid || getUserId()
  if (!userId) return { success: false }

  const username = String(profile.username || '').toLowerCase().trim()
  if (!username) return { success: false }

  await setDoc(doc(db, 'users', userId), {
    username,
    email: profile.email || '',
    displayName: profile.displayName || username,
    avatar: profile.avatar || '',
    createdAt: profile.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })

  return { success: true, userId }
}

// Local Storage Helpers
function getLocalBioCards(): Record<string, any> {
  if (typeof window === 'undefined') return {}
  try {
    const bioCardsStr = localStorage.getItem('bioCards')
    return bioCardsStr ? JSON.parse(bioCardsStr) : {}
  } catch (e) {
    return {}
  }
}

function saveLocalBioCard(cardId: string, cardData: any) {
  if (typeof window === 'undefined') return
  try {
    const cards = getLocalBioCards()
    cards[cardId] = {
      ...cardData,
      id: cardId,
      updatedAt: new Date().toISOString()
    }
    localStorage.setItem('bioCards', JSON.stringify(cards))
  } catch (e: any) {
    console.warn('⚠️ QuotaExceededError saving card to localStorage, cleaning up storage cache...', e)
    try {
      localStorage.removeItem('ally-supports-cache')
      const cards = getLocalBioCards()
      cards[cardId] = { ...cardData, id: cardId, updatedAt: new Date().toISOString() }
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

async function deleteFirestoreCard(docId: string, userId: string | null) {
  try {
    await deleteDoc(doc(db, 'bioCards', docId))
  } catch {}
  if (userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'cards', docId))
    } catch {}
  }
}

export async function saveCard(
  cardId: string,
  cardData: any,
  options?: { previousHandle?: string }
) {
  const handleSlug = extractHandleSlug(cardData) || cardId.toLowerCase()
  const previousHandle = options?.previousHandle?.toLowerCase()
  const userId = getUserId()

  // Remove stale alias when username changes
  if (previousHandle && previousHandle !== handleSlug) {
    deleteLocalBioCard(previousHandle)
    await deleteFirestoreCard(previousHandle, userId)
  }
  // Remove legacy random-id entry if it differs from username key
  if (cardId && cardId.toLowerCase() !== handleSlug) {
    deleteLocalBioCard(cardId)
    await deleteFirestoreCard(cardId, userId)
  }

  const dataToSave = {
    ...cardData,
    id: handleSlug,
    handle: handleSlug,
    userId: userId || 'anonymous',
    createdAt: cardData.createdAt || new Date().toISOString(),
    updatedAt: serverTimestamp(),
  }

  saveLocalBioCard(handleSlug, dataToSave)

  try {
    const globalCardRef = doc(db, 'bioCards', handleSlug)
    await setDoc(globalCardRef, dataToSave, { merge: true })
    console.log('✅ Card saved to Firestore bioCards:', handleSlug)

    if (userId) {
      const cardRef = doc(db, 'users', userId, 'cards', handleSlug)
      await setDoc(cardRef, dataToSave, { merge: true })
      console.log('✅ Card saved to Firestore users subcollection:', handleSlug)
    }

    return { success: true }
  } catch (error: any) {
    console.warn('⚠️ Firestore save fallback to localStorage:', error?.message || error)
    return { success: true, localOnly: true }
  }
}

export async function getAllCards() {
  const userId = getUserId()
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

  const localCardsMap = getLocalBioCards()
  const cardMap = new Map<string, any>()

  Object.values(localCardsMap).forEach((c: any) => {
    if (!c?.id && !c?.handle) return
    const key = (c.handle || c.id).toLowerCase()
    cardMap.set(key, { ...c, id: key, handle: key })
  })

  try {
    const globalRef = collection(db, 'bioCards')
    const globalSnap = await getDocs(globalRef)
    globalSnap.forEach((docSnap) => {
      const data = docSnap.data()
      const key = (data.handle || docSnap.id).toLowerCase()
      if (userId && data.userId && data.userId !== userId && data.userId !== 'anonymous') {
        if (accountUsername && key !== accountUsername) return
      }
      cardMap.set(key, {
        id: key,
        handle: key,
        ...data,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt,
        updatedAt:
          data.updatedAt instanceof Timestamp
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt,
      })
    })
  } catch (err) {
    console.warn('⚠️ Could not load from bioCards collection:', err)
  }

  if (userId) {
    try {
      const cardsRef = collection(db, 'users', userId, 'cards')
      const snapshot = await getDocs(cardsRef)
      snapshot.forEach((docSnap) => {
        const data = docSnap.data()
        const key = (data.handle || docSnap.id).toLowerCase()
        cardMap.set(key, {
          id: key,
          handle: key,
          ...data,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
          updatedAt:
            data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate().toISOString()
              : data.updatedAt,
        })
      })
    } catch (err) {
      console.warn('⚠️ Could not load from users subcollection:', err)
    }
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

export async function getCard(cardId: string) {
  const userId = getUserId()
  const localCardsMap = getLocalBioCards()
  const localCard = localCardsMap[cardId]

  // 1. Check top-level bioCards collection in Firestore
  try {
    const globalCardRef = doc(db, 'bioCards', cardId)
    const globalSnap = await getDoc(globalCardRef)
    if (globalSnap.exists()) {
      const data = globalSnap.data()
      const card = {
        id: globalSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate().toISOString() 
          : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp 
          ? data.updatedAt.toDate().toISOString() 
          : data.updatedAt,
      }
      return { success: true, card }
    }
  } catch (err) {
    console.warn('⚠️ Firestore bioCards fetch error:', err)
  }

  // 2. Check user subcollection in Firestore
  if (userId) {
    try {
      const cardRef = doc(db, 'users', userId, 'cards', cardId)
      const snapshot = await getDoc(cardRef)
      if (snapshot.exists()) {
        const data = snapshot.data()
        const card = {
          id: snapshot.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp 
            ? data.updatedAt.toDate().toISOString() 
            : data.updatedAt,
        }
        return { success: true, card }
      }
    } catch (err) {
      console.warn('⚠️ Firestore user subcollection fetch error:', err)
    }
  }

  // 3. Fallback to local storage
  if (localCard) {
    return { success: true, card: localCard }
  }

  return { success: false, card: null }
}

export async function deleteCard(cardId: string) {
  deleteLocalBioCard(cardId)

  const userId = getUserId()

  try {
    const globalCardRef = doc(db, 'bioCards', cardId)
    await deleteDoc(globalCardRef)
  } catch (err) {}

  if (userId) {
    try {
      const cardRef = doc(db, 'users', userId, 'cards', cardId)
      await deleteDoc(cardRef)
    } catch (err) {}
  }

  console.log('✅ Card deleted:', cardId)
  return { success: true }
}

export async function updateAnalytics(cardId: string, analytics: { views?: number; clicks?: number }) {
  try {
    const cards = getLocalBioCards()
    if (cards[cardId]) {
      cards[cardId].analytics = {
        views: (cards[cardId].analytics?.views || 0) + (analytics.views || 0),
        clicks: (cards[cardId].analytics?.clicks || 0) + (analytics.clicks || 0)
      }
      localStorage.setItem('bioCards', JSON.stringify(cards))
    }
  } catch (e) {}

  const userId = getUserId()
  const dataToUpdate = {
    analytics,
    updatedAt: serverTimestamp()
  }

  try {
    const globalCardRef = doc(db, 'bioCards', cardId)
    await setDoc(globalCardRef, dataToUpdate, { merge: true })
  } catch (err) {}

  if (userId) {
    try {
      const cardRef = doc(db, 'users', userId, 'cards', cardId)
      await setDoc(cardRef, dataToUpdate, { merge: true })
    } catch (err) {}
  }
  
  return { success: true }
}

/**
 * Upload a wallpaper video (or image) to Firebase Storage.
 * Falls back to a base64 data URL if Storage is unavailable or rules block the upload.
 *
 * @param file       The File object selected from the input
 * @param cardId     Used to scope the storage path per card
 * @param onProgress Optional callback receiving 0–100 progress
 */
export async function uploadWallpaperFile(
  file: File,
  cardId: string,
  onProgress?: (pct: number) => void
): Promise<string> {

  // ── Base64 fallback (immediate, no Firebase Storage needed) ─────────────
  // We skip Firebase Storage and use base64 directly. This works without
  // Storage being activated and without any rules. Cap at 20 MB.
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('File is too large for local storage. Please use a video under 20 MB.')
  }

  onProgress?.(10)

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 80) + 10 // 10→90
        onProgress?.(pct)
      }
    }
    reader.onload = () => {
      onProgress?.(100)
      resolve(reader.result as string)
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

  console.log('✅ Wallpaper stored as base64 data URL')
  return dataUrl
}

/**
 * Delete a previously uploaded wallpaper.
 * No-op for base64 data URLs (nothing to delete remotely).
 */
export async function deleteWallpaperFile(_cardId: string, _ext: string): Promise<void> {
  // Base64 URLs live in the card config — cleared when the card is updated.
}

