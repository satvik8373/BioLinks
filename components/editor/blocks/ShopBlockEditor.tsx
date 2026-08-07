'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'
import {
  BlockEditorContainer,
  BlockFieldLabel,
  BlockSelect,
  BlockTextarea,
} from './BlockEditorContainer'
import Input from '@/components/ui/Input'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

const CURRENCIES = ['$', '€', '£', '¥', '₹', '₩']

export default function ShopBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <BlockEditorContainer
      title="Shop product"
      description="Showcase digital items, merch, or store products."
    >
      <div className="space-y-4">
        {/* Product URL */}
        <div>
          <BlockFieldLabel
            label="Product Page URL"
            hint="Direct link to product checkout or store."
          />
          <Input
            type="url"
            value={link.url || ''}
            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
            placeholder="https://yourstore.com/product/..."
          />
        </div>

        {/* Price & Stock row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <BlockFieldLabel label="Price" hint="Currency & amount" />
            <div className="flex">
              <select
                value={link.currency || '$'}
                onChange={(e) => updateLink(link.id, 'currency', e.target.value)}
                className="px-3 py-3 text-sm font-bold border border-r-0 border-slate-200 rounded-l-2xl bg-white focus:outline-none cursor-pointer text-slate-800 focus:border-brand-600 transition-all"
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                value={link.price || ''}
                onChange={(e) => updateLink(link.id, 'price', e.target.value)}
                placeholder="0.00"
                className="flex-1 px-3 py-3 text-sm border border-slate-200 rounded-r-2xl bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <BlockFieldLabel label="Stock Status" hint="Badge shown on card" />
            <BlockSelect
              value={link.stockStatus || 'in-stock'}
              onChange={(v) => updateLink(link.id, 'stockStatus', v)}
            >
              <option value="in-stock">In Stock</option>
              <option value="limited">Limited Edition</option>
              <option value="out-of-stock">Out of Stock</option>
            </BlockSelect>
          </div>
        </div>

        {/* Description */}
        <div>
          <BlockFieldLabel
            label="Product Description"
            hint="Short details about this item."
          />
          <BlockTextarea
            rows={2}
            value={link.description || ''}
            onChange={(v) => updateLink(link.id, 'description', v)}
            placeholder="Describe your digital asset or merch item…"
          />
        </div>
      </div>
    </BlockEditorContainer>
  )
}
