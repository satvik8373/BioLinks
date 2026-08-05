'use client'

import React from 'react'
import { LinkItem, formatSocialUrl } from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'

interface SocialFieldsProps {
  link: LinkItem
  onUpdate: (updatedLink: LinkItem) => void
}

export default function SocialFields({ link, onUpdate }: SocialFieldsProps) {
  const currentPlatform = link.platform || link.icon || 'instagram'

  return (
    <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-3.5 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
        <ServiceIcon iconId={currentPlatform} size={16} />
        <span>Social Media Channel Settings</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">Social Platform</label>
          <select
            value={currentPlatform}
            onChange={e => {
              const platform = e.target.value
              onUpdate({
                ...link,
                platform: platform,
                icon: platform,
                text: link.text === 'Untitled Link' || !link.text ? `Follow on ${platform.charAt(0).toUpperCase() + platform.slice(1)}` : link.text,
                url: link.url ? formatSocialUrl(platform, link.url) : '',
              })
            }}
            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none"
          >
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="twitter">Twitter / X</option>
            <option value="email">Email</option>
            <option value="github">GitHub</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="discord">Discord</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="telegram">Telegram</option>
            <option value="spotify">Spotify</option>
            <option value="soundcloud">SoundCloud</option>
            <option value="twitch">Twitch</option>
            <option value="pinterest">Pinterest</option>
            <option value="apple-music">Apple Music</option>
            <option value="website">Website</option>
            <option value="phone">Phone</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">
            Handle or Full Profile Link
          </label>
          <input
            type="text"
            value={link.url || ''}
            onChange={e => {
              onUpdate({
                ...link,
                url: e.target.value,
              })
            }}
            onBlur={e => {
              const val = e.target.value
              if (val) {
                const formatted = formatSocialUrl(currentPlatform, val)
                if (formatted !== val) {
                  onUpdate({
                    ...link,
                    url: formatted,
                  })
                }
              }
            }}
            placeholder="@username or https://platform.com/user"
            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  )
}
