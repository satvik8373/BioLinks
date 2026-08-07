'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import {
  BlockEditorContainer,
  BlockFieldLabel,
  BlockSelect,
} from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

const CURRENCIES = ['$', '€', '£', '¥', '₹', '₩']

export default function DonationBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <BlockEditorContainer
      title="Payment & support"
      description="Collect tips, donations, or payment link support."
    >
      <div className="space-y-4">
        {/* Provider */}
        <div>
          <BlockFieldLabel
            label="Payment Provider"
            hint="Select service integration."
          />
          <BlockSelect
            value={link.paymentType || 'stripe'}
            onChange={(v) => updateLink(link.id, 'paymentType', v)}
          >
            <option value="stripe">Stripe Payment Link</option>
            <option value="paypal">PayPal.me</option>
            <option value="tip">Buy Me a Coffee / Tip Jar</option>
            <option value="venmo">Venmo</option>
            <option value="cashapp">Cash App</option>
            <option value="donation">One-time Donation</option>
          </BlockSelect>
        </div>

        {/* Payment URL */}
        <div>
          <BlockFieldLabel
            label="Payment URL"
            hint="Destination link to payment checkout."
          />
          <Input
            type="url"
            value={link.url || ''}
            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
            placeholder="https://buy.stripe.com/... or paypal.me/..."
          />
        </div>

        {/* Amount & subtitle row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <BlockFieldLabel label="Suggested Amount" hint="Currency & amount" />
            <div className="flex">
              <select
                value={link.paymentCurrency || '$'}
                onChange={(e) => updateLink(link.id, 'paymentCurrency', e.target.value)}
                className="px-3 py-3 text-sm font-bold border border-r-0 border-slate-200 rounded-l-2xl bg-white focus:outline-none cursor-pointer text-slate-800 focus:border-brand-600 transition-all"
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                value={link.paymentAmount || ''}
                onChange={(e) => updateLink(link.id, 'paymentAmount', e.target.value)}
                placeholder="5.00"
                className="flex-1 px-3 py-3 text-sm border border-slate-200 rounded-r-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <BlockFieldLabel label="Button Subtitle" hint="Brief description" />
            <Input
              type="text"
              value={link.description || ''}
              onChange={(e) => updateLink(link.id, 'description', e.target.value)}
              placeholder="Support my work"
            />
          </div>
        </div>
      </div>
    </BlockEditorContainer>
  )
}
