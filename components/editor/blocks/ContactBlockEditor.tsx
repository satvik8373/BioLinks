'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function ContactBlockEditor({ link, updateLink }: BlockEditorProps) {
  const contactType = link.contactType || 'email'

  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Contact button</h3>
        <p className="text-xs text-gray-500">Allow visitors to quickly reach you via email, phone, or chat.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Contact Method
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Select preferred channel.</p>
        <select
          value={contactType}
          onChange={e => updateLink(link.id, 'contactType', e.target.value)}
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black cursor-pointer transition-all"
        >
          <option value="email">Email Address</option>
          <option value="phone">Phone Number</option>
          <option value="whatsapp">WhatsApp Chat</option>
          <option value="telegram">Telegram Chat</option>
          <option value="address">Physical Address</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          {contactType === 'email' ? 'Email Address' :
           contactType === 'address' ? 'Address' : 'Number / Username'}
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Enter contact target value.</p>
        <input
          type={contactType === 'email' ? 'email' : 'text'}
          value={link.contactValue || ''}
          onChange={e => updateLink(link.id, 'contactValue', e.target.value)}
          placeholder={
            contactType === 'email'    ? 'you@example.com' :
            contactType === 'phone'    ? '+1 234 567 8900' :
            contactType === 'whatsapp' ? '+1 234 567 8900' :
            contactType === 'telegram' ? '@username' :
            contactType === 'address'  ? '123 Main St, City' :
            'Contact info'
          }
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
