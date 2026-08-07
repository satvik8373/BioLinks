'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockFieldLabel, BlockTextarea } from './BlockEditorContainer'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function TextBlockEditor({ link, updateLink }: BlockEditorProps) {
  const handleChange = (v: string) => {
    updateLink(link.id, 'text', v)
    updateLink(link.id, 'description', v)
  }

  return (
    <BlockEditorContainer
      title="Text block"
      description="Display announcements, bio notes, or custom text on your bio link."
    >
      <div>
        <BlockFieldLabel
          label="Text Content"
          hint="Paragraph or announcement message."
        />
        <BlockTextarea
          rows={3}
          value={link.description || link.text || ''}
          onChange={handleChange}
          placeholder="Welcome to my official profile page! Check out my links below…"
        />
      </div>
    </BlockEditorContainer>
  )
}
