import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore
let auth: Auth
let storage: FirebaseStorage
let googleProvider: GoogleAuthProvider
let githubProvider: GithubAuthProvider

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()
  githubProvider = new GithubAuthProvider()
} else {
  // Server-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
  auth = getAuth(app)
  storage = getStorage(app)
  googleProvider = new GoogleAuthProvider()
  githubProvider = new GithubAuthProvider()
}

export { app, db, auth, storage, googleProvider, githubProvider }
