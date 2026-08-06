'use client'

import React from 'react'
import { ShoppingBag } from 'lucide-react'

function ensureAbsoluteUrl(url?: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (!trimmed) return '#'
  if (/^(https?:\/\/|mailto:|tel:|wa\.me|t\.me|\/\/)/i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

function StockBadge({ status, textColor }: { status?: string; textColor: string }) {
  if (!status) return null
  const colors: Record<string, string> = {
    'in-stock': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'out-of-stock': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    'limited': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }
  const labels: Record<string, string> = {
    'in-stock': 'In Stock',
    'out-of-stock': 'Sold Out',
    'limited': 'Limited Stock',
  }
  return (
    <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full border mt-1 ${colors[status] || 'bg-black/20 text-white'}`}>
      {labels[status] || status}
    </span>
  )
}

interface Props {
  link: any
  btnStyle: React.CSSProperties
  textColor: string
  trackClick: (id: string) => void
  animClasses: string
}

export default function ShopRenderer({ link, btnStyle, textColor, trackClick, animClasses }: Props) {
  const key = link.id
  const isFeatured = link.layout === 'featured'

  if (isFeatured) {
    return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={{ ...btnStyle, height: 'auto', display: 'flex', flexDirection: 'column', padding: 0 }}
        className={`group relative overflow-hidden transform-gpu border-2 shadow-xl ${animClasses}`}>
        <div className="w-full aspect-video bg-black/10 overflow-hidden relative flex items-center justify-center">
          {link.thumbnail ? (
            <img src={link.thumbnail} alt={link.text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <ShoppingBag size={44} style={{ color: textColor, opacity: 0.35 }} />
          )}
          {link.price && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
              {link.currency || '$'}{link.price}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-1 text-left w-full">
          <h3 className="font-extrabold text-base leading-snug" style={{ color: textColor }}>{link.text}</h3>
          {link.description && <p className="text-xs opacity-75 leading-relaxed line-clamp-2" style={{ color: textColor }}>{link.description}</p>}
          <div className="mt-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center bg-black/10 group-hover:bg-black/20 transition-colors">
            Buy Now &rarr;
          </div>
        </div>
      </a>
    )
  }

  return (
    <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
      onClick={() => trackClick(key)} style={btnStyle}
      className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
      <div className="flex items-center justify-between px-4 py-3.5 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingBag size={18} />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-extrabold text-sm leading-tight" style={{ color: textColor }}>{link.text}</p>
            {link.description && <p className="text-xs truncate mt-0.5" style={{ color: textColor, opacity: 0.65 }}>{link.description}</p>}
            <StockBadge status={link.stockStatus} textColor={textColor} />
          </div>
        </div>
        {link.price && (
          <div className="text-right flex-shrink-0">
            {link.originalPrice && <p className="text-xs line-through" style={{ color: textColor, opacity: 0.45 }}>{link.currency || '$'}{link.originalPrice}</p>}
            <p className="font-extrabold text-sm" style={{ color: textColor }}>{link.currency || '$'}{link.price}</p>
          </div>
        )}
      </div>
    </a>
  )
}
