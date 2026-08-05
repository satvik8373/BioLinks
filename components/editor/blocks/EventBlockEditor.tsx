'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function EventBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Event & RSVP</h3>
        <p className="text-xs text-gray-500">Promote upcoming events, live shows, webinars, or meetups.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">Event Date</label>
          <input
            type="date"
            value={link.eventDate || ''}
            onChange={e => updateLink(link.id, 'eventDate', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black cursor-pointer transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">Event Time</label>
          <input
            type="time"
            value={link.eventTime || ''}
            onChange={e => updateLink(link.id, 'eventTime', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black cursor-pointer transition-all"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">Venue / Location</label>
        <p className="text-xs text-gray-500 mb-1.5">Physical address or online meeting link.</p>
        <input
          type="text"
          value={link.eventLocation || ''}
          onChange={e => updateLink(link.id, 'eventLocation', e.target.value)}
          placeholder="Main Stage Arena / Zoom Link"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">Tickets / RSVP Link</label>
        <p className="text-xs text-gray-500 mb-1.5">Destination URL for ticket booking.</p>
        <input
          type="url"
          value={link.url || ''}
          onChange={e => updateLink(link.id, 'url', e.target.value)}
          placeholder="https://eventbrite.com/e/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
