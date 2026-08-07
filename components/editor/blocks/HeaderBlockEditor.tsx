'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockFieldLabel } from './BlockEditorContainer'
import Input from '@/components/ui/Input'

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
      <div>
        <BlockFieldLabel label="Header Title Text" />
        <Input
          type="text"
          value={link.text || ''}
          onChange={(e) => updateLink(link.id, 'text', e.target.value)}
          placeholder="e.g. My Featured Projects"
        />
      </div>
    </BlockEditorContainer>
  )
}
