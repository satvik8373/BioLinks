'use client'

import React, { useState, useRef } from 'react'
import { 
  GripVertical, Eye, EyeOff, Trash2, Pin, ChevronDown, ChevronUp, 
  Globe, Layout, DollarSign, Phone, Calendar, Video, Music, Image as ImageIcon,
  Tag, MessageCircle, Clock, MapPin, Check, Sparkles, ExternalLink,
  UploadCloud, X, FileText, Upload, Pencil, BarChart2, Star, Lock,
  ShieldAlert, Key, AlertTriangle, Search, Zap, CheckSquare
} from 'lucide-react'
import { LinkItem, LinkType, formatSocialUrl } from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import SocialFields from './renderers/SocialFields'
import ShopFields from './renderers/ShopFields'

interface LinkItemCardProps {
  link: LinkItem
  index: number
  isExpanded: boolean
  isDragging?: boolean
  isDragOver?: boolean
  onToggleExpand: () => void
  onUpdate: (updatedLink: LinkItem) => void
  onRemove: () => void
  onToggleVisibility: () => void
  onTogglePin?: () => void
  // dnd-kit sortable attributes passed from parent
  dragHandleProps?: Record<string, unknown>
  draggableProps?: Record<string, unknown>
  innerRef?: (node: HTMLElement | null) => void
  // legacy — kept for backwards compat, ignored now
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop?: (e: React.DragEvent) => void
  onDragEnd?: () => void
}

export function detectPlatformFromUrl(url: string): { icon: string; title: string; type: LinkType } | null {
  if (!url || typeof url !== 'string') return null
  const lowerUrl = url.toLowerCase().trim()

  if (lowerUrl.includes('instagram.com')) {
    return { icon: 'instagram', title: 'Instagram', type: 'social' }
  }
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { icon: 'youtube', title: 'YouTube', type: 'video' }
  }
  if (lowerUrl.includes('spotify.com')) {
    return { icon: 'spotify', title: 'Spotify', type: 'music' }
  }
  if (lowerUrl.includes('tiktok.com')) {
    return { icon: 'tiktok', title: 'TikTok', type: 'social' }
  }
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    return { icon: 'twitter', title: 'X (Twitter)', type: 'social' }
  }
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return { icon: 'facebook', title: 'Facebook', type: 'social' }
  }
  if (lowerUrl.includes('github.com')) {
    return { icon: 'github', title: 'GitHub', type: 'social' }
  }
  if (lowerUrl.includes('linkedin.com')) {
    return { icon: 'linkedin', title: 'LinkedIn', type: 'social' }
  }
  if (lowerUrl.includes('discord.com') || lowerUrl.includes('discord.gg')) {
    return { icon: 'discord', title: 'Discord', type: 'social' }
  }
  if (lowerUrl.includes('whatsapp.com') || lowerUrl.includes('wa.me')) {
    return { icon: 'whatsapp', title: 'WhatsApp', type: 'contact' }
  }
  if (lowerUrl.includes('telegram.me') || lowerUrl.includes('t.me')) {
    return { icon: 'telegram', title: 'Telegram', type: 'contact' }
  }
  if (lowerUrl.includes('pinterest.com')) {
    return { icon: 'pinterest', title: 'Pinterest', type: 'social' }
  }
  if (lowerUrl.includes('twitch.tv')) {
    return { icon: 'twitch', title: 'Twitch', type: 'video' }
  }
  if (lowerUrl.includes('soundcloud.com')) {
    return { icon: 'soundcloud', title: 'SoundCloud', type: 'music' }
  }
  if (lowerUrl.includes('apple.com') || lowerUrl.includes('music.apple.com')) {
    return { icon: 'apple', title: 'Apple Music', type: 'music' }
  }
  if (lowerUrl.includes('amazon.com') || lowerUrl.includes('amzn.to')) {
    return { icon: 'amazon', title: 'Amazon', type: 'shop' }
  }
  if (lowerUrl.includes('paypal.com') || lowerUrl.includes('paypal.me')) {
    return { icon: 'paypal', title: 'PayPal', type: 'payment' }
  }
  if (lowerUrl.includes('mailto:')) {
    return { icon: 'email', title: 'Email Me', type: 'contact' }
  }
  if (lowerUrl.includes('tel:')) {
    return { icon: 'phone', title: 'Call Me', type: 'contact' }
  }

  return null
}

const OFFICIAL_ICON_KEYS = [
  'instagram', 'tiktok', 'youtube', 'spotify', 'twitter', 'facebook', 
  'linkedin', 'discord', 'github', 'whatsapp', 'telegram', 'shopify', 
  'apple-music', 'soundcloud', 'email', 'phone', 'website', 'link'
]

export default function LinkItemCard({
  link,
  index,
  isExpanded,
  isDragging,
  isDragOver,
  onToggleExpand,
  onUpdate,
  onRemove,
  onToggleVisibility,
  onTogglePin,
  innerRef,
  draggableProps,
  dragHandleProps,
}: LinkItemCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showUrlFallback, setShowUrlFallback] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<'settings' | 'layout' | 'thumbnail' | 'schedule' | 'lock'>('settings')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingUrl, setIsEditingUrl] = useState(false)

  const handleFileUpload = (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, GIF)')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('Image file size must be under 15MB')
      return
    }

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (dataUrl) {
        handleFieldChange('thumbnail', dataUrl)
      }
      setIsUploading(false)
    }
    reader.onerror = () => {
      alert('Failed to read media file')
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleFieldChange = (field: keyof LinkItem, value: any) => {
    let updated: LinkItem = {
      ...link,
      [field]: value,
    }

    if (field === 'url' && typeof value === 'string' && value.trim()) {
      const isYt = value.toLowerCase().includes('youtube.com') || value.toLowerCase().includes('youtu.be')
      if (!isYt && link.thumbnail && link.thumbnail.includes('youtube.com')) {
        updated.thumbnail = undefined
      }

      const detected = detectPlatformFromUrl(value)
      if (detected) {
        updated.icon = detected.icon
        updated.platform = detected.icon
        if (!link.text || link.text === 'Untitled Link' || link.text === 'My Link') {
          updated.text = detected.title
        }
        if ((!link.type || link.type === 'link') && detected.type) {
          updated.type = detected.type
        }
      }
    }

    onUpdate(updated)
  }

  // Type badge color mappings
  const getTypeBadge = (type: LinkType) => {
    switch (type) {
      case 'shop': return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Shop Product' }
      case 'music': return { bg: 'bg-green-100 text-green-800 border-green-200', label: 'Music Embed' }
      case 'video': return { bg: 'bg-red-100 text-red-800 border-red-200', label: 'Video Embed' }
      case 'contact': return { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Contact Button' }
      case 'event': return { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Event' }
      case 'payment': return { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Payment / Tip' }
      case 'booking': return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Booking' }
      case 'header': return { bg: 'bg-gray-200 text-gray-800 border-gray-300', label: 'Header' }
      case 'text': return { bg: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Note' }
      default: return { bg: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Link' }
    }
  }

  const badge = getTypeBadge(link.type)
  const detectedInfo = detectPlatformFromUrl(link.url || '')
  const activeIconKey = link.icon || link.platform || (detectedInfo?.icon) || (link.type === 'shop' ? 'shopify' : link.type === 'contact' ? 'phone' : link.type === 'music' ? 'spotify' : link.type === 'video' ? 'youtube' : 'website')

  return (
    <div
      ref={innerRef}
      {...(draggableProps as any)}
      className={`clay-card rounded-3xl overflow-hidden transition-all duration-300 ${
        !link.isVisible ? 'opacity-55' : ''
      } ${
        isExpanded ? 'ring-2 ring-purple-400/30' : ''
      } ${
        isDragging ? 'opacity-40 scale-[1.01] rotate-1' : ''
      } ${
        isDragOver ? 'ring-2 ring-violet-500/40' : ''
      }`}
      style={isExpanded ? { borderColor: 'rgba(124,58,237,0.30)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -3px 0 rgba(124,58,237,0.12), 0 4px 0 rgba(124,58,237,0.20), 0 10px 28px -4px rgba(124,58,237,0.14)' } : {}}
    >
      {/* ── Official Linktree Card Header (Normal Comfortable Sizing) ── */}
      <div className="p-5 md:p-6 space-y-4">
        {/* Top Header Row: Drag handle + Title/URL inline + Share + Toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Drag Handle (dnd-kit) */}
            <div 
              {...(dragHandleProps as any)}
              className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 p-0.5 rounded transition-colors flex-shrink-0 touch-none"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Title & URL Inline Editable */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Title Inline */}
              <div className="flex items-center gap-1.5 group/edit text-sm font-bold text-gray-900">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={link.text}
                    onChange={e => handleFieldChange('text', e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={e => { if (e.key === 'Enter') setIsEditingTitle(false) }}
                    autoFocus
                    className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-sm font-bold text-gray-900 outline-none w-full"
                  />
                ) : (
                  <div 
                    onClick={() => setIsEditingTitle(true)}
                    className="flex items-center gap-1.5 cursor-pointer hover:text-purple-600 truncate"
                  >
                    <span className="truncate">{link.text || 'Untitled Link'}</span>
                    <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover/edit:text-purple-600 flex-shrink-0 opacity-80" />
                  </div>
                )}
              </div>

              {/* URL Inline */}
              {link.type !== 'header' && (
                <div className="flex items-center gap-1.5 group/url text-xs text-gray-500 mt-0.5">
                  <span className="font-semibold text-gray-400">URL</span>
                  {isEditingUrl ? (
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={e => handleFieldChange('url', e.target.value)}
                      onBlur={() => setIsEditingUrl(false)}
                      onKeyDown={e => { if (e.key === 'Enter') setIsEditingUrl(false) }}
                      autoFocus
                      className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-900 outline-none w-full"
                    />
                  ) : (
                    <div 
                      onClick={() => setIsEditingUrl(true)}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-purple-600 truncate"
                    >
                      <span className="truncate">{link.url || 'Add URL'}</span>
                      <Pencil className="w-3 h-3 text-gray-400 group-hover/url:text-purple-600 flex-shrink-0 opacity-80" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Top Right: ON/OFF Toggle Switch */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onToggleVisibility}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                link.isVisible ? 'bg-black' : 'bg-gray-200'
              }`}
              title={link.isVisible ? 'Enabled' : 'Disabled'}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                link.isVisible ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Feature Toolbar Row: SVG Icon + Quick Action Icons + Analytics + Trash */}
        <div className="flex items-center justify-between pt-1 border-t border-gray-100/80 text-gray-500">
          <div className="flex items-center gap-3">
            {/* SVG Icon Pill */}
            <button
              type="button"
              onClick={() => {
                if (activeDrawer === 'settings' && isExpanded) {
                  onToggleExpand()
                } else {
                  setActiveDrawer('settings')
                  if (!isExpanded) onToggleExpand()
                }
              }}
              className={`w-8 h-8 rounded-xl transition-all flex items-center justify-center p-1.5 cursor-pointer ${
                isExpanded && activeDrawer === 'settings'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-purple-50 text-purple-600 border border-purple-100/80 hover:bg-purple-100'
              }`}
              title="Open Link Settings"
            >
              <ServiceIcon iconId={activeIconKey} size={18} />
            </button>

            {/* Quick Action Icons: Thumbnail (non-image only), Schedule Clock, Lock Gate, Analytics */}
            <div className="flex items-center gap-1.5 text-gray-400">
              {/* Thumbnail Icon */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeDrawer === 'thumbnail' && isExpanded) {
                      onToggleExpand()
                    } else {
                      setActiveDrawer('thumbnail')
                      if (!isExpanded) onToggleExpand()
                    }
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isExpanded && activeDrawer === 'thumbnail' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-100'
                  }`}
                  title="Add Thumbnail"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

              {/* 3. Schedule Clock Icon */}
              <button
                onClick={() => {
                  setActiveDrawer('schedule')
                  if (!isExpanded) onToggleExpand()
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isExpanded && activeDrawer === 'schedule' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-100'
                }`}
                title="Schedule Link"
              >
                <Clock className="w-4 h-4" />
              </button>

              {/* 4. Lock Gate Icon */}
              <button
                onClick={() => {
                  setActiveDrawer('lock')
                  if (!isExpanded) onToggleExpand()
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isExpanded && activeDrawer === 'lock' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-purple-600 hover:bg-gray-100'
                }`}
                title="Lock this link"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* 5. Analytics Counter */}
              <div className="flex items-center gap-1 text-xs text-gray-500 font-medium pl-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-gray-400" />
                <span>0 clicks</span>
              </div>
            </div>
          </div>

          {/* Delete Trash Button */}
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Expanded Dedicated Type Editor Drawer (Smooth Linktree Animation) ── */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[85vh] opacity-100 border-t border-gray-200 overflow-y-auto rounded-b-3xl bg-white' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div>
          {/* Drawer Header Banner (Official Linktree Neutral Warm Banner) */}
          <div className="bg-[#e9e9e1] px-6 py-3 flex items-center justify-between font-bold text-sm text-gray-900 border-b border-gray-200">
            <span className="w-6" /> {/* Spacer for perfect centering */}
            <span className="text-center font-bold text-sm md:text-base text-gray-900 flex-1">
              {activeDrawer === 'lock' ? 'Lock this link' :
               activeDrawer === 'schedule' ? 'Schedule' :
               activeDrawer === 'thumbnail' ? 'Add Thumbnail' :
               ((link.url || '').toLowerCase().includes('youtube') || (link.url || '').toLowerCase().includes('youtu.be') || link.type === 'video' ? 'YouTube' : link.text || 'Link')}
            </span>
            <button
              onClick={onToggleExpand}
              className="p-1 text-gray-700 hover:text-black rounded-full transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub-Tabs: Link Settings | Layout */}
          {(activeDrawer === 'settings' || activeDrawer === 'layout') && (
            <div className="flex border-b border-gray-200 px-6 bg-white sticky top-0 z-20">
              <button
                type="button"
                onClick={() => setActiveDrawer('settings')}
                className={`py-3.5 px-8 text-sm font-bold transition-all relative cursor-pointer ${
                  activeDrawer === 'settings' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <span>Link Settings</span>
                {activeDrawer === 'settings' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveDrawer('layout')}
                className={`py-3.5 px-8 text-sm font-bold transition-all relative cursor-pointer ${
                  activeDrawer === 'layout' ? 'text-gray-900 font-extrabold' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <span>Layout</span>
                {activeDrawer === 'layout' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </button>
            </div>
          )}

          {/* Drawer Body Container */}
          <div className="p-6 space-y-5 bg-white">

            {/* ── 0. DEDICATED THUMBNAIL DRAWER ── */}
            {activeDrawer === 'thumbnail' && (
              <div className="space-y-4 animate-fadeIn py-2 text-center">
                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
                  }}
                />

                {link.thumbnail ? (
                  <div className="flex items-center gap-4 text-left">
                    {/* Image Preview Box */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black/10 border border-gray-200 flex-shrink-0 shadow-sm">
                      <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {/* Change Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 bg-[#7800ff] hover:bg-[#6800e0] text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
                      >
                        Change
                      </button>
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleFieldChange('thumbnail', undefined)}
                        className="w-full py-3 border border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-800 font-bold text-sm rounded-full transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Add a Thumbnail or Icon to this Link.
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3.5 bg-[#7800ff] hover:bg-[#6800e0] text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
                    >
                      Set Thumbnail
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── 1. LOCK THIS LINK DRAWER ── */}
            {activeDrawer === 'lock' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <Lock className="w-5 h-5 text-gray-700" />
                    <h3>Lock this link</h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Visitors can only access this link by fulfilling certain criteria.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Link locked with:
                  </h4>

                  {/* Lock Option 1: Subscribe */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'subscribe' ? undefined : 'subscribe')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'subscribe' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'subscribe'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-gray-900">Subscribe</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Require visitors to subscribe to your newsletter or email list to unlock.</p>
                    </div>
                  </div>

                  {/* Lock Option 2: Code */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'code' ? undefined : 'code')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'code' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'code'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-gray-900">Code</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Require visitors to enter an secret access code to unlock.</p>
                      {link.lockType === 'code' && (
                        <input
                          type="text"
                          value={link.lockValue || ''}
                          onChange={e => handleFieldChange('lockValue', e.target.value)}
                          placeholder="Enter passcode (e.g. SECRET123)"
                          className="mt-2.5 w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </div>

                  {/* Lock Option 3: Password */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'password' ? undefined : 'password')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'password' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'password'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-gray-900">Password</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Protect this link with a secret password.</p>
                      {link.lockType === 'password' && (
                        <input
                          type="password"
                          value={link.lockValue || ''}
                          onChange={e => handleFieldChange('lockValue', e.target.value)}
                          placeholder="Set password..."
                          className="mt-2.5 w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </div>

                  {/* Lock Option 4: Date of birth */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'dob' ? undefined : 'dob')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'dob' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'dob'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-gray-900">Date of birth</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Require visitors to verify their age before accessing this link.</p>
                    </div>
                  </div>

                  {/* Lock Option 5: Sensitive content */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'sensitive' ? undefined : 'sensitive')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'sensitive' ? 'border-purple-600 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'sensitive'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-gray-900">Sensitive content</h5>
                      <p className="text-xs text-gray-500 mt-0.5">Show an 18+ sensitive content disclaimer prior to opening.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. SCHEDULE DRAWER ── */}
            {activeDrawer === 'schedule' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900">Schedule</h3>
                  <p className="text-xs text-gray-500">
                    Select the dates to show or hide this link on your Linktree.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Show link on</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <input
                        type="datetime-local"
                        value={link.scheduleStart || ''}
                        onChange={e => handleFieldChange('scheduleStart', e.target.value)}
                        className="bg-transparent text-xs text-gray-900 outline-none w-full font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Hide link on</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <input
                        type="datetime-local"
                        value={link.scheduleEnd || ''}
                        onChange={e => handleFieldChange('scheduleEnd', e.target.value)}
                        className="bg-transparent text-xs text-gray-900 outline-none w-full font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="scheduleNotify"
                    checked={link.scheduleNotify || false}
                    onChange={e => handleFieldChange('scheduleNotify', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="scheduleNotify" className="text-xs text-gray-700 font-medium cursor-pointer">
                    Notify subscribers when link is added
                  </label>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-gray-900">Time zone</label>
                  <p className="text-[11px] text-gray-500">Choose a time zone.</p>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <select
                      value={link.scheduleTimezone || '(GMT+5:30) New Delhi'}
                      onChange={e => handleFieldChange('scheduleTimezone', e.target.value)}
                      className="bg-transparent text-xs text-gray-900 font-medium outline-none w-full cursor-pointer"
                    >
                      <option value="(GMT+5:30) New Delhi">(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                      <option value="(GMT+0:00) London">(GMT+0:00) London, Dublin, Edinburgh</option>
                      <option value="(GMT-5:00) New York">(GMT-5:00) Eastern Time (US & Canada)</option>
                      <option value="(GMT-8:00) Pacific">(GMT-8:00) Pacific Time (US & Canada)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleFieldChange('isScheduled', true)
                    alert('Link schedule saved successfully!')
                  }}
                  className="w-full py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm rounded-full transition-colors mt-2"
                >
                  Schedule
                </button>
              </div>
            )}
            {/* ── TAB 1: LINK SETTINGS ── */}
            {activeDrawer === 'settings' && (
              <div className="space-y-4">
                {/* ── LINK SETTINGS ── */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subtext / Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={link.description || ''}
                    onChange={e => handleFieldChange('description', e.target.value)}
                    placeholder="Short subtitle or note displayed under the title"
                    className="w-full bg-white border border-gray-200 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-gray-900 outline-none transition-all"
                  />
                </div>

                {/* ── YOUTUBE / VIDEO LINK SETTINGS (Exact Match to Linktree Screenshot) ── */}
                {(link.type === 'video' || (link.url || '').toLowerCase().includes('youtube') || (link.url || '').toLowerCase().includes('youtu.be')) && (
                  <div className="space-y-5 animate-fadeIn pt-2 border-t border-gray-100 mt-3">
                    {/* Section 1: When a visitor clicks */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-gray-900">When a visitor clicks:</h4>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'display_video', label: 'Display my video on my Linktree' },
                          { id: 'open_youtube', label: 'Open YouTube video' },
                          { id: 'open_latest', label: "Open my channel's latest video" },
                          { id: 'display_latest', label: "Display my channel's latest video" },
                        ].map((opt) => {
                          const selected = (link.videoClickOption || 'open_youtube') === opt.id
                          return (
                            <label
                              key={opt.id}
                              className="flex items-center gap-3 cursor-pointer group py-1 select-none"
                            >
                              <input
                                type="radio"
                                name={`videoClickOption-${link.id}`}
                                checked={selected}
                                onChange={() => handleFieldChange('videoClickOption', opt.id)}
                                className="w-5 h-5 text-black border-2 border-gray-300 focus:ring-black accent-black cursor-pointer"
                              />
                              <span className={`text-sm ${selected ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {opt.label}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Section 2: Display options */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900">Display options</h4>
                      
                      <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <input
                          type="checkbox"
                          checked={link.videoMute || false}
                          onChange={(e) => handleFieldChange('videoMute', e.target.checked)}
                          className="w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black accent-black cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-900">Mute video</span>
                      </label>
                    </div>

                    {/* Section 3: Footer Feedback Link (Matching Screenshots 2, 3, 4) */}
                    <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <span>Got ideas? We're listening!</span>
                      <button
                        type="button"
                        onClick={() => alert('Thanks for your feedback!')}
                        className="underline font-bold text-gray-900 hover:text-purple-600 cursor-pointer"
                      >
                        Share feedback
                      </button>
                    </div>
                  </div>
                )}

                {/* SOCIAL CHANNEL FIELDS */}
                {link.type === 'social' && (
                  <SocialFields link={link} onUpdate={onUpdate} />
                )}

                {/* SHOP TYPE FIELDS */}
                {link.type === 'shop' && (
                  <ShopFields link={link} onFieldChange={handleFieldChange} />
                )}

                {/* CONTACT TYPE FIELDS */}
                {link.type === 'contact' && (
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>Contact Direct Trigger</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Contact Type</label>
                        <select
                          value={link.contactType || 'email'}
                          onChange={e => handleFieldChange('contactType', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        >
                          <option value="email">Email Address</option>
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp Chat</option>
                          <option value="telegram">Telegram</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Value ({link.contactType || 'email'})
                        </label>
                        <input
                          type="text"
                          value={link.contactValue || ''}
                          onChange={e => handleFieldChange('contactValue', e.target.value)}
                          placeholder={
                            link.contactType === 'phone' ? '+1234567890' :
                            link.contactType === 'whatsapp' ? '+1234567890' :
                            link.contactType === 'telegram' ? '@username' : 'you@example.com'
                          }
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* EVENT TYPE FIELDS */}
                {link.type === 'event' && (
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Event & Ticket Details</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Event Date</label>
                        <input
                          type="date"
                          value={link.eventDate || ''}
                          onChange={e => handleFieldChange('eventDate', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Event Time</label>
                        <input
                          type="text"
                          value={link.eventTime || ''}
                          onChange={e => handleFieldChange('eventTime', e.target.value)}
                          placeholder="8:00 PM EST"
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Location / Venue</label>
                        <input
                          type="text"
                          value={link.eventLocation || ''}
                          onChange={e => handleFieldChange('eventLocation', e.target.value)}
                          placeholder="New York, NY"
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PAYMENT TYPE FIELDS */}
                {link.type === 'payment' && (
                  <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span>Monetization & Tip Jar</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Payment Service</label>
                        <select
                          value={link.paymentType || 'tip'}
                          onChange={e => handleFieldChange('paymentType', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-900 outline-none"
                        >
                          <option value="tip">Tip Jar / Coffee</option>
                          <option value="stripe">Stripe Checkout</option>
                          <option value="paypal">PayPal</option>
                          <option value="venmo">Venmo</option>
                          <option value="cashapp">Cash App</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Suggested Amount</label>
                        <input
                          type="text"
                          value={link.paymentAmount || ''}
                          onChange={e => handleFieldChange('paymentAmount', e.target.value)}
                          placeholder="5.00"
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Currency</label>
                        <input
                          type="text"
                          value={link.paymentCurrency || '$'}
                          onChange={e => handleFieldChange('paymentCurrency', e.target.value)}
                          placeholder="$"
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* BOOKING TYPE FIELDS */}
                {link.type === 'booking' && (
                  <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span>Appointment Booking Settings</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Provider</label>
                        <select
                          value={link.bookingProvider || 'calendly'}
                          onChange={e => handleFieldChange('bookingProvider', e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        >
                          <option value="calendly">Calendly</option>
                          <option value="cal.com">Cal.com</option>
                          <option value="acuity">Acuity Scheduling</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={link.bookingDuration || '30 mins'}
                          onChange={e => handleFieldChange('bookingDuration', e.target.value)}
                          placeholder="30 mins"
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: LAYOUT (Exact Screenshot 1) ── */}
            {activeDrawer === 'layout' && (
              <div className="space-y-6 text-left animate-fadeIn">
                {(
                  <>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-gray-900">
                        Choose a layout for your link
                      </h4>
                    </div>

                    <div className="space-y-4">
                  {/* CLASSIC OPTION */}
                  <div
                    onClick={() => handleFieldChange('layout', 'classic')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      (link.layout || 'classic') === 'classic'
                        ? 'border-black bg-white shadow-sm ring-1 ring-black/5'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                        (link.layout || 'classic') === 'classic'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {(link.layout || 'classic') === 'classic' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Classic</h5>
                          <p className="text-xs text-gray-500 mt-0.5">Efficient, direct and compact.</p>
                        </div>
                        
                        {/* Linktree Classic Mini Pill Illustration */}
                        <div className="w-44 h-10 rounded-full bg-slate-900 flex items-center justify-between px-3 shadow-xs">
                          <div className="w-7 h-7 rounded-full bg-slate-800 overflow-hidden border border-white/20 flex items-center justify-center text-white text-[10px] font-bold">
                            {link.thumbnail ? (
                              <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>★</span>
                            )}
                          </div>
                          <span className="text-xs text-white/80 font-mono tracking-widest">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FEATURED OPTION */}
                  <div
                    onClick={() => handleFieldChange('layout', 'featured')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      link.layout === 'featured'
                        ? 'border-black bg-white shadow-sm ring-1 ring-black/5'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                        link.layout === 'featured'
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white'
                      }`}>
                        {link.layout === 'featured' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h5 className="text-sm font-bold text-gray-900">Featured</h5>
                          <p className="text-xs text-gray-500 mt-0.5">Make your link stand out with a larger, more attractive display.</p>
                        </div>

                        {/* Linktree Featured Mini Card Illustration */}
                        <div className="w-56 h-32 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-purple-950 overflow-hidden relative shadow-md flex items-center justify-center">
                          {link.thumbnail ? (
                            <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center p-3">
                              <Sparkles size={24} className="text-purple-400 mx-auto mb-1 opacity-75" />
                              <span className="text-[10px] text-white/70 block">Featured Showcase Banner</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                            <span className="text-[11px] font-bold text-white leading-tight truncate max-w-[150px]">
                              {link.text || 'Featured Showcase'}
                            </span>
                            <span className="text-[10px] text-white/80 font-mono tracking-widest mb-0.5">&rarr;</span>
                          </div>
                        </div>

                        {/* Media Upload Dropzone */}
                        <div className="pt-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
                            }}
                          />
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                            onDrop={(e) => {
                              e.preventDefault(); e.stopPropagation()
                              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0])
                            }}
                            className="w-full border-2 border-dashed border-gray-300 hover:border-purple-500 rounded-xl p-3 text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-purple-50/30"
                          >
                            <span className="text-xs font-bold text-gray-800 block">
                              {link.thumbnail ? 'Change Featured Thumbnail Image' : 'Upload Featured Thumbnail Image'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
