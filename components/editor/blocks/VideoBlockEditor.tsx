'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockFieldLabel, BlockRadioOption } from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

const VIDEO_OPTIONS = [
  { id: 'display_video',  label: 'Display video on my Linktree' },
  { id: 'open_youtube',   label: 'Open video on YouTube / platform' },
  { id: 'display_latest', label: "Display channel's latest video" },
] as const

export default function VideoBlockEditor({ link, updateLink }: BlockEditorProps) {
  const currentOption = link.videoClickOption || 'display_video'

  return (
    <BlockEditorContainer
      title="Video link"
      description="Embed YouTube, TikTok, or Vimeo videos on your Linktree."
    >
      <div className="space-y-4">
        {/* Click behaviour */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            When a visitor clicks:
          </p>
          <div className="space-y-1">
            {VIDEO_OPTIONS.map((opt) => (
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

        {/* Subtext */}
        <div className="pt-3 border-t border-slate-100">
          <BlockFieldLabel label="Video Subtext (Optional)" />
          <Input
            type="text"
            value={link.description || ''}
            onChange={(e) => updateLink(link.id, 'description', e.target.value)}
            placeholder="What is this video about?"
          />
        </div>
      </div>
    </BlockEditorContainer>
  )
}
