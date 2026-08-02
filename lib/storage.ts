/**
 * Simple Firestore-Only Storage (Like Linktree)
 * Single source of truth: Firestore
 * With localStorage fallback for development
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

// Toggle this to use Firestore (requires proper Firebase rules)
const USE_FIRESTORE = true

function getUserId(): string | null {
  if (typeof window === 'undefined') return null
  
  // Try Firebase Auth first (proper way)
  if (auth.currentUser) {
    return auth.currentUser.uid
  }
  
  // Fallback to localStorage for now (during migration)
  const profile = localStorage.getItem('userProfile')
  if (!profile) return null
  try {
    const user = JSON.parse(profile)
    return user.id || user.uid || null
  } catch {
    return null
  }
}

export async function saveCard(cardId: string, cardData: any) {
  const userId = getUserId()
  if (!userId) throw new Error('User not logged in')

  if (!USE_FIRESTORE) {
    // Temporary localStorage fallback
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    cards[cardId] = { ...cardData, id: cardId, updatedAt: new Date().toISOString() }
    localStorage.setItem('bioCards', JSON.stringify(cards))
    return { success: true }
  }

  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    await setDoc(cardRef, {
      ...cardData,
      userId,
      updatedAt: serverTimestamp()
    }, { merge: true })
    
    return { success: true }
  } catch (error: any) {
    console.error('Firestore save error:', error)
    // Fallback to localStorage if Firestore fails
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    cards[cardId] = { ...cardData, id: cardId, updatedAt: new Date().toISOString() }
    localStorage.setItem('bioCards', JSON.stringify(cards))
    return { success: true }
  }
}

export async function getAllCards() {
  const userId = getUserId()
  if (!userId) return { success: false, cards: [] }

  if (!USE_FIRESTORE) {
    // Temporary localStorage fallback
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    return { success: true, cards: Object.values(cards) }
  }

  try {
    const cardsRef = collection(db, 'users', userId, 'cards')
    const snapshot = await getDocs(cardsRef)
    
    const cards: any[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      cards.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      })
    })
    
    return { success: true, cards }
  } catch (error: any) {
    console.error('Firestore load error:', error)
    // Fallback to localStorage if Firestore fails
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    return { success: true, cards: Object.values(cards) }
  }
}

export async function getCard(cardId: string) {
  const userId = getUserId()
  if (!userId) throw new Error('User not logged in')

  if (!USE_FIRESTORE) {
    // Temporary localStorage fallback
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    const card = cards[cardId]
    return card ? { success: true, card } : { success: false, card: null }
  }

  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    const snapshot = await getDoc(cardRef)
    
    if (!snapshot.exists()) return { success: false, card: null }
    
    const data = snapshot.data()
    return {
      success: true,
      card: {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      }
    }
  } catch (error: any) {
    console.error('Firestore get error:', error)
    // Fallback to localStorage
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    const card = cards[cardId]
    return card ? { success: true, card } : { success: false, card: null }
  }
}

export async function deleteCard(cardId: string) {
  const userId = getUserId()
  if (!userId) throw new Error('User not logged in')

  if (!USE_FIRESTORE) {
    // Temporary localStorage fallback
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    delete cards[cardId]
    localStorage.setItem('bioCards', JSON.stringify(cards))
    return { success: true }
  }

  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    await deleteDoc(cardRef)
    
    // Also remove from localStorage cache
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    delete cards[cardId]
    localStorage.setItem('bioCards', JSON.stringify(cards))
    
    return { success: true }
  } catch (error: any) {
    console.error('Firestore delete error:', error)
    // Fallback to localStorage
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    delete cards[cardId]
    localStorage.setItem('bioCards', JSON.stringify(cards))
    return { success: true }
  }
}

export async function updateAnalytics(cardId: string, analytics: { views?: number; clicks?: number }) {
  const userId = getUserId()
  if (!userId) throw new Error('User not logged in')

  if (!USE_FIRESTORE) {
    // Temporary localStorage fallback
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    if (cards[cardId]) {
      cards[cardId].analytics = { ...cards[cardId].analytics, ...analytics }
      localStorage.setItem('bioCards', JSON.stringify(cards))
    }
    return { success: true }
  }

  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    await setDoc(cardRef, {
      analytics,
      updatedAt: serverTimestamp()
    }, { merge: true })
    
    return { success: true }
  } catch (error: any) {
    console.error('Firestore analytics error:', error)
    // Fallback to localStorage
    const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    if (cards[cardId]) {
      cards[cardId].analytics = { ...cards[cardId].analytics, ...analytics }
      localStorage.setItem('bioCards', JSON.stringify(cards))
    }
    return { success: true }
  }
}
