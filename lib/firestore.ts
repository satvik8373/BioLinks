import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

const CARDS_COLLECTION = 'bioCards'

export interface BioCard {
  id: string
  config: {
    profile: {
      avatar: string
      title: string
      bio: string
      location?: string
      website?: string
      profession?: string
    }
    links: Array<{
      id: string
      type: string
      text: string
      url: string
      icon: string
      isVisible: boolean
      platform?: string
      description?: string
      [key: string]: any
    }>
    theme: any
    socialLinks: Record<string, string>
  }
  analytics: {
    views: number
    clicks: number
  }
  createdAt: string | Timestamp
  updatedAt?: string | Timestamp
}

/**
 * Save a new bio card to Firestore
 */
export async function saveCard(cardId: string, cardData: Omit<BioCard, 'id'>) {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId)
    
    const dataToSave = {
      ...cardData,
      id: cardId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    await setDoc(cardRef, dataToSave, { merge: true })
    
    return { success: true, cardId }
  } catch (error: any) {
    console.error('Error saving card to Firestore:', error)
    throw new Error(`Failed to save card: ${error.message}`)
  }
}

/**
 * Get a bio card from Firestore
 */
export async function getCard(cardId: string): Promise<BioCard | null> {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId)
    const cardSnap = await getDoc(cardRef)
    
    if (!cardSnap.exists()) {
      return null
    }
    
    const data = cardSnap.data()
    
    // Convert Firestore Timestamps to ISO strings for JSON serialization
    return {
      ...data,
      id: cardSnap.id,
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toDate().toISOString() 
        : data.updatedAt,
    } as BioCard
  } catch (error: any) {
    console.error('Error getting card from Firestore:', error)
    throw new Error(`Failed to get card: ${error.message}`)
  }
}

/**
 * Update an existing bio card
 */
export async function updateCard(cardId: string, updates: Partial<BioCard>) {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId)
    
    // Check if card exists
    const cardSnap = await getDoc(cardRef)
    if (!cardSnap.exists()) {
      throw new Error('Card not found')
    }
    
    await updateDoc(cardRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
    
    return { success: true, cardId }
  } catch (error: any) {
    console.error('Error updating card in Firestore:', error)
    throw new Error(`Failed to update card: ${error.message}`)
  }
}

/**
 * Delete a bio card
 */
export async function deleteCard(cardId: string) {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId)
    await deleteDoc(cardRef)
    
    return { success: true, cardId }
  } catch (error: any) {
    console.error('Error deleting card from Firestore:', error)
    throw new Error(`Failed to delete card: ${error.message}`)
  }
}

/**
 * Increment view count for a card
 */
export async function incrementViews(cardId: string) {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId)
    
    await updateDoc(cardRef, {
      'analytics.views': increment(1),
      updatedAt: serverTimestamp(),
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Error incrementing views:', error)
    throw new Error(`Failed to increment views: ${error.message}`)
  }
}

/**
 * Increment click count for a card
 */
export async function incrementClicks(cardId: string) {
  try {
    const cardRef = doc(db, CARDS_COLLECTION, cardId)
    
    await updateDoc(cardRef, {
      'analytics.clicks': increment(1),
      updatedAt: serverTimestamp(),
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Error incrementing clicks:', error)
    throw new Error(`Failed to increment clicks: ${error.message}`)
  }
}
