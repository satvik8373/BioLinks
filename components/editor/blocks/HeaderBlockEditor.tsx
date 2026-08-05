'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function HeaderBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Header title</h3>
        <p className="text-xs text-gray-500">Divide your links into organized sections.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Header Title Text
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Section header label displayed on your bio link.</p>
        <input
          type="text"
          value={link.text || ''}
          onChange={e => updateLink(link.id, 'text', e.target.value)}
          placeholder="e.g. My Featured Projects"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
