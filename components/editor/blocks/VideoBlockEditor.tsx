'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockRadioOption } from './BlockEditorContainer'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function VideoBlockEditor({ link, updateLink }: BlockEditorProps) {
  const currentOption = link.videoClickOption || 'display_video'

  return (
    <BlockEditorContainer
      title="Video link"
      description="Embed YouTube, TikTok, or Vimeo videos on your Linktree."
    >
      <div className="space-y-4">
        {/* Section 1: When a visitor clicks */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-900">When a visitor clicks:</h4>
          <div className="space-y-2">
            {[
              { id: 'display_video', label: 'Display video on my Linktree' },
              { id: 'open_youtube', label: 'Open video on YouTube / platform' },
              { id: 'display_latest', label: "Display channel's latest video" },
            ].map((opt) => (
              <BlockRadioOption
                key={opt.id}
                selected={currentOption === opt.id}
                onClick={() => updateLink(link.id, 'videoClickOption', opt.id)}
                title={opt.label}
                name={`videoOption-${link.id}`}
              />
            ))}
          </div>
        </div>

        {/* Section 2: Video Details */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-900">Video Subtext (Optional)</label>
            <input
              type="text"
              value={link.description || ''}
              onChange={(e) => updateLink(link.id, 'description', e.target.value)}
              placeholder="What is this video about?"
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none focus:border-purple-500 transition-all font-medium"
            />
          </div>
        </div>
      </div>
    </BlockEditorContainer>
  )
}
