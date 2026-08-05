'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function DonationBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Payment & Support</h3>
        <p className="text-xs text-gray-500">Collect tips, donations, or payment link support.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Payment Provider
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Select service integration.</p>
        <select
          value={link.paymentType || 'stripe'}
          onChange={e => updateLink(link.id, 'paymentType', e.target.value)}
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black cursor-pointer transition-all"
        >
          <option value="stripe">Stripe Payment Link</option>
          <option value="paypal">PayPal.me</option>
          <option value="tip">Buy Me a Coffee / Tip Jar</option>
          <option value="venmo">Venmo</option>
          <option value="cashapp">Cash App</option>
          <option value="donation">One-time Donation</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Payment URL
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Destination link to payment checkout.</p>
        <input
          type="url"
          value={link.url || ''}
          onChange={e => updateLink(link.id, 'url', e.target.value)}
          placeholder="https://buy.stripe.com/... or paypal.me/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">
            Suggested Amount
          </label>
          <p className="text-xs text-gray-500 mb-1.5">Currency & amount</p>
          <div className="flex">
            <select
              value={link.paymentCurrency || '$'}
              onChange={e => updateLink(link.id, 'paymentCurrency', e.target.value)}
              className="px-3 py-3 text-xs font-bold border border-r-0 border-gray-200/90 rounded-l-2xl bg-gray-50 focus:outline-none cursor-pointer"
            >
              {['$','€','£','¥','₹','₩'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              value={link.paymentAmount || ''}
              onChange={e => updateLink(link.id, 'paymentAmount', e.target.value)}
              placeholder="5.00"
              className="flex-1 px-3 py-3 text-xs border border-gray-200/90 rounded-r-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-semibold"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">
            Button Subtitle
          </label>
          <p className="text-xs text-gray-500 mb-1.5">Brief description</p>
          <input
            type="text"
            value={link.description || ''}
            onChange={e => updateLink(link.id, 'description', e.target.value)}
            placeholder="Support my work"
            className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
          />
        </div>
      </div>
    </div>
  )
}
