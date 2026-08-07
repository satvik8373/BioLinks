'use client'

import React from 'react'
import { LinkItem, formatSocialUrl } from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import { ExternalLink, Check, ChevronDown } from 'lucide-react'

interface SocialFieldsProps {
  link: LinkItem
  onUpdate: (updatedLink: LinkItem) => void
}

const ALL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'github', label: 'GitHub' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'discord', label: 'Discord' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'spotify', label: 'Spotify' },
  { id: 'soundcloud', label: 'SoundCloud' },
  { id: 'apple-music', label: 'Apple Music' },
  { id: 'shopify', label: 'Shopify Store' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'website', label: 'Website' },
]

export default function SocialFields({ link, onUpdate }: SocialFieldsProps) {
  const currentPlatform = link.platform || link.icon || 'instagram'
  const isConnected = Boolean(link.url && link.url.trim())

  const handlePlatformChange = (platform: string) => {
    onUpdate({
      ...link,
      platform: platform,
      icon: platform,
      text: link.text === 'Untitled Link' || !link.text || link.text.startsWith('Follow on')
        ? `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
        : link.text,
      url: link.url ? formatSocialUrl(platform, link.url) : '',
    })
  }

  const handleUrlBlur = (val: string) => {
    if (val && val.trim()) {
      const formatted = formatSocialUrl(currentPlatform, val.trim())
      if (formatted !== val) {
        onUpdate({
          ...link,
          url: formatted,
        })
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-violet-50/40 border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-violet-600 text-white flex items-center justify-center p-1.5 shadow-2xs">
            <ServiceIcon iconId={currentPlatform} size={15} />
          </div>
          <span className="text-xs font-extrabold text-slate-900 tracking-tight">
            Social Media Channel Settings
          </span>
        </div>

        {isConnected && (
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" /> Connected
          </span>
        )}
      </div>

      {/* Dropdown & Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Social Platform Select Dropdown */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
            Social Platform
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-slate-600 flex items-center justify-center">
              <ServiceIcon iconId={currentPlatform} size={15} />
            </div>
            <select
              value={currentPlatform}
              onChange={e => handlePlatformChange(e.target.value)}
              className="w-full bg-white border border-slate-200/90 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-slate-900 outline-none transition-all shadow-2xs appearance-none cursor-pointer"
            >
              {ALL_PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        {/* Handle / URL Input */}
        <div>
          <label className="block text-[11px] font-extrabold text-slate-700 mb-1">
            Handle or Full Profile Link
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={link.url || ''}
              onChange={e => onUpdate({ ...link, url: e.target.value })}
              onBlur={e => handleUrlBlur(e.target.value)}
              placeholder="@username or https://platform.com/user"
              className="w-full bg-white border border-slate-200/90 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal shadow-2xs"
            />
            {isConnected && (
              <a
                href={link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.startsWith('tel:') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-2.5 text-slate-400 hover:text-slate-700 transition-colors p-1"
                title="Open link in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
