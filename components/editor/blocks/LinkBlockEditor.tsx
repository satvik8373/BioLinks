'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { detectPlatformFromUrl } from '@/lib/detectPlatform'
import { Link as LinkIcon, Sparkles } from 'lucide-react'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function LinkBlockEditor({ link, updateLink }: BlockEditorProps) {
  const urlValue = link.url || ''
  const detected = urlValue ? detectPlatformFromUrl(urlValue) : null

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Link settings</h3>
        <p className="text-xs text-gray-500">Manage destination URL and smart auto-detection.</p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-bold text-gray-900">
          Destination URL
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Paste any website, social profile, or web URL.
        </p>
        <input
          type="url"
          value={urlValue}
          onChange={(e) => {
            const newUrl = e.target.value
            updateLink(link.id, 'url', newUrl)
            const autoDetected = detectPlatformFromUrl(newUrl)
            if (autoDetected) {
              updateLink(link.id, 'platform', autoDetected.id)
              updateLink(link.id, 'icon', autoDetected.icon)
              if (!link.text || link.text === 'New Link' || link.text === 'Untitled Link' || link.text === 'Standard Link') {
                updateLink(link.id, 'text', autoDetected.defaultTitle || autoDetected.name)
              }
            }
          }}
          placeholder="https://instagram.com/yourname or https://youtube.com/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
        {detected && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200/80 rounded-xl text-xs font-bold text-purple-900">
            <Sparkles size={14} className="text-purple-600 animate-pulse" />
            <span>Auto-Detected: {detected.name} ({detected.category})</span>
          </div>
        )}
      </div>
    </div>
  )
}
