'use client'

import { useState, useEffect } from 'react'
import {
  Eye, ExternalLink, ShoppingBag, Phone, Mail,
  MessageCircle, Send, MapPin, Calendar, Music, Video,
  CheckCircle, AlertTriangle, XCircle, Globe, Share2, Sparkles,
  Copy, Check, X, QrCode, Image as ImageIcon
} from 'lucide-react'
import {
  InstagramIcon, TikTokIcon, YouTubeIcon, SpotifyIcon, TwitterIcon,
  FacebookIcon, LinkedInIcon, DiscordIcon, GitHubIcon, WhatsAppIcon,
  TelegramIcon, SoundCloudIcon, ShopifyIcon, EmailIcon, PhoneIcon,
  WebsiteIcon, AppleMusicIcon
} from '@/components/icons/ServiceIcons'
import { getEmbedIframeUrl, parseGoogleDriveUrl, formatAndNormalizeTheme } from '@/lib/themes'

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
  backgroundVideo?: string
  backgroundIframe?: string
  backgroundType?: string
  backgroundOverlay?: string
  buttonDefault: string
  buttonText: string
  profileText: string
  profileBio: string
  accent?: string
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

// ─── URL Sanitizer — ensures absolute external URLs ───────────────────────
function ensureAbsoluteUrl(url?: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (!trimmed) return '#'
  if (/^(https?:\/\/|mailto:|tel:|wa\.me|t\.me|\/\/)/i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

// ─── Background helper ────────────────────────────────────────────────────
function getBg(c: ThemeColors): React.CSSProperties {
  // For video backgrounds, return transparent so the <video> element shows through
  if (c.backgroundVideo || c.backgroundIframe) {
    return { backgroundColor: 'transparent' }
  }
  if (c.backgroundImage) {
    const driveObj = parseGoogleDriveUrl(c.backgroundImage)
    const imgUrl = driveObj.directUrl || c.backgroundImage
    return {
      backgroundImage: `url(${imgUrl})`,
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
    case 'hard-shadow':
      const hardBg = c.buttonDefault || '#ffffff'
      const hardBorder = bColor && bColor !== '#000000' && bColor !== '#000' ? bColor : (c.profileText || '#000000')
      return {
        ...base,
        backgroundColor: hardBg,
        color: getSmartContrastTextColor(hardBg, c.buttonText, c.profileText),
        border: `${Math.max(bWidth, 2)}px solid ${hardBorder}`,
        boxShadow: `3px 3px 0px ${hardBorder}`,
      }
    case 'fill':
      const fillBg = c.buttonDefault || '#ffffff'
      return {
        ...base,
        backgroundColor: fillBg,
        color: getSmartContrastTextColor(fillBg, c.buttonText, c.profileText),
        border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : 'none',
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

function StockBadge({ status, textColor }: { status?: string; textColor: string }) {
  const base = 'flex items-center gap-1 text-xs mt-1'
  if (status === 'in-stock')     return <span className={base} style={{ color: textColor, opacity: 0.7 }}><CheckCircle className="w-3 h-3" />In Stock</span>
  if (status === 'limited')      return <span className={base} style={{ color: textColor, opacity: 0.7 }}><AlertTriangle className="w-3 h-3" />Limited</span>
  if (status === 'out-of-stock') return <span className={base} style={{ color: textColor, opacity: 0.5 }}><XCircle className="w-3 h-3" />Out of Stock</span>
  return null
}

function contactHref(link: LinkItem): string {
  const v = link.contactValue || ''
  if (link.contactType === 'email')    return `mailto:${v}`
  if (link.contactType === 'phone')    return `tel:${v}`
  if (link.contactType === 'whatsapp') return `https://wa.me/${v.replace(/\D/g, '')}`
  if (link.contactType === 'telegram') return `https://t.me/${v.replace('@', '')}`
  return ensureAbsoluteUrl(link.url)
}

// ─── Main component ───────────────────────────────────────────────────────
export default function BioCard({ cardId }: { cardId: string }) {
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchCard = async () => {
      // 1. Always try the API first with cache:no-store — this is the source of truth.
      //    cardStore on the server is updated on every editor save via PUT.
      try {
        const response = await fetch(`/api/cards/${cardId}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })

        if (response.ok) {
          const data = await response.json()
          setCardData(data.card)
          setLoading(false)
          // Keep localStorage in sync with the fresh API data
          try {
            const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
            cards[cardId] = data.card
            localStorage.setItem('bioCards', JSON.stringify(cards))
          } catch (_) {}
          return
        }
      } catch (_) {}

      // 2. API failed (offline / 404) — fall back to localStorage
      try {
        const cards = JSON.parse(localStorage.getItem('bioCards') || '{}')
        let card = cards[cardId]

        if (!card) {
          const foundKey = Object.keys(cards).find(key => {
            const item = cards[key]
            const handle =
              item.handle ||
              item.config?.profile?.handle ||
              (item.config?.profile?.title
                ? item.config.profile.title.toLowerCase().replace(/[^a-z0-9]/g, '')
                : '')
            return key === cardId || handle === cardId.toLowerCase()
          })
          if (foundKey) card = cards[foundKey]
        }

        // Last resort — use currentBioLinkConfig (editor's live config)
        if (!card) {
          const raw = localStorage.getItem('currentBioLinkConfig')
          if (raw) {
            const parsed = JSON.parse(raw)
            card = {
              id: cardId,
              config: parsed,
              analytics: { views: 1, clicks: 0 },
              createdAt: new Date().toISOString(),
            }
          }
        }

        if (card) setCardData(card)
      } catch (_) {}

      setLoading(false)
    }

    fetchCard()
  }, [cardId])

  const trackClick = async (linkId: string) => {
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'click' }),
      })
      
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="animate-spin w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full" />
    </div>
  )

  if (!cardData) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-900 text-white">
      <p className="text-6xl mb-4">🔗</p>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-400 mb-6 text-sm">This bio link doesn't exist or hasn't been saved yet.</p>
      <a href="/" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors">Go Home</a>
    </div>
  )

  const { config } = cardData
  const theme = formatAndNormalizeTheme(config.theme)
  const c = theme.colors
  const bg = getBg(c)
  const btnStyle = buildBtnStyle(theme)
  const visibleLinks = (config.links || []).filter(l => l.isVisible !== false)
  const hasSocials = config.socialLinks && Object.values(config.socialLinks).some(Boolean)
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://biolink.ee/${cardId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pageUrl)}`

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderLink = (link: LinkItem) => {
    const key = link.id

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

    if (link.type === 'text') return (
      <p key={key} className="text-center text-sm leading-relaxed px-2"
        style={{ color: c.profileBio, fontFamily: theme.fonts?.body, opacity: 0.8 }}>
        {link.description || link.text}
      </p>
    )

    if (link.type === 'shop') return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
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

    if (link.type === 'event') return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
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

    if (link.type === 'music') return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
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

    if (link.type === 'video') return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
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

    const Icon = link.platform ? PLATFORM_ICONS[link.platform] : null

    return (
      <a 
        key={key} 
        href={ensureAbsoluteUrl(link.url)} 
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
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden" style={bg}>

      {c.backgroundImage && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${parseGoogleDriveUrl(c.backgroundImage).directUrl || c.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: theme.backgroundFilter || 'none',
          }}
        />
      )}

      {/* Custom Video Background (.mp4 / .webm) */}
      {c.backgroundVideo && (
        <video
          key={c.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
          src={ensureAbsoluteUrl(c.backgroundVideo)}
        />
      )}

      {/* Custom YouTube / Vimeo / Iframe Embed Background */}
      {c.backgroundIframe && (
        <iframe
          src={getEmbedIframeUrl(c.backgroundIframe)}
          className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none border-0 scale-125"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
      )}

      {/* Background Overlay */}
      {c.backgroundOverlay && (
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundColor: c.backgroundOverlay }} />
      )}

      {/* Noise overlay */}
      {theme.noiseOpacity && (
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: theme.noiseOpacity,
          mixBlendMode: 'overlay',
        }} />
      )}

      {/* ── Floating Desktop Card Frame ── */}
      <div className="relative z-10 w-full min-h-screen md:min-h-0 flex flex-col justify-between md:my-10 md:max-w-[480px] md:rounded-[36px] md:border md:border-white/20 md:shadow-2xl md:backdrop-blur-xl md:bg-black/20 p-5 md:p-8 overflow-hidden">

        {/* ── Top Header Actions (Star Badge & Share Button) ── */}
        <div className="flex items-center justify-between mb-6 relative z-30">
          <div className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-pointer">
            <Sparkles size={16} />
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="w-9 h-9 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
            title="Share this BioLink"
          >
            <Share2 size={16} />
          </button>
        </div>

        <div>
          {/* ── Profile Section ── */}
          {(() => {
            const headerLayout = (config.profile as any)?.headerLayout || 'classic'
            const headerShape = (config.profile as any)?.headerShape || 'loop'
            const bannerImage = (config.profile as any)?.bannerImage || ''

            const avatarSrc = config.profile.avatar && config.profile.avatar !== 'user' ? config.profile.avatar : ''
            const hasImg = (src?: string) => Boolean(src && (src.startsWith('http') || src.startsWith('data:') || src.length > 10))

            // 1. HERO LAYOUT
            if (headerLayout === 'hero') {
              return (
                <div className="mb-8 -mx-5 md:-mx-8 -mt-[80px] md:-mt-[92px] pt-24 md:pt-28 relative h-[380px] overflow-hidden flex flex-col justify-end p-6 text-center rounded-t-[36px]">
                  {hasImg(avatarSrc) ? (
                    <img
                      src={avatarSrc}
                      alt="hero avatar"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)'
                      }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold"
                      style={{
                        background: c.backgroundGradient
                          ? `linear-gradient(${c.backgroundGradient.direction || '135deg'}, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})`
                          : c.backgroundMesh || `linear-gradient(135deg, ${c.background || '#0f172a'}, ${c.accent || '#4f46e5'})`,
                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                      }}
                    >
                      {(config.profile.title || '?')[0].toUpperCase()}
                    </div>
                  )}

                  {/* Overlaid Title & Bio */}
                  <div className="relative z-10 text-center pb-2">
                    <h1 className="text-2xl font-bold mb-1.5 leading-tight text-white drop-shadow-md"
                      style={{ fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                      {config.profile.title || 'Your Name'}
                    </h1>
                    {config.profile.bio && (
                      <p className="text-sm leading-relaxed max-w-xs mx-auto text-white/95 drop-shadow-sm"
                        style={{ fontFamily: theme.fonts?.body || 'Inter, sans-serif' }}>
                        {config.profile.bio}
                      </p>
                    )}
                    {config.profile.location && (
                      <p className="text-xs mt-2 flex items-center justify-center gap-1 text-white/90 drop-shadow-sm">
                        <MapPin size={11} />{config.profile.location}
                      </p>
                    )}
                  </div>
                </div>
              )
            }

            // 2. BANNER LAYOUT
            if (headerLayout === 'banner') {
              return (
                <div className="text-center mb-8">
                  {/* Banner strip */}
                  <div className="w-[calc(100%+40px)] md:w-[calc(100%+64px)] h-44 -mx-5 md:-mx-8 -mt-[80px] md:-mt-[92px] relative bg-slate-200 border-b border-white/20 shadow-sm overflow-hidden flex items-center justify-center rounded-t-[36px]">
                    {hasImg(bannerImage) ? (
                      <img src={bannerImage} alt="banner" className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white/80"
                        style={{
                          background: c.backgroundGradient
                            ? `linear-gradient(${c.backgroundGradient.direction || '135deg'}, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})`
                            : c.backgroundMesh || `linear-gradient(135deg, ${c.accent || '#ec4899'}, ${c.buttonDefault || '#4f46e5'})`
                        }}
                      >
                        <ImageIcon size={32} opacity={0.7} />
                      </div>
                    )}
                  </div>

                  {/* Overlapping Avatar */}
                  <div className="mb-4 flex justify-center relative z-10 -mt-12">
                    {hasImg(avatarSrc) ? (
                      <img src={avatarSrc} alt="avatar" className="w-24 h-24 rounded-full object-cover shadow-lg" />
                    ) : (
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg"
                        style={{
                          backgroundColor: c.buttonDefault || '#1e293b',
                          color: c.buttonText || c.profileText || '#ffffff'
                        }}
                      >
                        {(config.profile.title || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold mb-1.5 leading-tight"
                    style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                    {config.profile.title || 'Your Name'}
                  </h1>

                  {config.profile.bio && (
                    <p className="text-sm leading-relaxed max-w-xs mx-auto"
                      style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter, sans-serif', opacity: 0.9 }}>
                      {config.profile.bio}
                    </p>
                  )}
                </div>
              )
            }

            // 4. SHAPE LAYOUT
            if (headerLayout === 'shape') {
              // Shapes: loop, flower, oval, rounded, burst
              const shapeBorderRadius =
                headerShape === 'flower' ? '38% 62% 63% 37% / 41% 44% 56% 59%' :
                headerShape === 'loop' ? '60% 40% 30% 70% / 60% 30% 70% 40%' :
                headerShape === 'oval' ? '50% / 35%' :
                headerShape === 'burst' ? '30% 70% 70% 30% / 50% 30% 70% 50%' : '36px'

              return (
                <div className="text-center mb-8">
                  <div className="mb-4 flex justify-center">
                    <div
                      className="w-48 h-40 overflow-hidden shadow-2xl flex items-center justify-center relative transition-all duration-300 border-4 border-white/40"
                      style={{
                        borderRadius: shapeBorderRadius,
                        backgroundColor: c.buttonDefault || c.accent || '#4F46E5'
                      }}
                    >
                      {hasImg(avatarSrc) ? (
                        <img src={avatarSrc} alt="avatar shape" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold" style={{ color: c.buttonText || '#ffffff' }}>
                          {(config.profile.title || '?')[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold mb-1.5 leading-tight"
                    style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                    {config.profile.title || 'Your Name'}
                  </h1>

                  {config.profile.bio && (
                    <p className="text-sm leading-relaxed max-w-xs mx-auto"
                      style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter, sans-serif', opacity: 0.9 }}>
                      {config.profile.bio}
                    </p>
                  )}
                </div>
              )
            }

            // 5. CLASSIC LAYOUT (DEFAULT)
            return (
              <div className="text-center mb-8">
                <div className="mb-4 flex justify-center">
                  {hasImg(avatarSrc) ? (
                    <img src={avatarSrc} alt="avatar"
                      className="w-24 h-24 rounded-full object-cover shadow-lg" />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg bg-white/15">
                      <span className="text-3xl font-bold" style={{ color: c.profileText }}>
                        {(config.profile.title || '?')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold mb-1.5 leading-tight"
                  style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                  {config.profile.title || 'Your Name'}
                </h1>

                {config.profile.bio && (
                  <p className="text-sm leading-relaxed max-w-xs mx-auto"
                    style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter, sans-serif', opacity: 0.9 }}>
                    {config.profile.bio}
                  </p>
                )}

                {config.profile.location && (
                  <p className="text-xs mt-2 flex items-center justify-center gap-1"
                    style={{ color: c.profileBio, opacity: 0.7 }}>
                    <MapPin size={11} />{config.profile.location}
                  </p>
                )}
              </div>
            )
          })()}

          {/* ── Links ── */}
          {visibleLinks.length > 0 && (
            <div className="space-y-3 mb-8">
              {visibleLinks.map(renderLink)}
            </div>
          )}

          {/* ── Social Icons ── */}
          {hasSocials && (
            <div className="flex justify-center flex-wrap gap-3 mb-8">
              {Object.entries(config.socialLinks).map(([platform, url]) => {
                if (!url) return null
                const Icon = PLATFORM_ICONS[platform]
                if (!Icon) return null
                return (
                  <a key={platform} href={ensureAbsoluteUrl(url)} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    style={{ backgroundColor: 'rgba(128,128,128,0.25)', color: c.profileText }}>
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Join BioLink CTA Pill Button ── */}
        <div className="w-full my-6 flex justify-center">
          <a
            href="/create"
            className="w-full py-3 px-4 rounded-full bg-white text-slate-900 font-extrabold text-xs text-center shadow-lg hover:bg-slate-50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer block"
          >
            Join {config.profile.title || 'Satvikpatel'} on BioLink
          </a>
        </div>

        {/* ── Footer ── */}
        <div className="w-full text-center pt-4 border-t border-white/10">
          <div className="flex items-center justify-center gap-5 mb-2">
            <span className="text-xs flex items-center gap-1 font-semibold" style={{ color: c.profileBio, opacity: 0.5 }}>
              <Eye size={12} />{cardData.analytics.views} views
            </span>
            <span className="text-xs flex items-center gap-1 font-semibold" style={{ color: c.profileBio, opacity: 0.5 }}>
              <ExternalLink size={12} />{cardData.analytics.clicks} clicks
            </span>
          </div>
          <p className="text-xs font-medium" style={{ color: c.profileBio, opacity: 0.4 }}>Powered by BioLink</p>
        </div>

      </div>

      {/* ── Desktop "View on mobile" QR Code Widget ── */}
      <div className="fixed bottom-6 right-6 hidden md:flex flex-col items-center gap-2 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl z-30 group hover:scale-105 transition-transform">
        <span className="text-[11px] font-bold text-white tracking-wide uppercase">View on mobile</span>
        <div className="p-1.5 bg-white rounded-xl shadow-md">
          <img src={qrCodeUrl} alt="Mobile QR Code" className="w-24 h-24 rounded-lg object-contain" />
        </div>
      </div>

      {/* ── Share Modal ── */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Share this BioLink</h3>
            <p className="text-xs text-slate-500 mb-4">Share your page with friends, followers, or across your social media.</p>

            <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200 mb-5">
              <input
                type="text"
                readOnly
                value={pageUrl}
                className="bg-transparent text-xs font-semibold text-slate-800 flex-1 outline-none px-2 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="clay-btn clay-btn-primary px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-slate-100">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <WhatsAppIcon size={20} />
                </div>
                <span className="text-[11px] font-bold">WhatsApp</span>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                  <TwitterIcon size={20} />
                </div>
                <span className="text-[11px] font-bold">Twitter/X</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <TelegramIcon size={20} />
                </div>
                <span className="text-[11px] font-bold">Telegram</span>
              </a>
              <a
                href={`mailto:?subject=Check out this BioLink&body=${encodeURIComponent(pageUrl)}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Mail size={20} />
                </div>
                <span className="text-[11px] font-bold">Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
