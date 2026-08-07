'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer } from './BlockEditorContainer'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function HeaderBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <BlockEditorContainer
      title="Header title"
      description="Divide your links into organized sections."
    >
      <div className="space-y-1">
        <label className="block text-xs font-bold text-gray-900 mb-1">
          Header Title Text
        </label>
        <input
          type="text"
          value={link.text || ''}
          onChange={(e) => updateLink(link.id, 'text', e.target.value)}
          placeholder="e.g. My Featured Projects"
          className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-purple-500 transition-all font-semibold"
        />
      </div>
    </BlockEditorContainer>
  )
}
