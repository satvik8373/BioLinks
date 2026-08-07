'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockFieldLabel, BlockSelect } from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

const PLACEHOLDERS: Record<string, string> = {
  email:    'you@example.com',
  phone:    '+1 234 567 8900',
  whatsapp: '+1 234 567 8900',
  telegram: '@username',
  address:  '123 Main St, City',
}

const VALUE_LABELS: Record<string, string> = {
  email:    'Email Address',
  phone:    'Phone Number',
  whatsapp: 'WhatsApp Number',
  telegram: 'Telegram Username',
  address:  'Physical Address',
}

export default function ContactBlockEditor({ link, updateLink }: BlockEditorProps) {
  const contactType = link.contactType || 'email'

  return (
    <BlockEditorContainer
      title="Contact button"
      description="Allow visitors to quickly reach you via email, phone, or chat."
    >
      <div className="space-y-4">
        <div>
          <BlockFieldLabel
            label="Contact Method"
            hint="Select your preferred channel."
          />
          <BlockSelect
            value={contactType}
            onChange={(v) => updateLink(link.id, 'contactType', v)}
          >
            <option value="email">Email Address</option>
            <option value="phone">Phone Number</option>
            <option value="whatsapp">WhatsApp Chat</option>
            <option value="telegram">Telegram Chat</option>
            <option value="address">Physical Address</option>
          </BlockSelect>
        </div>

        <div>
          <BlockFieldLabel
            label={VALUE_LABELS[contactType] || 'Contact Value'}
            hint="Enter your contact target."
          />
          <Input
            type={contactType === 'email' ? 'email' : 'text'}
            value={link.contactValue || ''}
            onChange={(e) => updateLink(link.id, 'contactValue', e.target.value)}
            placeholder={PLACEHOLDERS[contactType] || 'Contact info'}
          />
        </div>
      </div>
    </BlockEditorContainer>
  )
}
