'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function EmbedBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Audio & Embed player</h3>
        <p className="text-xs text-gray-500">Embed Spotify tracks, SoundCloud players, or custom audio widgets.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Target Media URL
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Paste Spotify track, album, or SoundCloud URL.</p>
        <input
          type="url"
          value={link.url || ''}
          onChange={e => updateLink(link.id, 'url', e.target.value)}
          placeholder="https://open.spotify.com/track/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Direct Embed URL (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Custom iframe src or embed URL.</p>
        <input
          type="url"
          value={link.embedUrl || ''}
          onChange={e => updateLink(link.id, 'embedUrl', e.target.value)}
          placeholder="https://open.spotify.com/embed/track/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
