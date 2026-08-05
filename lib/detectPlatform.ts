// Smart URL Platform Auto-Detection Engine for LinkTree
export interface PlatformMeta {
  id: string
  name: string
  category: 'social' | 'video' | 'music' | 'developer' | 'business' | 'files' | 'booking' | 'productivity' | 'commerce' | 'contact' | 'other'
  icon: string
  color: string
  bgGradient?: string
  defaultTitle?: string
}

export const PLATFORM_RULES: { domains: string[]; meta: PlatformMeta }[] = [
  {
    domains: ['instagram.com', 'instagr.am'],
    meta: {
      id: 'instagram',
      name: 'Instagram',
      category: 'social',
      icon: 'instagram',
      color: '#E4405F',
      bgGradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
      defaultTitle: 'Instagram Profile',
    },
  },
  {
    domains: ['youtube.com', 'youtu.be'],
    meta: {
      id: 'youtube',
      name: 'YouTube',
      category: 'video',
      icon: 'youtube',
      color: '#FF0000',
      bgGradient: 'bg-red-600',
      defaultTitle: 'Watch on YouTube',
    },
  },
  {
    domains: ['tiktok.com'],
    meta: {
      id: 'tiktok',
      name: 'TikTok',
      category: 'video',
      icon: 'tiktok',
      color: '#000000',
      bgGradient: 'bg-black',
      defaultTitle: 'Watch on TikTok',
    },
  },
  {
    domains: ['twitter.com', 'x.com'],
    meta: {
      id: 'twitter',
      name: 'X (Twitter)',
      category: 'social',
      icon: 'twitter',
      color: '#1DA1F2',
      bgGradient: 'bg-slate-900',
      defaultTitle: 'Follow on X',
    },
  },
  {
    domains: ['facebook.com', 'fb.com', 'fb.watch'],
    meta: {
      id: 'facebook',
      name: 'Facebook',
      category: 'social',
      icon: 'facebook',
      color: '#1877F2',
      bgGradient: 'bg-blue-600',
      defaultTitle: 'Facebook Page',
    },
  },
  {
    domains: ['spotify.com', 'open.spotify.com'],
    meta: {
      id: 'spotify',
      name: 'Spotify',
      category: 'music',
      icon: 'spotify',
      color: '#1DB954',
      bgGradient: 'bg-emerald-500',
      defaultTitle: 'Listen on Spotify',
    },
  },
  {
    domains: ['soundcloud.com'],
    meta: {
      id: 'soundcloud',
      name: 'SoundCloud',
      category: 'music',
      icon: 'soundcloud',
      color: '#FF5500',
      bgGradient: 'bg-orange-500',
      defaultTitle: 'SoundCloud Track',
    },
  },
  {
    domains: ['music.apple.com'],
    meta: {
      id: 'apple-music',
      name: 'Apple Music',
      category: 'music',
      icon: 'apple-music',
      color: '#FA243C',
      bgGradient: 'bg-red-500',
      defaultTitle: 'Apple Music',
    },
  },
  {
    domains: ['github.com'],
    meta: {
      id: 'github',
      name: 'GitHub',
      category: 'developer',
      icon: 'github',
      color: '#24292F',
      bgGradient: 'bg-slate-900',
      defaultTitle: 'GitHub Profile',
    },
  },
  {
    domains: ['linkedin.com'],
    meta: {
      id: 'linkedin',
      name: 'LinkedIn',
      category: 'business',
      icon: 'linkedin',
      color: '#0A66C2',
      bgGradient: 'bg-blue-700',
      defaultTitle: 'Connect on LinkedIn',
    },
  },
  {
    domains: ['discord.gg', 'discord.com'],
    meta: {
      id: 'discord',
      name: 'Discord',
      category: 'social',
      icon: 'discord',
      color: '#5865F2',
      bgGradient: 'bg-indigo-600',
      defaultTitle: 'Join Discord Server',
    },
  },
  {
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    meta: {
      id: 'telegram',
      name: 'Telegram',
      category: 'contact',
      icon: 'telegram',
      color: '#0088CC',
      bgGradient: 'bg-sky-400',
      defaultTitle: 'Chat on Telegram',
    },
  },
  {
    domains: ['wa.me', 'whatsapp.com', 'api.whatsapp.com'],
    meta: {
      id: 'whatsapp',
      name: 'WhatsApp',
      category: 'contact',
      icon: 'whatsapp',
      color: '#25D366',
      bgGradient: 'bg-emerald-500',
      defaultTitle: 'WhatsApp Chat',
    },
  },
  {
    domains: ['drive.google.com', 'docs.google.com'],
    meta: {
      id: 'google-drive',
      name: 'Google Drive',
      category: 'files',
      icon: 'website',
      color: '#4285F4',
      bgGradient: 'bg-blue-500',
      defaultTitle: 'View Document',
    },
  },
  {
    domains: ['calendly.com', 'cal.com'],
    meta: {
      id: 'calendly',
      name: 'Calendly',
      category: 'booking',
      icon: 'calendar',
      color: '#006BFF',
      bgGradient: 'bg-sky-500',
      defaultTitle: 'Book a Meeting',
    },
  },
  {
    domains: ['notion.so', 'notion.site'],
    meta: {
      id: 'notion',
      name: 'Notion',
      category: 'productivity',
      icon: 'website',
      color: '#000000',
      bgGradient: 'bg-slate-800',
      defaultTitle: 'Notion Workspace',
    },
  },
  {
    domains: ['etsy.com'],
    meta: {
      id: 'etsy',
      name: 'Etsy',
      category: 'commerce',
      icon: 'shopify',
      color: '#F1641E',
      bgGradient: 'bg-orange-500',
      defaultTitle: 'Etsy Shop',
    },
  },
  {
    domains: ['gumroad.com'],
    meta: {
      id: 'gumroad',
      name: 'Gumroad',
      category: 'commerce',
      icon: 'shopify',
      color: '#FF90E8',
      bgGradient: 'bg-pink-600',
      defaultTitle: 'Gumroad Store',
    },
  },
  {
    domains: ['patreon.com'],
    meta: {
      id: 'patreon',
      name: 'Patreon',
      category: 'social',
      icon: 'user',
      color: '#FF424D',
      bgGradient: 'bg-orange-600',
      defaultTitle: 'Support on Patreon',
    },
  },
  {
    domains: ['ko-fi.com'],
    meta: {
      id: 'ko-fi',
      name: 'Ko-fi',
      category: 'commerce',
      icon: 'user',
      color: '#29ABE2',
      bgGradient: 'bg-sky-400',
      defaultTitle: 'Buy Me a Coffee',
    },
  },
  {
    domains: ['pinterest.com', 'pin.it'],
    meta: {
      id: 'pinterest',
      name: 'Pinterest',
      category: 'social',
      icon: 'pinterest',
      color: '#BD081C',
      bgGradient: 'bg-red-600',
      defaultTitle: 'Pinterest Boards',
    },
  },
  {
    domains: ['twitch.tv'],
    meta: {
      id: 'twitch',
      name: 'Twitch',
      category: 'video',
      icon: 'twitch',
      color: '#9146FF',
      bgGradient: 'bg-purple-600',
      defaultTitle: 'Twitch Live Stream',
    },
  },
]

export function detectPlatformFromUrl(url: string): PlatformMeta | null {
  if (!url || typeof url !== 'string') return null
  const cleanUrl = url.trim().toLowerCase()

  for (const rule of PLATFORM_RULES) {
    if (rule.domains.some(domain => cleanUrl.includes(domain))) {
      return rule.meta
    }
  }

  return null
}
