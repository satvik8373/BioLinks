'use client'

import React from 'react'
import { LinkItem } from '@/lib/types/link'

interface BlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function ShopBlockEditor({ link, updateLink }: BlockEditorProps) {
  return (
    <div className="space-y-5 text-left">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900">Shop product</h3>
        <p className="text-xs text-gray-500">Showcase digital items, merch, or store products.</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Product Page URL
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Direct link to product checkout or store.</p>
        <input
          type="url"
          value={link.url || ''}
          onChange={e => updateLink(link.id, 'url', e.target.value)}
          placeholder="https://yourstore.com/product/..."
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3.5 text-xs font-mono text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">Price</label>
          <p className="text-xs text-gray-500 mb-1.5">Currency & price</p>
          <div className="flex">
            <select
              value={link.currency || '$'}
              onChange={e => updateLink(link.id, 'currency', e.target.value)}
              className="px-3 py-3 text-xs font-bold border border-r-0 border-gray-200/90 rounded-l-2xl bg-gray-50 focus:outline-none cursor-pointer"
            >
              {['$','€','£','¥','₹','₩'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              value={link.price || ''}
              onChange={e => updateLink(link.id, 'price', e.target.value)}
              placeholder="0.00"
              className="flex-1 px-3 py-3 text-xs border border-gray-200/90 rounded-r-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-semibold"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-bold text-gray-900">Stock Availability</label>
          <p className="text-xs text-gray-500 mb-1.5">Status badge</p>
          <select
            value={link.stockStatus || 'in-stock'}
            onChange={e => updateLink(link.id, 'stockStatus', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs font-semibold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black cursor-pointer transition-all"
          >
            <option value="in-stock">In Stock</option>
            <option value="limited">Limited Edition</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-bold text-gray-900">
          Product Description
        </label>
        <p className="text-xs text-gray-500 mb-1.5">Short details about this item.</p>
        <textarea
          rows={2}
          value={link.description || ''}
          onChange={e => updateLink(link.id, 'description', e.target.value)}
          placeholder="Describe your digital asset or merch item…"
          className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl px-4 py-3 text-xs text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
        />
      </div>
    </div>
  )
}
