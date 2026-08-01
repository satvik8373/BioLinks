'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditCardPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.templateId as string

  useEffect(() => {
    // Load the card from localStorage
    const savedCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    const card = savedCards[cardId]

    if (!card) {
      // Card not found, redirect to dashboard
      router.push('/dashboard')
      return
    }

    // Load the card config into the editor
    localStorage.setItem('currentBioLinkConfig', JSON.stringify(card.config))
    
    // Redirect to the main editor
    router.push('/editor')
  }, [cardId, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-neo-purple border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading card...</p>
      </div>
    </div>
  )
}
