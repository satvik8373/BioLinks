export type LinkType = 
  | 'link'
  | 'header'
  | 'text'
  | 'social'
  | 'shop'
  | 'music'
  | 'video'
  | 'contact'
  | 'event'
  | 'payment'
  | 'booking'
  | 'form'
  | 'nft'

export interface LinkItem {
  id: string
  type: LinkType
  text: string
  url: string
  icon: string // Official icon identifier: 'instagram', 'youtube', 'spotify', 'website', etc.
  isVisible: boolean
  platform?: string
  description?: string
  
  // Layout & Display
  layout?: 'classic' | 'featured' | 'compact'
  isPinned?: boolean
  priority?: number
  prioritizeMode?: 'none' | 'animate' | 'redirect'
  
  // Collection Grouping
  groupId?: string
  isGroupHeader?: boolean
  groupTitle?: string
  collectionLayout?: 'stack' | 'grid' | 'carousel' | 'showcase'
  
  // Scheduling
  scheduleStart?: string // ISO date/time string
  scheduleEnd?: string   // ISO date/time string
  isScheduled?: boolean
  scheduleNotify?: boolean
  scheduleTimezone?: string

  // Lock / Gate
  isLocked?: boolean
  lockType?: 'subscribe' | 'code' | 'password' | 'dob' | 'sensitive'
  lockValue?: string
  
  // Video / YouTube Settings
  videoClickOption?: 'display_video' | 'open_youtube' | 'open_latest' | 'display_latest'
  videoMute?: boolean
  price?: string
  currency?: string
  originalPrice?: string
  stockStatus?: 'in-stock' | 'out-of-stock' | 'limited'
  
  // Contact
  contactType?: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'address'
  contactValue?: string
  
  // Event
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  
  // Media / Embeds
  thumbnail?: string
  embedUrl?: string
  autoPlay?: boolean
  
  // Payment / Tip Jar
  paymentType?: 'stripe' | 'paypal' | 'venmo' | 'cashapp' | 'tip' | 'donation'
  paymentAmount?: string
  paymentCurrency?: string
  
  // Booking / Calendar
  bookingUrl?: string
  bookingDuration?: string
  bookingProvider?: 'calendly' | 'cal.com' | 'acuity' | 'custom'
  
  // Form
  formType?: 'contact' | 'survey' | 'email-capture' | 'custom'
  formFields?: Array<{ name: string; type: string; required: boolean }>
  formAction?: string
  
  // NFT
  nftContract?: string
  nftChain?: 'ethereum' | 'polygon' | 'solana' | 'base'
  nftPrice?: string
  nftImage?: string
}

export interface LinkCategory {
  id: string
  label: string
  description: string
  iconName: string
}

export interface LinkOption {
  id: string
  type: LinkType
  platform?: string
  label: string
  description: string
  icon: string // Official icon key name
  defaultText: string
  defaultUrl?: string
  defaultLayout?: 'classic' | 'featured' | 'compact'
  defaultFields?: Partial<LinkItem>
}

export const LINK_CATEGORIES: LinkCategory[] = [
  { id: 'suggested', label: 'Suggested', description: 'Popular features and shortcuts', iconName: 'Sparkles' },
  { id: 'social', label: 'Social & Bio', description: 'Connect your social media channels', iconName: 'Share2' },
  { id: 'shop', label: 'Shop & Monetize', description: 'Sell products and accept payments', iconName: 'ShoppingBag' },
  { id: 'media', label: 'Music & Video', description: 'Embed players, tracks, and videos', iconName: 'Video' },
  { id: 'contact', label: 'Contact & Connect', description: 'Email, phone, WhatsApp & forms', iconName: 'Phone' },
  { id: 'events', label: 'Events & Booking', description: 'Schedule appointments and events', iconName: 'Calendar' },
  { id: 'content', label: 'Headers & Text', description: 'Organize your bio page with sections', iconName: 'Type' },
]

export const QUICK_TILES = [
  { id: 'url', type: 'link' as LinkType, label: 'Add URL', iconName: 'Globe', iconKey: 'website', text: 'My Website' },
  { id: 'header', type: 'header' as LinkType, label: 'Header', iconName: 'Type', iconKey: 'type', text: 'New Section' },
  { id: 'shop', type: 'shop' as LinkType, label: 'Product', iconName: 'ShoppingBag', iconKey: 'shopify', text: 'Featured Product' },
  { id: 'youtube', type: 'video' as LinkType, label: 'YouTube', iconName: 'Video', iconKey: 'youtube', text: 'Watch Video' },
  { id: 'spotify', type: 'music' as LinkType, label: 'Spotify', iconName: 'Music', iconKey: 'spotify', text: 'Listen on Spotify' },
  { id: 'whatsapp', type: 'contact' as LinkType, label: 'WhatsApp', iconName: 'MessageCircle', iconKey: 'whatsapp', text: 'Chat on WhatsApp' },
  { id: 'tip', type: 'payment' as LinkType, label: 'Tip Jar', iconName: 'DollarSign', iconKey: 'dollar-sign', text: 'Support My Work' },
  { id: 'booking', type: 'booking' as LinkType, label: 'Book Call', iconName: 'Calendar', iconKey: 'calendar', text: 'Schedule a Meeting' },
]

export const LINK_OPTIONS: Record<string, LinkOption[]> = {
  suggested: [
    { id: 'url', type: 'link', label: 'Standard Link', description: 'Link to any website or URL', icon: 'website', defaultText: 'Visit My Website' },
    { id: 'header', type: 'header', label: 'Header Title', description: 'Section divider header text', icon: 'type', defaultText: 'My Links' },
    { id: 'shop', type: 'shop', label: 'Digital Product', description: 'Sell items with price tag and buy link', icon: 'shopify', defaultText: 'Exclusive Digital Guide', defaultFields: { price: '19.99', currency: '$', stockStatus: 'in-stock', layout: 'featured' } },
    { id: 'youtube', type: 'video', platform: 'youtube', label: 'YouTube Video', description: 'Embed responsive video player', icon: 'youtube', defaultText: 'Check out my latest video', defaultFields: { layout: 'featured' } },
    { id: 'spotify', type: 'music', platform: 'spotify', label: 'Spotify Track / Album', description: 'Embed audio player widget', icon: 'spotify', defaultText: 'Listen on Spotify', defaultFields: { layout: 'featured' } },
  ],
  social: [
    { id: 'instagram', type: 'social', platform: 'instagram', label: 'Instagram Profile', description: 'Direct link to Instagram profile', icon: 'instagram', defaultText: 'Follow on Instagram' },
    { id: 'tiktok', type: 'social', platform: 'tiktok', label: 'TikTok Account', description: 'Link to your TikTok feed', icon: 'tiktok', defaultText: 'Watch on TikTok' },
    { id: 'twitter', type: 'social', platform: 'twitter', label: 'X / Twitter Profile', description: 'Link to your X profile', icon: 'twitter', defaultText: 'Follow on X' },
    { id: 'github', type: 'social', platform: 'github', label: 'GitHub Repositories', description: 'Showcase your code projects', icon: 'github', defaultText: 'Star on GitHub' },
    { id: 'linkedin', type: 'social', platform: 'linkedin', label: 'LinkedIn Profile', description: 'Connect professionally', icon: 'linkedin', defaultText: 'Connect on LinkedIn' },
  ],
  shop: [
    { id: 'shop-item', type: 'shop', label: 'Shop Product Card', description: 'Product with price, strike price & stock badge', icon: 'shopify', defaultText: 'Product Name', defaultFields: { price: '29.00', currency: '$', stockStatus: 'in-stock', layout: 'featured' } },
    { id: 'tip-jar', type: 'payment', label: 'Support / Tip Jar', description: 'Accept tips & donations from fans', icon: 'dollar-sign', defaultText: 'Buy Me a Coffee', defaultFields: { paymentType: 'tip', paymentAmount: '5.00', paymentCurrency: '$' } },
    { id: 'stripe', type: 'payment', label: 'Stripe Checkout', description: 'Direct link to Stripe payment page', icon: 'payment', defaultText: 'Pay via Stripe', defaultFields: { paymentType: 'stripe' } },
    { id: 'paypal', type: 'payment', label: 'PayPal Me', description: 'Direct link to PayPal', icon: 'payment', defaultText: 'Pay via PayPal', defaultFields: { paymentType: 'paypal' } },
  ],
  media: [
    { id: 'youtube', type: 'video', platform: 'youtube', label: 'YouTube Player', description: 'Embed YouTube video player', icon: 'youtube', defaultText: 'Watch on YouTube', defaultFields: { layout: 'featured' } },
    { id: 'vimeo', type: 'video', platform: 'vimeo', label: 'Vimeo Video', description: 'Embed Vimeo video player', icon: 'video', defaultText: 'Watch on Vimeo', defaultFields: { layout: 'featured' } },
    { id: 'spotify', type: 'music', platform: 'spotify', label: 'Spotify Embed', description: 'Play music directly on your page', icon: 'spotify', defaultText: 'Listen on Spotify', defaultFields: { layout: 'featured' } },
    { id: 'soundcloud', type: 'music', platform: 'soundcloud', label: 'SoundCloud Audio', description: 'Embed SoundCloud track or playlist', icon: 'soundcloud', defaultText: 'Listen on SoundCloud', defaultFields: { layout: 'featured' } },
    { id: 'apple-music', type: 'music', platform: 'apple-music', label: 'Apple Music Track', description: 'Embed Apple Music song player', icon: 'apple-music', defaultText: 'Stream on Apple Music', defaultFields: { layout: 'featured' } },
  ],
  contact: [
    { id: 'contact-email', type: 'contact', label: 'Email Contact', description: 'Tap to send email directly', icon: 'email', defaultText: 'Send me an Email', defaultFields: { contactType: 'email' } },
    { id: 'contact-whatsapp', type: 'contact', label: 'WhatsApp Direct Chat', description: 'Tap to open WhatsApp chat', icon: 'whatsapp', defaultText: 'Chat on WhatsApp', defaultFields: { contactType: 'whatsapp' } },
    { id: 'contact-telegram', type: 'contact', label: 'Telegram Channel/Chat', description: 'Open Telegram conversation', icon: 'telegram', defaultText: 'Message on Telegram', defaultFields: { contactType: 'telegram' } },
    { id: 'contact-phone', type: 'contact', label: 'Call Phone Number', description: 'Tap to place direct phone call', icon: 'phone', defaultText: 'Call Me Directly', defaultFields: { contactType: 'phone' } },
  ],
  events: [
    { id: 'booking-calendly', type: 'booking', label: 'Calendly Appointment', description: 'Schedule meetings seamlessly', icon: 'calendar', defaultText: 'Book a 30-min Call', defaultFields: { bookingProvider: 'calendly', bookingDuration: '30 mins' } },
    { id: 'event-card', type: 'event', label: 'Live Event / Concert', description: 'Promote upcoming date & venue', icon: 'event', defaultText: 'Live Tour Concert', defaultFields: { eventDate: '2026-09-15', eventLocation: 'Main Arena' } },
  ],
  content: [
    { id: 'section-header', type: 'header', label: 'Section Header', description: 'Clean text divider title', icon: 'type', defaultText: 'Featured Content' },
    { id: 'text-note', type: 'text', label: 'Announcement / Note', description: 'Highlight text message or bio notice', icon: 'text', defaultText: 'Welcome to my official link tree!' },
  ],
}

/**
 * Smart URL Auto-Detector
 * Given a URL input string, detects platform, type, title, and initial configuration.
 */
export function detectLinkTypeFromUrl(inputUrl: string): Partial<LinkItem> | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null
  const url = inputUrl.trim()
  if (!url) return null

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return {
      type: 'video',
      platform: 'youtube',
      text: 'Watch on YouTube',
      url: url,
      icon: 'youtube',
      layout: 'featured',
    }
  }

  // Spotify
  if (url.includes('spotify.com')) {
    return {
      type: 'music',
      platform: 'spotify',
      text: 'Listen on Spotify',
      url: url,
      icon: 'spotify',
      layout: 'featured',
    }
  }

  // SoundCloud
  if (url.includes('soundcloud.com')) {
    return {
      type: 'music',
      platform: 'soundcloud',
      text: 'Listen on SoundCloud',
      url: url,
      icon: 'soundcloud',
      layout: 'featured',
    }
  }

  // TikTok
  if (url.includes('tiktok.com')) {
    return {
      type: 'social',
      platform: 'tiktok',
      text: 'Watch on TikTok',
      url: url,
      icon: 'tiktok',
    }
  }

  // Instagram
  if (url.includes('instagram.com')) {
    return {
      type: 'social',
      platform: 'instagram',
      text: 'Follow on Instagram',
      url: url,
      icon: 'instagram',
    }
  }

  // Twitter / X
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return {
      type: 'social',
      platform: 'twitter',
      text: 'Follow on X',
      url: url,
      icon: 'twitter',
    }
  }

  // GitHub
  if (url.includes('github.com')) {
    return {
      type: 'social',
      platform: 'github',
      text: 'Check GitHub',
      url: url,
      icon: 'github',
    }
  }

  // LinkedIn
  if (url.includes('linkedin.com')) {
    return {
      type: 'social',
      platform: 'linkedin',
      text: 'Connect on LinkedIn',
      url: url,
      icon: 'linkedin',
    }
  }

  // WhatsApp
  if (url.includes('wa.me') || url.includes('whatsapp.com')) {
    return {
      type: 'contact',
      platform: 'whatsapp',
      contactType: 'whatsapp',
      text: 'Chat on WhatsApp',
      url: url,
      icon: 'whatsapp',
    }
  }

  // Calendly / Cal.com
  if (url.includes('calendly.com') || url.includes('cal.com')) {
    return {
      type: 'booking',
      platform: 'calendly',
      bookingProvider: url.includes('cal.com') ? 'cal.com' : 'calendly',
      bookingUrl: url,
      text: 'Book an Appointment',
      url: url,
      icon: 'calendar',
    }
  }

  // Standard Web Link fallback
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace('www.', '')
    const capitalized = domain.charAt(0).toUpperCase() + domain.slice(1)
    return {
      type: 'link',
      text: capitalized,
      url: url.startsWith('http') ? url : `https://${url}`,
      icon: 'website',
    }
  } catch (e) {
    return {
      type: 'link',
      text: 'Custom Link',
      url: url,
      icon: 'website',
    }
  }
}

/**
 * Smart Social URL Formatter
 * Formats a username or handle into a full platform URL
 */
export function formatSocialUrl(platform: string, input: string): string {
  if (!input) return ''
  const trimmed = input.trim()
  if (!trimmed) return ''

  // If already full URL, return as-is
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed) || /^tel:/i.test(trimmed)) {
    return trimmed
  }

  const cleanHandle = trimmed.replace(/^@/, '')

  switch (platform.toLowerCase()) {
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`
    case 'twitter':
    case 'x':
      return `https://twitter.com/${cleanHandle}`
    case 'facebook':
      return `https://facebook.com/${cleanHandle}`
    case 'linkedin':
      return `https://linkedin.com/in/${cleanHandle}`
    case 'youtube':
      return `https://youtube.com/@${cleanHandle}`
    case 'tiktok':
      return `https://tiktok.com/@${cleanHandle}`
    case 'github':
      return `https://github.com/${cleanHandle}`
    case 'discord':
      return trimmed.includes('discord.gg') ? `https://${trimmed}` : `https://discord.gg/${cleanHandle}`
    case 'twitch':
      return `https://twitch.tv/${cleanHandle}`
    case 'spotify':
      return trimmed.includes('open.spotify.com') ? `https://${trimmed}` : `https://open.spotify.com/artist/${cleanHandle}`
    case 'whatsapp':
      return `https://wa.me/${trimmed.replace(/\D/g, '')}`
    case 'telegram':
      return `https://t.me/${cleanHandle}`
    case 'soundcloud':
      return `https://soundcloud.com/${cleanHandle}`
    case 'email':
      return `mailto:${trimmed}`
    case 'phone':
      return `tel:${trimmed}`
    default:
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
  }
}

