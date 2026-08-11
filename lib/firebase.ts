import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { getApp, auth, googleProvider, githubProvider } from './firebase-auth'

let db: Firestore | null = null
let storage: FirebaseStorage | null = null

// Lazy getters that initialize on-demand
export const getDb = (): Firestore => {
  if (!db) {
    const app = getApp()
    db = getFirestore(app)
  }
  return db
}

export const getStorageInstance = (): FirebaseStorage => {
  if (!storage) {
    const app = getApp()
    storage = getStorage(app)
  }
  return storage
}

// Legacy exports for backward compatibility
export { auth, googleProvider, githubProvider }

// Re-export app getter
export { getApp as app }

// Export db and storage as getters
export { db, storage }
