'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DebugPage() {
  const [bioCards, setBioCards] = useState<any>({})
  const [previewCardId, setPreviewCardId] = useState<string>('')
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      const previewId = localStorage.getItem('editorPreviewCardId') || ''
      const config = localStorage.getItem('currentBioLinkConfig')
      
      setBioCards(cards)
      setPreviewCardId(previewId)
      setCurrentConfig(config ? JSON.parse(config) : null)
    } catch (error) {
      console.error('Error loading debug info:', error)
    }
  }, [])

  const cardIds = Object.keys(bioCards)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🔍 Debug Information</h1>

          {/* Preview Card ID */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Preview Card ID</h2>
            <p className="text-sm text-blue-700 font-mono break-all">
              {previewCardId || '(none)'}
            </p>
            {previewCardId && (
              <a 
                href={`/card/${previewCardId}`}
                target="_blank"
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Open Preview Card
              </a>
            )}
          </div>

          {/* Saved Cards */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-2">Saved Bio Cards</h2>
            {cardIds.length === 0 ? (
              <p className="text-sm text-green-700">No cards saved yet</p>
            ) : (
              <div className="space-y-3">
                {cardIds.map(id => (
                  <div key={id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                    <div className="flex-1">
                      <p className="text-sm font-mono text-gray-700 break-all">{id}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Title: {bioCards[id]?.config?.profile?.title || '(no title)'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Links: {bioCards[id]?.config?.links?.length || 0}
                      </p>
                    </div>
                    <a 
                      href={`/card/${id}`}
                      target="_blank"
                      className="ml-4 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Config */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">Current Editor Config</h2>
            {currentConfig ? (
              <div className="space-y-2">
                <p className="text-sm text-purple-700">
                  <strong>Title:</strong> {currentConfig.profile?.title || '(none)'}
                </p>
                <p className="text-sm text-purple-700">
                  <strong>Bio:</strong> {currentConfig.profile?.bio || '(none)'}
                </p>
                <p className="text-sm text-purple-700">
                  <strong>Links:</strong> {currentConfig.links?.length || 0}
                </p>
                <p className="text-sm text-purple-700">
                  <strong>Theme:</strong> {currentConfig.theme?.id || '(none)'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-purple-700">No config found</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/editor')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Go to Editor
            </button>
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Create New
            </button>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
          </div>

          {/* Raw Data */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
              View Raw Data (JSON)
            </summary>
            <div className="mt-3 p-4 bg-gray-900 rounded-lg overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">
                {JSON.stringify({ bioCards, previewCardId, currentConfig }, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}
