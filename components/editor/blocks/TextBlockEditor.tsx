'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function TextBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Text block</h3>
        <p className="text-xs text-gray-500">Display announcements, bio notes, or custom text on your bio link.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Text Content / Announcement
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Paragraph or announcement message.</p>
        <textarea
          rows={3}
          value={link.description || link.text || ''}
          onChange={e => {
            updateLink(link.id, 'text', e.target.value)
            updateLink(link.id, 'description', e.target.value)
          }}
          placeholder="Welcome to my official profile page! Check out my links below…"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
