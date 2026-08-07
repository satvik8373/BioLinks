import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { app, auth, googleProvider, githubProvider } from './firebase-auth'

let db: Firestore
let storage: FirebaseStorage

if (typeof window !== 'undefined') {
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, db, auth, storage, googleProvider, githubProvider }
