'use client'

import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { 
  X, Search, Sparkles, ShoppingBag, Video, Phone, Calendar, Type, 
  Globe, Layout, ImageIcon, Upload, Asterisk, ChevronRight, ArrowRight
} from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import { detectPlatformFromUrl } from '@/lib/detectPlatform'
import { ServiceIcon } from '@/components/icons/ServiceIcons'

interface AddLinkModalProps {
  onClose: () => void
  onAdd: (preset: Partial<LinkItem>) => void
}

interface CoreBlockOption {
  id: string
  label: string
  description: string
  bg: string
  Icon: React.ElementType
  type: LinkItem['type']
  platform?: string
}

const CORE_BLOCKS: CoreBlockOption[] = [
  { id: 'link',      label: 'Link',       description: 'Add any URL button with smart platform auto-detection', bg: 'bg-indigo-600', Icon: Globe,       type: 'link' },
  { id: 'header',    label: 'Header',     description: 'Section heading to organize your page',                 bg: 'bg-slate-700',  Icon: Layout,      type: 'header' },
  { id: 'text',      label: 'Text',       description: 'Add body text, announcements, or bio notes',            bg: 'bg-slate-500',  Icon: Type,        type: 'text' },
  { id: 'video',     label: 'Video',      description: 'Embed playable YouTube, TikTok, or Vimeo video',         bg: 'bg-red-600',    Icon: Video,       type: 'video', platform: 'youtube' },
  { id: 'form',      label: 'Form',       description: 'Collect emails, feedback, survey & waitlist signups',    bg: 'bg-purple-600', Icon: Type,        type: 'form' },
  { id: 'contact',   label: 'Contact',    description: 'Email, phone, WhatsApp, or Telegram chat link',          bg: 'bg-sky-500',    Icon: Phone,       type: 'contact' },
  { id: 'file',      label: 'File',       description: 'Share Google Drive docs, PDFs, & file downloads',       bg: 'bg-blue-600',   Icon: Upload,      type: 'link', platform: 'google-drive' },
  { id: 'embed',     label: 'Embed',      description: 'Embed Spotify, SoundCloud, or custom web iFrames',       bg: 'bg-pink-600',   Icon: Sparkles,    type: 'music', platform: 'spotify' },
  { id: 'gallery',   label: 'Gallery',    description: 'Showcase photo gallery slider with multiple images',    bg: 'bg-amber-600',  Icon: ImageIcon,   type: 'gallery' },
  { id: 'divider',   label: 'Divider',    description: 'Add a subtle visual separator line',                    bg: 'bg-slate-400',  Icon: Asterisk,    type: 'text' },
  { id: 'store',     label: 'Store',      description: 'Sell products & digital downloads with pricing', bg: 'bg-purple-700', Icon: ShoppingBag, type: 'shop' },
  { id: 'donation',  label: 'Donation',   description: 'Accept tips, coffee donations & one-time payments',     bg: 'bg-emerald-500',Icon: ShoppingBag, type: 'payment' },
  { id: 'countdown', label: 'Countdown',  description: 'Display countdown timer for launches & events',         bg: 'bg-blue-700',   Icon: Calendar,    type: 'event' },
  { id: 'rss',       label: 'RSS Feed',   description: 'Stream latest blog posts, news & RSS updates',           bg: 'bg-orange-500', Icon: Globe,       type: 'link' },
]

export default function AddLinkModal({ onClose, onAdd }: AddLinkModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (backdropRef.current && modalRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' })
      gsap.fromTo(modalRef.current, { scale: 0.92, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.1)' })
    }
  }, [])

  const handleClose = () => {
    if (backdropRef.current && modalRef.current) {
      const tl = gsap.timeline({ onComplete: onClose })
      tl.to(modalRef.current, { scale: 0.95, opacity: 0, y: 10, duration: 0.22, ease: 'power2.in' })
      tl.to(backdropRef.current, { opacity: 0, duration: 0.18, ease: 'power2.in' }, '-=0.1')
    } else {
      onClose()
    }
  }

  // Smart Auto-Detector based on pasted URL in search input
  const detected = searchQuery.trim() ? detectPlatformFromUrl(searchQuery.trim()) : null

  const filteredBlocks = searchQuery.trim()
    ? CORE_BLOCKS.filter(b =>
        b.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : CORE_BLOCKS

  return (
    <div
      ref={backdropRef}
      onClick={handleClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 cursor-pointer"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Add Feature or Link
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Select a core block or paste any URL for instant auto-detection</p>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & URL Input Box */}
        <div className="p-4 bg-slate-50 border-b border-gray-100 flex-shrink-0">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              placeholder="Paste URL or search blocks (e.g. instagram, youtube, form, shop)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
              autoFocus
            />
          </div>

          {/* Smart URL Auto-Detected Banner */}
          {detected && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                  <ServiceIcon iconId={detected.icon} size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-purple-950">{detected.name} Detected</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded-full">Auto</span>
                  </div>
                  <p className="text-xs text-purple-700 truncate max-w-[280px]">{searchQuery}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAdd({
                    type: detected.category === 'video' ? 'video' : detected.category === 'music' ? 'music' : 'link',
                    text: detected.name,
                    url: searchQuery.trim(),
                    icon: detected.icon,
                    platform: detected.icon,
                  })
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                Add {detected.name} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Blocks Grid List */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 no-scrollbar">
          {filteredBlocks.map((block) => {
            const IconComponent = block.Icon
            return (
              <div
                key={block.id}
                onClick={() => {
                  onAdd({
                    type: block.type,
                    text: block.label === 'Link' ? 'My Link' : block.label,
                    url: block.type === 'link' ? 'https://' : '',
                    icon: block.platform || (block.type === 'link' ? 'website' : block.type === 'video' ? 'youtube' : block.type === 'music' ? 'spotify' : 'link'),
                    platform: block.platform,
                  })
                }}
                className="group p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 bg-white hover:bg-purple-50/40 transition-all cursor-pointer flex items-center justify-between shadow-2xs hover:shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${block.bg} text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    {block.platform ? (
                      <ServiceIcon iconId={block.platform} size={20} />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-sm text-gray-900 group-hover:text-purple-900 truncate">
                      {block.label}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1 leading-snug">
                      {block.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-1" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
