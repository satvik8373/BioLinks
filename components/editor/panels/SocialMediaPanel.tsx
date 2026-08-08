'use client'

import React, { useState } from 'react'
import {
  Share2, X, Search, Trash2, ExternalLink,
  Sparkles, ArrowLeft, HelpCircle
} from 'lucide-react'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import { formatSocialUrl } from '@/lib/types/link'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export interface SocialPlatform {
  id: string
  name: string
  placeholder: string
  category: 'social' | 'music' | 'contact' | 'commerce'
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: 'instagram',   name: 'Instagram',     placeholder: '@username',                    category: 'social' },
  { id: 'tiktok',      name: 'TikTok',         placeholder: '@username',                    category: 'social' },
  { id: 'youtube',     name: 'YouTube',        placeholder: '@channel or channel URL',      category: 'social' },
  { id: 'twitter',     name: 'Twitter / X',    placeholder: '@handle',                      category: 'social' },
  { id: 'linkedin',    name: 'LinkedIn',       placeholder: 'in/username',                  category: 'social' },
  { id: 'github',      name: 'GitHub',         placeholder: 'username',                     category: 'social' },
  { id: 'facebook',    name: 'Facebook',       placeholder: 'username',                     category: 'social' },
  { id: 'discord',     name: 'Discord',        placeholder: 'invite code or server link',   category: 'social' },
  { id: 'spotify',     name: 'Spotify',        placeholder: 'artist-id or Spotify URL',     category: 'music' },
  { id: 'soundcloud',  name: 'SoundCloud',     placeholder: 'username',                     category: 'music' },
  { id: 'apple-music', name: 'Apple Music',    placeholder: 'artist URL',                   category: 'music' },
  { id: 'whatsapp',    name: 'WhatsApp',       placeholder: '+1234567890 (phone number)',   category: 'contact' },
  { id: 'telegram',    name: 'Telegram',       placeholder: '@username',                    category: 'contact' },
  { id: 'email',       name: 'Email',          placeholder: 'you@example.com',              category: 'contact' },
  { id: 'phone',       name: 'Phone',          placeholder: '+1 234 567 8900',              category: 'contact' },
  { id: 'shopify',     name: 'Shopify Store',  placeholder: 'yourstore.myshopify.com',      category: 'commerce' },
]

const CATEGORY_LABELS: Record<string, string> = {
  all:      'All Channels',
  social:   'Social & Video',
  music:    'Music & Audio',
  contact:  'Contact & Messaging',
  commerce: 'Store & Commerce',
}

interface Props {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

export default function SocialMediaPanel({ config, updateConfig, onBack }: Props) {
  const [searchQuery,    setSearchQuery]    = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const socialLinks: Record<string, string> = config?.socialLinks || {}
  const position = config?.socialIconPosition || 'top'

  const activePlatforms = Object.entries(socialLinks).filter(([_, url]) => Boolean(url?.trim()))
  const activeCount     = activePlatforms.length

  const handleInputChange = (platformId: string, val: string) =>
    updateConfig(`socialLinks.${platformId}`, val)

  const handleInputBlur = (platformId: string, val: string) => {
    if (val?.trim()) {
      const formatted = formatSocialUrl(platformId, val.trim())
      if (formatted !== val) updateConfig(`socialLinks.${platformId}`, formatted)
    }
  }

  const handleRemove = (platformId: string) => {
    const updated = { ...socialLinks }
    delete updated[platformId]
    delete updated[platformId.toLowerCase()]
    updateConfig('socialLinks', updated)
  }

  const filteredPlatforms = SOCIAL_PLATFORMS.filter(p => {
    const matchesSearch   = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-5 animate-in fade-in duration-200">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </Button>
          )}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Social Channels</h1>
            <p className="text-xs text-slate-500 font-medium">Connect and manage your social profile icons</p>
          </div>
        </div>
        <Badge variant="primary" size="md" dot>
          <Sparkles className="w-3 h-3" />
          {activeCount} Connected
        </Badge>
      </div>

      {/* Position card */}
      <div className="clay-card-flat p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Share2 className="w-4 h-4 text-brand-600" />
            Icon Placement
          </span>
          <span className="text-[11px] font-bold text-slate-400">Position on Bio Card</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(['top', 'bottom'] as const).map((pos) => (
            <Button
              key={pos}
              type="button"
              variant={position === pos ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => updateConfig('socialIconPosition', pos)}
            >
              {pos === 'top' ? 'Top (Below Bio)' : 'Bottom (Above Footer)'}
            </Button>
          ))}
        </div>
      </div>

      {/* Search & filter */}
      <div className="space-y-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Instagram, TikTok, YouTube…"
            className="w-full bg-white border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-800 outline-none transition-all shadow-clay-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 w-7 h-7"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
            <Button
              key={id}
              variant={activeCategory === id ? 'primary' : 'secondary'}
              size="xs"
              shape="pill"
              onClick={() => setActiveCategory(id)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Platform list */}
      <div className="space-y-2.5">
        {filteredPlatforms.map((platform) => {
          const rawVal      = socialLinks[platform.id] || socialLinks[platform.id.toLowerCase()] || ''
          const isConnected = Boolean(rawVal?.trim())

          return (
            <div
              key={platform.id}
              className={`p-3.5 bg-white border rounded-2xl transition-all shadow-clay-sm ${
                isConnected
                  ? 'border-brand-300 ring-2 ring-brand-500/10 bg-brand-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 transition-colors ${
                  isConnected ? 'bg-brand-600 text-white shadow-clay-sm' : 'bg-slate-100 text-slate-600'
                }`}>
                  <ServiceIcon iconId={platform.id} size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                      {platform.name}
                      {isConnected && <Badge variant="success" size="sm" dot>Connected</Badge>}
                    </label>
                    {isConnected && (
                      <Button
                        type="button"
                        variant="danger"
                        size="xs"
                        onClick={() => handleRemove(platform.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </Button>
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={rawVal}
                      onChange={(e) => handleInputChange(platform.id, e.target.value)}
                      onBlur={(e) => handleInputBlur(platform.id, e.target.value)}
                      placeholder={platform.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-brand-600 focus:bg-white rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-brand-500/20"
                    />
                    {isConnected && (
                      <a
                        href={rawVal.startsWith('http') || rawVal.startsWith('mailto:') || rawVal.startsWith('tel:') ? rawVal : `https://${rawVal}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-2.5 text-slate-400 hover:text-slate-700 transition-colors p-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filteredPlatforms.length === 0 && (
          <div className="text-center py-10 clay-card-flat rounded-2xl p-6">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-extrabold text-slate-700">No social channels found</p>
            <p className="text-[11px] text-slate-400 mt-1">Try searching for a different platform name</p>
          </div>
        )}
      </div>
    </div>
  )
}
