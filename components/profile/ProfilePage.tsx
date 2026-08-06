'use client'

import React from 'react'
import BioCard, { BioCardProps } from '@/components/card/BioCard'

export interface ProfilePageProps extends BioCardProps {
  className?: string
}

/**
 * 🏆 ProfilePage — Single Unified Rendering Engine
 * 
 * This is THE ONLY component that renders a bio profile.
 * Used by:
 * - Public pages: /[username]
 * - Editor preview: wrapped in <iframe id="preview-iframe"> (/preview-iframe)
 * 
 * Theme updates happen via CSS variables ONLY.
 * Never conditionally render based on theme.
 */
export default function ProfilePage({
  cardId = 'default',
  overrideConfig,
  isPreview = false,
  hideQRCode = false,
  className = '',
}: ProfilePageProps) {
  return (
    <div suppressHydrationWarning className={`w-full h-full ${className}`}>
      <BioCard
        cardId={cardId}
        overrideConfig={overrideConfig}
        isPreview={isPreview}
        hideQRCode={hideQRCode}
      />
    </div>
  )
}

