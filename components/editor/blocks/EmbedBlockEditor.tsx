'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockFieldLabel } from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function EmbedBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <BlockEditorContainer
      title="Audio & embed player"
      description="Embed Spotify tracks, SoundCloud players, or custom audio widgets."
    >
      <div className="space-y-4">
        <div>
          <BlockFieldLabel
            label="Target Media URL"
            hint="Paste a Spotify track, album, or SoundCloud URL."
          />
          <Input
            type="url"
            value={link.url || ''}
            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
            placeholder="https://open.spotify.com/track/..."
          />
        </div>

        <div>
          <BlockFieldLabel
            label="Direct Embed URL (Optional)"
            hint="Custom iframe src or embed URL."
          />
          <Input
            type="url"
            value={link.embedUrl || ''}
            onChange={(e) => updateLink(link.id, 'embedUrl', e.target.value)}
            placeholder="https://open.spotify.com/embed/track/..."
          />
        </div>
      </div>
    </BlockEditorContainer>
  )
}
