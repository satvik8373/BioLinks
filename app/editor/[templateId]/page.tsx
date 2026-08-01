'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function EditCardPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.templateId as string

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
    const card = savedCards[cardId]

    if (!card) {
      router.push('/my-cards')
      return
    }

    localStorage.setItem('currentBioLinkConfig', JSON.stringify(card.config))
    localStorage.setItem('editorPreviewCardId', cardId)
    router.push('/editor')
  }, [cardId, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-extrabold text-indigo-950">Loading card editor...</p>
      </div>
    </div>
  )
}
