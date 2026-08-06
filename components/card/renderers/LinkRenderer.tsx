'use client'

import React from 'react'
import { ExternalLink, Globe } from 'lucide-react'
import {
  InstagramIcon, TikTokIcon, YouTubeIcon, SpotifyIcon, TwitterIcon,
  FacebookIcon, LinkedInIcon, DiscordIcon, GitHubIcon, WhatsAppIcon,
  TelegramIcon, SoundCloudIcon, ShopifyIcon, EmailIcon, PhoneIcon,
  WebsiteIcon, AppleMusicIcon
} from '@/components/icons/ServiceIcons'

const PLATFORM_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  instagram: InstagramIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
  spotify: SpotifyIcon, twitter: TwitterIcon, facebook: FacebookIcon,
  linkedin: LinkedInIcon, discord: DiscordIcon, github: GitHubIcon,
  whatsapp: WhatsAppIcon, telegram: TelegramIcon, soundcloud: SoundCloudIcon,
  shopify: ShopifyIcon, email: EmailIcon, phone: PhoneIcon, website: WebsiteIcon,
  'apple-music': AppleMusicIcon,
}

function ensureAbsoluteUrl(url?: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (!trimmed) return '#'
  if (/^(https?:\/\/|mailto:|tel:|wa\.me|t\.me|\/\/)/i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

interface Props {
  link: any
  btnStyle: React.CSSProperties
  textColor: string
  trackClick: (id: string) => void
  animClasses: string
}

export default function LinkRenderer({ link, btnStyle, textColor, trackClick, animClasses }: Props) {
  const key = link.id
  const isCompact = link.layout === 'compact'
  const isFeatured = link.layout === 'featured'

  if (link.type === 'header') {
    return (
      <div key={key} className="w-full pt-4 pb-2 text-center">
        <h3 className="text-xs font-black uppercase tracking-widest opacity-80" style={{ color: textColor }}>
          {link.text}
        </h3>
      </div>
    )
  }

  if (link.type === 'text') {
    return (
      <div key={key} className="w-full py-2 px-4 text-center">
        <p className="text-xs font-semibold leading-relaxed opacity-90" style={{ color: textColor }}>
          {link.text}
        </p>
      </div>
    )
  }

  const IconComp = link.platform && PLATFORM_ICONS[link.platform.toLowerCase()]
    ? PLATFORM_ICONS[link.platform.toLowerCase()]
    : null

  if (isCompact) {
    return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={btnStyle}
        className={`group relative overflow-hidden transform-gpu flex items-center justify-center p-3 text-center ${animClasses}`}>
        {IconComp ? (
          <IconComp size={18} />
        ) : link.thumbnail ? (
          <img src={link.thumbnail} alt={link.text} className="w-5 h-5 rounded-full object-cover" />
        ) : (
          <Globe size={18} />
        )}
      </a>
    )
  }

  if (isFeatured) {
    return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={{ ...btnStyle, height: 'auto', display: 'flex', flexDirection: 'column', padding: 0 }}
        className={`group relative overflow-hidden transform-gpu border-2 shadow-xl ${animClasses}`}>
        {link.thumbnail && (
          <div className="w-full aspect-video bg-black/10 overflow-hidden relative">
            <img src={link.thumbnail} alt={link.text} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="p-4 flex flex-col gap-1 text-left w-full">
          <div className="flex items-center gap-2">
            {IconComp ? <IconComp size={18} /> : <Globe size={18} />}
            <h3 className="font-extrabold text-base leading-snug" style={{ color: textColor }}>{link.text}</h3>
          </div>
          {link.description && (
            <p className="text-xs opacity-75 leading-relaxed line-clamp-2 mt-1" style={{ color: textColor }}>{link.description}</p>
          )}
        </div>
      </a>
    )
  }

  return (
    <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
      onClick={() => trackClick(key)} style={btnStyle}
      className={`group relative overflow-hidden transform-gpu flex items-center justify-between px-4 py-3.5 ${animClasses}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {IconComp ? (
          <IconComp size={20} />
        ) : link.thumbnail ? (
          <img src={link.thumbnail} alt={link.text} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
        ) : (
          <Globe size={18} className="flex-shrink-0" />
        )}
        <div className="min-w-0 text-left">
          <span className="font-extrabold text-sm block truncate" style={{ color: textColor }}>{link.text}</span>
          {link.description && (
            <span className="text-xs block truncate opacity-70 mt-0.5" style={{ color: textColor }}>{link.description}</span>
          )}
        </div>
      </div>
      <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 flex-shrink-0 ml-2" />
    </a>
  )
}
