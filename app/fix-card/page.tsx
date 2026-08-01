'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'

export default function FixCardPage() {
  const [status, setStatus] = useState<'checking' | 'fixed' | 'error' | 'no-config'>('checking')
  const [message, setMessage] = useState('')
  const [cardId, setCardId] = useState('')
  const router = useRouter()

  useEffect(() => {
    fixCard()
  }, [])

  const fixCard = () => {
    setStatus('checking')
    
    try {
      // Get the current config from editor
      const configStr = localStorage.getItem('currentBioLinkConfig')
      const previewCardId = localStorage.getItem('editorPreviewCardId')
      
      if (!configStr) {
        setStatus('no-config')
        setMessage('No editor config found. Please go to /create to start.')
        return
      }

      const config = JSON.parse(configStr)
      
      // Use existing preview card ID or the one from URL
      const cardIdToUse = previewCardId || '1139dai67'
      
      // Get existing cards
      const cardsStr = localStorage.getItem('bioCards') || '{}'
      const cards = JSON.parse(cardsStr)
      
      // Save the card
      cards[cardIdToUse] = {
        id: cardIdToUse,
        config: {
          profile: config.profile,
          links: config.links,
          theme: config.theme,
          socialLinks: config.socialLinks || {},
        },
        analytics: cards[cardIdToUse]?.analytics || { views: 0, clicks: 0 },
        createdAt: cards[cardIdToUse]?.createdAt || new Date().toISOString(),
      }
      
      // Save back to localStorage
      localStorage.setItem('bioCards', JSON.stringify(cards))
      localStorage.setItem('editorPreviewCardId', cardIdToUse)
      
      setCardId(cardIdToUse)
      setStatus('fixed')
      setMessage(`Successfully saved card! You can now view it at /card/${cardIdToUse}`)
      
    } catch (error: any) {
      setStatus('error')
      setMessage(`Error: ${error.message}`)
      console.error('Fix error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          {status === 'checking' && (
            <>
              <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Fixing Your Card...</h1>
              <p className="text-gray-600">Please wait</p>
            </>
          )}

          {status === 'fixed' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">✅ Card Fixed!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="space-y-3">
                <a
                  href={`/card/${cardId}`}
                  target="_blank"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-center"
                >
                  View Your Card
                </a>
                <button
                  onClick={() => router.push('/editor')}
                  className="block w-full px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Back to Editor
                </button>
                <button
                  onClick={() => router.push('/debug')}
                  className="block w-full px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Debug Info
                </button>
              </div>
            </>
          )}

          {status === 'no-config' && (
            <>
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">⚠️ No Config Found</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/create')}
                  className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Create Bio Link
                </button>
                <button
                  onClick={() => router.push('/debug')}
                  className="block w-full px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Debug Info
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">❌ Error</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              
              <div className="space-y-3">
                <button
                  onClick={fixCard}
                  className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/debug')}
                  className="block w-full px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Debug Info
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
