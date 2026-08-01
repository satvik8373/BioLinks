'use client'

import { useState, useEffect } from 'react'
import {
  Eye, ExternalLink, ShoppingBag, Phone, Mail,
  MessageCircle, Send, MapPin, Calendar, Music, Video,
  CheckCircle, AlertTriangle, XCircle, Globe
} from 'lucide-react'
import {
  InstagramIcon, TikTokIcon, YouTubeIcon, SpotifyIcon, TwitterIcon,
  FacebookIcon, LinkedInIcon, DiscordIcon, GitHubIcon, WhatsAppIcon,
  TelegramIcon, SoundCloudIcon, ShopifyIcon, EmailIcon, PhoneIcon,
  WebsiteIcon, AppleMusicIcon
} from '@/components/icons/ServiceIcons'

// ─── Types ────────────────────────────────────────────────────────────────
interface LinkItem {
  id: string
  type: 'link' | 'header' | 'text' | 'social' | 'shop' | 'music' | 'video' | 'contact' | 'event'
  text: string
  url: string
  icon?: string
  isVisible?: boolean
  platform?: string
  description?: string
  price?: string
  currency?: string
  originalPrice?: string
  stockStatus?: 'in-stock' | 'out-of-stock' | 'limited'
  contactType?: string
  contactValue?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  embedUrl?: string
}

interface ThemeColors {
  background: string
  backgroundGradient?: { from: string; to: string; direction?: string }
  backgroundMesh?: string
  backgroundImage?: string
  backgroundOverlay?: string
  buttonDefault: string
  buttonText: string
  profileText: string
  profileBio: string
}

interface BioLinkConfig {
  theme: {
    id: string
    noiseOpacity?: number
    colors: ThemeColors
    buttonStyle: {
      borderRadius: number
      borderWidth: number
      borderColor?: string
      shadow: boolean
      shadowStyle?: 'none' | 'soft' | 'strong' | 'hard'
      style?: 'solid' | 'clay' | 'outline' | 'soft' | 'glass' | 'hard-shadow' | 'fill'
      animation?: 'none' | 'bounce' | 'pulse' | 'wobble' | 'slide' | string
      enableAnimations?: boolean
    }
    fonts: { heading: string; body: string }
  }
  profile: { avatar: string; title: string; bio: string; location?: string; website?: string }
  links: LinkItem[]
  socialLinks: { [key: string]: string }
}

interface CardData {
  id: string
  config: BioLinkConfig
  analytics: { views: number; clicks: number }
  createdAt: string
}

// ─── Platform icons ───────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  instagram: InstagramIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
  spotify: SpotifyIcon, twitter: TwitterIcon, facebook: FacebookIcon,
  linkedin: LinkedInIcon, discord: DiscordIcon, github: GitHubIcon,
  whatsapp: WhatsAppIcon, telegram: TelegramIcon, soundcloud: SoundCloudIcon,
  shopify: ShopifyIcon, email: EmailIcon, phone: PhoneIcon, website: WebsiteIcon,
  'apple-music': AppleMusicIcon,
}

// ─── Background helper ────────────────────────────────────────────────────
function getBg(c: ThemeColors): React.CSSProperties {
  if (c.backgroundImage) {
    const overlay = c.backgroundOverlay
      ? `linear-gradient(${c.backgroundOverlay}, ${c.backgroundOverlay}), `
      : ''
    return {
      backgroundImage: `${overlay}url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  if (c.backgroundMesh) return { background: c.backgroundMesh }
  if (c.backgroundGradient) {
    const g = c.backgroundGradient
    return { background: `linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})` }
  }
  return { backgroundColor: c.background }
}

// ─── Button style builder — changes per theme style ───────────────────────
function getSmartContrastTextColor(bgHex?: string, fallbackText?: string, profileText?: string): string {
  if (fallbackText && fallbackText !== '#000000' && fallbackText !== '#ffffff' && fallbackText !== '#000') {
    return fallbackText
  }
  const bg = bgHex || '#ffffff'
  if (bg.startsWith('#') && bg.length === 7) {
    const r = parseInt(bg.substring(1, 3), 16)
    const g = parseInt(bg.substring(3, 5), 16)
    const b = parseInt(bg.substring(5, 7), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 140 ? '#ffffff' : '#0f172a'
  }
  return fallbackText || profileText || '#0f172a'
}

function buildBtnStyle(
  theme: BioLinkConfig['theme'],
  variant: 'default' | 'icon-only' = 'default'
): React.CSSProperties {
  const { colors: c, buttonStyle: bs, fonts } = theme
  const r = bs?.borderRadius ?? 20
  const style = bs?.style ?? 'solid'
  const shStyle = bs?.shadowStyle ?? (bs?.shadow ? 'soft' : 'none')

  let boxShadow = 'none'
  if (shStyle === 'soft') boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'
  else if (shStyle === 'strong') boxShadow = '0 12px 30px rgba(0, 0, 0, 0.22)'
  else if (shStyle === 'hard') boxShadow = `4px 4px 0px 0px ${c.buttonText || '#000000'}`

  const base: React.CSSProperties = {
    fontFamily: fonts?.body || 'Inter, sans-serif',
    borderRadius: r > 20 ? '9999px' : `${r}px`,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textDecoration: 'none',
    boxShadow,
  }

  const bWidth = bs?.borderWidth ?? 0
  const bColor = bs?.borderColor || c.buttonText || c.profileText || '#000000'

  switch (style) {
    case 'clay':
      const isClayWhite = !c.buttonDefault || c.buttonDefault === '#ffffff' || c.buttonDefault === '#FFFFFF'
      const clayBg = isClayWhite ? 'rgba(255, 255, 255, 0.92)' : c.buttonDefault
      return {
        ...base,
        backgroundColor: clayBg,
        color: getSmartContrastTextColor(isClayWhite ? '#ffffff' : c.buttonDefault, c.buttonText, c.profileText),
        border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : '1px solid rgba(255, 255, 255, 0.65)',
        boxShadow: 'inset 0 3px 6px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(0, 0, 0, 0.12), 0 14px 30px -4px rgba(0, 0, 0, 0.28)',
      }
    case 'glass':
      const isOpaqueWhite = !c.buttonDefault || c.buttonDefault === '#ffffff' || c.buttonDefault === '#FFFFFF'
      return {
        ...base,
        backgroundColor: isOpaqueWhite ? 'rgba(255, 255, 255, 0.22)' : c.buttonDefault,
        color: c.buttonText && c.buttonText !== '#000000' && c.buttonText !== '#000' ? c.buttonText : '#ffffff',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: `${Math.max(bWidth, 1)}px solid ${bColor && bColor !== '#000000' ? bColor : 'rgba(255,255,255,0.35)'}`,
        boxShadow: boxShadow !== 'none' ? boxShadow : '0 4px 20px rgba(0,0,0,0.1)',
      }
    case 'outline':
      const outlineColor = c.buttonText && c.buttonText !== '#000000' ? c.buttonText : (c.profileText || '#ffffff')
      return {
        ...base,
        backgroundColor: 'transparent',
        color: outlineColor,
        border: `${Math.max(bWidth, 2)}px solid ${bColor && bColor !== '#000000' ? bColor : outlineColor}`,
        boxShadow: 'none',
      }
    case 'soft':
      const softBg = c.buttonDefault || '#ffffff'
      return {
        ...base,
        backgroundColor: softBg,
        color: getSmartContrastTextColor(softBg, c.buttonText, c.profileText),
        border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : '1px solid rgba(255, 255, 255, 0.75)',
        boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.22), 0 6px 12px -4px rgba(0, 0, 0, 0.12)',
      }
    default: // solid
      const solidBg = c.buttonDefault || '#ffffff'
      return {
        ...base,
        backgroundColor: solidBg,
        color: getSmartContrastTextColor(solidBg, c.buttonText, c.profileText),
        border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : 'none',
        boxShadow: boxShadow !== 'none' ? boxShadow : '0 4px 14px rgba(0,0,0,0.1)',
      }
  }
}

// ─── Stock badge ──────────────────────────────────────────────────────────
function StockBadge({ status, textColor }: { status?: string; textColor: string }) {
  const base = 'flex items-center gap-1 text-xs mt-1'
  if (status === 'in-stock')     return <span className={base} style={{ color: textColor, opacity: 0.7 }}><CheckCircle className="w-3 h-3" />In Stock</span>
  if (status === 'limited')      return <span className={base} style={{ color: textColor, opacity: 0.7 }}><AlertTriangle className="w-3 h-3" />Limited</span>
  if (status === 'out-of-stock') return <span className={base} style={{ color: textColor, opacity: 0.5 }}><XCircle className="w-3 h-3" />Out of Stock</span>
  return null
}

// ─── Contact href builder ─────────────────────────────────────────────────
function contactHref(link: LinkItem): string {
  const v = link.contactValue || ''
  if (link.contactType === 'email')    return `mailto:${v}`
  if (link.contactType === 'phone')    return `tel:${v}`
  if (link.contactType === 'whatsapp') return `https://wa.me/${v.replace(/\D/g, '')}`
  if (link.contactType === 'telegram') return `https://t.me/${v.replace('@', '')}`
  return link.url || '#'
}

// ─── Main component ───────────────────────────────────────────────────────
export default function BioCard({ cardId }: { cardId: string }) {
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCard = async () => {
      try {
        console.log('🔍 Fetching card:', cardId)
        
        // First try to fetch from API (server-side storage)
        const response = await fetch(`/api/cards/${cardId}`)
        
        console.log('📡 API Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Card loaded from Firebase:', data.card)
          setCardData(data.card)
          setLoading(false)
          return
        }
        
        console.log('⚠️ API failed, trying localStorage fallback...')
        
        // Fallback to localStorage if API fails (for backward compatibility)
        const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
        let card = cards[cardId]
        
        if (!card) {
          // Find by handle slug
          const foundKey = Object.keys(cards).find(key => {
            const item = cards[key]
            const handle = item.handle || (item.config?.profile?.handle) || (item.config?.profile?.title ? item.config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '') : '')
            return key === cardId || handle === cardId.toLowerCase()
          })
          if (foundKey) {
            card = cards[foundKey]
          }
        }

        // Ultimate fallback to active config if editing
        if (!card) {
          const currentConfig = localStorage.getItem('currentBioLinkConfig')
          if (currentConfig) {
            try {
              const parsed = JSON.parse(currentConfig)
              card = {
                id: cardId,
                config: parsed,
                analytics: { views: 1, clicks: 0 },
                createdAt: new Date().toISOString()
              }
            } catch (err) {}
          }
        }

        if (card) {
          console.log('✅ Card loaded successfully:', card)
          card.analytics = card.analytics || { views: 0, clicks: 0 }
          card.analytics.views = (card.analytics.views || 0) + 1
          cards[cardId] = card
          localStorage.setItem('bioCards', JSON.stringify(cards))
          setCardData(card)
        } else {
          console.error('❌ Card not found for identifier:', cardId)
        }
      } catch (e) { 
        console.error('❌ Error fetching card:', e)
      }
      finally { setLoading(false) }
    }
    
    fetchCard()
  }, [cardId])

  const trackClick = async (linkId: string) => {
    try {
      // Track click via API
      await fetch(`/api/cards/${cardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'click' }),
      })
      
      // Also update localStorage as backup
      const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      if (cards[cardId]) {
        cards[cardId].analytics.clicks = (cards[cardId].analytics.clicks || 0) + 1
        localStorage.setItem('bioCards', JSON.stringify(cards))
      }
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  )

  if (!cardData) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <p className="text-6xl mb-4">🔗</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6 text-sm">This bio link doesn't exist or hasn't been saved yet.</p>
      <a href="/" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm">Go Home</a>
    </div>
  )

  const { config } = cardData
  const theme = config.theme
  const c = theme.colors
  const bg = getBg(c)
  const btnStyle = buildBtnStyle(theme)
  const visibleLinks = (config.links || []).filter(l => l.isVisible !== false)
  const hasSocials = config.socialLinks && Object.values(config.socialLinks).some(Boolean)

  // ── Icon box inside a button (platform-aware) ──────────────────────────
  const IconBox = ({ link }: { link: LinkItem }) => {
    const Icon = link.platform ? PLATFORM_ICONS[link.platform] : null
    const boxStyle: React.CSSProperties = {
      width: 36, height: 36, borderRadius: `${Math.min(theme.buttonStyle?.borderRadius ?? 8, 10)}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      backgroundColor: 'rgba(128,128,128,0.15)',
      color: c.buttonText,
    }
    if (!Icon) return null
    return <div style={boxStyle}><Icon size={18} /></div>
  }

  // ── Render each link type ──────────────────────────────────────────────
  const renderLink = (link: LinkItem) => {
    const key = link.id

    // HEADER — section divider label
    if (link.type === 'header') return (
      <div key={key} className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px" style={{ backgroundColor: c.buttonText, opacity: 0.15 }} />
        <span className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: c.profileText, opacity: 0.5, fontFamily: theme.fonts?.body }}>
          {link.text}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: c.buttonText, opacity: 0.15 }} />
      </div>
    )

    const animEnabled = theme.buttonStyle?.enableAnimations ?? true
    const animStyle = theme.buttonStyle?.animation ?? 'bounce'

    let animClasses = ''
    if (animEnabled) {
      if (animStyle === 'bounce') animClasses = 'hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out'
      else if (animStyle === 'pulse') animClasses = 'animate-pulse hover:animate-none hover:scale-[1.02] transition-all'
      else if (animStyle === 'wobble') animClasses = 'hover:animate-bounce hover:scale-[1.02] transition-all'
      else if (animStyle === 'slide') animClasses = 'hover:translate-x-2 transition-transform duration-200 ease-out'
    }

    // TEXT — plain paragraph
    if (link.type === 'text') return (
      <p key={key} className="text-center text-sm leading-relaxed px-2"
        style={{ color: c.profileBio, fontFamily: theme.fonts?.body, opacity: 0.8 }}>
        {link.description || link.text}
      </p>
    )

    // SHOP — left icon+info, right price
    if (link.type === 'shop') return (
      <a key={key} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
        <div className="flex items-center justify-between px-4 py-3.5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ShoppingBag size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight" style={{ color: c.buttonText }}>{link.text}</p>
              {link.description && <p className="text-xs truncate mt-0.5" style={{ color: c.buttonText, opacity: 0.65 }}>{link.description}</p>}
              <StockBadge status={link.stockStatus} textColor={c.buttonText} />
            </div>
          </div>
          {link.price && (
            <div className="text-right flex-shrink-0">
              {link.originalPrice && <p className="text-xs line-through" style={{ color: c.buttonText, opacity: 0.45 }}>{link.currency || '$'}{link.originalPrice}</p>}
              <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>{link.currency || '$'}{link.price}</p>
            </div>
          )}
        </div>
      </a>
    )

    // CONTACT
    if (link.type === 'contact') return (
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
            <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>{link.text}</p>
            {link.contactValue && <p className="text-xs mt-0.5" style={{ color: c.buttonText, opacity: 0.65 }}>{link.contactValue}</p>}
          </div>
        </div>
      </a>
    )

    // EVENT
    if (link.type === 'event') return (
      <a key={key} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
        <div className="flex items-center justify-between px-4 py-3.5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight" style={{ color: c.buttonText }}>{link.text}</p>
              {link.eventLocation && (
                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: c.buttonText, opacity: 0.65 }}>
                  <MapPin size={10} />{link.eventLocation}
                </p>
              )}
            </div>
          </div>
          {(link.eventDate || link.eventTime) && (
            <div className="text-right flex-shrink-0">
              {link.eventDate && <p className="text-xs font-bold" style={{ color: c.buttonText, opacity: 0.8 }}>{link.eventDate}</p>}
              {link.eventTime && <p className="text-xs" style={{ color: c.buttonText, opacity: 0.55 }}>{link.eventTime}</p>}
            </div>
          )}
        </div>
      </a>
    )

    // MUSIC
    if (link.type === 'music') return (
      <a key={key} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {link.platform && PLATFORM_ICONS[link.platform]
              ? (() => { const I = PLATFORM_ICONS[link.platform!]; return <I size={18} /> })()
              : <Music size={18} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>{link.text}</p>
            {link.description && <p className="text-xs truncate mt-0.5" style={{ color: c.buttonText, opacity: 0.65 }}>{link.description}</p>}
          </div>
        </div>
      </a>
    )

    // VIDEO
    if (link.type === 'video') return (
      <a key={key} href={link.url || '#'} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            {link.platform && PLATFORM_ICONS[link.platform]
              ? (() => { const I = PLATFORM_ICONS[link.platform!]; return <I size={18} /> })()
              : <Video size={18} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>{link.text}</p>
            {link.description && <p className="text-xs truncate mt-0.5" style={{ color: c.buttonText, opacity: 0.65 }}>{link.description}</p>}
          </div>
        </div>
      </a>
    )

    // SOCIAL / LINK — default
    const Icon = link.platform ? PLATFORM_ICONS[link.platform] : null

    return (
      <a 
        key={key} 
        href={link.url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={() => trackClick(key)} 
        style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}
      >
        <div className="flex items-center px-4 py-3.5 gap-3.5">
          <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
            {Icon ? (
              <Icon size={19} />
            ) : (
              <Globe size={19} />
            )}
          </div>
          <p className="font-extrabold text-sm md:text-base flex-1 text-center truncate px-2" style={{ color: c.buttonText }}>
            {link.text}
          </p>
          <div className="w-6 flex items-center justify-end opacity-40 group-hover:opacity-80 transition-opacity">
            <ExternalLink size={15} />
          </div>
        </div>
      </a>
    )
  }

  return (
    <div className="min-h-screen relative" style={bg}>

      {/* Noise overlay */}
      {theme.noiseOpacity && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: theme.noiseOpacity,
          mixBlendMode: 'overlay',
        }} />
      )}

      {/* ── Page content — centered column ── */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-[680px] mx-auto px-5 pt-16 pb-12">

          {/* ── Profile section ── */}
          <div className="text-center mb-10">
            {/* Avatar */}
            <div className="mb-5 flex justify-center">
              {config.profile.avatar && config.profile.avatar !== 'user'
                ? (config.profile.avatar.startsWith('http') || config.profile.avatar.startsWith('data:')
                  ? <img src={config.profile.avatar} alt="avatar"
                      className="w-24 h-24 rounded-full object-cover"
                      style={{ border: '3px solid rgba(255,255,255,0.25)' }} />
                  : <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.2)' }}>
                      {config.profile.avatar}
                    </div>
                )
                : <div className="w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.2)' }}>
                    <span className="text-3xl font-bold" style={{ color: c.profileText }}>
                      {(config.profile.title || '?')[0].toUpperCase()}
                    </span>
                  </div>
              }
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold mb-2 leading-tight"
              style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
              {config.profile.title || 'Your Name'}
            </h1>

            {/* Bio */}
            {config.profile.bio && (
              <p className="text-sm leading-relaxed max-w-xs mx-auto"
                style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter, sans-serif', opacity: 0.85 }}>
                {config.profile.bio}
              </p>
            )}

            {/* Location */}
            {config.profile.location && (
              <p className="text-xs mt-2 flex items-center justify-center gap-1"
                style={{ color: c.profileBio, opacity: 0.6 }}>
                <MapPin size={11} />{config.profile.location}
              </p>
            )}
          </div>

          {/* ── Links ── */}
          {visibleLinks.length > 0 && (
            <div className="space-y-3 mb-10">
              {visibleLinks.map(renderLink)}
            </div>
          )}

          {/* ── Social icons ── */}
          {hasSocials && (
            <div className="flex justify-center flex-wrap gap-3 mb-10">
              {Object.entries(config.socialLinks).map(([platform, url]) => {
                if (!url) return null
                const Icon = PLATFORM_ICONS[platform]
                if (!Icon) return null
                return (
                  <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'rgba(128,128,128,0.2)', color: c.profileText }}>
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="w-full text-center pb-8">
          <div className="flex items-center justify-center gap-5 mb-2">
            <span className="text-xs flex items-center gap-1" style={{ color: c.profileBio, opacity: 0.4 }}>
              <Eye size={11} />{cardData.analytics.views} views
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: c.profileBio, opacity: 0.4 }}>
              <ExternalLink size={11} />{cardData.analytics.clicks} clicks
            </span>
          </div>
          <p className="text-xs" style={{ color: c.profileBio, opacity: 0.3 }}>Powered by BioLink</p>
        </div>
      </div>
    </div>
  )
}
