'use client'

import React from 'react'
import { Tag } from 'lucide-react'
import { LinkItem } from '@/lib/types/link'

interface ShopFieldsProps {
  link: LinkItem
  onFieldChange: (field: keyof LinkItem, value: any) => void
}

export default function ShopFields({ link, onFieldChange }: ShopFieldsProps) {
  return (
    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
        <Tag className="w-4 h-4 text-emerald-600" />
        <span>Shop Product Details</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">Price</label>
          <input
            type="text"
            value={link.price || ''}
            onChange={e => onFieldChange('price', e.target.value)}
            placeholder="29.99"
            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">Original Price (Sale)</label>
          <input
            type="text"
            value={link.originalPrice || ''}
            onChange={e => onFieldChange('originalPrice', e.target.value)}
            placeholder="49.99"
            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">Stock Status</label>
          <select
            value={link.stockStatus || 'in-stock'}
            onChange={e => onFieldChange('stockStatus', e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 outline-none"
          >
            <option value="in-stock">In Stock</option>
            <option value="limited">Limited Edition</option>
            <option value="out-of-stock">Sold Out</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[11px] font-bold text-gray-700 mb-1">Product Thumbnail Image URL</label>
        <input
          type="text"
          value={link.thumbnail || ''}
          onChange={e => onFieldChange('thumbnail', e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
        />
      </div>
    </div>
  )
}
