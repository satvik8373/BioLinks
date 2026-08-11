// Theme-adaptable Service Icons (inherits theme text/icon color or custom brand color)
import React from 'react'

export interface IconProps {
  className?: string
  size?: number
  color?: string
  fill?: string
  style?: React.CSSProperties
}

// ── Instagram Icon ──
export const InstagramIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || fill || 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

// ── TikTok Icon ──
export const TikTokIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

// ── YouTube Icon ──
export const YouTubeIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

// ── Gallery Icon ──
export const GalleryIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || fill || 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

// ── Spotify Icon ──
export const SpotifyIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

// ── Apple Music Icon ──
export const AppleMusicIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
  </svg>
)

// ── SoundCloud Icon ──
export const SoundCloudIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M1.175 12.225c-.051 0-.094.046-.101.105l-.233 2.154.233 2.105c.007.059.05.104.101.104.05 0 .093-.045.101-.104l.262-2.105-.262-2.154c-.008-.059-.051-.105-.101-.105zm1.49.876c-.05 0-.093.047-.101.107l-.191 1.278.191 1.232c.008.06.051.107.101.107.05 0 .094-.047.102-.107l.218-1.232-.218-1.278c-.008-.06-.052-.107-.102-.107zm1.49-1.639c-.05 0-.094.048-.102.109l-.218 2.917.218 2.845c.008.061.052.108.102.108.05 0 .094-.047.102-.108l.246-2.845-.246-2.917c-.008-.061-.052-.109-.102-.109zm1.49-1.639c-.05 0-.094.049-.102.11l-.218 4.556.218 4.435c.008.061.052.11.102.11.05 0 .094-.049.102-.11l.246-4.435-.246-4.556c-.008-.061-.052-.11-.102-.11z"/>
  </svg>
)

// ── TIDAL Icon ──
export const TidalIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M12 0L6 6l6 6 6-6-6-6zM0 12l6 6 6-6-6-6-6 6zm12 0l6 6 6-6-6-6-6 6zm-6 6l6 6 6-6-6-6-6 6z"/>
  </svg>
)

// ── YouTube Music Icon ──
export const YouTubeMusicIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={color || fill || 'currentColor'} strokeWidth="2" fill="none" />
    <polygon points="10,8 16,12 10,16" fill={color || fill || 'currentColor'} />
  </svg>
)

export const TwitterIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export const LinkedInIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
  </svg>
)

export const FacebookIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export const GitHubIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

export const WebsiteIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
)

export const EmailIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
)

export const PhoneIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
)

export const WhatsAppIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
)

export const TelegramIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

export const ShopifyIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M15.337 2.368c-.332-.066-.71-.066-1.113-.066-.377 0-.8.066-1.245.2-.133-.2-.31-.377-.533-.533C11.6 1.57 10.8 1.57 10.133 1.77c-.2.066-.4.133-.6.2L8.8 1.57c-.533-.2-1.2-.133-1.667.2-.533.377-.8 1-.8 1.667v.133c-.133.066-.266.133-.4.2-1.333.533-2.267 1.333-2.667 2.333-.333.8-.2 1.667.4 2.267.133.133.266.2.4.266v8.8c0 1.333 1.067 2.4 2.4 2.4h9.6c1.333 0 2.4-1.067 2.4-2.4V8.235c.133-.066.266-.133.4-.266.6-.6.733-1.467.4-2.267-.4-1-.933-1.8-2.267-2.333l-.065-.001z"/>
  </svg>
)

export const DiscordIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.445.865-.608 1.25-1.845-.276-3.68-.276-5.487 0-.164-.393-.406-.874-.618-1.25a.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.028C.533 9.046-.319 13.58.099 18.058a.082.082 0 00.031.056c2.053 1.508 4.041 2.423 5.993 3.029a.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.042-.106c-.653-.248-1.274-.55-1.872-.892a.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.078-.011c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.079.01c.12.099.246.198.373.292a.077.077 0 01-.007.128 12.299 12.299 0 01-1.873.891a.077.077 0 00-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 00.084.029c1.961-.607 3.95-1.522 6.002-3.029a.077.077 0 00.031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.029zM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.211 0 2.176 1.095 2.157 2.419 0 1.333-.956 2.419-2.157 2.419Z"/>
  </svg>
)

export const CustomLinkIcon = ({ className = "", size = 24, color, fill, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color || fill || 'currentColor'}
    style={style}
    className={className}
  >
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
)

export const LinkIcon = CustomLinkIcon

// Icon mapping object
const SERVICE_ICON_COMPONENTS = {
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  spotify: SpotifyIcon,
  github: GitHubIcon,
  website: WebsiteIcon,
  email: EmailIcon,
  phone: PhoneIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  'apple-music': AppleMusicIcon,
  soundcloud: SoundCloudIcon,
  tidal: TidalIcon,
  'youtube-music': YouTubeMusicIcon,
  gallery: GalleryIcon,
  shopify: ShopifyIcon,
  discord: DiscordIcon,
  'custom-link': CustomLinkIcon,
  link: LinkIcon,
}

// Helper component to render service icons adaptable to theme styling
export const ServiceIcon = ({ 
  iconId, 
  name,
  className = "", 
  size = 24,
  color,
  fill,
  style
}: { 
  iconId?: string
  name?: string
  className?: string
  size?: number 
  color?: string
  fill?: string
  style?: React.CSSProperties
}) => {
  const targetId = (iconId || name || 'link').toLowerCase()
  const IconComponent = SERVICE_ICON_COMPONENTS[targetId as keyof typeof SERVICE_ICON_COMPONENTS] || CustomLinkIcon
  return <IconComponent className={className} size={size} color={color} fill={fill} style={style} />
}