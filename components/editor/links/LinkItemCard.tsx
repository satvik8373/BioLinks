'use client'

import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { 
  GripVertical, Eye, EyeOff, Trash2, Pin, ChevronDown, ChevronUp, 
  Globe, Layout, DollarSign, Phone, Calendar, Video, Music, Image as ImageIcon,
  Tag, MessageCircle, Clock, MapPin, Check, Sparkles, ExternalLink,
  UploadCloud, X, FileText, Upload, Pencil, BarChart2, Star, Lock,
  ShieldAlert, Key, AlertTriangle, Search, Zap, CheckSquare, Sliders, Grid, Layers
} from 'lucide-react'
import { LinkItem, LinkType, formatSocialUrl } from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import SocialFields from './renderers/SocialFields'
import ShopFields from './renderers/ShopFields'
import GalleryBlockEditor from '@/components/editor/blocks/GalleryBlockEditor'
import MusicBlockEditor from '@/components/editor/blocks/MusicBlockEditor'
import { uploadImageToFirebase } from '@/lib/firebaseStorage'
import MediaLibraryModal from '@/components/modals/MediaLibraryModal'
import { saveMediaToLibrary } from '@/lib/mediaLibrary'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

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

function detectPlatformFromUrl(url: string): { icon: string; title: string; type: LinkType } | null {
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
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [showUrlFallback, setShowUrlFallback] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<'settings' | 'layout' | 'thumbnail' | 'schedule' | 'lock'>('settings')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingUrl, setIsEditingUrl] = useState(false)

  const drawerRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)

  // GSAP Smooth Expand & Collapse Drawer Animation
  useEffect(() => {
    if (!drawerRef.current) return

    if (isExpanded) {
      gsap.killTweensOf(drawerRef.current)
      gsap.fromTo(
        drawerRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.42, ease: 'power2.out' }
      )
      if (drawerContentRef.current) {
        gsap.fromTo(
          drawerContentRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, delay: 0.08, ease: 'power2.out' }
        )
      }
    } else {
      gsap.killTweensOf(drawerRef.current)
      if (drawerContentRef.current) {
        gsap.to(drawerContentRef.current, {
          y: 8,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        })
      }
      gsap.to(drawerRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
      })
    }
  }, [isExpanded])

  // GSAP Sub-Drawer Tab Transition
  useEffect(() => {
    if (isExpanded && drawerContentRef.current) {
      gsap.fromTo(
        drawerContentRef.current,
        { opacity: 0.3, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [activeDrawer])

  const handleFileUpload = async (file: File) => {
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
    // Instant UI update using FileReader base64
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      if (dataUrl) {
        saveMediaToLibrary(dataUrl, file.name)
        handleFieldChange('thumbnail', dataUrl)
      }

      // Cloudinary upload in background
      try {
        const firebaseUrl = await uploadImageToFirebase(file, 'thumbnails')
        if (firebaseUrl) {
          saveMediaToLibrary(firebaseUrl, file.name)
          handleFieldChange('thumbnail', firebaseUrl)
        }
      } catch (err) {
        console.warn('Cloud storage upload warning (data URL active):', err)
      } finally {
        setIsUploading(false)
      }
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
      case 'gallery': return { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Photo Gallery' }
      case 'event': return { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Event' }
      case 'payment': return { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Payment / Tip' }
      case 'booking': return { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Booking' }
      case 'header': return { bg: 'bg-slate-200 text-slate-800 border-slate-300', label: 'Header' }
      case 'text': return { bg: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Note' }
      default: return { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Link' }
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
              className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600 p-0.5 rounded transition-colors flex-shrink-0 touch-none"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Title & URL Inline Editable */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Title Inline */}
              <div className="flex items-center gap-1.5 group/edit text-sm font-bold text-slate-900">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={link.text}
                    onChange={e => handleFieldChange('text', e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={e => { if (e.key === 'Enter') setIsEditingTitle(false) }}
                    autoFocus
                    className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-sm font-bold text-slate-900 outline-none w-full focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingTitle(true)}
                    className="flex items-center gap-1.5 cursor-pointer hover:text-brand-600 truncate"
                  >
                    <span className="truncate">{link.text || 'Untitled Link'}</span>
                    <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover/edit:text-brand-600 flex-shrink-0 opacity-80" />
                  </div>
                )}
              </div>

              {/* URL Inline */}
              {link.type !== 'header' && link.type !== 'gallery' && (
                <div className="flex items-center gap-1.5 group/url text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-400">URL</span>
                  {isEditingUrl ? (
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={e => handleFieldChange('url', e.target.value)}
                      onBlur={() => setIsEditingUrl(false)}
                      onKeyDown={e => { if (e.key === 'Enter') setIsEditingUrl(false) }}
                      autoFocus
                      className="bg-slate-100 border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-900 outline-none w-full focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                    />
                  ) : (
                    <div
                      onClick={() => setIsEditingUrl(true)}
                      className="flex items-center gap-1.5 cursor-pointer hover:text-brand-600 truncate"
                    >
                      <span className="truncate">{link.url || 'Add URL'}</span>
                      <Pencil className="w-3 h-3 text-slate-400 group-hover/url:text-brand-600 flex-shrink-0 opacity-80" />
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
                link.isVisible ? 'bg-slate-900' : 'bg-slate-200'
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
        <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-slate-500">
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
                  ? 'bg-brand-600 text-white shadow-clay-sm'
                  : 'bg-brand-50 text-brand-600 border border-brand-100/80 hover:bg-brand-100'
              }`}
              title="Open Link Settings"
            >
              <ServiceIcon iconId={activeIconKey} size={18} />
            </button>

            {/* Quick Action Icons: Thumbnail (non-image only), Schedule Clock, Lock Gate, Analytics */}
            <div className="flex items-center gap-1.5 text-slate-400">
              {/* Thumbnail Icon */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeDrawer === 'thumbnail' && isExpanded) { onToggleExpand() }
                    else { setActiveDrawer('thumbnail'); if (!isExpanded) onToggleExpand() }
                  }}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isExpanded && activeDrawer === 'thumbnail' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100'
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
                  isExpanded && activeDrawer === 'schedule' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100'
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
                  isExpanded && activeDrawer === 'lock' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-brand-600 hover:bg-slate-100'
                }`}
                title="Lock this link"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* 5. Analytics Counter */}
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium pl-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-slate-400" />
                <span>0 clicks</span>
              </div>
            </div>
          </div>

          {/* Delete Trash Button */}
          <button
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete link"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Expanded Type Editor Drawer (Seamless Editor Container) ── */}
      <div 
        ref={drawerRef}
        className={`overflow-hidden border-t border-slate-200/80 rounded-b-[24px] bg-slate-50/40 ${
          isExpanded ? 'max-h-[85vh] overflow-y-auto' : 'max-h-0 pointer-events-none'
        }`}
      >
        <div ref={drawerContentRef} className="p-5 space-y-4">
          {/* Integrated Sub-Tabs Pill Selector */}
          {(activeDrawer === 'settings' || activeDrawer === 'layout') && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setActiveDrawer('settings')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDrawer === 'settings'
                      ? 'bg-white text-brand-700 shadow-clay-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Link Settings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDrawer('layout')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDrawer === 'layout'
                      ? 'bg-white text-brand-700 shadow-clay-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Layout
                </button>
              </div>

              <button
                type="button"
                onClick={onToggleExpand}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Drawer Body Container */}
          <div className="space-y-4">

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
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-900/10 border border-slate-200 flex-shrink-0 shadow-sm">
                      <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      {/* Change Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowMediaLibrary(true)
                        }}
                        className="w-full py-3 bg-[#7800ff] hover:bg-[#6800e0] text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Choose from Library / Change
                      </button>
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFieldChange('thumbnail', undefined)
                        }}
                        className="w-full py-3 border border-slate-300 hover:border-rose-400 hover:bg-rose-50 text-slate-800 font-bold text-sm rounded-full transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-slate-700">
                      Add a Thumbnail or Icon to this Link.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowMediaLibrary(true)
                      }}
                      className="w-full py-3.5 bg-[#7800ff] hover:bg-[#6800e0] text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Set Thumbnail / Media Library
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── 1. LOCK THIS LINK DRAWER ── */}
            {activeDrawer === 'lock' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <Lock className="w-5 h-5 text-slate-700" />
                    <h3>Lock this link</h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Visitors can only access this link by fulfilling certain criteria.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Link locked with:
                  </h4>

                  {/* Lock Option 1: Subscribe */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'subscribe' ? undefined : 'subscribe')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'subscribe' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'subscribe'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Subscribe</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Require visitors to subscribe to your newsletter or email list to unlock.</p>
                    </div>
                  </div>

                  {/* Lock Option 2: Code */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'code' ? undefined : 'code')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'code' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'code'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-slate-900">Code</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Require visitors to enter an secret access code to unlock.</p>
                      {link.lockType === 'code' && (
                        <input
                          type="text"
                          value={link.lockValue || ''}
                          onChange={e => handleFieldChange('lockValue', e.target.value)}
                          placeholder="Enter passcode (e.g. SECRET123)"
                          className="mt-2.5 w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </div>

                  {/* Lock Option 3: Password */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'password' ? undefined : 'password')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'password' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'password'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-slate-900">Password</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Protect this link with a secret password.</p>
                      {link.lockType === 'password' && (
                        <input
                          type="password"
                          value={link.lockValue || ''}
                          onChange={e => handleFieldChange('lockValue', e.target.value)}
                          placeholder="Set password..."
                          className="mt-2.5 w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none"
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                    </div>
                  </div>

                  {/* Lock Option 4: Date of birth */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'dob' ? undefined : 'dob')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'dob' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'dob'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Date of birth</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Require visitors to verify their age before accessing this link.</p>
                    </div>
                  </div>

                  {/* Lock Option 5: Sensitive content */}
                  <div 
                    onClick={() => handleFieldChange('lockType', link.lockType === 'sensitive' ? undefined : 'sensitive')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      link.lockType === 'sensitive' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={link.lockType === 'sensitive'}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
                    />
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Sensitive content</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Show an 18+ sensitive content disclaimer prior to opening.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. SCHEDULE DRAWER ── */}
            {activeDrawer === 'schedule' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Schedule</h3>
                  <p className="text-xs text-slate-500">
                    Select the dates to show or hide this link on your Linktree.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Show link on</label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <input
                        type="datetime-local"
                        value={link.scheduleStart || ''}
                        onChange={e => handleFieldChange('scheduleStart', e.target.value)}
                        className="bg-transparent text-xs text-slate-900 outline-none w-full font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Hide link on</label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <input
                        type="datetime-local"
                        value={link.scheduleEnd || ''}
                        onChange={e => handleFieldChange('scheduleEnd', e.target.value)}
                        className="bg-transparent text-xs text-slate-900 outline-none w-full font-medium"
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
                    className="rounded border-slate-300 accent-brand-600 focus:ring-2 focus:ring-brand-500/30"
                  />
                  <label htmlFor="scheduleNotify" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Notify subscribers when link is added
                  </label>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-bold text-slate-900">Time zone</label>
                  <p className="text-[11px] text-slate-500">Choose a time zone.</p>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <select
                      value={link.scheduleTimezone || '(GMT+5:30) New Delhi'}
                      onChange={e => handleFieldChange('scheduleTimezone', e.target.value)}
                      className="bg-transparent text-xs text-slate-900 font-medium outline-none w-full cursor-pointer"
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
                  className="w-full py-3.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm rounded-full transition-colors mt-2"
                >
                  Schedule
                </button>
              </div>
            )}
            {/* ── TAB 1: LINK SETTINGS ── */}
            {activeDrawer === 'settings' && (
              <div className="space-y-4">
                {/* ── LINK SETTINGS / GALLERY BLOCK / MUSIC BLOCK ── */}
                {link.type === 'gallery' ? (
                  <GalleryBlockEditor
                    link={link}
                    onUpdate={onUpdate}
                  />
                ) : link.type === 'music' || (link.url && (link.url.includes('spotify.com') || link.url.includes('soundcloud.com') || link.url.includes('music.apple.com'))) ? (
                  <MusicBlockEditor
                    link={link}
                    onUpdate={onUpdate}
                    onClose={onToggleExpand}
                  />
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtext / Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={link.description || ''}
                      onChange={e => handleFieldChange('description', e.target.value)}
                      placeholder="Short subtitle or note displayed under the title"
                      className="w-full bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-xl px-3 py-2 text-sm text-slate-900 outline-none transition-all"
                    />
                  </div>
                )}

                {/* ── YOUTUBE / VIDEO LINK SETTINGS (Exact Match to Linktree Screenshot) ── */}
                {(link.type === 'video' || (link.url || '').toLowerCase().includes('youtube') || (link.url || '').toLowerCase().includes('youtu.be')) && (
                  <div className="space-y-5 animate-fadeIn pt-2 border-t border-slate-100 mt-3">
                    {/* Section 1: When a visitor clicks */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900">When a visitor clicks:</h4>
                      
                      <div className="space-y-3">
                        {[
                          { id: 'display_video', label: 'Display my video on my Linktree' },
                          { id: 'open_youtube',  label: 'Open video on YouTube / platform' },
                          { id: 'open_latest',   label: "Open my channel's latest video" },
                          { id: 'display_latest',label: "Display my channel's latest video" },
                        ].map((opt) => {
                          const selected = (link.videoClickOption || 'open_youtube') === opt.id
                          return (
                            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group py-1 select-none">
                              <input
                                type="radio"
                                name={`videoClickOption-${link.id}`}
                                checked={selected}
                                onChange={() => handleFieldChange('videoClickOption', opt.id)}
                                className="w-4 h-4 accent-brand-600 border-2 border-slate-300 focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
                              />
                              <span className={`text-sm ${selected ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                {opt.label}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Section 2: Display options */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900">Display options</h4>
                      
                      <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <input
                          type="checkbox"
                          checked={link.videoMute || false}
                          onChange={(e) => handleFieldChange('videoMute', e.target.checked)}
                          className="w-4 h-4 accent-brand-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-brand-500/30 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-slate-900">Mute video</span>
                      </label>
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
                  <div className="bg-sky-50/60 border border-sky-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                      <Phone className="w-4 h-4 text-sky-600" />
                      <span>Contact Direct Trigger</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Type</label>
                        <select
                          value={link.contactType || 'email'}
                          onChange={e => handleFieldChange('contactType', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="email">Email Address</option>
                          <option value="phone">Phone Call</option>
                          <option value="whatsapp">WhatsApp Chat</option>
                          <option value="telegram">Telegram</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Value ({link.contactType || 'email'})
                        </label>
                        <input
                          type="text"
                          value={link.contactValue || ''}
                          onChange={e => handleFieldChange('contactValue', e.target.value)}
                          placeholder={link.contactType === 'phone' ? '+1234567890' : link.contactType === 'whatsapp' ? '+1234567890' : link.contactType === 'telegram' ? '@username' : 'you@example.com'}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
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
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Event Date</label>
                        <input type="date" value={link.eventDate || ''} onChange={e => handleFieldChange('eventDate', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Event Time</label>
                        <input type="text" value={link.eventTime || ''} onChange={e => handleFieldChange('eventTime', e.target.value)} placeholder="8:00 PM EST" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Location / Venue</label>
                        <input type="text" value={link.eventLocation || ''} onChange={e => handleFieldChange('eventLocation', e.target.value)} placeholder="New York, NY" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20" />
                      </div>
                    </div>
                  </div>
                )}

                {/* PAYMENT TYPE FIELDS */}
                {link.type === 'payment' && (
                  <div className="bg-brand-50/60 border border-brand-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
                      <DollarSign className="w-4 h-4 text-brand-600" />
                      <span>Monetization & Tip Jar</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Service</label>
                        <select value={link.paymentType || 'tip'} onChange={e => handleFieldChange('paymentType', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20">
                          <option value="tip">Tip Jar / Coffee</option>
                          <option value="stripe">Stripe Checkout</option>
                          <option value="paypal">PayPal</option>
                          <option value="venmo">Venmo</option>
                          <option value="cashapp">Cash App</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Suggested Amount</label>
                        <input type="text" value={link.paymentAmount || ''} onChange={e => handleFieldChange('paymentAmount', e.target.value)} placeholder="5.00" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Currency</label>
                        <input type="text" value={link.paymentCurrency || '$'} onChange={e => handleFieldChange('paymentCurrency', e.target.value)} placeholder="$" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20" />
                      </div>
                    </div>
                  </div>
                )}

                {/* BOOKING TYPE FIELDS */}
                {link.type === 'booking' && (
                  <div className="bg-brand-50/60 border border-brand-200/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
                      <Clock className="w-4 h-4 text-brand-600" />
                      <span>Appointment Booking Settings</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Provider</label>
                        <select value={link.bookingProvider || 'calendly'} onChange={e => handleFieldChange('bookingProvider', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20">
                          <option value="calendly">Calendly</option>
                          <option value="cal.com">Cal.com</option>
                          <option value="acuity">Acuity Scheduling</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration</label>
                        <input type="text" value={link.bookingDuration || '30 mins'} onChange={e => handleFieldChange('bookingDuration', e.target.value)} placeholder="30 mins" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: LAYOUT (Exact Screenshot 1) ── */}
            {activeDrawer === 'layout' && (
              <div className="space-y-6 text-left animate-fadeIn">
                {link.type === 'gallery' ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        Choose a display layout for your gallery
                      </h4>
                      <p className="text-xs text-slate-500">
                        Select how your photo gallery is rendered to your page visitors.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          id: 'slider',
                          name: 'Slider / Carousel',
                          desc: 'Interactive slideshow with navigation arrows, dots, & counter.',
                          mockup: (
                            <div className="w-full h-24 rounded-xl bg-slate-900 relative overflow-hidden flex items-center justify-center border border-slate-700/80 shadow-xs">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <Sliders className="w-6 h-6 text-purple-400 opacity-80" />
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white text-[9px]">&larr;</div>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-white text-[9px]">&rarr;</div>
                              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
                                <div className="w-3.5 h-1 rounded-full bg-white" />
                                <div className="w-1 h-1 rounded-full bg-white/40" />
                                <div className="w-1 h-1 rounded-full bg-white/40" />
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'grid',
                          name: 'Photo Grid',
                          desc: 'Clean 2x2 or 3x3 photo grid displaying all images together.',
                          mockup: (
                            <div className="w-full h-24 rounded-xl bg-slate-900 p-1.5 grid grid-cols-2 gap-1 border border-slate-700/80 shadow-xs">
                              <div className="bg-slate-800/90 rounded-lg flex items-center justify-center text-purple-300 text-[10px] font-bold border border-slate-700">1</div>
                              <div className="bg-slate-800/90 rounded-lg flex items-center justify-center text-purple-300 text-[10px] font-bold border border-slate-700">2</div>
                              <div className="bg-slate-800/90 rounded-lg flex items-center justify-center text-purple-300 text-[10px] font-bold border border-slate-700">3</div>
                              <div className="bg-slate-800/90 rounded-lg flex items-center justify-center text-purple-300 text-[10px] font-bold border border-slate-700">4</div>
                            </div>
                          ),
                        },
                        {
                          id: 'stack',
                          name: 'Card Stack',
                          desc: 'Overlapping photo deck. Tap top card to cycle through photos.',
                          mockup: (
                            <div className="w-full h-24 relative flex items-center justify-center">
                              <div className="absolute w-[80%] h-18 rounded-xl bg-slate-800 border border-slate-700 top-0 opacity-40 scale-90" />
                              <div className="absolute w-[85%] h-18 rounded-xl bg-slate-800 border border-slate-700 top-1 opacity-70 scale-95" />
                              <div className="absolute w-[90%] h-18 rounded-xl bg-[#0d1322] border border-slate-700 top-2 p-2 flex flex-col justify-between shadow-md">
                                <div className="flex items-center gap-1 text-[10px] text-purple-300 font-bold">
                                  <Layers className="w-3.5 h-3.5" /> Stack Deck
                                </div>
                                <span className="text-[9px] text-white/60">Tap to cycle &rarr;</span>
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'hero',
                          name: 'Hero Showcase',
                          desc: 'Featured main photo on top with clickable thumbnail strip below.',
                          mockup: (
                            <div className="w-full h-24 flex flex-col gap-1">
                              <div className="w-full h-16 rounded-xl bg-gradient-to-r from-purple-900/90 to-indigo-900/90 border border-slate-700 flex items-center justify-center text-white text-[10px] font-bold gap-1 shadow-xs">
                                <Sparkles className="w-3.5 h-3.5 text-purple-300" /> Featured Hero
                              </div>
                              <div className="flex gap-1">
                                <div className="flex-1 h-6 rounded-md bg-slate-800 border border-purple-500/60" />
                                <div className="flex-1 h-6 rounded-md bg-slate-800/60 border border-slate-700" />
                                <div className="flex-1 h-6 rounded-md bg-slate-800/60 border border-slate-700" />
                              </div>
                            </div>
                          ),
                        },
                      ].map((opt) => {
                        const isSelected = (link.galleryLayout || 'slider') === opt.id
                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleFieldChange('galleryLayout', opt.id)}
                            className={`p-5 rounded-[22px] border-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-slate-900 bg-white shadow-2xs'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start gap-3.5">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                                isSelected ? 'border-slate-900 bg-slate-900' : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                              </div>

                              <div className="flex-1 space-y-3">
                                <div>
                                  <h5 className="text-base font-extrabold text-slate-900 leading-tight">{opt.name}</h5>
                                </div>

                                {/* Graphic Mockup Illustration */}
                                <div>
                                  {opt.mockup}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 text-left animate-fadeIn">
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-slate-900">
                        Choose a layout for your link
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {/* CLASSIC OPTION */}
                      <div
                        onClick={() => handleFieldChange('layout', 'classic')}
                        className={`p-5 rounded-[22px] border-2 transition-all cursor-pointer ${
                          (link.layout || 'classic') === 'classic'
                            ? 'border-slate-900 bg-white shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                            (link.layout || 'classic') === 'classic'
                              ? 'border-slate-900 bg-slate-900'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {(link.layout || 'classic') === 'classic' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h5 className="text-base font-extrabold text-slate-900 leading-tight">Classic</h5>
                            </div>

                            {/* Linktree Classic Mini Pill Mockup */}
                            <div className="w-52 h-10 rounded-full bg-[#0d1322] flex items-center justify-between px-3 shadow-xs">
                              <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-white text-[11px] font-bold">
                                {link.thumbnail ? (
                                  <img src={link.thumbnail} alt="" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                                )}
                              </div>
                              <span className="text-xs text-white/80 font-bold">&rarr;</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* FEATURED OPTION */}
                      <div
                        onClick={() => handleFieldChange('layout', 'featured')}
                        className={`p-5 rounded-[22px] border-2 transition-all cursor-pointer ${
                          link.layout === 'featured'
                            ? 'border-slate-900 bg-white shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                            link.layout === 'featured'
                              ? 'border-slate-900 bg-slate-900'
                              : 'border-slate-300 bg-white'
                          }`}>
                            {link.layout === 'featured' && (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h5 className="text-base font-extrabold text-slate-900 leading-tight">Featured</h5>
                            </div>

                             {/* Linktree Featured Card Banner Mockup */}
                            <div className="w-full sm:w-72 h-36 rounded-2xl bg-gradient-to-br from-[#0d1322] via-[#151c2e] to-[#1e1435] p-3.5 flex flex-col justify-between text-white border border-slate-700/80 shadow-sm relative overflow-hidden group">
                              {link.thumbnail ? (
                                <img
                                  src={link.thumbnail}
                                  alt="Featured Thumbnail"
                                  className="w-full h-full object-cover absolute inset-0 z-0"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-1 my-auto z-10">
                                  <Sparkles className="w-5 h-5 text-purple-400" />
                                  <span className="text-[11px] font-semibold text-slate-400">Featured Showcase Banner</span>
                                </div>
                              )}
                              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-bold text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 -mx-3.5 -mb-3.5 mt-auto">
                                <span className="truncate">{link.text || 'Follow on Instagram'}</span>
                                <span>&rarr;</span>
                              </div>
                            </div>

                            {/* Upload / Change / Remove Featured Thumbnail */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                if (e.target.files?.[0]) handleFileUpload(e.target.files[0])
                              }}
                            />
                            <div className="flex items-center gap-2 w-full">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowMediaLibrary(true)
                                }}
                                className="flex-1 py-3 border-2 border-dashed border-slate-300 hover:border-purple-500 rounded-2xl text-xs font-extrabold text-slate-800 flex items-center justify-center transition-colors cursor-pointer bg-slate-50/50 hover:bg-purple-50/30"
                              >
                                {isUploading ? 'Uploading...' : link.thumbnail ? 'Change Featured Image (Library)' : 'Choose from Library / Upload Image'}
                              </button>
                              {link.thumbnail && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleFieldChange('thumbnail', undefined)
                                  }}
                                  className="py-3 px-3 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                                  title="Remove thumbnail"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibraryModal
          onClose={() => setShowMediaLibrary(false)}
          onSelectImage={(url) => {
            saveMediaToLibrary(url)
            handleFieldChange('thumbnail', url)
          }}
        />
      )}
    </div>
  )
}
