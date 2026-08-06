'use client'

import React from 'react'
import { Mail, Phone, MessageCircle, Send, MapPin } from 'lucide-react'

function contactHref(link: any): string {
  const val = link.contactValue || link.url || ''
  if (!val) return '#'
  if (link.contactType === 'email') return `mailto:${val}`
  if (link.contactType === 'phone') return `tel:${val.replace(/\D/g, '')}`
  if (link.contactType === 'whatsapp') return `https://wa.me/${val.replace(/\D/g, '')}`
  if (link.contactType === 'telegram') return `https://t.me/${val.replace(/^@/, '')}`
  return val.startsWith('http') ? val : `https://${val}`
}

interface Props {
  link: any
  btnStyle: React.CSSProperties
  textColor: string
  trackClick: (id: string) => void
  animClasses: string
}

export default function ContactRenderer({ link, btnStyle, textColor, trackClick, animClasses }: Props) {
  const key = link.id
  const isFeatured = link.layout === 'featured'

  if (isFeatured) {
    return (
      <a key={key} href={contactHref(link)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={{ ...btnStyle, height: 'auto', padding: '16px' }}
        className={`group relative overflow-hidden transform-gpu border-2 shadow-xl flex flex-col gap-3 text-left ${animClasses}`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {link.contactType === 'email'    && <Mail size={22} />}
            {link.contactType === 'phone'    && <Phone size={22} />}
            {link.contactType === 'whatsapp' && <MessageCircle size={22} />}
            {link.contactType === 'telegram' && <Send size={22} />}
            {link.contactType === 'address'  && <MapPin size={22} />}
            {!link.contactType               && <Phone size={22} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-base leading-tight" style={{ color: textColor }}>{link.text}</p>
            {link.contactValue && <p className="text-xs opacity-75 mt-0.5 truncate" style={{ color: textColor }}>{link.contactValue}</p>}
          </div>
        </div>
        <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-center bg-black/10 group-hover:bg-black/20 transition-colors">
          Get in Touch &rarr;
        </div>
      </a>
    )
  }

  return (
    <a key={key} href={contactHref(link)} target="_blank" rel="noopener noreferrer"
      onClick={() => trackClick(key)} style={btnStyle}
      className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
      <div className="flex items-center justify-center gap-3 px-4 py-3.5">
        <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          {link.contactType === 'email'    && <Mail size={18} />}
          {link.contactType === 'phone'    && <Phone size={18} />}
          {link.contactType === 'whatsapp' && <MessageCircle size={18} />}
          {link.contactType === 'telegram' && <Send size={18} />}
          {link.contactType === 'address'  && <MapPin size={18} />}
          {!link.contactType               && <Phone size={18} />}
        </div>
        <div className="text-left">
          <p className="font-extrabold text-sm" style={{ color: textColor }}>{link.text}</p>
          {link.contactValue && <p className="text-xs mt-0.5" style={{ color: textColor, opacity: 0.65 }}>{link.contactValue}</p>}
        </div>
      </div>
    </a>
  )
}
