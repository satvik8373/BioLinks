import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Check if Firebase config is available
const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.projectId !== 'your_project_id'
  )
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null
let githubProvider: GithubAuthProvider | null = null

// Lazy initialization - only initialize when Firebase is properly configured
const initializeFirebase = () => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured - skipping initialization')
    return false
  }

  if (!app) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
    } else {
      app = getApps()[0]
    }
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    githubProvider = new GithubAuthProvider()
  }
  return true
}

// Initialize immediately if we're in a proper runtime environment
if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
  initializeFirebase()
}

// Export getters that initialize on-demand
export const getApp = (): FirebaseApp => {
  if (!app) initializeFirebase()
  if (!app) throw new Error('Firebase not configured')
  return app
}

export const getAuthInstance = (): Auth => {
  if (!auth) initializeFirebase()
  if (!auth) throw new Error('Firebase Auth not configured')
  return auth
}

export const getGoogleProvider = (): GoogleAuthProvider => {
  if (!googleProvider) initializeFirebase()
  if (!googleProvider) throw new Error('Firebase Auth not configured')
  return googleProvider
}

export const getGithubProvider = (): GithubAuthProvider => {
  if (!githubProvider) initializeFirebase()
  if (!githubProvider) throw new Error('Firebase Auth not configured')
  return githubProvider
}

// Legacy exports for backward compatibility (will throw if not configured)
export { app, auth, googleProvider, githubProvider }
