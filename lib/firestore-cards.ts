import { db } from './firebase'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'

// Save a bio card to Firestore
export async function saveBioCard(userId: string, cardId: string, cardData: any) {
  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    await setDoc(cardRef, {
      ...cardData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error saving card:', error)
    return { success: false, error }
  }
}

// Get a single bio card
export async function getBioCard(userId: string, cardId: string) {
  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    const cardSnap = await getDoc(cardRef)
    
    if (cardSnap.exists()) {
      return { success: true, data: { id: cardSnap.id, ...cardSnap.data() } }
    } else {
      return { success: false, error: 'Card not found' }
    }
  } catch (error) {
    console.error('Error getting card:', error)
    return { success: false, error }
  }
}

// Get all bio cards for a user
export async function getAllBioCards(userId: string) {
  try {
    const cardsRef = collection(db, 'users', userId, 'cards')
    const cardsSnap = await getDocs(cardsRef)
    
    const cards: any[] = []
    cardsSnap.forEach((doc) => {
      cards.push({ id: doc.id, ...doc.data() })
    })
    
    return { success: true, data: cards }
  } catch (error) {
    console.error('Error getting cards:', error)
    return { success: false, error, data: [] }
  }
}

// Delete a bio card
export async function deleteBioCard(userId: string, cardId: string) {
  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    await deleteDoc(cardRef)
    return { success: true }
  } catch (error) {
    console.error('Error deleting card:', error)
    return { success: false, error }
  }
}

// Update card analytics
export async function updateCardAnalytics(userId: string, cardId: string, analytics: any) {
  try {
    const cardRef = doc(db, 'users', userId, 'cards', cardId)
    await updateDoc(cardRef, {
      'analytics': analytics,
      'updatedAt': serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating analytics:', error)
    return { success: false, error }
  }
}

// Save user profile to Firestore
export async function saveUserProfile(userId: string, profileData: any) {
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true })
    return { success: true }
  } catch (error) {
    console.error('Error saving profile:', error)
    return { success: false, error }
  }
}

// Get user profile from Firestore
export async function getUserProfile(userId: string) {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { success: true, data: { id: userSnap.id, ...userSnap.data() } }
    } else {
      return { success: false, error: 'Profile not found' }
    }
  } catch (error) {
    console.error('Error getting profile:', error)
    return { success: false, error }
  }
}
