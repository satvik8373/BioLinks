'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import {
  Eye, ExternalLink, ShoppingBag, Phone, Mail,
  MessageCircle, Send, MapPin, Calendar, Music, Video,
  CheckCircle, AlertTriangle, XCircle, Globe, Share2, Sparkles,
  Copy, Check, X, QrCode, Image as ImageIcon, Link2, Lock, Play, ArrowLeft, ChevronRight,
  MoreVertical, Briefcase, ShieldCheck, Award, MousePointer, Pointer, ArrowDownRight
} from 'lucide-react'
import {
  InstagramIcon, TikTokIcon, YouTubeIcon, SpotifyIcon, TwitterIcon,
  FacebookIcon, LinkedInIcon, DiscordIcon, GitHubIcon, WhatsAppIcon,
  TelegramIcon, SoundCloudIcon, ShopifyIcon, EmailIcon, PhoneIcon,
  WebsiteIcon, AppleMusicIcon, ServiceIcon
} from '@/components/icons/ServiceIcons'
import { getEmbedIframeUrl, parseGoogleDriveUrl, formatAndNormalizeTheme, applyThemeToCSSVariables } from '@/lib/themes'
import { getCardPublicUrl } from '@/lib/urlHelper'
import { getBackgroundPaint } from '@/lib/backgroundStyle'
import GallerySlider from '@/components/card/GallerySlider'
import LinkRenderer from '@/components/card/renderers/LinkRenderer'
import ShopRenderer from '@/components/card/renderers/ShopRenderer'
import ContactRenderer from '@/components/card/renderers/ContactRenderer'
import DecorationLayer from '@/components/ui/DecorationLayer'
import StickerCanvasLayer, { PlacedSticker } from '@/components/card/StickerCanvasLayer'
import WelcomeSplashScreen from '@/components/ui/WelcomeSplashScreen'
import MusicSheetModal from '@/components/modals/MusicSheetModal'



// ─── Types ────────────────────────────────────────────────────────────────
interface LinkItem {
  id: string
  type: 'link' | 'header' | 'text' | 'gallery' | 'social' | 'shop' | 'music' | 'video' | 'contact' | 'event' | 'payment' | 'booking' | 'form' | 'nft'
  text: string
  url: string
  icon?: string
  isVisible?: boolean
  platform?: string
  description?: string
  layout?: 'classic' | 'featured' | 'compact'
  thumbnail?: string
  embedUrl?: string
  price?: string
  currency?: string
  originalPrice?: string
  stockStatus?: 'in-stock' | 'out-of-stock' | 'limited'
  contactType?: string
  contactValue?: string
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  paymentType?: 'stripe' | 'paypal' | 'venmo' | 'cashapp' | 'tip' | 'donation'
  paymentAmount?: string
  bookingProvider?: 'calendly' | 'cal.com' | 'acuity' | 'custom'
  formType?: 'contact' | 'survey' | 'email-capture' | 'newsletter' | 'waitlist' | 'custom'
  nftChain?: 'ethereum' | 'polygon' | 'solana' | 'base'
  nftContract?: string
  nftPrice?: string
  isPinned?: boolean
  prioritizeMode?: 'none' | 'animate' | 'redirect'
  scheduleStart?: string
  scheduleEnd?: string
  groupId?: string
  isGroupHeader?: boolean
  groupTitle?: string
  collectionLayout?: 'stack' | 'grid' | 'carousel' | 'showcase'
  videoClickOption?: 'display_video' | 'open_youtube' | 'open_latest' | 'display_latest'
  videoMute?: boolean
  musicClickOption?:
    | 'display_services_preview'
    | 'display_services'
    | 'display_spotify'
    | 'direct_url'
  streamingServices?: Array<{
    id: string
    name: string
    platformKey: string
    url?: string
    isVisible: boolean
  }>
  isScheduled?: boolean
  scheduleNotify?: boolean
  scheduleTimezone?: string
  galleryPhotos?: Array<{ id: string; url: string; title?: string; description?: string }>
  galleryLayout?: 'slider' | 'grid' | 'stack' | 'hero'
  galleryCtaUrl?: string
  galleryCtaLabel?: string
  isLocked?: boolean
  lockType?: 'subscribe' | 'code' | 'password' | 'dob' | 'sensitive'
  lockValue?: string
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
      boxShadow?: string
      style?: 'solid' | 'clay' | 'outline' | 'soft' | 'glass' | 'hard-shadow' | 'fill' | 'wood' | 'carved' | 'raised' | 'leather' | 'retro-lcd' | 'button-retro-lcd' | string
      animation?: 'none' | 'bounce' | 'pulse' | 'wobble' | 'slide' | string
      enableAnimations?: boolean
    }
    fonts: { heading: string; body: string }
    customFooterText?: string
    hideFooterLogo?: boolean
  }
  profile: {
    avatar: string
    title: string
    bio: string
    location?: string
    website?: string
    showBadge?: boolean
    badgeType?: string
    badgeText?: string
    isVerified?: boolean
  }
  links: LinkItem[]
  socialLinks: { [key: string]: string }
  socialIconPosition?: 'top' | 'bottom'
}

interface CardData {
  id: string
  config: BioLinkConfig
  analytics: { views: number; clicks: number }
  createdAt: string
}

// ─── Profile Badge / Sticker Component ─────────────────────────────────────
function ProfileBadge({ profile }: { profile: any }) {
  const showBadge = profile?.showBadge || profile?.isVerified
  if (!showBadge) return null

  const badgeType = profile?.badgeType || 'verified'
  const customText = profile?.badgeText

  if (customText) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-500/15 text-blue-600 border border-blue-500/25 backdrop-blur-xs flex-shrink-0">
        <ShieldCheck size={12} /> {customText}
      </span>
    )
  }

  if (badgeType === 'pro') {
    return (
      <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs" title="PRO Creator">
        <Sparkles size={11} strokeWidth={2.5} />
      </div>
    )
  }

  if (badgeType === 'featured') {
    return (
      <div className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs" title="Featured">
        <Award size={11} strokeWidth={2.5} />
      </div>
    )
  }

  // Default verified check
  return (
    <div className="w-5 h-5 bg-[#2f6fed] rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-xs" title="Verified">
      <Check size={12} strokeWidth={3} />
    </div>
  )
}

// ─── Platform icons ───────────────────────────────────────────────────────
const PLATFORM_ICONS: Record<string, any> = {
  instagram: InstagramIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
  spotify: SpotifyIcon, twitter: TwitterIcon, x: TwitterIcon, facebook: FacebookIcon,
  linkedin: LinkedInIcon, in: LinkedInIcon, discord: DiscordIcon, github: GitHubIcon,
  whatsapp: WhatsAppIcon, telegram: TelegramIcon, soundcloud: SoundCloudIcon,
  shopify: ShopifyIcon, email: EmailIcon, mail: EmailIcon, phone: PhoneIcon,
  website: WebsiteIcon, globe: Globe, 'apple-music': AppleMusicIcon,
  work: Briefcase, briefcase: Briefcase,
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
  const type = c.backgroundType || (
    (c.backgroundVideo || c.backgroundIframe) ? 'video' :
    c.backgroundImage ? 'image' :
    c.backgroundMesh ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
    c.backgroundGradient ? 'gradient' : 'fill'
  )

  if (type === 'video' || type === 'image') {
    return { backgroundColor: 'transparent' }
  }

  if ((type === 'pattern' || type === 'blur' || type === 'mesh') && c.backgroundMesh) {
    return {
      ...getBackgroundPaint(c.backgroundMesh),
      backgroundSize: 'var(--profile-background-size, cover)',
      backgroundPosition: 'center',
    }
  }

  if (type === 'gradient' && c.backgroundGradient) {
    const g = c.backgroundGradient
    if (g.direction === 'radial') {
      return getBackgroundPaint(`radial-gradient(circle, ${g.from}, ${g.to})`)
    }
    return getBackgroundPaint(`linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})`)
  }

  return getBackgroundPaint(c.background || '#FFFFFF')
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

export function resolveFontFamily(fontName?: string): string {
  if (!fontName) return "'Inter', sans-serif"
  const clean = fontName.trim()

  const map: Record<string, string> = {
    'Albert Sans': "'Albert Sans', sans-serif",
    'Belanosima': "'Belanosima', sans-serif",
    'Bricolage Grotesque': "'Bricolage Grotesque', sans-serif",
    'DM Sans': "'DM Sans', sans-serif",
    'Epilogue': "'Epilogue', sans-serif",
    'IBM Plex Sans': "'IBM Plex Sans', sans-serif",
    'Inter': "'Inter', sans-serif",
    'Lato': "'Lato', sans-serif",
    'Link Sans': "'Plus Jakarta Sans', sans-serif",
    'M Plus Rounded': "'M PLUS Rounded 1c', sans-serif",
    'Manrope': "'Manrope', sans-serif",
    'Oxanium': "'Oxanium', cursive",
    'Poppins': "'Poppins', sans-serif",
    'Red Hat Display': "'Red Hat Display', sans-serif",
    'Roboto': "'Roboto', sans-serif",
    'Rubik': "'Rubik', sans-serif",
    'Space Grotesk': "'Space Grotesk', sans-serif",
    'Syne': "'Syne', sans-serif",
    'Montserrat': "'Montserrat', sans-serif",
    'Playfair Display': "'Playfair Display', serif",
    'Open Sans': "'Open Sans', sans-serif",
    'Silkscreen': "'Silkscreen', monospace",
    'font-silkscreen': "'Silkscreen', monospace",
  }

  if (map[clean]) return map[clean]
  if (clean.includes(',') || clean.includes("'") || clean.includes('"')) {
    return clean
  }
  return `'${clean}', sans-serif`
}

function buildBtnStyle(
  theme: BioLinkConfig['theme'],
  variant: 'default' | 'icon-only' = 'default'
): React.CSSProperties {
  const { colors: c, buttonStyle: bs, fonts } = theme
  const r = bs?.borderRadius ?? 20
  const style = bs?.style ?? 'solid'
  const shStyle = bs?.shadowStyle ?? (bs?.shadow ? 'soft' : 'none')

  // bs.boxShadow can hold the full resolved CSS string from the theme config
  // (e.g. shadow-pill-clay). Falls back to the shStyle shorthand.
  let boxShadow = (bs as any)?.boxShadow || 'none'
  if (!boxShadow || boxShadow === 'none') {
    if (shStyle === 'soft') boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)'
    else if (shStyle === 'strong') boxShadow = '0 12px 30px rgba(0, 0, 0, 0.22)'
    else if (shStyle === 'hard') boxShadow = `4px 4px 0px 0px ${c.buttonText || '#000000'}`
  }

  const base: React.CSSProperties = {
    fontFamily: resolveFontFamily(fonts?.body),
    borderRadius: typeof r === 'number' ? (r > 35 ? '9999px' : `${r}px`) : String(r || '20px'),
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textDecoration: 'none',
    boxShadow,
  }

  const bWidth = bs?.borderWidth ?? 0
  const bColor = bs?.borderColor || c.buttonText || c.profileText || '#000000'

  if (theme.id === 'retro-lcd' || style === 'retro-lcd' || style === 'button-retro-lcd') {
    const isDefaultDarkOrGrey = !c.buttonDefault || c.buttonDefault === '#D3D1C7' || c.buttonDefault === '#39342C' || c.buttonDefault === '#1E293B' || c.buttonDefault === '#161821' || c.buttonDefault === '#000000' || c.buttonDefault === '#ffffff' || c.buttonDefault === '#F8FAFC'
    const retroBg = isDefaultDarkOrGrey ? 'rgba(255, 255, 255, 0.05)' : c.buttonDefault
    return {
      ...base,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: retroBg,
      color: c.buttonText || '#1a2211',
      border: `${Math.max(bWidth, 2)}px solid ${bColor}`,
      borderRadius: typeof r === 'number' ? `${r}px` : (r || '12px'),
      padding: '11px 12px',
      fontFamily: resolveFontFamily(theme.fonts?.body || "'Silkscreen', monospace"),
      fontSize: '15px',
      boxShadow: 'none',
    }
  }

  switch (style) {
    case 'clay':
      const isClayWhite = !c.buttonDefault || c.buttonDefault === '#ffffff' || c.buttonDefault === '#FFFFFF'
      const clayBg = isClayWhite ? '#eef0f3' : c.buttonDefault
      // Always use the exact neumorphic pill shadow from sofy-clay.html
      const clayShadow = '6px 6px 12px rgba(163,168,178,0.45), -6px -6px 12px rgba(255,255,255,0.9)'
      return {
        ...base,
        backgroundColor: clayBg,
        color: getSmartContrastTextColor(clayBg, c.buttonText, c.profileText),
        border: 'none',
        boxShadow: clayShadow,
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
    case 'wood':
      return {
        ...base,
        backgroundImage: 'url(/wallpapers/wood-button.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#2B1F16',
        border: `${Math.max(bWidth, 1)}px solid rgba(43, 31, 22, 0.25)`,
        boxShadow: '0 4px 10px rgba(43, 31, 22, 0.25)',
      }
    case 'carved':
      return {
        ...base,
        backgroundImage: 'url(/wallpapers/wood-button.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#2B1F16',
        border: 'none',
        boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.35), 0 1px 0px rgba(255, 255, 255, 0.4)',
      }
    case 'raised':
      return {
        ...base,
        backgroundImage: 'url(/wallpapers/wood-button.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#2B1F16',
        border: `${Math.max(bWidth, 1)}px solid rgba(43, 31, 22, 0.3)`,
        boxShadow: '0 8px 0px #8B5A2B, 0 8px 15px rgba(0, 0, 0, 0.35)',
      }
    case 'leather':
      return {
        ...base,
        backgroundImage: 'url(/wallpapers/leather-button.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#FFF8F0',
        border: '1.5px dashed rgba(255, 248, 240, 0.4)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
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
export interface BioCardProps {
  cardId?: string
  overrideConfig?: BioLinkConfig
  isPreview?: boolean
  hideQRCode?: boolean
  onUpdateConfig?: (path: string, value: any) => void
}

export default function BioCard({ 
  cardId = 'default',
  overrideConfig,
  isPreview = false,
  hideQRCode = false,
  onUpdateConfig
}: BioCardProps) {
  const [mounted, setMounted] = useState(false)
  const [cardData, setCardData] = useState<CardData | null>(() => {
    if (overrideConfig) {
      return {
        id: cardId || 'preview',
        config: overrideConfig,
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString(),
      }
    }
    return null
  })
  const [loading, setLoading] = useState<boolean>(() => !overrideConfig)
  const themeRootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (themeRootRef.current && cardData?.config.theme) {
      applyThemeToCSSVariables(formatAndNormalizeTheme(cardData.config.theme), themeRootRef.current)
    }
  }, [cardData?.config.theme])

  useEffect(() => {
    setMounted(true)
  }, [])
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [lockedModalLink, setLockedModalLink] = useState<LinkItem | null>(null)
  const [unlockInput, setUnlockInput] = useState('')
  const [unlockError, setUnlockError] = useState('')
  const [unlockedLinks, setUnlockedLinks] = useState<Record<string, boolean>>({})
  const [activeVideoModal, setActiveVideoModal] = useState<LinkItem | null>(null)
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean | string>>({})
  const [latestVideoDetails, setLatestVideoDetails] = useState<Record<string, { thumbnailUrl?: string; title?: string; latestUrl?: string }>>({})
  const [activeGallery, setActiveGallery] = useState<{
    title: string
    photos: Array<{ id?: string; url: string; title?: string; description?: string; targetUrl?: string }>
    ctaLabel?: string
    ctaUrl?: string
  } | null>(null)
  const [activeMusicSheetLink, setActiveMusicSheetLink] = useState<LinkItem | null>(null)
  const [splashKey, setSplashKey] = useState(0)
  const [isSplashActive, setIsSplashActive] = useState<boolean>(() => Boolean((cardData?.config as any)?.splashScreen?.enabled))

  // Replay splash screen animation live in preview whenever splash settings change
  const currentSplash = (cardData?.config as any)?.splashScreen
  const splashEnabled = Boolean(currentSplash?.enabled)
  const splashTemplate = currentSplash?.template
  const splashTagline = currentSplash?.tagline
  const splashFreq = currentSplash?.frequency

  useEffect(() => {
    if (splashEnabled) {
      setIsSplashActive(true)
      setSplashKey(prev => prev + 1)
    } else {
      setIsSplashActive(false)
    }
  }, [splashEnabled, splashTemplate, splashTagline, splashFreq])

  const linksContainerRef = useRef<HTMLDivElement>(null)

  // GSAP Entrance Animation for all link containers & layout blocks
  useEffect(() => {
    if (linksContainerRef.current?.children) {
      gsap.fromTo(
        Array.from(linksContainerRef.current.children),
        { opacity: 0, y: 22, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
      )
    }
  }, [cardData?.config?.links?.length])

  useEffect(() => {
    if (!cardData?.config?.links) return
    const targetLinks = cardData.config.links.filter(l => (l.videoClickOption === 'open_latest' || l.videoClickOption === 'display_latest') && l.url)
    if (targetLinks.length === 0) return

    let isMounted = true
    Promise.all(
      targetLinks.map(async (link) => {
        try {
          const res = await fetch(`/api/youtube-latest?url=${encodeURIComponent(link.url)}`)
          if (res.ok) {
            const data = await res.json()
            if ((data.thumbnailUrl || data.title) && isMounted) {
              setLatestVideoDetails(prev => ({
                ...prev,
                [link.id]: {
                  thumbnailUrl: data.thumbnailUrl,
                  title: data.title,
                  latestUrl: data.latestUrl,
                },
              }))
            }
          }
        } catch (_) {}
      })
    )
    return () => { isMounted = false }
  }, [cardData?.config?.links])

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lockedModalLink) return

    const { lockType, lockValue } = lockedModalLink

    if (lockType === 'code' || lockType === 'password') {
      if (lockValue && unlockInput.trim() !== lockValue.trim()) {
        setUnlockError('Incorrect passcode or password. Please try again.')
        return
      }
    }
    if (lockType === 'subscribe') {
      if (!unlockInput.includes('@') || !unlockInput.includes('.')) {
        setUnlockError('Please enter a valid email address.')
        return
      }
    }

    setUnlockedLinks(prev => ({ ...prev, [lockedModalLink.id]: true }))
    const targetUrl = ensureAbsoluteUrl(lockedModalLink.url)
    setLockedModalLink(null)
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleLinkClick = (e: React.MouseEvent, link: LinkItem) => {
    trackClick(link.id)
    if (link.lockType && !unlockedLinks[link.id]) {
      e.preventDefault()
      setLockedModalLink(link)
      setUnlockInput('')
      setUnlockError('')
      return
    }

    const isYouTubeUrl = (link.url || '').toLowerCase().includes('youtube.com') || (link.url || '').toLowerCase().includes('youtu.be')
    const clickOpt = link.videoClickOption || 'display_video'
    const isShowcaseMode = clickOpt === 'display_video' || clickOpt === 'display_latest'

    if (isShowcaseMode && (isYouTubeUrl || link.type === 'video')) {
      e.preventDefault()
      setActiveVideoModal(link)
    }
  }

  useEffect(() => {
    // 0. Listen for live postMessage updates from parent editor window (iframe preview)
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'UPDATE_CONFIG' && event.data.config) {
        setCardData({
          id: cardId || 'preview',
          config: event.data.config,
          analytics: { views: 0, clicks: 0 },
          createdAt: new Date().toISOString(),
        })
        setLoading(false)
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'currentBioLinkConfig' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue)
          setCardData({
            id: cardId || 'preview',
            config: parsed,
            analytics: { views: 0, clicks: 0 },
            createdAt: new Date().toISOString(),
          })
          setLoading(false)
        } catch (_) {}
      }
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('storage', handleStorage)

    // If overrideConfig is provided (editor preview), use it directly
    if (overrideConfig) {
      setCardData({
        id: cardId || 'preview',
        config: overrideConfig,
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString(),
      })
      setLoading(false)
      return () => {
        window.removeEventListener('message', handleMessage)
        window.removeEventListener('storage', handleStorage)
      }
    }

    // Otherwise load from API/localStorage (public page)
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

    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [cardId, overrideConfig])

  useEffect(() => {
    const linkId = 'biocard-google-fonts-stylesheet'
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;700&family=Belanosima:wght@400;700&family=Bricolage+Grotesque:wght@400;700&family=DM+Sans:wght@400;700&family=Epilogue:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=Inter:wght@400;700&family=Lato:wght@400;700&family=M+PLUS+Rounded+1c:wght@400;700&family=Manrope:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Oxanium:wght@400;700&family=Playfair+Display:wght@400;700&family=Plus+Jakarta+Sans:wght@400;700&family=Poppins:wght@400;700&family=Red+Hat+Display:wght@400;700&family=Roboto:wght@400;700&family=Rubik:wght@400;700&family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@400;700&family=Syne:wght@400;700&display=swap'
      document.head.appendChild(link)
    }
  }, [])

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

  if (!mounted && !overrideConfig) {
    return <div className="bl-profile-theme min-h-screen relative flex flex-col items-center justify-center bg-slate-950" />
  }

  if (loading && !cardData) return null

  if (!cardData) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-900 text-white">
      <Link2 className="w-16 h-16 mb-4 text-gray-500" />
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-gray-400 mb-6 text-sm">This bio link doesn't exist or hasn't been saved yet.</p>
      <Link href="/" className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-sm transition-colors">Go Home</Link>
    </div>
  )

  const { config } = cardData
  const theme = formatAndNormalizeTheme(config.theme)
  const c = theme.colors
  const bg = getBg(c)
  const btnStyle = buildBtnStyle(theme)
  const isClay = theme.buttonStyle?.style === 'clay' || theme.id === 'soft-clay'
  const isWood = theme.buttonStyle?.style === 'wood' || theme.buttonStyle?.style === 'carved' || theme.buttonStyle?.style === 'raised' || theme.buttonStyle?.style === 'leather' || theme.id === 'skeuo-wood'
  
  // Filter visible links + apply scheduling logic
  const now = new Date()
  const allLinks = (config.links || []).filter(l => {
    if (l.isVisible === false) return false
    if (l.isScheduled && (l.scheduleStart || l.scheduleEnd)) {
      const start = l.scheduleStart ? new Date(l.scheduleStart) : null
      const end = l.scheduleEnd ? new Date(l.scheduleEnd) : null
      if (start && now < start) return false
      if (end && now > end) return false
    }
    return true
  })
  
  // Sort: pinned links first
  const visibleLinks = [...allLinks].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })
  
  // Social icons come EXCLUSIVELY from config.socialLinks
  const allSocialItems: { platform: string; url: string }[] = []
  if (config.socialLinks) {
    Object.entries(config.socialLinks).forEach(([platform, url]) => {
      if (url && url.trim()) {
        allSocialItems.push({ platform: platform.toLowerCase(), url: url.trim() })
      }
    })
  }

  const hasSocials = allSocialItems.length > 0
  const pageUrl = getCardPublicUrl(cardId, (config.profile as any)?.handle || config.profile?.title)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pageUrl)}`

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const extractYouTubeThumb = (url?: string): string | null => {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (match && match[1]) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    if (url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be')) {
      return `https://img.youtube.com/vi/hqdefault.jpg`
    }
    return null
  }

  const getSpotifyEmbedUrl = (url?: string): string | null => {
    if (!url) return null
    const clean = url.trim()
    if (clean.includes('open.spotify.com/embed/')) return clean

    const match = clean.match(/open\.spotify\.com\/(track|album|playlist|artist|show|episode)\/([a-zA-Z0-9]+)/)
    if (match && match[1] && match[2]) {
      return `https://open.spotify.com/embed/${match[1]}/${match[2]}`
    }
    return null
  }

  const renderLink = (link: LinkItem) => {
    const key = link.id

    if (link.type === 'header') {
      const text = (link.groupTitle || link.text || '').trim()
      const isDefault = !text || text.toLowerCase() === 'add collection title' || text.toLowerCase() === 'new section' || text.toLowerCase() === 'section header'
      if (isDefault) return null

      return (
        <div key={key} className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px" style={{ backgroundColor: c.buttonText, opacity: 0.15 }} />
          <span className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: c.profileText, opacity: 0.5, fontFamily: theme.fonts?.body }}>
            {text}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: c.buttonText, opacity: 0.15 }} />
        </div>
      )
    }

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

    const isFeatured = link.layout === 'featured'
    const isCompact = link.layout === 'compact'

    if (link.type === 'gallery') {
      return (
        <GallerySlider
          key={key}
          title={link.text}
          photos={link.galleryPhotos || []}
          animClasses={animClasses}
          compact={isCompact}
          layout={link.galleryLayout || 'slider'}
          ctaUrl={link.galleryCtaUrl}
          ctaLabel={link.galleryCtaLabel}
          btnStyle={btnStyle}
        />
      )
    }

    if (link.type === 'shop') {
      return (
        <ShopRenderer
          key={key}
          link={link}
          btnStyle={btnStyle}
          textColor={c.buttonText}
          trackClick={trackClick}
          animClasses={animClasses}
        />
      )
    }

    if (link.type === 'contact') {
      return (
        <ContactRenderer
          key={key}
          link={link}
          btnStyle={btnStyle}
          textColor={c.buttonText}
          trackClick={trackClick}
          animClasses={animClasses}
        />
      )
    }

    if (link.type === 'event') {
      if (isFeatured) {
        return (
          <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
            onClick={() => trackClick(key)} style={{ ...btnStyle, height: 'auto', padding: '16px' }}
            className={`group relative overflow-hidden transform-gpu border-2 shadow-xl flex flex-col gap-3 text-left ${animClasses}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight" style={{ color: c.buttonText }}>{link.text}</h3>
                  {link.eventLocation && (
                    <p className="text-xs opacity-75 mt-0.5 flex items-center gap-1" style={{ color: c.buttonText }}>
                      <MapPin size={12} />{link.eventLocation}
                    </p>
                  )}
                </div>
              </div>
              {(link.eventDate || link.eventTime) && (
                <div className="px-2.5 py-1 bg-black/10 rounded-lg text-right flex-shrink-0">
                  {link.eventDate && <p className="text-xs font-bold" style={{ color: c.buttonText }}>{link.eventDate}</p>}
                  {link.eventTime && <p className="text-[10px] opacity-75" style={{ color: c.buttonText }}>{link.eventTime}</p>}
                </div>
              )}
            </div>
            <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-center bg-black/10 group-hover:bg-black/20 transition-colors">
              RSVP / Join Event &rarr;
            </div>
          </a>
        )
      }

      return (
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
    }

    if (link.type === 'payment') {
      if (isFeatured) {
        return (
          <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
            onClick={() => trackClick(key)} style={{ ...btnStyle, height: 'auto', padding: '16px' }}
            className={`group relative overflow-hidden transform-gpu border-2 shadow-xl flex flex-col gap-3 text-left ${animClasses}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight" style={{ color: c.buttonText }}>{link.text}</h3>
                  {link.paymentType && (
                    <p className="text-xs opacity-75 mt-0.5 capitalize" style={{ color: c.buttonText }}>{link.paymentType}</p>
                  )}
                </div>
              </div>
              {link.paymentAmount && (
                <div className="px-3 py-1 bg-black/15 rounded-xl font-extrabold text-base" style={{ color: c.buttonText }}>
                  {link.currency || '$'}{link.paymentAmount}
                </div>
              )}
            </div>
            <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-center bg-black/10 group-hover:bg-black/20 transition-colors">
              Support / Send Tip &rarr;
            </div>
          </a>
        )
      }

      return (
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
                {link.paymentType && (
                  <p className="text-xs mt-0.5 capitalize" style={{ color: c.buttonText, opacity: 0.65 }}>
                    {link.paymentType}
                  </p>
                )}
              </div>
            </div>
            {link.paymentAmount && (
              <div className="text-right flex-shrink-0">
                <p className="font-extrabold text-base" style={{ color: c.buttonText }}>
                  {link.currency || '$'}{link.paymentAmount}
                </p>
              </div>
            )}
          </div>
        </a>
      )
    }

    if (link.type === 'booking') {
      if (isFeatured) {
        return (
          <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
            onClick={() => trackClick(key)} style={{ ...btnStyle, height: 'auto', padding: '16px' }}
            className={`group relative overflow-hidden transform-gpu border-2 shadow-xl flex flex-col gap-3 text-left ${animClasses}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight" style={{ color: c.buttonText }}>{link.text}</h3>
                  {link.bookingProvider && (
                    <p className="text-xs opacity-75 mt-0.5 capitalize" style={{ color: c.buttonText }}>via {link.bookingProvider}</p>
                  )}
                </div>
              </div>
              {(link as any).bookingDuration && (
                <div className="px-2.5 py-1 bg-black/10 rounded-lg text-xs font-bold" style={{ color: c.buttonText }}>
                  {(link as any).bookingDuration}
                </div>
              )}
            </div>
            <div className="w-full py-2 px-3 rounded-xl text-xs font-bold text-center bg-black/10 group-hover:bg-black/20 transition-colors">
              Book Appointment &rarr;
            </div>
          </a>
        )
      }

      return (
        <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
          onClick={() => trackClick(key)} style={btnStyle}
          className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Calendar size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>{link.text}</p>
              {link.bookingProvider && (
                <p className="text-xs mt-0.5 capitalize" style={{ color: c.buttonText, opacity: 0.65 }}>
                  via {link.bookingProvider}
                </p>
              )}
            </div>
            <ExternalLink size={14} style={{ color: c.buttonText, opacity: 0.4 }} />
          </div>
        </a>
      )
    }

    if (link.type === 'form') {
      const layout = (link as any).formLayout || 'inline'
      const submissions = (link as any).submissions || []

      const handleSubmitForm = (e: React.FormEvent, formData: any) => {
        e.preventDefault()
        const newSub = {
          ...formData,
          date: new Date().toLocaleDateString()
        }
        const updatedSubmissions = [...submissions, newSub]
        // Save submission dynamically to card state if handler present
        if ((config as any).onUpdateLink) {
          (config as any).onUpdateLink({ ...link, submissions: updatedSubmissions })
        }
      }

      return (
        <div key={key} className="w-full mb-3">
          <div
            style={btnStyle}
            className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>{link.text}</p>
                {link.description && (
                  <p className="text-xs mt-0.5 opacity-75 truncate" style={{ color: c.buttonText }}>
                    {link.description}
                  </p>
                )}
              </div>
              <ChevronRight size={14} style={{ color: c.buttonText, opacity: 0.4 }} />
            </div>
          </div>
        </div>
      )
    }

    if (link.type === 'nft') return (
      <a key={key} href={ensureAbsoluteUrl(link.url)} target="_blank" rel="noopener noreferrer"
        onClick={() => trackClick(key)} style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}>
        <div className="flex items-center justify-between px-4 py-3.5 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ImageIcon size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight" style={{ color: c.buttonText }}>{link.text}</p>
              {link.nftChain && (
                <p className="text-xs mt-0.5 capitalize" style={{ color: c.buttonText, opacity: 0.65 }}>
                  {link.nftChain}
                </p>
              )}
            </div>
          </div>
          {link.nftPrice && (
            <div className="text-right flex-shrink-0">
              <p className="font-extrabold text-sm" style={{ color: c.buttonText }}>
                {link.nftPrice} ETH
              </p>
            </div>
          )}
        </div>
      </a>
    )

    if (link.type === 'music' || (theme.specialty?.autoUrlEmbeds !== false && link.url && link.url.includes('spotify.com'))) {
      const musicOpt = link.musicClickOption || 'display_services_preview'
      const isSpotify = (link.url || '').toLowerCase().includes('spotify.com')
      const albumArt = link.thumbnail || (isSpotify ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80' : null)

      return (
        <button
          key={key}
          type="button"
          onClick={() => {
            trackClick(key)
            if (musicOpt === 'direct_url') {
              window.open(ensureAbsoluteUrl(link.url), '_blank', 'noopener,noreferrer')
            } else {
              setActiveMusicSheetLink(link)
            }
          }}
          style={btnStyle}
          className={`w-full group relative overflow-hidden transform-gpu min-h-[58px] block text-decoration-none transition-all mb-3 text-left cursor-pointer ${animClasses}`}
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            {/* Square Album Cover Image */}
            {albumArt ? (
              <img
                src={albumArt}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                {isSpotify ? <SpotifyIcon size={22} /> : <Music size={20} />}
              </div>
            )}

            {/* Center: Track Title & Subtitle with Spotify Icon */}
            <div className="min-w-0 flex-1 text-center pr-1">
              <p className="font-extrabold text-sm tracking-tight truncate" style={{ color: c.buttonText }}>
                {link.text || 'Song Title'}
              </p>
              <div
                className="flex items-center justify-center gap-1.5 text-xs truncate mt-0.5"
                style={{ color: c.buttonText, opacity: 0.8 }}
              >
                {isSpotify ? (
                  <SpotifyIcon size={13} className="flex-shrink-0 inline" />
                ) : (
                  <Music size={12} className="flex-shrink-0 inline" />
                )}
                <span className="truncate">
                  {link.description || 'Song • Stream everywhere'}
                </span>
              </div>
            </div>

            {/* Right: Three Vertical Dots (MoreVertical) */}
            <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={16} style={{ color: c.buttonText }} />
            </div>
          </div>
        </button>
      )
    }

    const isYouTubeUrl = (link.type === 'video' || theme.specialty?.autoUrlEmbeds !== false) && ((link.url || '').toLowerCase().includes('youtube.com') || (link.url || '').toLowerCase().includes('youtu.be'))
    const ytThumb = isYouTubeUrl ? extractYouTubeThumb(link.url) : null
    const latestInfo = latestVideoDetails[link.id]
    const cardThumb = latestInfo?.thumbnailUrl || link.thumbnail || ytThumb
    const cardTitle = latestInfo?.title || link.text || 'YouTube Video'
    const clickOpt = link.videoClickOption || 'display_video'
    const isShowcaseMode = clickOpt === 'display_video' || clickOpt === 'display_latest'

    // ── YOUTUBE FORMAT 1: "Display my video on my Linktree" (display_video / display_latest) ──
    if (isYouTubeUrl && (clickOpt === 'display_video' || clickOpt === 'display_latest')) {
      const isPlaying = Boolean(playingVideos[link.id])

      if (isPlaying) {
        const playingTarget = typeof playingVideos[link.id] === 'string' ? (playingVideos[link.id] as unknown as string) : ''
        const embedSrc = getEmbedIframeUrl(playingTarget || link.embedUrl || link.url || '')
        const autoSrc = embedSrc ? `${embedSrc}${embedSrc.includes('?') ? '&' : '?'}autoplay=1${link.videoMute ? '&mute=1' : ''}` : ''

        return (
          <div key={key} style={btnStyle} className="relative w-full aspect-video rounded-[inherit] overflow-hidden shadow-md bg-black flex flex-col justify-center mb-3">
            <iframe
              src={autoSrc}
              title={link.text || 'YouTube Video Player'}
              className="w-full h-full absolute inset-0 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setPlayingVideos(prev => ({ ...prev, [link.id]: false }))
              }}
              className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors shadow-md cursor-pointer"
              title="Close video"
            >
              <X size={14} />
            </button>
          </div>
        )
      }

      return (
        <a
          key={key}
          href={ensureAbsoluteUrl(link.url)}
          onClick={async (e) => {
            e.preventDefault()
            trackClick(link.id)
            if (clickOpt === 'display_latest') {
              const preEmbed = latestInfo?.latestUrl
              if (preEmbed) {
                setPlayingVideos(prev => ({ ...prev, [link.id]: preEmbed }))
                return
              }
              try {
                const res = await fetch(`/api/youtube-latest?url=${encodeURIComponent(link.url)}`)
                if (!res.ok) {
                  throw new Error(`HTTP error ${res.status}`)
                }
                const data = await res.json()
                if (data.embedUrl || data.latestUrl) {
                  setPlayingVideos(prev => ({ ...prev, [link.id]: data.embedUrl || data.latestUrl }))
                  return
                }
              } catch {
                // fallback
              }
            }
            setPlayingVideos(prev => ({ ...prev, [link.id]: true }))
          }}
          style={btnStyle}
          className={`group relative w-full aspect-video rounded-[inherit] overflow-hidden shadow-md block text-decoration-none transition-all mb-3 ${animClasses}`}
        >
          {/* Background Thumbnail Image */}
          {cardThumb ? (
            <img
              src={cardThumb}
              alt={cardTitle || 'YouTube Video'}
              className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full absolute inset-0 bg-slate-900 flex items-center justify-center">
              <YouTubeIcon size={40} className="text-red-600" />
            </div>
          )}

          {/* Top Left YouTube Badge */}
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold shadow-sm pointer-events-none">
            <YouTubeIcon size={14} className="text-red-500" />
            <span>YouTube</span>
          </div>

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-11 h-11 rounded-full bg-black/65 backdrop-blur-xs text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={18} className="fill-white ml-0.5" />
            </div>
          </div>

          {/* Bottom Gradient Title Overlay */}
          {cardTitle && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20 text-left pointer-events-none">
              <h4 className="font-bold text-white text-xs leading-tight drop-shadow-md truncate">
                {cardTitle}
              </h4>
            </div>
          )}
        </a>
      )
    }

    // ── YOUTUBE FORMAT 2: "Open YouTube video" (open_youtube) ──
    if (isYouTubeUrl && clickOpt === 'open_youtube') {
      return (
        <a
          key={key}
          href={ensureAbsoluteUrl(link.url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(link.id)}
          className={`group w-full h-[140px] flex flex-col justify-between rounded-lg overflow-hidden shadow-sm border border-white/10 bg-white block text-decoration-none transition-all hover:shadow-md ${animClasses}`}
        >
          {/* Top Bezel-less Image Header */}
          <div className="w-full flex-1 overflow-hidden bg-black relative">
            {cardThumb ? (
              <img
                src={cardThumb}
                alt={cardTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <YouTubeIcon size={32} className="text-red-600" />
              </div>
            )}
          </div>

          {/* Bottom Light Section with Title */}
          <div className="p-2 bg-white border-t border-gray-100/50">
            <h4 className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-1">
              {cardTitle}
            </h4>
          </div>
        </a>
      )
    }

    // ── YOUTUBE FORMAT 3: "Open my channel's latest video" (open_latest) ──
    if (isYouTubeUrl && clickOpt === 'open_latest') {
      return (
        <button
          key={key}
          type="button"
          onClick={async () => {
            trackClick(link.id)
            try {
              const targetUrl = latestInfo?.latestUrl
              if (targetUrl) {
                window.open(targetUrl, '_blank', 'noopener,noreferrer')
                return
              }
              const res = await fetch(`/api/youtube-latest?url=${encodeURIComponent(link.url)}`)
              if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`)
              }
              const data = await res.json()
              const target = data.latestUrl || link.url
              window.open(target, '_blank', 'noopener,noreferrer')
            } catch {
              window.open(link.url, '_blank', 'noopener,noreferrer')
            }
          }}
          className={`group w-full h-[140px] flex flex-col justify-between rounded-lg overflow-hidden shadow-sm border border-white/10 bg-white text-left transition-all hover:shadow-md ${animClasses}`}
        >
          {/* Top Bezel-less Image Header */}
          <div className="w-full flex-1 overflow-hidden bg-black relative">
            {cardThumb ? (
              <img
                src={cardThumb}
                alt={cardTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <YouTubeIcon size={32} className="text-red-600" />
              </div>
            )}
            {/* "Latest" badge */}
            <span className="absolute top-1.5 left-1.5 bg-red-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide shadow">
              Latest
            </span>
          </div>
          {/* Bottom section */}
          <div className="p-2 bg-white border-t border-gray-100/50">
            <h4 className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-1">
              {cardTitle}
            </h4>
          </div>
        </button>
      )
    }



    // Classic Button Layout (Default) or Featured Card Layout
    const rawIconKey = (link.platform || link.icon || '').toLowerCase()
    const inferredIconKey = rawIconKey || (() => {
      const u = (link.url || '').toLowerCase()
      const t = (link.text || '').toLowerCase()
      if (u.includes('spotify.com')) return 'spotify'
      if (u.includes('github.com')) return 'github'
      if (u.includes('youtube') || t.includes('youtube')) return 'youtube'
      if (u.includes('instagram') || t.includes('instagram')) return 'instagram'
      if (u.includes('twitter') || u.includes('x.com') || t.includes('twitter')) return 'twitter'
      if (u.includes('linkedin') || t.includes('linkedin')) return 'linkedin'
      if (t.includes('work') || t.includes('portfolio')) return 'work'
      if (t.includes('resume') || t.includes('résumé') || t === 'cv') return 'document'
      if (t.includes('coffee')) return 'coffee'
      if (t.includes('business') || t.includes('inquir') || t.includes('contact') || u.includes('mailto:')) return 'email'
      if (t.includes('website') || t.includes('site') || u.includes('http')) return 'website'
      return 'globe'
    })()
    const Icon = PLATFORM_ICONS[inferredIconKey] || Globe
    const isClay = theme.buttonStyle?.style === 'clay' || theme.id === 'soft-clay'

    const featuredThumb = link.thumbnail || (link as any).featuredImage || (link as any).imageUrl || null

    if (isFeatured) {
      return (
        <a
          key={key}
          href={ensureAbsoluteUrl(link.url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => handleLinkClick(e, link)}
          style={{
            ...btnStyle,
            height: 'auto',
            padding: 0,
            overflow: 'hidden',
          }}
          className={`group relative overflow-hidden transform-gpu flex flex-col w-full shadow-md transition-all ${animClasses}`}
          data-profile-link="featured"
          data-link-platform={inferredIconKey}
        >
          {/* Top Featured Banner Image */}
          <div className="w-full h-36 sm:h-44 bg-slate-800 relative overflow-hidden flex items-center justify-center">
            {featuredThumb ? (
              <img
                src={featuredThumb}
                alt={link.text}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-white/80"
                style={{
                  background: `linear-gradient(135deg, ${c.accent || '#4f46e5'}, ${c.buttonDefault || '#161821'})`,
                }}
              >
                <Sparkles size={24} className="mb-1 opacity-70" />
                <span className="text-xs font-bold tracking-tight">Featured Showcase Banner</span>
              </div>
            )}
          </div>

          {/* Bottom Info Bar */}
          <div className={`flex items-center ${isClay ? 'px-[18px] py-[12px]' : 'px-4 py-3'} gap-3 w-full border-t border-white/10`}>
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
              {Icon ? <Icon size={16} /> : <Globe size={16} />}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-extrabold text-sm leading-tight truncate" style={{ color: isClay ? '#161821' : c.buttonText }}>
                {link.text}
              </p>
              {link.description && (
                <p className="text-xs truncate mt-0.5 opacity-75" style={{ color: isClay ? '#6b7280' : c.buttonText }}>
                  {link.description}
                </p>
              )}
            </div>
            <ChevronRight size={16} style={{ color: isClay ? '#9aa0ab' : c.buttonText, opacity: 0.7 }} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      )
    }

    const isRetroBtn = theme.id === 'retro-lcd' || theme.buttonStyle?.style === 'retro-lcd' || theme.buttonStyle?.style === 'button-retro-lcd'
    if (isRetroBtn) {
      return (
        <a 
          key={key} 
          href={ensureAbsoluteUrl(link.url)} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => handleLinkClick(e, link)} 
          style={btnStyle}
          className={`group relative overflow-hidden transform-gpu flex items-center justify-between gap-[10px] text-[15px] no-underline whitespace-nowrap ${animClasses}`}
        >
          <div className="w-[22px] h-[22px] border-2 rounded-[5px] flex items-center justify-center flex-shrink-0" style={{ borderColor: theme.buttonStyle?.borderColor || c.buttonText || '#1a2211' }}>
            {Icon ? <Icon size={13} style={{ color: c.buttonText }} /> : <Globe size={13} style={{ color: c.buttonText }} />}
          </div>
          <span className="flex-1 min-w-0 text-left truncate font-bold text-[14px] sm:text-[15px] whitespace-nowrap leading-none" style={{ color: c.buttonText, fontFamily: resolveFontFamily(theme.fonts?.body) }}>
            {link.text}
          </span>
          <span className="text-[18px] leading-none flex-shrink-0 ml-auto font-bold" style={{ color: c.buttonText, fontFamily: resolveFontFamily(theme.fonts?.body) }}>&rsaquo;</span>
        </a>
      )
    }

    return (
      <a 
        key={key} 
        href={ensureAbsoluteUrl(link.url)} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => handleLinkClick(e, link)} 
        style={btnStyle}
        className={`group relative overflow-hidden transform-gpu min-h-[50px] ${animClasses}`}
        data-profile-link="classic"
        data-link-platform={inferredIconKey}
      >
        <div className={`flex items-center ${isClay ? 'px-[18px] py-[14px]' : 'px-4 py-3.5'} gap-3.5`}>
          <div data-link-icon={inferredIconKey} data-has-thumbnail={link.thumbnail ? 'true' : undefined} className={
            isClay 
              ? "w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0" 
              : (isWood 
                  ? "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.35),_0_1px_1px_rgba(255,255,255,0.3)] border border-amber-950/20" 
                  : "w-9 h-9 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200")
            }
            style={
              isClay 
                ? (() => {
                    const p = (link.platform || link.icon || '').toLowerCase()
                    const isYT = p === 'youtube' || (link.url || '').includes('youtube')
                    const isWork = p === 'briefcase' || p === 'work'
                    const isMail = p === 'mail' || p === 'email'
                    if (isYT)   return { backgroundColor: '#ff1f1f', color: '#fff',     boxShadow: '0 3px 8px rgba(120,124,134,0.18)' }
                    if (isWork) return { backgroundColor: '#f2f3f5', color: '#c7791f',  boxShadow: '0 3px 8px rgba(120,124,134,0.18)' }
                    if (isMail) return { backgroundColor: '#3f5cf0', color: '#fff',     boxShadow: '0 3px 8px rgba(120,124,134,0.18)' }
                    return { backgroundColor: '#ffffff', color: '#2f6fed', boxShadow: '0 3px 8px rgba(120,124,134,0.18)' }
                  })() 
                : (isWood 
                    ? {
                        backgroundImage: 'url(/wallpapers/wood-button.webp)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: '#2B1F16',
                      }
                    : undefined)
            }
          >
            {link.thumbnail ? <img src={link.thumbnail} alt="" className="w-full h-full object-cover rounded-[inherit]" /> : Icon ? <Icon size={isClay ? 22 : 18} /> : <Globe size={isClay ? 22 : 18} />}
          </div>
          <div className="flex-1 min-w-0">
            <p data-link-title className={`${isClay ? 'text-[17px] font-bold' : 'font-extrabold text-sm md:text-base'} leading-tight truncate`} style={{ color: isClay ? '#161821' : (theme.buttonStyle?.style === 'leather' ? '#FFF8F0' : (isWood ? '#2B1F16' : c.buttonText)), fontFamily: resolveFontFamily(theme.fonts?.body) }}>
              {link.text}
            </p>
            {link.description && (
              <p data-link-description className={`${isClay ? 'text-[14px]' : 'text-xs'} truncate mt-0.5`} style={{ color: isClay ? '#6b7280' : (theme.buttonStyle?.style === 'leather' ? 'rgba(255,248,240,0.75)' : (isWood ? 'rgba(43,31,22,0.75)' : c.buttonText)), fontFamily: resolveFontFamily(theme.fonts?.body), opacity: isClay ? 1 : 0.8 }}>
                {link.description}
              </p>
            )}
          </div>
          <div className="w-5 flex items-center justify-end transition-opacity">
            <ChevronRight size={18} style={{ color: isClay ? '#9aa0ab' : (theme.buttonStyle?.style === 'leather' ? '#FFF8F0' : (isWood ? '#2B1F16' : c.buttonText)), opacity: isClay ? 1 : (isWood ? 0.7 : 0.4) }} />
          </div>
        </div>
      </a>
    )
  }

  const hasCustomBackground = Boolean(
    c.backgroundImage ||
    c.backgroundVideo ||
    c.backgroundIframe ||
    c.backgroundMesh ||
    c.backgroundGradient ||
    c.backgroundType ||
    (c.background && c.background !== '#e9eaee' && c.background !== '#ffffff' && c.background !== 'rgb(233, 234, 238)')
  )

  const widthToken = (config as any)?.cardWidth || (theme as any)?.layout?.width || (theme.specialty?.cardMaxWidth === '390px' ? 'compact' : 'normal')
  const widthClass =
    widthToken === 'compact' ? 'max-w-[390px]' :
    widthToken === 'wide' ? 'max-w-[640px]' :
    widthToken === 'full' ? 'max-w-4xl w-full' :
    'max-w-[480px]'

  const hasCardSpecialty = Boolean(theme.specialty?.cardBackground || theme.specialty?.cardBorderRadius || isWood || isClay)
  const cardMaxWidth = theme.specialty?.cardMaxWidth || (widthToken === 'compact' ? '390px' : widthToken === 'wide' ? '640px' : '480px')

  const cardStyle: React.CSSProperties = {
    maxWidth: cardMaxWidth,
    padding: theme.specialty?.cardPadding,
  }

  const activeDecorations = (theme.specialty as any)?.decorations || ((theme.specialty as any)?.blobs ? ['blobs', 'noise'] : [])

  return (
    <div
      ref={themeRootRef}
      suppressHydrationWarning
      data-theme={theme.id}
      data-theme-style={theme.specialty?.styleId || theme.id}
      data-header-layout={(config.profile as any)?.headerLayout || theme.headerLayout || 'classic'}
      className={`bl-profile-theme ${isPreview ? 'w-full h-full relative overflow-hidden p-3 sm:p-4 flex items-center justify-center' : 'min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden'}`}
      style={bg}
    >
      {c.backgroundImage && c.backgroundType === 'image' && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${parseGoogleDriveUrl(c.backgroundImage).directUrl || c.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: theme.backgroundFilter || 'none',
          }}
        />
      )}

      {/* Custom Video Background (.mp4 / .webm) */}
      {c.backgroundVideo && c.backgroundType === 'video' && (
        <video
          key={c.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          src={ensureAbsoluteUrl(c.backgroundVideo)}
        />
      )}

      {/* Custom YouTube / Vimeo / Iframe Embed Background */}
      {c.backgroundIframe && c.backgroundType === 'video' && (
        <iframe
          src={getEmbedIframeUrl(c.backgroundIframe)}
          title="Background Video Player"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none border-0 scale-125"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
      )}

      {/* Background Overlay */}
      {c.backgroundOverlay && (
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: c.backgroundOverlay }} />
      )}

      {/* Noise overlay */}
      {theme.noiseOpacity && (
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: theme.noiseOpacity,
          mixBlendMode: 'overlay',
        }} />
      )}

      {/* ── Welcome / Loading Splash Screen Intro Sequence ── */}
      <WelcomeSplashScreen
        key={`splash_${splashKey}`}
        splash={(config as any).splashScreen}
        profile={config.profile}
        isPreview={isPreview}
        onFinish={() => setIsSplashActive(false)}
      />

      {/* Content container: the page owns the theme background and textures. */}
      <div
        className={`relative z-10 flex flex-col card-frame w-full ${widthClass} ${
          hasCardSpecialty
            ? (isPreview ? 'max-h-full overflow-y-auto no-scrollbar my-auto' : 'my-auto')
            : (isPreview
                ? 'h-full p-4 overflow-y-auto no-scrollbar'
                : 'min-h-screen pt-12 px-4 pb-4 sm:pt-16 sm:px-5 sm:pb-5 md:pt-6 md:my-6 md:min-h-0 md:px-6 md:pb-6')
        }`}
        style={cardStyle}
      >

        <DecorationLayer decorations={activeDecorations} blobColorLeft="#ffffff" blobColorRight="#ffffff" />

        {/* ── Interactive Floating Stickers Canvas Layer ── */}
        <StickerCanvasLayer
          stickers={(config as any).stickers || []}
          onUpdateStickers={(updated) => {
            setCardData((prev) => prev ? {
              ...prev,
              config: { ...prev.config, stickers: updated }
            } : prev)
            if (onUpdateConfig) onUpdateConfig('stickers', updated)
            if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
              window.parent.postMessage({ type: 'UPDATE_CONFIG_STICKERS', stickers: updated }, '*')
            }
          }}
          editable={true}
        />

        <div>
          {/* ── Profile Section ── */}
          {(() => {
            const bannerImage = (config.profile as any)?.bannerImage || ''
            const headerLayout = (config.profile as any)?.headerLayout || (bannerImage ? 'banner' : theme.headerLayout || 'classic')
            const headerShape = (config.profile as any)?.headerShape || 'loop'

            const avatarSrc = config.profile.avatar && config.profile.avatar !== 'user' ? config.profile.avatar : ''
            const hasImg = (src?: string) => Boolean(src && (src.startsWith('http') || src.startsWith('data:') || src.length > 10))
            const hasCardBg = Boolean(theme.specialty?.cardBackground)

            // 1. HERO LAYOUT (Mobile Optimized - Seamless Full Bleed)
            if (headerLayout === 'hero') {
              return (
                <div className="-mt-4 -mx-4 mb-6 relative h-[300px] sm:h-[360px] rounded-t-[inherit] overflow-hidden flex flex-col justify-end p-4 sm:p-6 text-center">
                  {hasImg(avatarSrc) ? (
                    <img
                      src={avatarSrc}
                      alt="hero avatar"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold"
                      style={{
                        background: c.backgroundGradient
                          ? `linear-gradient(${c.backgroundGradient.direction || '135deg'}, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})`
                          : c.backgroundMesh || `linear-gradient(135deg, ${c.background || '#0f172a'}, ${c.accent || '#4f46e5'})`,
                      }}
                    >
                      {(config.profile.title || '?')[0].toUpperCase()}
                    </div>
                  )}

                  {/* Gradient Overlay for Seamless Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                  {/* Overlaid Title & Bio */}
                  <div className="relative z-10 text-center pb-2">
                    <div className="flex items-center justify-center gap-1.5 px-4 mb-1">
                      <h1 className="text-xl sm:text-2xl font-bold leading-tight text-white drop-shadow-md"
                        style={{ fontFamily: resolveFontFamily(theme.fonts?.heading) }}>
                        {config.profile.title || 'Your Name'}
                      </h1>
                      <ProfileBadge profile={config.profile} />
                    </div>
                    {config.profile.bio && (
                      <p className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto text-white/95 drop-shadow-sm px-4"
                        style={{ fontFamily: resolveFontFamily(theme.fonts?.body) }}>
                        {config.profile.bio}
                      </p>
                    )}
                    {config.profile.location && (
                      <p className="text-xs mt-1.5 flex items-center justify-center gap-1 text-white/90 drop-shadow-sm">
                        <MapPin size={11} />{config.profile.location}
                      </p>
                    )}
                  </div>
                </div>
              )
            }

            // 2. BANNER LAYOUT (Mobile Optimized - Bezel-Less Full Bleed)
            if (headerLayout === 'banner') {
              return (
                <div className="text-center mb-6 sm:mb-8 -mt-4 -mx-4">
                  {/* Banner strip */}
                  <div className="w-full h-32 sm:h-40 relative bg-slate-200 border-b border-white/20 shadow-sm overflow-hidden flex items-center justify-center rounded-t-[inherit]">
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
                        <ImageIcon size={28} opacity={0.7} className="sm:w-8 sm:h-8" />
                      </div>
                    )}
                  </div>

                  {/* Overlapping Avatar */}
                  <div className="mb-3 sm:mb-4 flex justify-center relative z-10 -mt-10 sm:-mt-12">
                    {hasImg(avatarSrc) ? (
                      <img src={avatarSrc} alt="avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg border-2 border-white" />
                    ) : (
                      <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                        style={{
                          backgroundColor: c.buttonDefault || '#1e293b',
                          color: c.buttonText || c.profileText || '#ffffff'
                        }}
                      >
                        <span className="text-2xl sm:text-4xl font-bold">
                          {(config.profile.title || '?')[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 px-4 mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold leading-tight"
                      style={{ color: c.profileText, fontFamily: resolveFontFamily(theme.fonts?.heading) }}>
                      {config.profile.title || 'Your Name'}
                    </h1>
                    <ProfileBadge profile={config.profile} />
                  </div>

                  {config.profile.bio && (
                    <p className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto px-4"
                      style={{ color: c.profileBio, fontFamily: resolveFontFamily(theme.fonts?.body), opacity: 0.9 }}>
                      {config.profile.bio}
                    </p>
                  )}
                </div>
              )
            }

            // 4. SHAPE LAYOUT (Mobile Responsive)
            if (headerLayout === 'shape') {
              const shapeBorderRadius =
                headerShape === 'flower' ? '38% 62% 63% 37% / 41% 44% 56% 59%' :
                headerShape === 'loop' ? '60% 40% 30% 70% / 60% 30% 70% 40%' :
                headerShape === 'oval' ? '50% / 35%' :
                headerShape === 'burst' ? '30% 70% 70% 30% / 50% 30% 70% 50%' : '36px'

              return (
                <div className="w-full text-center mb-6 sm:mb-8">
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <div
                      className="w-36 h-28 sm:w-44 sm:h-36 overflow-hidden shadow-xl flex items-center justify-center relative transition-all duration-300 border-4 border-white/40"
                      style={{
                        borderRadius: shapeBorderRadius,
                        backgroundColor: c.buttonDefault || c.accent || '#4F46E5'
                      }}
                    >
                      {hasImg(avatarSrc) ? (
                        <img src={avatarSrc} alt="avatar shape" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl sm:text-4xl font-bold" style={{ color: c.buttonText || '#ffffff' }}>
                          {(config.profile.title || '?')[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-bold mb-1 leading-tight px-4"
                    style={{ color: c.profileText, fontFamily: resolveFontFamily(theme.fonts?.heading) }}>
                    {config.profile.title || 'Your Name'}
                  </h1>

                  {config.profile.bio && (
                    <p className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto px-4"
                      style={{ color: c.profileBio, fontFamily: resolveFontFamily(theme.fonts?.body), opacity: 0.9 }}>
                      {config.profile.bio}
                    </p>
                  )}
                </div>
              )
            }

            // 5. CLASSIC LAYOUT (DEFAULT - Mobile Optimized)
            const showStatusBar = Boolean((theme.specialty as any)?.statusBar)
            const creatorTag = (theme.specialty as any)?.creatorTag
            const avatarBorder = (theme.specialty as any)?.avatarBorder

            return (
              <div className="w-full text-center relative z-10 mb-4 sm:mb-6">
                {/* Optional Status Bar */}
                {showStatusBar && (
                  <div className="flex justify-between items-center text-[13px] tracking-wider pb-2 relative z-10" style={{ color: c.profileText }}>
                    <span className="font-bold">{(theme.specialty as any)?.time || '09:41'}</span>
                    <span className="flex items-center gap-[6px]">
                      <span className="flex items-end gap-[1px] h-[9px]">
                        <span className="w-[2px] h-[3px] block" style={{ backgroundColor: c.profileText }} />
                        <span className="w-[2px] h-[5px] block" style={{ backgroundColor: c.profileText }} />
                        <span className="w-[2px] h-[7px] block" style={{ backgroundColor: c.profileText }} />
                        <span className="w-[2px] h-[9px] block" style={{ backgroundColor: c.profileText }} />
                      </span>
                      <span className="w-[20px] h-[10px] border-[1.5px] rounded-[2px] relative flex items-center p-[1.5px]" style={{ borderColor: c.profileText }}>
                        <span className="block w-[75%] h-full" style={{ backgroundColor: c.profileText }} />
                        <span className="absolute -right-[4px] top-[2.5px] w-[2px] h-[5px] rounded-r-[1px]" style={{ backgroundColor: c.profileText }} />
                      </span>
                    </span>
                  </div>
                )}

                {/* Optional Creator Tag */}
                {creatorTag && (
                  <div className="text-right text-[15px] underline underline-offset-[3px] mb-1.5 relative z-10" style={{ color: c.profileText }}>
                    {creatorTag}
                  </div>
                )}
                {/* Avatar */}
                <div data-profile-avatar className="w-24 h-24 sm:w-28 sm:h-28 my-3 mx-auto overflow-hidden shadow-md border-white/80"
                  style={{
                    width: theme.avatarStyle?.size, height: theme.avatarStyle?.size,
                    borderRadius: theme.avatarStyle?.shape === 'square' ? 0 : theme.avatarStyle?.shape === 'rounded' ? 16 : '50%',
                    border: avatarBorder || `${theme.avatarStyle?.borderWidth ?? 2}px solid rgba(255,255,255,0.8)`,
                    clipPath: theme.avatarStyle?.shape === 'hexagon' ? 'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)' : undefined,
                  }}>
                  {hasImg(avatarSrc) ? (
                    <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${c.accent || c.buttonDefault || '#2f6fed'}, ${c.buttonDefault || '#161821'})` }}>
                      <span className="text-3xl sm:text-4xl font-bold" style={{ color: c.buttonText || '#ffffff' }}>
                        {(config.profile.title || '?')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  {theme.specialty?.accentNote && <span aria-hidden="true" data-theme-accent-note className="hidden">{theme.specialty.accentNote}</span>}
                </div>

                {/* Name & Verified Badge */}
                <div className="flex items-center justify-center gap-1.5 px-4 mt-1">
                  <h1
                    className="text-xl sm:text-2xl font-bold leading-tight"
                    style={{ color: c.profileText, fontFamily: resolveFontFamily(theme.fonts?.heading) }}
                  >
                    {config.profile.title || 'Your Name'}
                  </h1>
                  <ProfileBadge profile={config.profile} />
                </div>

                {/* Bio */}
                {config.profile.bio && (
                  <p
                    className="text-xs sm:text-sm leading-relaxed max-w-xs mx-auto px-4 mt-1.5"
                    style={{
                      color: c.profileBio,
                      fontFamily: resolveFontFamily(theme.fonts?.body),
                      opacity: 0.9,
                    }}
                  >
                    {config.profile.bio}
                  </p>
                )}

                {config.profile.location && (
                  <p className="text-xs mt-1.5 flex items-center justify-center gap-1"
                    style={{ color: c.profileBio, fontFamily: theme.fonts?.body }}>
                    <MapPin size={12} />{config.profile.location}
                  </p>
                )}
              </div>
            )
          })()}

          {/* ── Social Icons (Top Position) ── */}
          {hasSocials && (config.socialIconPosition || 'top') === 'top' && (() => {
            const hasDashedSocials = Boolean((theme.specialty as any)?.socialBorder?.includes('dashed') || theme.id === 'retro-lcd' || theme.buttonStyle?.style === 'retro-lcd' || theme.buttonStyle?.style === 'button-retro-lcd')
            return (
              <div className="flex justify-center items-center flex-wrap relative z-10 gap-3.5 mb-6 px-4">
                {allSocialItems.map(({ platform, url }) => {
                  if (!url) return null
                  const Icon = PLATFORM_ICONS[platform]
                  if (!Icon) return null
                  const isClay = theme.buttonStyle?.style === 'clay' || theme.id === 'soft-clay'
                  const claySocialColor =
                    isClay && platform === 'linkedin' ? '#2f6fed' :
                    isClay && (platform === 'twitter' || platform === 'x') ? '#3aa0f3' :
                    isClay ? '#1a1d24' : undefined

                  if (hasDashedSocials) {
                  return (
                    <a
                      key={platform}
                      href={ensureAbsoluteUrl(url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[42px] h-[42px] rounded-full border-2 border-dashed flex items-center justify-center transition-all hover:scale-110"
                      style={{ borderColor: c.profileText || '#1a2211', color: c.profileText || '#1a2211' }}
                      title={platform}
                    >
                      <Icon size={20} style={{ color: c.profileText || '#1a2211' }} />
                    </a>
                  )
                }

                return (
                  <a
                    key={platform}
                    href={ensureAbsoluteUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      isClay
                        ? "w-12 h-12 rounded-[16px] flex items-center justify-center transition-all hover:-translate-y-0.5"
                        : (isWood
                            ? "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.4)] border border-amber-950/25"
                            : "w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-90")
                    }
                    style={
                      isClay
                        ? {
                            backgroundColor: '#eef0f3',
                            color: claySocialColor,
                            boxShadow: '5px 5px 10px rgba(163,168,178,0.45), -5px -5px 10px rgba(255,255,255,0.9)',
                          }
                        : (isWood
                            ? {
                                backgroundImage: 'url(/wallpapers/wood-button.webp)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: '#2B1F16',
                              }
                            : { backgroundColor: 'rgba(255,255,255,0.15)', color: c.profileText })
                    }
                    title={platform}
                  >
                    <Icon size={isClay ? 22 : (isWood ? 18 : 16)} />
                  </a>
                )
              })}
            </div>
          )
        })()}

          {/* ── Links (Mobile Optimized) ── */}
          {visibleLinks.length > 0 && (
            <div ref={linksContainerRef} className={`${(theme.buttonStyle?.style === 'clay' || theme.id === 'soft-clay') ? 'space-y-[14px]' : 'space-y-2.5 sm:space-y-3'} mb-6 sm:mb-8 w-full`}>
              {visibleLinks.map((link) => {
                if (link.groupId && !link.isGroupHeader) return null // Handled inside parent collection

                if (link.isGroupHeader) {
                  const groupLinks = visibleLinks.filter(l => l.groupId === link.id && !l.isGroupHeader)
                  const layout = link.collectionLayout || 'stack'

                  return (
                    <div key={link.id} className="space-y-2.5 w-full">
                      {renderLink(link)}

                      {groupLinks.length > 0 && (
                        <div>
                          {layout === 'grid' && (
                            <div className="grid grid-cols-2 gap-2.5 w-full items-stretch">
                              {groupLinks.map((gLink) => (
                                <div key={gLink.id} className="w-full h-full flex flex-col">
                                  {renderLink(gLink)}
                                </div>
                              ))}
                            </div>
                          )}

                          {layout === 'carousel' && (
                            <div className="-mx-1 px-1 flex gap-3 overflow-x-auto pb-3 pt-1.5 w-full snap-x snap-mandatory scrollbar-none items-stretch">
                              {groupLinks.map((gLink) => (
                                <div key={gLink.id} className="w-[240px] shrink-0 snap-center flex flex-col">
                                  {renderLink(gLink)}
                                </div>
                              ))}
                            </div>
                          )}

                          {layout === 'showcase' && (
                            <div className="space-y-2.5 w-full">
                              {renderLink({ ...groupLinks[0], layout: 'featured' })}
                              {groupLinks.length > 1 && (
                                <div className="grid grid-cols-2 gap-2.5 w-full">
                                  {groupLinks.slice(1).map(renderLink)}
                                </div>
                              )}
                            </div>
                          )}

                          {layout === 'stack' && (
                            <div className="space-y-2.5 w-full">
                              {groupLinks.map(renderLink)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                }

                return renderLink(link)
              })}
            </div>
          )}

        </div>

        {/* ── Social Icons (Bottom Position) ── */}
        {hasSocials && config.socialIconPosition === 'bottom' && (
          <div className="flex justify-center items-center gap-2.5 mb-4 px-4 flex-wrap">
            {allSocialItems.map(({ platform, url }) => {
              if (!url) return null
              const Icon = PLATFORM_ICONS[platform]
              if (!Icon) return null
              return (
                <a 
                  key={platform} 
                  href={ensureAbsoluteUrl(url)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={
                    isWood
                      ? "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.3),_inset_0_1px_1px_rgba(255,255,255,0.4)] border border-amber-950/25"
                      : "w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-90"
                  }
                  style={
                    isWood
                      ? {
                          backgroundImage: 'url(/wallpapers/wood-button.webp)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          color: '#2B1F16',
                        }
                      : { 
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          color: c.profileText
                        }
                  }
                  title={platform}
                >
                  <Icon size={isWood ? 18 : 16} />
                </a>
              )
            })}
          </div>
        )}

        {/* ── Official Linktree Footer Section ── */}
        <div className="w-full flex flex-col items-center gap-4 mt-8 mb-4 px-2 flex-shrink-0 z-20">
          {/* Custom Footer Note (if configured in FooterPanel) */}
          {config.theme?.customFooterText && (
            <p className="text-xs font-semibold text-center opacity-85 px-4" style={{ color: c.profileBio || c.profileText }}>
              {config.theme.customFooterText}
            </p>
          )}

          {/* Join CTA Pill Button (hidden if hideFooterLogo is true) */}
          {!(config.theme?.hideFooterLogo) && (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={btnStyle}
              className="w-full max-w-[340px] py-3.5 px-6 font-extrabold text-sm text-center hover:scale-[1.02] active:scale-95 transition-all cursor-pointer block"
            >
              Join {(config.profile as any)?.handle || config.profile.title?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'satvikpatel8373'} on BioLink
            </a>
          )}

          {/* Official Footer Sub-Links */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-[11px] font-semibold text-center leading-relaxed" style={{ color: c.profileBio || c.profileText || '#1a2211' }}>
            <button type="button" onClick={() => {}} className="hover:underline opacity-90 hover:opacity-100 cursor-pointer">Cookie Preferences</button>
            <span className="opacity-60">•</span>
            <button type="button" onClick={() => {}} className="hover:underline opacity-90 hover:opacity-100 cursor-pointer">Report</button>
            <span className="opacity-60">•</span>
            <button type="button" onClick={() => {}} className="hover:underline opacity-90 hover:opacity-100 cursor-pointer">Privacy</button>
            <span className="opacity-60">•</span>
            <button type="button" onClick={() => {}} className="hover:underline opacity-90 hover:opacity-100 cursor-pointer">Explore</button>
          </div>
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
      {/* ── Lock Unlock Modal Overlay ── */}
      {lockedModalLink && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center space-y-4 relative border border-gray-100">
            <button
              onClick={() => setLockedModalLink(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock size={28} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-gray-900">{lockedModalLink.text || 'Locked Content'}</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {lockedModalLink.lockType === 'subscribe' && 'Please subscribe with your email to unlock this link.'}
                {lockedModalLink.lockType === 'code' && 'Enter the secret access code to unlock.'}
                {lockedModalLink.lockType === 'password' && 'Enter password to access this protected link.'}
                {lockedModalLink.lockType === 'dob' && 'Age verification required. Confirm your birth date.'}
                {lockedModalLink.lockType === 'sensitive' && '18+ Sensitive content warning disclaimer.'}
              </p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-3 pt-1">
              {(lockedModalLink.lockType === 'code' || lockedModalLink.lockType === 'password') && (
                <input
                  type={lockedModalLink.lockType === 'password' ? 'password' : 'text'}
                  value={unlockInput}
                  onChange={e => setUnlockInput(e.target.value)}
                  placeholder={lockedModalLink.lockType === 'password' ? 'Enter password...' : 'Enter access code...'}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:border-purple-600 rounded-xl text-sm outline-none font-medium"
                  autoFocus
                />
              )}

              {lockedModalLink.lockType === 'subscribe' && (
                <input
                  type="email"
                  value={unlockInput}
                  onChange={e => setUnlockInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:border-purple-600 rounded-xl text-sm outline-none font-medium"
                  autoFocus
                />
              )}

              {lockedModalLink.lockType === 'dob' && (
                <input
                  type="date"
                  value={unlockInput}
                  onChange={e => setUnlockInput(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 focus:border-purple-600 rounded-xl text-sm outline-none font-medium"
                  autoFocus
                />
              )}

              {lockedModalLink.lockType === 'sensitive' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium text-left">
                  ⚠️ Warning: This link contains adult or sensitive material. By clicking Unlock, you confirm you are 18 years of age or older.
                </div>
              )}

              {unlockError && (
                <p className="text-xs font-bold text-red-600 animate-shake">{unlockError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                Unlock Link & Continue &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── LINKTREE VIDEO LIGHTBOX MODAL ── */}
      {activeVideoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveVideoModal(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-white">
              <div className="flex items-center gap-2 min-w-0 pr-4">
                <YouTubeIcon size={18} className="text-red-600 fill-red-600 shrink-0" />
                <h3 className="font-bold text-sm truncate">{activeVideoModal.text || 'YouTube Video'}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Embedded Video iFrame */}
            <div className="w-full aspect-video bg-black relative">
              <iframe
                src={`${getEmbedIframeUrl(activeVideoModal.embedUrl || activeVideoModal.url || '')}?autoplay=1${activeVideoModal.videoMute ? '&mute=1' : ''}`}
                title={activeVideoModal.text || 'Video Embed Modal'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE GALLERY BOTTOM SHEET ── */}
      {activeGallery && (
        <div
          className="fixed inset-0 z-[60] flex flex-col justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onClick={() => setActiveGallery(null)}
        >
          {/* Sheet container — slides up */}
          <div
            className="relative w-full rounded-t-3xl overflow-hidden flex flex-col"
            style={{
              maxHeight: '92vh',
              background: '#fff',
              animation: 'gallery-sheet-in 0.35s cubic-bezier(0.32,0.72,0,1) both',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-9 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-gray-900 truncate">{activeGallery.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Gallery · {activeGallery.photos.length} photo{activeGallery.photos.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {activeGallery.ctaUrl && (
                  <a
                    href={ensureAbsoluteUrl(activeGallery.ctaUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Share"
                    onClick={() => trackClick(activeGallery.title)}
                  >
                    <Share2 size={18} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveGallery(null)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable photo list */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">
              {activeGallery.photos.map((photo, i) => (
                <div key={photo.id || i} className="w-full">
                  {/* Photo */}
                  <div className="w-full rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                    {photo.targetUrl ? (
                      <a href={ensureAbsoluteUrl(photo.targetUrl)} target="_blank" rel="noopener noreferrer">
                        <img
                          src={photo.url}
                          alt={photo.title || ''}
                          className="w-full h-auto object-cover"
                          style={{ display: 'block' }}
                        />
                      </a>
                    ) : (
                      <img
                        src={photo.url}
                        alt={photo.title || ''}
                        className="w-full h-auto object-cover"
                        style={{ display: 'block' }}
                      />
                    )}
                  </div>
                  {/* Title / description */}
                  {(photo.title || photo.description) && (
                    <div className="mt-2 px-1">
                      {photo.title && (
                        <p className="text-sm font-extrabold text-gray-900 leading-snug">{photo.title}</p>
                      )}
                      {photo.description && (
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{photo.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* CTA button inside sheet */}
              {activeGallery.ctaLabel && activeGallery.ctaUrl && (
                <a
                  href={ensureAbsoluteUrl(activeGallery.ctaUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center font-extrabold text-sm rounded-2xl bg-gray-900 text-white shadow-md hover:bg-black transition-colors"
                >
                  {activeGallery.ctaLabel} →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MUSIC BOTTOM SHEET MODAL (Linktree Official UI - Screenshot Match) ── */}
      {/* ── MUSIC BOTTOM SHEET MODAL ── */}
      {activeMusicSheetLink && (
        <MusicSheetModal
          link={activeMusicSheetLink}
          onClose={() => setActiveMusicSheetLink(null)}
        />
      )}

      {/* Keyframe for sheet slide-up */}
      <style>{`
        @keyframes gallery-sheet-in {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>

    </div>
  )
}
