'use client'

import React, { useState } from 'react'
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
  { id: 'gallery',   label: 'Gallery',    description: 'Showcase photos in grid, stack, or carousel',           bg: 'bg-amber-600',  Icon: ImageIcon,   type: 'link' },
  { id: 'divider',   label: 'Divider',    description: 'Add a subtle visual separator line',                    bg: 'bg-slate-400',  Icon: Asterisk,    type: 'text' },
  { id: 'store',     label: 'Store',      description: 'Sell products & digital downloads with pricing', bg: 'bg-purple-700', Icon: ShoppingBag, type: 'shop' },
  { id: 'donation',  label: 'Donation',   description: 'Accept tips, coffee donations & one-time payments',     bg: 'bg-emerald-500',Icon: ShoppingBag, type: 'payment' },
  { id: 'countdown', label: 'Countdown',  description: 'Display countdown timer for launches & events',         bg: 'bg-blue-700',   Icon: Calendar,    type: 'event' },
  { id: 'rss',       label: 'RSS Feed',   description: 'Stream latest blog posts, news & RSS updates',           bg: 'bg-orange-500', Icon: Globe,       type: 'link' },
]

export default function AddLinkModal({ onClose, onAdd }: AddLinkModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              Add Feature or Link
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Select a core block or paste any URL for instant auto-detection</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & URL Input Bar */}
        <div className="px-6 py-3.5 bg-gray-50/70 border-b border-gray-100 flex-shrink-0">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Paste any URL (Instagram, YouTube, Spotify, TikTok) or search..."
              className="w-full bg-white border border-gray-200 focus:border-purple-500 rounded-xl pl-10 pr-10 py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-400 shadow-xs outline-none transition-all"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Smart URL Auto-Detected Card */}
          {detected && (
            <div className="mt-3 bg-purple-50/90 border border-purple-200 rounded-2xl p-3 flex items-center justify-between animate-fadeIn shadow-2xs">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white p-2 ${detected.bgGradient || 'bg-purple-600'}`}>
                  <ServiceIcon iconId={detected.icon} size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-purple-200 text-purple-900 rounded-md uppercase tracking-wider">
                      Auto Detected: {detected.name}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-purple-950 mt-0.5">{detected.defaultTitle || detected.name}</p>
                  <p className="text-[11px] text-purple-600 truncate max-w-xs">{searchQuery}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onAdd({
                    type: detected.category === 'video' ? 'video' : detected.category === 'music' ? 'music' : 'link',
                    text: detected.defaultTitle || detected.name,
                    url: searchQuery,
                    icon: detected.icon,
                    platform: detected.id
                  })
                }}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Add Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-0">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-1">
            {searchQuery ? 'Matching Blocks' : 'Core Block Library (15)'}
          </p>

          <div className="space-y-1.5 pb-4">
            {filteredBlocks.map(opt => {
              const BlockIcon = opt.Icon
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    const urlValue = searchQuery.trim().startsWith('http') ? searchQuery.trim() : ''
                    onAdd({ type: opt.type, text: opt.label, icon: opt.id, platform: opt.platform, url: urlValue })
                  }}
                  className="w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all group text-left cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-2xs ${opt.bg}`}>
                    <BlockIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-gray-900 leading-tight">{opt.label}</p>
                    <p className="text-xs text-gray-500 leading-tight truncate">{opt.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 flex-shrink-0 transition-colors" />
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
