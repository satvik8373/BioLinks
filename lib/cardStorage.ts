/**
 * Centralized Card Storage
 * Saves to BOTH localStorage (instant) and Firestore (synced across devices)
 */

import { saveBioCard, getAllBioCards, deleteBioCard, updateCardAnalytics } from './firestore-cards'

// Save a single card to both localStorage and Firestore
export async function saveCard(cardId: string, cardData: any) {
  try {
    // 1. Save to localStorage (instant)
    const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    bioCards[cardId] = cardData
    localStorage.setItem('bioCards', JSON.stringify(bioCards))

    // 2. Save to Firestore (if user is logged in)
    const userProfile = localStorage.getItem('userProfile')
    if (userProfile) {
      const user = JSON.parse(userProfile)
      if (user.id) {
        await saveBioCard(user.id, cardId, cardData)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving card:', error)
    return { success: false, error }
  }
}

// Load all cards from Firestore and merge with localStorage
export async function loadCards() {
  try {
    const userProfile = localStorage.getItem('userProfile')
    
    if (!userProfile) {
      // Not logged in - return localStorage only
      const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      return { success: true, cards: bioCards }
    }

    const user = JSON.parse(userProfile)
    if (!user.id) {
      // No user ID - return localStorage only
      const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      return { success: true, cards: bioCards }
    }

    // Get cards from Firestore
    const result = await getAllBioCards(user.id)
    
    if (result.success && result.data) {
      // Convert array to object
      const firestoreCards: any = {}
      result.data.forEach((card: any) => {
        firestoreCards[card.id] = card
      })

      // Merge with localStorage (Firestore is source of truth)
      localStorage.setItem('bioCards', JSON.stringify(firestoreCards))
      
      return { success: true, cards: firestoreCards }
    } else {
      // Firestore failed - return localStorage
      const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      return { success: true, cards: bioCards }
    }
  } catch (error) {
    console.error('Error loading cards:', error)
    // Return localStorage as fallback
    const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    return { success: true, cards: bioCards }
  }
}

// Delete a card from both localStorage and Firestore
export async function removeCard(cardId: string) {
  try {
    // 1. Remove from localStorage
    const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    delete bioCards[cardId]
    localStorage.setItem('bioCards', JSON.stringify(bioCards))

    // 2. Remove from Firestore
    const userProfile = localStorage.getItem('userProfile')
    if (userProfile) {
      const user = JSON.parse(userProfile)
      if (user.id) {
        await deleteBioCard(user.id, cardId)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting card:', error)
    return { success: false, error }
  }
}

// Update card analytics (views, clicks)
export async function saveAnalytics(cardId: string, analytics: any) {
  try {
    // 1. Update localStorage
    const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    if (bioCards[cardId]) {
      bioCards[cardId].analytics = analytics
      localStorage.setItem('bioCards', JSON.stringify(bioCards))
    }

    // 2. Update Firestore
    const userProfile = localStorage.getItem('userProfile')
    if (userProfile) {
      const user = JSON.parse(userProfile)
      if (user.id) {
        await updateCardAnalytics(user.id, cardId, analytics)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving analytics:', error)
    return { success: false, error }
  }
}

// Sync localStorage cards to Firestore (one-time migration)
export async function syncToFirestore() {
  try {
    const userProfile = localStorage.getItem('userProfile')
    if (!userProfile) {
      return { success: false, error: 'User not logged in' }
    }

    const user = JSON.parse(userProfile)
    if (!user.id) {
      return { success: false, error: 'No user ID' }
    }

    const bioCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    const cardIds = Object.keys(bioCards)

    if (cardIds.length === 0) {
      return { success: true, message: 'No cards to sync' }
    }

    // Upload all cards to Firestore
    const promises = cardIds.map(cardId => 
      saveBioCard(user.id, cardId, bioCards[cardId])
    )

    await Promise.all(promises)

    return { success: true, message: `Synced ${cardIds.length} cards` }
  } catch (error) {
    console.error('Error syncing to Firestore:', error)
    return { success: false, error }
  }
}
