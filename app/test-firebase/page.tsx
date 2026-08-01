'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export default function TestFirebasePage() {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState<any>(null)

  useEffect(() => {
    testFirebase()
  }, [])

  const testFirebase = async () => {
    try {
      setStatus('testing')
      setMessage('Testing Firebase connection...')

      // Test 1: Check if db is initialized
      if (!db) {
        throw new Error('Firebase db is not initialized')
      }

      setMessage('✅ Firebase initialized\n\nTesting Firestore write...')

      // Test 2: Try to write a test document
      const testCollection = collection(db, 'test')
      const testDoc = await addDoc(testCollection, {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'This is a test document'
      })

      setMessage('✅ Firebase initialized\n✅ Firestore write successful\n\nTesting Firestore read...')

      // Test 3: Try to read documents
      const querySnapshot = await getDocs(testCollection)
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      setMessage('✅ Firebase initialized\n✅ Firestore write successful\n✅ Firestore read successful')
      setDetails({
        testDocId: testDoc.id,
        documentsInTestCollection: docs.length,
        firebaseConfig: {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        }
      })
      setStatus('success')

    } catch (error: any) {
      console.error('Firebase test failed:', error)
      setStatus('error')
      setMessage(`❌ Firebase test failed:\n\n${error.message}`)
      setDetails({
        error: error.message,
        stack: error.stack,
        firebaseConfig: {
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'MISSING',
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'MISSING',
          hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔥 Firebase Connection Test</h1>

          {/* Status */}
          <div className={`p-6 rounded-xl mb-6 ${
            status === 'testing' ? 'bg-blue-50 border border-blue-200' :
            status === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              {status === 'testing' && (
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full flex-shrink-0" />
              )}
              {status === 'success' && (
                <svg className="w-8 h-8 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="w-8 h-8 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <div className="flex-1">
                <pre className={`text-sm whitespace-pre-wrap font-mono ${
                  status === 'testing' ? 'text-blue-800' :
                  status === 'success' ? 'text-green-800' :
                  'text-red-800'
                }`}>{message}</pre>
              </div>
            </div>
          </div>

          {/* Details */}
          {details && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Details:</h2>
              <pre className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">What This Tests:</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Firebase SDK initialization with your config</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Firestore write permission (creates a test document)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>Firestore read permission (reads test documents)</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={testFirebase}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Test Again
            </button>
            <a
              href="/editor"
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Go to Editor
            </a>
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Firebase Console
            </a>
          </div>

          {status === 'error' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Troubleshooting:</h3>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Check if Firestore is enabled in Firebase Console</li>
                <li>• Verify .env.local has all Firebase config values</li>
                <li>• Make sure dev server was restarted after adding .env.local</li>
                <li>• Check Firestore security rules allow read/write</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
