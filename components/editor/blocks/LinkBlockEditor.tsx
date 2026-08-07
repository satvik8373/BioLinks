'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import { detectPlatformFromUrl } from '@/lib/detectPlatform'
import { BlockEditorContainer, BlockFieldLabel } from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function LinkBlockEditor({ link, updateLink }: BlockEditorProps) {
  const urlValue = link.url || ''
  const detected = urlValue ? detectPlatformFromUrl(urlValue) : null

  const handleUrlChange = (newUrl: string) => {
    updateLink(link.id, 'url', newUrl)
    const autoDetected = detectPlatformFromUrl(newUrl)
    if (autoDetected) {
      updateLink(link.id, 'platform', autoDetected.id)
      updateLink(link.id, 'icon', autoDetected.icon)
      const isGenericTitle =
        !link.text ||
        ['New Link', 'Untitled Link', 'Standard Link'].includes(link.text)
      if (isGenericTitle) {
        updateLink(link.id, 'text', autoDetected.defaultTitle || autoDetected.name)
      }
    }
  }

  return (
    <BlockEditorContainer
      title="Link settings"
      description="Manage destination URL and smart auto-detection."
    >
      <div className="space-y-3">
        <div>
          <BlockFieldLabel
            label="Destination URL"
            hint="Paste any website, social profile, or web URL."
          />
          <Input
            type="url"
            value={urlValue}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://instagram.com/yourname"
          />
        </div>

        {detected && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-brand-50 border border-brand-200/70 rounded-2xl text-xs font-bold text-brand-900">
            <Sparkles size={13} className="text-brand-500 flex-shrink-0 animate-pulse" />
            <span>
              Auto-detected: {detected.name}{' '}
              <span className="font-medium text-brand-700">({detected.category})</span>
            </span>
          </div>
        )}
      </div>
    </BlockEditorContainer>
  )
}
