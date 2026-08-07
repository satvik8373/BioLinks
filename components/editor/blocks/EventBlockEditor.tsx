'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import { BlockEditorContainer, BlockFieldLabel } from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function EventBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <BlockEditorContainer
      title="Event & RSVP"
      description="Promote upcoming events, live shows, webinars, or meetups."
    >
      <div className="space-y-4">
        {/* Date & Time row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <BlockFieldLabel label="Event Date" />
            <Input
              type="date"
              value={link.eventDate || ''}
              onChange={(e) => updateLink(link.id, 'eventDate', e.target.value)}
            />
          </div>
          <div>
            <BlockFieldLabel label="Event Time" />
            <Input
              type="time"
              value={link.eventTime || ''}
              onChange={(e) => updateLink(link.id, 'eventTime', e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <BlockFieldLabel
            label="Venue / Location"
            hint="Physical address or online meeting link."
          />
          <Input
            type="text"
            value={link.eventLocation || ''}
            onChange={(e) => updateLink(link.id, 'eventLocation', e.target.value)}
            placeholder="Main Stage Arena / Zoom link"
          />
        </div>

        {/* Tickets URL */}
        <div>
          <BlockFieldLabel
            label="Tickets / RSVP Link"
            hint="Destination URL for ticket booking."
          />
          <Input
            type="url"
            value={link.url || ''}
            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
            placeholder="https://eventbrite.com/e/..."
          />
        </div>
      </div>
    </BlockEditorContainer>
  )
}
