'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import { THEMES, getThemeById, formatAndNormalizeTheme, Theme, getEmbedIframeUrl } from '@/lib/themes'
import { getCardPublicUrl, getCleanUsernameSlug, getDisplayUrlSlug, getAccountUsername, resolveCardKey } from '@/lib/urlHelper'
import LinkListEditor from '@/components/editor/links/LinkListEditor'
import AddLinkModal from '@/components/editor/links/AddLinkModal'
import { LinkItem as TypedLinkItem, formatSocialUrl } from '@/lib/types/link'
import {
  InstagramIcon, TikTokIcon, YouTubeIcon, SpotifyIcon, TwitterIcon,
  FacebookIcon, LinkedInIcon, DiscordIcon, GitHubIcon, WhatsAppIcon,
  TelegramIcon, SoundCloudIcon, ShopifyIcon, EmailIcon, PhoneIcon,
  WebsiteIcon, AppleMusicIcon, ServiceIcon
} from '@/components/icons/ServiceIcons'
import { saveCard, saveUserProfile, uploadWallpaperFile } from '@/lib/storage'
import { detectPlatformFromUrl } from '@/lib/detectPlatform'
import BlockEditorDispatcher from '@/components/editor/blocks/BlockEditorDispatcher'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  GripVertical,
  Settings,
  Palette,
  Type,
  Link as LinkIcon,
  Share2,
  Image as ImageIcon,
  Layout,
  Smartphone,
  Globe,
  MapPin,
  ExternalLink,
  Play,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  EyeOff,
  RotateCcw,
  Undo2,
  Redo2,
  User,
  ShoppingBag,
  Instagram,
  BarChart3,
  Search,
  Sparkles,
  Copy,
  Zap,
  Sticker,
  Asterisk,
  Shuffle,
  Paintbrush,
  Dices,
  Pencil,
  Upload,
  Calendar,
  Download,
  Star,
  Video,
} from 'lucide-react'
import WallpaperPanel from '@/components/editor/wallpaper/WallpaperPanel'

interface LinkItem {
  id: string
  type: 'link' | 'header' | 'text' | 'social' | 'shop' | 'music' | 'video' | 'contact' | 'event' | 'payment' | 'booking' | 'form' | 'nft'
  text: string
  url: string
  icon: string
  isVisible: boolean
  platform?: string
  description?: string
  // Layout & Display
  layout?: 'classic' | 'featured' | 'compact'
  isPinned?: boolean
  priority?: number
  // Collection Grouping
  groupId?: string
  isGroupHeader?: boolean
  groupTitle?: string
  collectionLayout?: 'stack' | 'grid' | 'carousel' | 'showcase'
  videoClickOption?: 'display_video' | 'open_youtube' | 'open_latest' | 'display_latest'
  videoMute?: boolean
  // Scheduling
  scheduleStart?: string // ISO date
  scheduleEnd?: string   // ISO date
  isScheduled?: boolean
  // shop
  price?: string
  currency?: string
  originalPrice?: string
  stockStatus?: 'in-stock' | 'out-of-stock' | 'limited'
  // contact
  contactType?: 'email' | 'phone' | 'whatsapp' | 'telegram' | 'address'
  contactValue?: string
  // event
  eventDate?: string
  eventTime?: string
  eventLocation?: string
  // media
  thumbnail?: string
  embedUrl?: string
  autoPlay?: boolean
  // payment
  paymentType?: 'stripe' | 'paypal' | 'venmo' | 'cashapp' | 'tip' | 'donation'
  paymentAmount?: string
  paymentCurrency?: string
  // booking/calendar
  bookingUrl?: string
  bookingDuration?: string
  bookingProvider?: 'calendly' | 'cal.com' | 'acuity' | 'custom'
  // form
  formType?: 'contact' | 'survey' | 'email-capture' | 'custom'
  formFields?: Array<{ name: string; type: string; required: boolean }>
  formAction?: string
  // nft
  nftContract?: string
  nftChain?: 'ethereum' | 'polygon' | 'solana' | 'base'
  nftPrice?: string
  nftImage?: string
}

interface BioLinkConfig {
  theme: Theme
  profile: {
    avatar: string
    title: string
    handle?: string
    bio: string
    location?: string
    website?: string
    profession?: string
  }
  links: LinkItem[]
  socialLinks: {
    [key: string]: string
  }
  socialIconPosition?: 'top' | 'bottom'
}

export default function EditorPage() {
  const router = useRouter()
  const [config, setConfig] = useState<BioLinkConfig | null>(null)
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'profile' | 'background' | 'fonts' | 'buttons' | 'colors' | 'settings' | 'social' | 'shop' | 'seo' | 'analytics' | 'themes'>('links')
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAddLinkModal, setShowAddLinkModal] = useState(false)
  const [targetGroupId, setTargetGroupId] = useState<string | undefined>(undefined)
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean | string>>({})

  const handleOpenAddModal = (groupId?: string) => {
    setTargetGroupId(groupId)
    setShowAddLinkModal(true)
  }
  const [isEditingHandle, setIsEditingHandle] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<string>('')
  const [handleDraft, setHandleDraft] = useState('')
  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [handleError, setHandleError] = useState('')
  // Collapsible sidebar groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ myLinktree: true, tools: false })
  // Stable preview card ID — created once per editor session, reused for live preview
  const [previewCardId, setPreviewCardId] = useState<string>('')

  // Undo & Redo History Stacks
  const [pastConfigs, setPastConfigs] = useState<BioLinkConfig[]>([])
  const [futureConfigs, setFutureConfigs] = useState<BioLinkConfig[]>([])
  const isUndoRedoRef = useRef(false)
  const handleUndo = () => {
    if (pastConfigs.length === 0 || !config) return
    const previous = pastConfigs[pastConfigs.length - 1]
    const newPast = pastConfigs.slice(0, pastConfigs.length - 1)
    
    isUndoRedoRef.current = true
    setPastConfigs(newPast)
    setFutureConfigs(prev => [config, ...prev])
    setConfig(previous)
    
    // Immediately update localStorage
    try {
      localStorage.setItem('currentBioLinkConfig', JSON.stringify(previous))
    } catch (e) {
      console.error('Failed to save undo state to localStorage', e)
    }
    
    // Reset flag after state update
    setTimeout(() => { isUndoRedoRef.current = false }, 0)
  }

  const handleRedo = () => {
    if (futureConfigs.length === 0 || !config) return
    const next = futureConfigs[0]
    const newFuture = futureConfigs.slice(1)
    
    isUndoRedoRef.current = true
    setPastConfigs(prev => [...prev, config])
    setFutureConfigs(newFuture)
    setConfig(next)
    
    // Immediately update localStorage
    try {
      localStorage.setItem('currentBioLinkConfig', JSON.stringify(next))
    } catch (e) {
      console.error('Failed to save redo state to localStorage', e)
    }
    
    // Reset flag after state update
    setTimeout(() => { isUndoRedoRef.current = false }, 0)
  }

  // Keyboard shortcut listener for Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) {
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault()
          handleRedo()
        } else {
          e.preventDefault()
          handleUndo()
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pastConfigs, futureConfigs, config])

  const toggleGroup = (key: string) => setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }))

  const getCurrentUserId = () => {
    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      return profile.id || profile.uid || ''
    } catch {
      return ''
    }
  }

  const syncPreviewCard = async (cfg: BioLinkConfig, pid: string, previousHandle?: string) => {
    if (!pid || !cfg) return
    try {
      const handleSlug = resolveCardKey(cfg.profile?.handle, cfg.profile?.title) || pid
      const ownerId = getCurrentUserId()
      if (!ownerId) throw new Error('Sign in is required to save a username')

      const configPayload = {
        profile: cfg.profile,
        links: cfg.links,
        theme: cfg.theme,
        socialLinks: cfg.socialLinks,
      }

      const response = await fetch(`/api/cards/${handleSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: configPayload,
          handle: handleSlug,
          ownerId,
          previousHandle: previousHandle || (pid !== handleSlug ? pid : undefined),
        }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Could not claim this username')
      }

      const cardPayload = {
        id: handleSlug,
        handle: handleSlug,
        config: configPayload,
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString(),
      }
      await saveCard(handleSlug, cardPayload, {
        previousHandle: previousHandle || (pid !== handleSlug ? pid : undefined),
      })
    } catch (err) {
      console.error('Error syncing preview card:', err)
    }
  }

  // Rename account username URL — updates existing card, never creates a duplicate
  const applyHandleChange = async () => {
    if (!config || !handleDraft || handleStatus !== 'available') return
    const oldHandle = resolveCardKey(config.profile.handle, config.profile.title) || previewCardId
    const newHandle = handleDraft

    if (oldHandle === newHandle) {
      setIsEditingHandle(false)
      setHandleStatus('idle')
      setHandleError('')
      return
    }

    // Update account username in userProfile (URL is account-level, like Linktree)
    try {
      const profileStr = localStorage.getItem('userProfile')
      if (profileStr) {
        const profile = JSON.parse(profileStr)
        profile.username = newHandle
        localStorage.setItem('userProfile', JSON.stringify(profile))
        await saveUserProfile(profile)
      }
    } catch (err) {
      // Local storage still preserves the change if Firestore is unavailable.
      console.warn('Could not save username to Firestore:', err)
    }

    localStorage.setItem('editorPreviewCardId', newHandle)
    localStorage.setItem('activeBioCardId', newHandle)
    setPreviewCardId(newHandle)

    const nextConfig = {
      ...config,
      profile: { ...config.profile, handle: newHandle },
    }
    await syncPreviewCard(nextConfig, newHandle, oldHandle)
    // Keep the editor state and persisted config aligned with the active URL.
    setConfig(nextConfig)
    localStorage.setItem('currentBioLinkConfig', JSON.stringify(nextConfig))

    setIsEditingHandle(false)
    setHandleStatus('idle')
    setHandleError('')
  }

  useEffect(() => {
    const savedConfig = localStorage.getItem('currentBioLinkConfig')
    const profile = localStorage.getItem('userProfile')
    
    if (!savedConfig || !profile) {
      setLoading(false)
      router.push('/create')
      return
    }

    try {
      const parsedConfig = JSON.parse(savedConfig)
      const parsedProfile = JSON.parse(profile)
      const accountUsername = getCleanUsernameSlug(parsedProfile.username) || getAccountUsername()
      const handleSlug =
        resolveCardKey(parsedConfig.profile?.handle, parsedConfig.profile?.title) ||
        accountUsername ||
        'user'

      if (!parsedConfig.profile.handle && accountUsername) {
        parsedConfig.profile.handle = accountUsername
      }

      localStorage.setItem('editorPreviewCardId', handleSlug)
      localStorage.setItem('activeBioCardId', handleSlug)
      setPreviewCardId(handleSlug)
      setConfig(parsedConfig)
      setLoading(false)

      syncPreviewCard(parsedConfig, handleSlug).catch(err => {
        console.error('Error syncing initial preview:', err)
      })
    } catch (error) {
      console.error('Error loading config:', error)
      setLoading(false)
      router.push('/create')
    }
  }, [router])

  // updateConfig — accepts either a single path+value OR an array of {path, value}
  // pairs, applying ALL changes in one atomic setConfig call so no updates are lost.
  const updateConfig = (pathOrUpdates: string | Array<{ path: string; value: any }>, value?: any) => {
    if (!config) return

    // Don't save to history during undo/redo operations
    if (!isUndoRedoRef.current) {
      setPastConfigs(prev => [...prev, JSON.parse(JSON.stringify(config))].slice(-30))
      setFutureConfigs([])
    }

    const updates: Array<{ path: string; value: any }> = Array.isArray(pathOrUpdates)
      ? pathOrUpdates
      : [{ path: pathOrUpdates as string, value }]

    setConfig(prev => {
      if (!prev) return prev
      const newConfig: BioLinkConfig = JSON.parse(JSON.stringify(prev))
      for (const { path, value: val } of updates) {
        const keys = path.split('.')
        let current: any = newConfig
        for (let i = 0; i < keys.length - 1; i++) {
          if (current[keys[i]] === undefined || current[keys[i]] === null) current[keys[i]] = {}
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = val
      }
      return newConfig
    })
  }

  // Auto-save to localStorage whenever config changes
  useEffect(() => {
    if (!config) return

    try {
      localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))
    } catch (e: any) {
      console.warn('⚠️ QuotaExceededError saving config to localStorage, clearing cache...', e)
      try {
        localStorage.removeItem('ally-supports-cache')
        localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))
      } catch (err) {
        console.error('Could not save currentBioLinkConfig to localStorage:', err)
      }
    }

    syncPreviewCard(config, previewCardId).catch(err => {
      console.error('Error syncing preview:', err)
    })

    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, [config, previewCardId])

  const addLink = (preset?: Partial<TypedLinkItem>) => {
    if (!config) return

    const newLink: LinkItem = {
      id: Date.now().toString(),
      type: (preset?.type || 'link') as any,
      text: preset?.text || 'New Link',
      url: preset?.url || '',
      icon: preset?.icon || '🔗',
      isVisible: true,
      groupId: targetGroupId,
      platform: preset?.platform,
      description: preset?.description,
      layout: preset?.layout || 'classic',
      price: preset?.price,
      currency: preset?.currency,
      originalPrice: preset?.originalPrice,
      stockStatus: preset?.stockStatus,
      contactType: preset?.contactType,
      contactValue: preset?.contactValue,
      eventDate: preset?.eventDate,
      eventTime: preset?.eventTime,
      eventLocation: preset?.eventLocation,
      thumbnail: preset?.thumbnail,
      embedUrl: preset?.embedUrl,
      paymentType: preset?.paymentType,
      paymentAmount: preset?.paymentAmount,
      paymentCurrency: preset?.paymentCurrency,
      bookingProvider: preset?.bookingProvider,
      bookingDuration: preset?.bookingDuration,
      bookingUrl: preset?.bookingUrl,
    }

    let updatedLinks: LinkItem[]
    if (targetGroupId) {
      const headerIdx = config.links.findIndex(l => l.id === targetGroupId)
      if (headerIdx !== -1) {
        let lastChildIdx = headerIdx
        for (let i = headerIdx + 1; i < config.links.length; i++) {
          if (config.links[i].groupId === targetGroupId) {
            lastChildIdx = i
          }
        }
        updatedLinks = [...config.links]
        updatedLinks.splice(lastChildIdx + 1, 0, newLink)
      } else {
        updatedLinks = [...config.links, newLink]
      }
    } else {
      updatedLinks = [...config.links, newLink]
    }

    updateConfig('links', updatedLinks)
    setSelectedLinkId(newLink.id)
    setShowAddLinkModal(false)
    setTargetGroupId(undefined)
  }

  const removeLink = (id: string) => {
    if (!config) return
    updateConfig('links', config.links.filter(link => link.id !== id))
    if (selectedLinkId === id) {
      setSelectedLinkId(null)
    }
  }

  const toggleLinkVisibility = (id: string) => {
    if (!config) return
    const newLinks = config.links.map(link => 
      link.id === id ? { ...link, isVisible: !link.isVisible } : link
    )
    updateConfig('links', newLinks)
  }

  const updateLink = (id: string, field: string, value: any) => {
    if (!config) return
    const newLinks = config.links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    )
    updateConfig('links', newLinks)
  }

  const updateFullLink = (updatedLink: any) => {
    if (!config) return
    const newLinks = config.links.map(link => 
      link.id === updatedLink.id ? updatedLink : link
    )
    updateConfig('links', newLinks)
  }

  const reorderLinks = (fromIndex: number, toIndex: number) => {
    if (!config) return
    const newLinks = [...config.links]
    const [movedItem] = newLinks.splice(fromIndex, 1)
    newLinks.splice(toIndex, 0, movedItem)
    updateConfig('links', newLinks)
  }

  const saveBioLink = async () => {
    if (!config) return
    
    setIsSaving(true)
    setSaveError(null)

    try {
      const handleSlug = resolveCardKey(config.profile?.handle, config.profile?.title) || getAccountUsername() || 'user'
      const ownerId = getCurrentUserId()
      
      if (!ownerId) {
        throw new Error('You must be signed in to save your card. Please log in and try again.')
      }

      console.log('💾 Saving card under account username:', handleSlug)

      const cardPayload = {
        id: handleSlug,
        handle: handleSlug,
        config: {
          profile: config.profile,
          links: config.links,
          theme: config.theme,
          socialLinks: config.socialLinks,
        },
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString(),
      }

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: handleSlug,
          handle: handleSlug,
          config: cardPayload.config,
          analytics: cardPayload.analytics,
          ownerId,
          previousHandle: previewCardId !== handleSlug ? previewCardId : undefined,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Server error: ${response.status}. Please try again.`)
      }

      await saveCard(handleSlug, cardPayload, {
        previousHandle: previewCardId !== handleSlug ? previewCardId : undefined,
      })

      localStorage.setItem('editorPreviewCardId', handleSlug)
      localStorage.setItem('activeBioCardId', handleSlug)
      setPreviewCardId(handleSlug)
      localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))

      const cardUrl = getCardPublicUrl(handleSlug)
      console.log('✅ Card saved successfully! Public URL:', cardUrl)
      
      try {
        await navigator.clipboard.writeText(cardUrl)
      } catch (clipErr) {
        console.warn('Clipboard access denied, but save succeeded')
      }
      
      setShowShareModal(true)
      setIsSaving(false)
    } catch (error: any) {
      console.error('❌ Error saving bio link:', error)
      setSaveError(error.message || 'Failed to save your card. Please try again.')
      setIsSaving(false)
    }
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EEF0F8 0%, #E8E9F5 100%)' }}>
        <div className="text-center clay-card p-10 clay-pop-in">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25), 0 4px 0 #4F46E5, 0 8px 20px rgba(124,58,237,0.35)' }}>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
          </div>
          <p className="text-base font-extrabold text-slate-800 tracking-tight">Loading editor...</p>
          <p className="text-xs text-slate-400 font-medium mt-1">Preparing your workspace</p>
        </div>
      </div>
    )
  }

  // ── Design summary helpers ──
  const bgSummary = () => {
    const c = config.theme.colors
    const type = (c.backgroundType as string) || (
      c.backgroundVideo || c.backgroundIframe ? 'video' :
      c.backgroundImage ? 'image' :
      c.backgroundMesh ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
      c.backgroundGradient ? 'gradient' : 'fill'
    )
    if (type === 'gradient') return 'Gradient'
    if (type === 'image') return 'Image'
    if (type === 'video') return 'Video'
    if (type === 'blur') return 'Blur'
    if (type === 'pattern') return 'Pattern'
    return 'Fill'
  }
  const fontSummary = () => config.theme.fonts?.body?.split(',')[0]?.trim() || 'Default'
  const buttonSummary = () => {
    const s = config.theme.buttonStyle?.style ?? 'solid'
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  const themeSummary = () => config.theme.name || 'Custom'

  const isDesignTab = ['profile','themes','background','buttons','fonts','appearance','colors'].includes(activeTab)

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden" style={{ background: 'linear-gradient(170deg, #EEF0F8 0%, #E8E9F5 60%, #EBE8F8 100%)' }}>

      {/* ── Left Sidebar (Hidden on mobile, shown on tablet+) ── */}
      <aside className="hidden md:flex w-56 flex-col flex-shrink-0 clay-sidebar">

        {/* User profile row */}
        <div className="px-4 py-3.5 flex-shrink-0 flex items-center justify-between gap-2" style={{ borderBottom: '1.5px solid rgba(148,163,184,0.2)' }}>
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar src={config.profile.avatar} size="sm" fallback="user" />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </div>
            <span className="text-[11px] font-extrabold text-slate-800 truncate tracking-tight">
              {config.profile.title || 'My BioLink'}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={handleUndo} disabled={pastConfigs.length === 0} title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded-xl transition-all ${
                pastConfigs.length > 0
                  ? 'cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
              }`}
              style={pastConfigs.length > 0 ? { background: 'rgba(124,58,237,0.08)', color: '#7C3AED', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(124,58,237,0.08)' } : { background: 'rgba(148,163,184,0.08)', color: '#CBD5E1' }}>
              <Undo2 className="w-3 h-3" />
            </button>
            <button onClick={handleRedo} disabled={futureConfigs.length === 0} title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded-xl transition-all ${
                futureConfigs.length > 0
                  ? 'cursor-pointer'
                  : 'opacity-30 cursor-not-allowed'
              }`}
              style={futureConfigs.length > 0 ? { background: 'rgba(124,58,237,0.08)', color: '#7C3AED', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(124,58,237,0.08)' } : { background: 'rgba(148,163,184,0.08)', color: '#CBD5E1' }}>
              <Redo2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
          {[
            { id: 'links',      label: 'Links',     icon: LinkIcon, color: '#7C3AED' },
            { id: 'appearance', label: 'Design',    icon: Palette,  color: '#EC4899' },
            { id: 'analytics',  label: 'Analytics', icon: BarChart3, color: '#0EA5E9' },
            { id: 'settings',   label: 'Settings',  icon: Settings, color: '#10B981' },
          ].map(({ id, label, icon: Icon, color }) => {
            const isActive = (id === 'appearance' && isDesignTab) || (!isDesignTab && activeTab === id)
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id === 'appearance' ? 'appearance' : id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-extrabold transition-all clay-nav-item ${
                  isActive ? 'clay-nav-item-active' : 'clay-nav-item-idle'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive ? 'bg-white/20' : 'bg-white'
                }`}
                style={isActive ? {} : { boxShadow: `inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(15,23,42,0.06), 0 1.5px 0 rgba(148,163,184,0.2)` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : color }} />
                </div>
                <span className="tracking-tight">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex-shrink-0 p-3 space-y-2" style={{ borderTop: '1.5px solid rgba(148,163,184,0.2)' }}>
          <button
            type="button"
            onClick={saveBioLink}
            disabled={isSaving}
            className={`w-full py-2.5 px-4 text-white text-xs clay-save-btn flex items-center justify-center gap-2 ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Save & Share
              </>
            )}
          </button>
          
          {/* Error Message */}
          {saveError && (
            <div className="p-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)' }}>
              <p className="text-[10px] font-bold text-red-600 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                {saveError}
              </p>
              <button
                onClick={() => setSaveError(null)}
                className="text-[10px] text-red-500 hover:text-red-700 mt-1 underline font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!config) return
                const slug = getCleanUsernameSlug(config.profile?.handle || config.profile?.title) || 'user'
                const cardUrl = getCardPublicUrl(previewCardId, slug)
                window.open(cardUrl, '_blank')
                syncPreviewCard(config, previewCardId).catch(() => {})
              }}
              className="flex-1 py-2 px-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer clay-btn clay-btn-ghost"
            >
              <Eye className="w-3.5 h-3.5" style={{ color: '#7C3AED' }} />
              <span className="text-slate-700">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/my-cards')}
              className="flex-1 py-2 px-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              style={{ background: 'rgba(148,163,184,0.12)', color: '#64748B', border: '1.5px solid rgba(148,163,184,0.25)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 0 rgba(148,163,184,0.18)' }}
            >
              <X className="w-3.5 h-3.5 text-rose-400" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>


      {/* ── Middle Panel (Mobile Optimized) ── */}
      <main className="flex-1 overflow-hidden flex flex-col clay-main">
        
        {/* ── Top Mobile Header Bar ── */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <Avatar src={config.profile.avatar} size="sm" fallback="user" />
            <span className="text-sm font-bold text-slate-800 truncate max-w-[180px]">
              {config.profile.title || 'My BioLink'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!config) return
                await syncPreviewCard(config, previewCardId)
                const slug = getCleanUsernameSlug(config.profile?.handle || config.profile?.title) || 'user'
                const cardUrl = getCardPublicUrl(previewCardId, slug)
                window.location.href = cardUrl
              }}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 active:scale-95 transition-transform"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="max-w-3xl mx-auto p-4 sm:p-6">

            {/* LINKS */}
            {activeTab === 'links' && (
              <LinkListEditor
                links={config.links}
                socialLinks={config.socialLinks}
                socialIconPosition={config.socialIconPosition}
                profile={config.profile}
                selectedLinkId={selectedLinkId}
                setSelectedLinkId={setSelectedLinkId}
                onOpenAddModal={handleOpenAddModal}
                onAddCollection={() => {
                  const newGroupId = `group-${Date.now()}`
                  const newCollectionHeader: any = {
                    id: newGroupId,
                    type: 'header',
                    text: 'Add collection title',
                    url: '',
                    icon: 'folder',
                    isVisible: true,
                    isGroupHeader: true,
                    groupTitle: 'Add collection title',
                    groupId: newGroupId
                  }
                  const updatedLinks = [newCollectionHeader, ...config.links]
                  updateConfig([{ path: 'links', value: updatedLinks }])
                }}
                onUpdateLink={updateFullLink}
                onRemoveLink={removeLink}
                onToggleVisibility={toggleLinkVisibility}
                onReorderLinks={reorderLinks}
                onSetLinks={(newLinks) => updateConfig('links', newLinks)}
                onUpdateSocialLink={(platformId, url) => updateConfig(`socialLinks.${platformId}`, url)}
                onRemoveSocialLink={(platformId) => {
                  const updatedSocial = { ...(config.socialLinks || {}) }
                  delete updatedSocial[platformId]
                  delete updatedSocial[platformId.toLowerCase()]
                  const updatedLinks = (config.links || []).filter(l => {
                    const p = (l.platform || l.icon || '').toLowerCase()
                    return p !== platformId.toLowerCase()
                  })
                  updateConfig([
                    { path: 'socialLinks', value: updatedSocial },
                    { path: 'links', value: updatedLinks },
                  ])
                }}
                onUpdateSocialPosition={(pos) => updateConfig('socialIconPosition', pos)}
                onUpdateProfile={(field, value) => updateConfig(`profile.${field}`, value)}
              />
            )}

            {/* DESIGN INDEX — Linktree-style clickable row list */}
            {activeTab === 'appearance' && (
              <DesignIndexPanel
                config={config}
                bgSummary={bgSummary()}
                fontSummary={fontSummary()}
                buttonSummary={buttonSummary()}
                themeSummary={themeSummary()}
                onNavigate={(tab) => setActiveTab(tab as any)}
              />
            )}

            {/* DESIGN TOOL PANELS */}
            {isDesignTab && activeTab !== 'appearance' && (
              <div className="space-y-5">
                {activeTab === 'profile'    && <ProfilePanel    config={config} updateConfig={updateConfig} onBack={() => setActiveTab('appearance')} />}
                {activeTab === 'themes'     && <ThemesPanel     config={config} updateConfig={updateConfig} onBack={() => setActiveTab('appearance')} />}
                {activeTab === 'background' && <WallpaperPanel config={config} updateConfig={updateConfig} onBack={() => setActiveTab('appearance')} />}
                {activeTab === 'buttons'    && <ButtonsPanel    config={config} updateConfig={updateConfig} onBack={() => setActiveTab('appearance')} />}
                {activeTab === 'fonts'      && <FontsPanel      config={config} updateConfig={updateConfig} onBack={() => setActiveTab('appearance')} />}
                {activeTab === 'colors'     && <ColorsPanel     config={config} updateConfig={updateConfig} onBack={() => setActiveTab('appearance')} />}
              </div>
            )}

            {/* OTHER PANELS */}
            {activeTab === 'settings'  && <SettingsPanel    config={config} updateConfig={updateConfig} />}
            {activeTab === 'social'    && <SocialMediaPanel config={config} updateConfig={updateConfig} />}
            {activeTab === 'shop'      && <ShopPanel config={config} updateConfig={updateConfig} onOpenAddModal={() => setShowAddLinkModal(true)} />}
            {activeTab === 'seo'       && <SEOPanel         config={config} updateConfig={updateConfig} />}
            {activeTab === 'analytics' && <AnalyticsPanel   config={config} />}

          </div>
        </div>
      </main>



        {/* Right Panel - Live Preview (Always Visible with Share URL) */}
        <aside className="hidden lg:flex w-[380px] flex-col items-center flex-shrink-0 overflow-hidden py-6 px-4 clay-right-panel">

          {/* ── Bezel-less Floating Mobile Card Screen ── */}
          <div className="w-[270px] mb-5 flex-shrink-0">
            {isEditingHandle ? (
              <div className="bg-white border border-indigo-300 rounded-2xl px-3.5 py-2.5 shadow-sm ring-2 ring-indigo-500/10 space-y-2">
                {/* Input row */}
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 select-none flex-shrink-0">biolink.ee/</span>
                  <input
                    type="text"
                    autoFocus
                    value={handleDraft}
                    onChange={async (e) => {
                      const raw = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      setHandleDraft(raw)
                      if (!raw || raw.length < 3) {
                        setHandleStatus(raw.length > 0 ? 'invalid' : 'idle')
                        setHandleError(raw.length > 0 ? 'At least 3 characters' : '')
                        return
                      }
                      if (raw.length > 30) {
                        setHandleStatus('invalid')
                        setHandleError('Max 30 characters')
                        return
                      }
                      setHandleStatus('checking')
                      setHandleError('')
                      try {
                        // previewCardId is the authoritative current username. The
                        // config can briefly contain the pre-rename handle while
                        // React state is updating.
                        const excludeId = previewCardId || resolveCardKey(config.profile?.handle, config.profile?.title) || ''
                        const ownerId = getCurrentUserId()
                        const res = await fetch(`/api/cards/check-handle?handle=${raw}&excludeId=${excludeId}&ownerId=${ownerId}`, { cache: 'no-store' })
                        const data = await res.json()
                        if (data.available) {
                          setHandleStatus('available')
                          setHandleError('')
                        } else {
                          setHandleStatus(data.reason?.includes('characters') || data.reason?.includes('letters') || data.reason?.includes('reserved') ? 'invalid' : 'taken')
                          setHandleError(data.reason || 'Not available')
                        }
                      } catch {
                        setHandleStatus('idle')
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={async (e) => {
                      if (e.key === 'Escape') {
                        setIsEditingHandle(false)
                        setHandleStatus('idle')
                        setHandleError('')
                      }
                      if (e.key === 'Enter' && handleStatus === 'available') {
                        await applyHandleChange()
                      }
                    }}
                    className="flex-1 min-w-0 text-xs font-bold text-slate-900 bg-transparent outline-none border-none p-0 focus:ring-0"
                    placeholder="your-handle"
                  />
                  {/* Status icon */}
                  {handleStatus === 'checking' && <span className="text-[10px] text-slate-400 flex-shrink-0 animate-pulse">…</span>}
                  {handleStatus === 'available' && <span className="text-emerald-500 flex-shrink-0 text-[10px] font-bold">✓</span>}
                  {(handleStatus === 'taken' || handleStatus === 'invalid') && <span className="text-rose-500 flex-shrink-0 text-[10px] font-bold">✕</span>}
                </div>

                {/* Error / hint */}
                {handleError && (
                  <p className={`text-[10px] font-semibold px-0.5 ${handleStatus === 'available' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {handleError}
                  </p>
                )}
                {handleStatus === 'available' && !handleError && (
                  <p className="text-[10px] font-semibold text-emerald-600 px-0.5">Available!</p>
                )}

                {/* Confirm / Cancel */}
                <div className="flex gap-2 pt-0.5">
                  <button
                    disabled={handleStatus !== 'available'}
                    onClick={applyHandleChange}
                    className="flex-1 text-[11px] font-bold py-1.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => { setIsEditingHandle(false); setHandleStatus('idle'); setHandleError('') }}
                    className="flex-1 text-[11px] font-bold py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  setHandleDraft((config.profile.handle || config.profile.title || '').toLowerCase().replace(/[^a-z0-9-]/g, ''))
                  setHandleStatus('idle')
                  setHandleError('')
                  setIsEditingHandle(true)
                }}
                className="clay-url-pill px-4 py-2 flex items-center justify-between cursor-pointer"
                title="Click to edit URL handle"
              >
                <span className="text-[11px] font-bold text-slate-600 truncate mr-2 flex-1">
                  biolink.ee/<span className="text-slate-900">{getDisplayUrlSlug(config.profile.handle || config.profile.title)}</span>
                </span>
                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.08)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
                  <Pencil className="w-2.5 h-2.5 text-violet-500" />
                </div>
              </div>
            )}
          </div>

          {/* ── Bezel-less Floating Mobile Card Screen ── */}
          <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
            <div 
              className="relative flex-shrink-0 overflow-hidden transition-all duration-300 clay-preview-shell"
              style={{
                width: 268,
                height: 518,
                borderRadius: 34,
              }}
            >
              <BioLinkPreview config={config} />
            </div>
          </div>

          {/* Active Links Count */}
          <div className="pt-3 text-center flex-shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(148,163,184,0.25)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(15,23,42,0.05)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 4px rgba(52,211,153,0.6)' }} />
              <p className="text-[10px] font-extrabold text-slate-500 tracking-tight">
                {config.links.filter(l => l.isVisible !== false).length} active links
              </p>
            </div>
          </div>
        </aside>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 safe-area-bottom z-50">
        <div className="flex items-center justify-around px-4 py-3">
          {[
            { id: 'links', label: 'Links', icon: LinkIcon, color: '#7C3AED' },
            { id: 'appearance', label: 'Design', icon: Palette, color: '#EC4899' },
            { id: 'preview', label: 'Preview', icon: Eye, color: '#0EA5E9' },
            { id: 'settings', label: 'Settings', icon: Settings, color: '#10B981' },
          ].map(({ id, label, icon: Icon, color }) => {
            if (id === 'preview') {
              return (
                <button
                  key={id}
                  onClick={async () => {
                    if (!config) return
                    await syncPreviewCard(config, previewCardId)
                    const slug = getCleanUsernameSlug(config.profile?.handle || config.profile?.title) || 'user'
                    const cardUrl = getCardPublicUrl(previewCardId, slug)
                    window.location.href = cardUrl
                  }}
                  className="flex flex-col items-center gap-1 min-w-[64px] py-1 active:scale-95 transition-transform"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: '#F1F5F9' }}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      style={{ color: color }} 
                    />
                  </div>
                  <span className="text-[10px] font-bold tracking-tight text-slate-500">
                    {label}
                  </span>
                </button>
              )
            }
            
            const isActive = (id === 'appearance' && isDesignTab) || (!isDesignTab && activeTab === id)
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id === 'appearance' ? 'appearance' : id as any)}
                className="flex flex-col items-center gap-1 min-w-[64px] py-1 active:scale-95 transition-transform"
              >
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={isActive 
                    ? { background: color, boxShadow: `0 2px 8px ${color}40` }
                    : { background: '#F1F5F9' }
                  }
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isActive ? '#ffffff' : color }} 
                  />
                </div>
                <span 
                  className={`text-[10px] font-bold tracking-tight ${
                    isActive ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── Mobile Save Button (Floating) ── */}
      <button
        onClick={saveBioLink}
        disabled={isSaving}
        className={`md:hidden fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg flex items-center justify-center active:scale-95 transition-all ${
          isSaving ? 'opacity-70' : ''
        }`}
        style={{ boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}
      >
        {isSaving ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Share2 className="w-6 h-6" />
        )}
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <AddLinkModal
          onClose={() => {
            setShowAddLinkModal(false)
            setTargetGroupId(undefined)
          }}
          onAdd={addLink}
        />
      )}
    </div>
  )
}

// ── shared helper: compute CSS background for any theme type ──────────────
function themeBackground(theme: Theme): React.CSSProperties {
  const c = theme.colors
  const type = c.backgroundType || (
    c.backgroundVideo || c.backgroundIframe ? 'video' :
    c.backgroundImage ? 'image' :
    c.backgroundMesh ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
    c.backgroundGradient ? 'gradient' : 'fill'
  )

  if (type === 'video') {
    return { backgroundColor: 'transparent' }
  }

  if (type === 'image' && c.backgroundImage) {
    return {
      backgroundImage: `${c.backgroundOverlay ? `linear-gradient(${c.backgroundOverlay},${c.backgroundOverlay}),` : ''}url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  if (type === 'pattern' && c.backgroundMesh) {
    return {
      backgroundColor: c.background || '#0f172a',
      backgroundImage: c.backgroundMesh,
      backgroundSize: (c as any).backgroundPatternSize || '20px 20px',
    }
  }

  if (type === 'blur' && c.backgroundMesh) {
    return { background: c.backgroundMesh }
  }

  if (type === 'gradient' && c.backgroundGradient) {
    const g = c.backgroundGradient
    if (g.direction === 'radial') {
      return { background: `radial-gradient(circle, ${g.from}, ${g.to})` }
    }
    return { background: `linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})` }
  }

  return { backgroundColor: c.background || '#7F2AEB' }
}

// ── DesignIndexPanel — exact Linktree Design page layout ───────────────────
function DesignIndexPanel({ config, bgSummary, fontSummary, buttonSummary, themeSummary, onNavigate }: {
  config: any
  bgSummary: string
  fontSummary: string
  buttonSummary: string
  themeSummary: string
  onNavigate: (tab: string) => void
}) {
  const c = config.theme.colors

  // Background style for wallpaper/theme thumbnail
  let cardBgStyle: React.CSSProperties = {}
  if (c.backgroundImage) {
    cardBgStyle = {
      backgroundImage: `url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  } else if (c.backgroundMesh) {
    cardBgStyle = { background: c.backgroundMesh }
  } else if (c.backgroundGradient) {
    cardBgStyle = { background: `linear-gradient(135deg, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` }
  } else {
    cardBgStyle = { backgroundColor: c.background || '#6366f1' }
  }

  // Shared card row component matching official Linktree pill-card design
  const DesignRow = ({ id, label, summary, thumbnail, showZap = false }: {
    id: string; label: string; summary?: string; thumbnail: React.ReactNode; showZap?: boolean
  }) => (
    <button
      onClick={() => onNavigate(id)}
      className="w-full clay-design-row px-4 py-3.5 flex items-center gap-3.5 text-left group"
    >
      {/* Left thumbnail squircle */}
      <div className="w-[48px] h-[48px] rounded-[16px] overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.8), inset 0 -1.5px 0 rgba(148,163,184,0.12), 0 2px 0 rgba(148,163,184,0.18), 0 3px 8px rgba(15,23,42,0.07)', border: '1.5px solid rgba(148,163,184,0.2)' }}>
        {thumbnail}
      </div>

      {/* Label */}
      <span className="flex-1 text-[13px] font-extrabold text-slate-800 tracking-tight">{label}</span>

      {/* Right side controls (Zap badge, Summary text, Chevron) */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {showZap && (
          <div className="w-6 h-6 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 0 #4F46E5, 0 3px 8px rgba(124,58,237,0.30)' }}>
            <Zap className="w-3 h-3 fill-white text-white" />
          </div>
        )}
        {summary && (
          <span className="text-[11px] font-bold text-slate-400">{summary}</span>
        )}
        <div className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:translate-x-0.5"
          style={{ background: 'rgba(148,163,184,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
          <ChevronRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
        </div>
      </div>
    </button>
  )

  return (
    <div className="space-y-3">
      {/* ── Theme (standalone top card) ── */}
      <DesignRow
        id="themes"
        label="Theme"
        summary={themeSummary}
        thumbnail={
          <div className="w-full h-full" style={cardBgStyle}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-4 h-4 rounded-full opacity-60" style={{ backgroundColor: c.profileText || '#fff' }} />
              <div className="w-6 h-1 rounded-full opacity-80" style={{ backgroundColor: c.buttonDefault || '#fff' }} />
              <div className="w-4 h-1 rounded-full opacity-50" style={{ backgroundColor: c.buttonDefault || '#fff' }} />
            </div>
          </div>
        }
      />

      {/* ── Section Title ── */}
      <div className="pt-2 pb-1">
        <h2 className="text-base font-bold text-slate-900 px-1">Customize</h2>
      </div>

      {/* ── 1. Header ── */}
      <DesignRow
        id="profile"
        label="Header"
        summary={(config.profile.headerLayout || 'classic').charAt(0).toUpperCase() + (config.profile.headerLayout || 'classic').slice(1)}
        showZap={true}
        thumbnail={
          <div className="w-full h-full bg-slate-950 flex items-center justify-center p-0.5">
            <Avatar src={config.profile.avatar} size="sm" fallback="user" />
          </div>
        }
      />

      {/* ── 2. Wallpaper ── */}
      <DesignRow
        id="background"
        label="Wallpaper"
        summary={bgSummary}
        showZap={true}
        thumbnail={
          <div className="w-full h-full rounded-xl" style={cardBgStyle} />
        }
      />

      {/* ── 3. Buttons ── */}
      <DesignRow
        id="buttons"
        label="Buttons"
        summary={buttonSummary}
        showZap={true}
        thumbnail={
          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <div
              className="w-7 h-7 rounded-xl border border-slate-200/90 bg-white shadow-xs"
              style={{
                backgroundColor: c.buttonDefault || '#ffffff',
                borderRadius: `${Math.min((config.theme.buttonStyle?.borderRadius ?? 12) / 2, 12)}px`,
              }}
            />
          </div>
        }
      />

      {/* ── 4. Text ── */}
      <DesignRow
        id="fonts"
        label="Text"
        summary={fontSummary}
        showZap={true}
        thumbnail={
          <div className="w-full h-full bg-slate-100/70 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-800" style={{ fontFamily: config.theme.fonts?.body }}>Aa</span>
          </div>
        }
      />

      {/* ── 5. Colors ── */}
      <DesignRow
        id="colors"
        label="Colors"
        thumbnail={
          <div className="w-[34px] h-[34px] rounded-xl border border-slate-200 bg-white shadow-xs" />
        }
      />

      {/* ── 6. Stickers ── */}
      <DesignRow
        id="stickers"
        label="Stickers"
        summary="Decorate your page"
        thumbnail={
          <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Sticker className="w-5 h-5" />
          </div>
        }
      />

      {/* ── 7. Footer ── */}
      <DesignRow
        id="footer"
        label="Footer"
        thumbnail={
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-700">
            <Asterisk className="w-5 h-5" />
          </div>
        }
      />
    </div>
  )
}


// Themes Panel Component — exact Linktree Theme page layout
function ThemesPanel({ config, updateConfig, onBack }: any) {
  const [subTab, setSubTab] = useState<'customizable' | 'curated'>('customizable')

  const applyTheme = (targetTheme: Theme) => {
    // Deep clone the preset so we don't mutate the THEMES array
    const cleanTheme: Theme = JSON.parse(JSON.stringify(targetTheme))

    // Keep preset backgrounds intact. Image themes store their actual visual in
    // backgroundImage, so clearing it makes the selected theme look incorrect.
    cleanTheme.colors.backgroundVideo   = ''
    cleanTheme.colors.backgroundIframe  = ''
    // Let the preset's fill/gradient/mesh/image background take over.
    ;(cleanTheme.colors as any).backgroundType = ''

    updateConfig('theme', cleanTheme)
  }

  const handleShuffle = () => {
    const selectable = THEMES.filter(t => t.id !== 'custom')
    if (selectable.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectable.length)
      applyTheme(selectable[randomIndex])
    }
  }

  const displayThemes = THEMES.filter(t => t.id !== 'custom')

  return (
    <div className="space-y-5">
      {/* ── Top Bar: ← Theme title + Shuffle button ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
              title="Back to Design"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Theme</h1>
        </div>

        <button
          onClick={handleShuffle}
          className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-800 flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <Shuffle className="w-4 h-4 text-slate-700" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* ── Sub-tabs: Customizable | Curated ── */}
      <div className="flex items-center gap-6 border-b border-slate-200/80">
        <button
          onClick={() => setSubTab('customizable')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            subTab === 'customizable' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Customizable
          {subTab === 'customizable' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSubTab('curated')}
          className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
            subTab === 'curated' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Curated
          {subTab === 'curated' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-full" />
          )}
        </button>
      </div>

      {/* ── Themes 5-column Grid ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5 pt-1">
        {/* Custom Card (First) */}
        <div className="flex flex-col items-center group">
          <button
            onClick={() => {
              const customTheme = THEMES.find(t => t.id === 'custom') || THEMES[0]
              applyTheme(customTheme)
            }}
            className={`w-full aspect-[3/4] rounded-[22px] border-2 bg-slate-100/90 flex flex-col items-center justify-center transition-all cursor-pointer ${
              config.theme.id === 'custom'
                ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                : 'border-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <Paintbrush className="w-6 h-6 text-slate-700 stroke-[1.5]" />
          </button>
          <span className="text-xs font-semibold text-slate-700 mt-2 text-center truncate max-w-full">
            Custom
          </span>
        </div>

        {/* Theme Cards */}
        {displayThemes.map((theme) => (
          <div key={theme.id} className="flex flex-col items-center group">
            <button
              onClick={() => applyTheme(theme)}
              className={`w-full aspect-[3/4] rounded-[22px] relative overflow-hidden border-2 transition-all cursor-pointer shadow-2xs hover:shadow-md ${
                config.theme.id === theme.id
                  ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-400'
              }`}
              style={themeBackground(theme)}
            >
              {/* Heading typography preview Aa */}
              <span
                className="absolute top-2.5 left-3 text-lg md:text-xl font-bold tracking-tight"
                style={{
                  color: theme.colors.profileText || '#FFFFFF',
                  fontFamily: theme.fonts?.heading || 'sans-serif',
                }}
              >
                Aa
              </span>

              {/* Zap lightning badge */}
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-900/60 backdrop-blur-xs text-white flex items-center justify-center">
                <Zap className="w-3 h-3 fill-white text-white" />
              </div>

              {/* Translucent pill button mockup preview at bottom */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[82%] h-6 rounded-full bg-white/35 backdrop-blur-xs border border-white/20 shadow-2xs flex items-center justify-center">
                <div className="w-[50%] h-1 rounded-full bg-white/70" />
              </div>
            </button>

            {/* Theme title centered below */}
            <span className="text-xs font-semibold text-slate-700 mt-2 text-center truncate max-w-full">
              {theme.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const compressImageFile = (file: File, maxDimension = 800, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } else {
          resolve(e.target?.result as string)
        }
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

// Profile Panel Component (Header) — exact Linktree Header design
function ProfilePanel({ config, updateConfig, onBack }: any) {
  const selectedLayout = config.profile?.headerLayout || 'classic'
  const titleStyle = config.profile?.titleStyle || 'text'
  const altFontEnabled = config.profile?.altFont || false
  const [showImageInput, setShowImageInput] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressed = await compressImageFile(file, 800, 0.85)
        updateConfig('profile.avatar', compressed)
      } catch (err) {
        console.error('Failed to compress avatar:', err)
      }
    }
  }

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 0.85)
        updateConfig('profile.bannerImage', compressed)
      } catch (err) {
        console.error('Failed to compress banner:', err)
      }
    }
  }

  const layouts = [
    { id: 'classic', label: 'Classic', isPro: false, showZap: false },
    { id: 'hero',    label: 'Hero',    isPro: true,  showZap: true  },
    { id: 'banner',  label: 'Banner',  isPro: false, showZap: true  },
    { id: 'shape',   label: 'Shape',   isPro: false, showZap: true  },
  ]

  const fonts = [
    'Manrope', 'Inter', 'Roboto', 'Outfit', 'Plus Jakarta Sans', 'Playfair Display', 'Space Grotesk'
  ]

  return (
    <div className="space-y-7">
      {/* Hidden file input pickers */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        onChange={handleAvatarFile}
        className="hidden"
      />
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/*"
        onChange={handleBannerFile}
        className="hidden"
      />

      {/* ── Top Bar: ← Header title ── */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
            title="Back to Design"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Header</h1>
      </div>

      {/* ── 1. Layout Section ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Layout</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => updateConfig('profile.headerLayout', l.id)}
              className={`w-28 sm:w-32 aspect-square rounded-[22px] border-2 bg-white flex flex-col items-center justify-between p-3 relative overflow-hidden transition-all cursor-pointer flex-shrink-0 ${
                selectedLayout === l.id
                  ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-400'
              }`}
            >
              {/* Badge */}
              {l.isPro ? (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <span>Pro</span>
                  <Zap className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              ) : l.showZap ? (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-3 h-3 fill-white text-white" />
                </div>
              ) : null}

              {/* Mockup layout graphic tailored for each layout */}
              <div className="flex-1 flex items-center justify-center w-full pt-1.5 pb-1">
                {l.id === 'classic' && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden border border-slate-200 shadow-xs flex items-center justify-center">
                      <Avatar src={config.profile.avatar} size="xs" fallback="user" />
                    </div>
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                  </div>
                )}
                {l.id === 'hero' && (
                  <div className="w-full h-11 bg-slate-900 rounded-t-lg relative overflow-hidden flex flex-col justify-end p-1.5 border border-slate-700 shadow-xs">
                    {config.profile.avatar && (config.profile.avatar.startsWith('http') || config.profile.avatar.startsWith('data:')) ? (
                      <img src={config.profile.avatar} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-indigo-900 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="relative z-10 w-10 h-1 bg-white rounded-full mx-auto" />
                  </div>
                )}
                {l.id === 'banner' && (
                  <div className="w-full flex flex-col items-center relative">
                    <div className="w-full h-6 rounded-t-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative overflow-hidden">
                      {config.profile.bannerImage && (
                        <img src={config.profile.bannerImage} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white -mt-3.5 relative z-10 overflow-hidden shadow-xs flex items-center justify-center">
                      <Avatar src={config.profile.avatar} size="xs" fallback="user" />
                    </div>
                  </div>
                )}
                {l.id === 'shape' && (
                  <div className="w-8 h-8 bg-rose-600 overflow-hidden shadow-xs flex items-center justify-center" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                    <Avatar src={config.profile.avatar} size="xs" fallback="user" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-slate-800">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Dynamic Sub-Section: Shape Selector (When Layout === 'shape') ── */}
      {selectedLayout === 'shape' && (
        <div className="pt-2 pb-2">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Shape</h2>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'loop',    label: 'Loop',    iconPath: 'M10 25C10 15 25 10 40 10C55 10 70 15 70 25C70 35 55 40 40 40C25 40 10 35 10 25Z' },
              { id: 'flower',  label: 'Flower',  iconPath: 'M25 10C30 5 45 5 50 10C55 15 65 20 65 30C65 40 55 45 50 50C45 55 30 55 25 50C20 45 10 40 10 30C10 20 20 15 25 10Z' },
              { id: 'oval',    label: 'Oval',    iconPath: 'M15 25C15 14 26 10 40 10C54 10 65 14 65 25C65 36 54 40 40 40C26 40 15 36 15 25Z' },
              { id: 'rounded', label: 'Rounded', iconPath: 'M15 15C15 10 20 10 40 10C60 10 65 10 65 15C65 35 65 35 65 35C65 40 60 40 40 40C20 40 15 40 15 35Z' },
              { id: 'burst',   label: 'Burst',   iconPath: 'M40 5L46 16L58 12L54 24L65 30L55 38L62 48L50 46L44 57L36 48L24 53L27 41L15 38L24 28L18 18L30 20L40 5Z' },
            ].map((s) => {
              const currentShape = config.profile?.headerShape || 'loop'
              const isSelected = currentShape === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => updateConfig('profile.headerShape', s.id)}
                  className={`w-20 sm:w-24 aspect-square rounded-[20px] border-2 bg-white flex flex-col items-center justify-center p-2.5 transition-all cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                      : 'border-slate-200/80 hover:border-slate-400'
                  }`}
                >
                  <div className="w-10 h-6 flex items-center justify-center mb-1">
                    <svg viewBox="0 0 80 50" className="w-9 h-6 fill-slate-800">
                      <path d={s.iconPath} />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 2. Profile image ── */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Profile image</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[16px] flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload image
          </button>
          <div className="relative group">
            <div
              onClick={() => avatarInputRef.current?.click()}
              className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
            >
              <Avatar src={config.profile.avatar} size="lg" fallback="user" />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Upload new image"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showImageInput && (
        <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-700">Or enter Image URL / Emoji</label>
          <input
            type="text"
            value={config.profile.avatar}
            onChange={(e) => updateConfig('profile.avatar', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[14px] bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="https://... or emoji 😀"
          />
        </div>
      )}

      {/* ── Dynamic Sub-Section: Banner Image (When Layout === 'banner') ── */}
      {selectedLayout === 'banner' && (
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-900">Banner image</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[16px] flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload banner
            </button>
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="w-14 h-14 rounded-[18px] bg-slate-100 border border-slate-200 flex flex-col items-center justify-center cursor-pointer shadow-xs hover:bg-slate-200/70 transition-colors relative overflow-hidden"
              title="Upload Banner Image"
            >
              {config.profile.bannerImage ? (
                <img src={config.profile.bannerImage} alt="banner" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                  <Plus className="w-3 h-3 -ml-1 -mt-2 stroke-[3]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title</label>
        <input
          type="text"
          value={config.profile.title}
          onChange={(e) => updateConfig('profile.title', e.target.value)}
          className="w-full sm:w-80 bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          placeholder="satvikpatel8373"
        />
      </div>

      {/* ── 4. Bio ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900 pt-3">Bio</label>
        <div className="w-full sm:w-80 relative">
          <textarea
            value={config.profile.bio || ''}
            onChange={(e) => {
              if (e.target.value.length <= 160) {
                updateConfig('profile.bio', e.target.value)
              }
            }}
            maxLength={160}
            className="w-full bg-white border border-slate-200 rounded-[20px] p-4 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none min-h-[105px] pr-4 pb-8"
            placeholder="Add a short bio"
          />
          <span className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400 pointer-events-none">
            {config.profile.bio?.length || 0}/160
          </span>
        </div>
      </div>

      {/* ── 5. Title style ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title style</label>
        <div className="flex items-center gap-3">
          {/* Aa Text */}
          <button
            onClick={() => updateConfig('profile.titleStyle', 'text')}
            className={`w-28 py-3 rounded-[18px] border-2 bg-white flex flex-col items-center justify-center transition-all cursor-pointer ${
              titleStyle === 'text'
                ? 'border-slate-900 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-400'
            }`}
          >
            <span className="text-lg font-bold text-slate-900 leading-none">Aa</span>
            <span className="text-xs font-semibold text-slate-700 mt-1">Text</span>
          </button>

          {/* Logo */}
          <button
            onClick={() => updateConfig('profile.titleStyle', 'logo')}
            className={`w-28 py-3 rounded-[18px] border-2 bg-white flex flex-col items-center justify-center transition-all cursor-pointer relative ${
              titleStyle === 'logo'
                ? 'border-slate-900 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-400'
            }`}
          >
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center">
              <Zap className="w-3 h-3 fill-white text-white" />
            </div>
            <ImageIcon className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-semibold text-slate-700 mt-1">Logo</span>
          </button>
        </div>
      </div>

      {/* ── 6. Alternative title font ── */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <div>
          <label className="text-sm font-bold text-slate-900 block">Alternative title font</label>
          <span className="text-xs text-slate-400 font-normal">Matches page font by default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-3 h-3 fill-white text-white" />
          </div>
          <button
            onClick={() => updateConfig('profile.altFont', !altFontEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              altFontEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                altFontEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── 7. Title font ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title font</label>
        <select
          value={config.theme.fonts?.heading || 'Manrope'}
          onChange={(e) => updateConfig('theme.fonts.heading', e.target.value)}
          className="w-full sm:w-80 bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* ── 8. Title color ── */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title color</label>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-[18px] px-4 py-2.5 shadow-2xs">
          <input
            type="color"
            value={config.theme.colors?.profileText || '#FFFFFF'}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-6 h-6 rounded-lg border border-slate-200 cursor-pointer shadow-xs"
          />
          <input
            type="text"
            value={config.theme.colors?.profileText || '#FFFFFF'}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-20 font-mono text-sm font-bold text-slate-900 uppercase focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}


// Background Panel — wallpaper (Flat, Gradient, Google Drive)
function BackgroundPanel({ config, updateConfig, onBack }: any) {
  const c = config.theme.colors
  const activeType = c.backgroundType || (
    c.backgroundVideo || c.backgroundIframe ? 'video' :
    c.backgroundImage ? 'image' :
    c.backgroundMesh ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
    c.backgroundGradient ? 'gradient' : 'fill'
  )

  const setBgType = (type: string) => {
    const base = [
      { path: 'theme.colors.backgroundType', value: type },
      { path: 'theme.colors.backgroundGradient', value: null },
      { path: 'theme.colors.backgroundMesh', value: '' },
      { path: 'theme.colors.backgroundImage', value: '' },
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
    ]
    if (type === 'gradient') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundGradient', value: c.backgroundGradient || { from: c.background || '#4F46E5', to: c.accent || '#EC4899', direction: '135deg' } },
      ])
    } else if (type === 'blur') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundMesh', value: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(109,40,217,0.8) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(124,58,237,0.7) 0%, transparent 55%), linear-gradient(160deg, #1E1035 0%, #2D1B69 100%)' },
      ])
    } else if (type === 'pattern') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundMesh', value: 'radial-gradient(circle, rgba(255,255,255,0.18) 15%, transparent 16%)' },
      ])
    } else {
      updateConfig(base)
    }
  }

  const [videoUploadState, setVideoUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)
  const [videoUploadError, setVideoUploadError] = useState('')
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Current video URL (from a previous upload)
  const currentVideoUrl = c.backgroundVideo || ''

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setVideoUploadError('Please upload an MP4, WebM, or MOV video file.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setVideoUploadError('File is too large. Maximum size is 50 MB.')
      return
    }

    setVideoUploadState('uploading')
    setVideoUploadProgress(0)
    setVideoUploadError('')

    // Use cardId from config if available, otherwise a fallback key
    const cardId = (config as any).id || 'wallpaper'

    try {
      const downloadUrl = await uploadWallpaperFile(file, cardId, (pct) => {
        setVideoUploadProgress(pct)
      })
      updateConfig([
        { path: 'theme.colors.backgroundVideo', value: downloadUrl },
        { path: 'theme.colors.backgroundIframe', value: '' },
        { path: 'theme.colors.backgroundImage', value: '' },
        { path: 'theme.colors.backgroundType', value: 'video' },
      ])
      setVideoUploadState('done')
      setVideoUploadError('')
    } catch (err: any) {
      const msg = err?.message || 'Upload failed. Please try again.'
      setVideoUploadError(msg)
      setVideoUploadState('error')
      console.error('❌ Video upload error:', err)
    }

    // Reset file input so the same file can be re-selected if needed
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleClearVideo = () => {
    updateConfig([
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
      { path: 'theme.colors.backgroundType', value: 'fill' },
    ])
    setVideoUploadState('idle')
    setVideoUploadProgress(0)
    setVideoUploadError('')
  }

  // Image-only URL handler (kept for image tab)
  const handleImageUrlChange = (url: string) => {
    const trimmed = url.trim()
    updateConfig([
      { path: 'theme.colors.backgroundImage', value: trimmed },
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
      { path: 'theme.colors.backgroundType', value: trimmed ? 'image' : 'fill' },
    ])
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setVideoUploadError('Please choose an image file (JPG, PNG, WebP, or GIF).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setVideoUploadError('Image is too large. Maximum size is 10 MB.')
      return
    }
    try {
      const imageUrl = await uploadWallpaperFile(file, (config as any).id || 'wallpaper')
      handleImageUrlChange(imageUrl)
      setVideoUploadError('')
    } catch (err: any) {
      setVideoUploadError(err?.message || 'Could not upload the image.')
    }
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const imageUrl = c.backgroundImage || ''
  const tintMatch = String(c.backgroundOverlay || '').match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/i)
  const tintAmount = tintMatch ? Math.round(Number(tintMatch[1]) * 100) : 0

  const colorSwatches = [
    '#FFFFFF', '#090D16', '#0F172A', '#1E1B4B', '#064E3B', '#4C1D95', '#831843', '#7B3200', '#7F2AEB'
  ]
  const gradientPresets = [
    { name: 'Sunset', from: '#FF512F', to: '#DD2476' },
    { name: 'Ocean', from: '#2B5876', to: '#4E4376' },
    { name: 'Neon', from: '#8A2387', to: '#E94057' },
    { name: 'Emerald', from: '#0F766E', to: '#047857' },
    { name: 'Royal', from: '#6D28D9', to: '#9333EA' },
    { name: 'Peach', from: '#F43F5E', to: '#FB923C' },
  ]

  return (
    <div className="space-y-6">
      {/* Heading with Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Wallpaper</h2>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-600 mb-3">Wallpaper style</p>
      </div>

      {/* Style selector matching Linktree */}
      <div className="flex gap-3.5 overflow-x-auto py-2 px-1 -mx-1 scrollbar-none">
        {[
          {
            type: 'fill',
            label: 'Fill',
            preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 shadow-xs" style={{ backgroundColor: c.background || '#7F2AEB' }} />
          },
          {
            type: 'gradient',
            label: 'Gradient',
            preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 shadow-xs" style={{ background: c.backgroundGradient ? `linear-gradient(135deg, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` : 'linear-gradient(135deg, #7F2AEB, #A78BFA)' }} />
          },
          {
            type: 'blur',
            label: 'Blur',
            preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 shadow-xs bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 blur-[0.5px]" />
          },
          {
            type: 'pattern',
            label: 'Pattern',
            preview: (
              <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 bg-indigo-600 relative overflow-hidden shadow-xs">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 15%, transparent 16%)', backgroundSize: '6px 6px' }} />
              </div>
            )
          },
          {
            type: 'image',
            label: 'Image',
            preview: (
              <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 overflow-hidden shadow-xs bg-cover bg-center relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=120&q=80)' }}>
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900/80 text-white flex items-center justify-center">
                  <ImageIcon size={10} />
                </div>
              </div>
            )
          },
          {
            type: 'video',
            label: 'Video',
            preview: (
              <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 bg-slate-100 flex items-center justify-center shadow-xs relative">
                <Video className="w-5 h-5 text-slate-500" />
              </div>
            )
          }
        ].map(({ type, label, preview }) => (
          <button
            key={type}
            onClick={() => setBgType(type)}
            className={`flex-shrink-0 p-1.5 pb-2.5 rounded-[20px] border-2 bg-white flex flex-col items-center gap-2 transition-all cursor-pointer ${
              activeType === type
                ? 'border-slate-850 shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                : 'border-transparent hover:border-slate-200'
            }`}
            style={{ width: '88px' }}
          >
            {preview}
            <span className={`text-[11px] font-bold tracking-tight ${activeType === type ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
          </button>
        ))}
      </div>

      {/* Controls for each mode */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">

        {/* Flat Color / Pattern (both use background color base) */}
        {(activeType === 'fill' || activeType === 'pattern') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">Background color</span>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <input
                  type="color"
                  value={c.background || '#7F2AEB'}
                  onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
                  className="w-6 h-6 rounded-md border-0 cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-md"
                />
                <span className="font-mono text-sm font-bold text-slate-700 uppercase">{c.background || '#7F2AEB'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {colorSwatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => updateConfig('theme.colors.background', hex)}
                  title={hex}
                  className={`w-9 h-9 rounded-xl border-2 transition-transform hover:scale-105 cursor-pointer ${c.background?.toUpperCase() === hex.toUpperCase() ? 'border-slate-800 scale-105' : 'border-slate-200'}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Gradient */}
        {activeType === 'gradient' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start Color</label>
                <input
                  type="color"
                  value={c.backgroundGradient?.from || '#4F46E5'}
                  onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, from: e.target.value })}
                  className="w-full h-11 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">End Color</label>
                <input
                  type="color"
                  value={c.backgroundGradient?.to || '#EC4899'}
                  onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, to: e.target.value })}
                  className="w-full h-11 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Direction</label>
              <select
                value={c.backgroundGradient?.direction || '135deg'}
                onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, direction: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
              >
                <option value="0deg">Top → Bottom</option>
                <option value="90deg">Left → Right</option>
                <option value="135deg">Diagonal ↘</option>
                <option value="180deg">Bottom → Top</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {gradientPresets.map((gp) => (
                  <button
                    key={gp.name}
                    onClick={() => updateConfig('theme.colors.backgroundGradient', { from: gp.from, to: gp.to, direction: '135deg' })}
                    className="rounded-xl border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer"
                  >
                    <div className="h-8 w-full" style={{ background: `linear-gradient(135deg, ${gp.from}, ${gp.to})` }} />
                    <span className="block text-[11px] font-semibold text-slate-700 py-1 text-center">{gp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mesh / Blur */}
        {activeType === 'blur' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800">Mesh Blur Gradient</label>
            <textarea
              rows={3}
              value={c.backgroundMesh || ''}
              onChange={(e) => updateConfig('theme.colors.backgroundMesh', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white"
              placeholder="radial-gradient(ellipse ...)"
            />
            <p className="text-xs text-slate-500">Provide multiple CSS radial gradient stops layered to form a custom mesh.</p>
          </div>
        )}

        {/* Image */}
        {activeType === 'image' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">Wallpaper Image Link</label>
              {imageUrl && (
                <button onClick={() => handleImageUrlChange('')} className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer">
                  Clear
                </button>
              )}
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm font-mono bg-slate-50 focus:bg-white transition-colors"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste a direct image URL (JPG, PNG, WebP, GIF).
            </p>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageFileChange}
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" /> {imageUrl ? 'Replace background image' : 'Upload background image'}
            </button>

            {imageUrl && (
              <div className="h-28 rounded-xl overflow-hidden border border-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
            )}

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-sm font-semibold text-slate-800">Effect</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: '', label: 'None' },
                  { id: 'grayscale(1)', label: 'Mono' },
                  { id: 'blur(5px)', label: 'Blur' },
                  { id: 'contrast(1.35) saturate(0.65)', label: 'Halftone' },
                ].map((effect) => (
                  <button
                    key={effect.label}
                    onClick={() => updateConfig('theme.backgroundFilter', effect.id)}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      (config.theme.backgroundFilter || '') === effect.id ? 'border-slate-900 bg-white text-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {effect.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Tint</label>
                  <p className="text-xs text-slate-500">Improves text visibility.</p>
                </div>
                <span className="text-xs font-bold text-slate-500">{tintAmount}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                value={tintAmount}
                onChange={(e) => updateConfig('theme.colors.backgroundOverlay', `rgba(0,0,0,${Number(e.target.value) / 100})`)}
                className="w-full accent-slate-900"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Noise</p>
                <p className="text-xs text-slate-500">Add a subtle grain texture.</p>
              </div>
              <button
                role="switch"
                aria-checked={Boolean(config.theme.noiseOpacity)}
                onClick={() => updateConfig('theme.noiseOpacity', config.theme.noiseOpacity ? 0 : 0.12)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${config.theme.noiseOpacity ? 'bg-slate-900' : 'bg-slate-200'}`}
              >
                <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${config.theme.noiseOpacity ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Tint color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={c.backgroundOverlay || '#000000'}
                  onChange={(e) => updateConfig('theme.colors.backgroundOverlay', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={c.backgroundOverlay || 'rgba(0,0,0,0.4)'}
                  onChange={(e) => updateConfig('theme.colors.backgroundOverlay', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-white"
                  placeholder="rgba(0,0,0,0.4)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Video — file upload */}
        {activeType === 'video' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">Wallpaper Video</label>
              {currentVideoUrl && (
                <button
                  onClick={handleClearVideo}
                  className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Current video preview */}
            {currentVideoUrl && videoUploadState !== 'uploading' && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video relative">
                <video
                  src={currentVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                  Preview
                </span>
              </div>
            )}

            {/* Upload button / progress */}
            {videoUploadState === 'uploading' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Uploading…</span>
                  <span>{videoUploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-200"
                    style={{ width: `${videoUploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => videoInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer"
              >
                <Upload className="w-6 h-6 text-slate-400" />
                <span className="text-sm font-semibold text-slate-600">
                  {currentVideoUrl ? 'Replace video' : 'Upload video'}
                </span>
                <span className="text-xs text-slate-400">MP4, WebM or MOV · max 50 MB</span>
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              className="hidden"
              onChange={handleVideoFileChange}
            />

            {/* Success / error feedback */}
            {videoUploadState === 'done' && (
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Video uploaded successfully
              </p>
            )}
            {videoUploadState === 'error' && videoUploadError && (
              <p className="text-xs font-semibold text-rose-500">{videoUploadError}</p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// Fonts Panel Component (Text)
function FontsPanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Fonts</h2>
        <p className="text-sm text-slate-500">Choose typography and text colors for your card</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Page font</label>
        <select
          value={config.theme.fonts.body}
          onChange={(e) => updateConfig('theme.fonts.body', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
        >
          <option value="Inter">Inter</option>
          <option value="Poppins">Poppins</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Space Grotesk">Space Grotesk</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Page text color</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.profileBio}
            onChange={(e) => updateConfig('theme.colors.profileBio', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.profileBio}
              onChange={(e) => updateConfig('theme.colors.profileBio', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#666666"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Title color</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.profileText}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.profileText}
              onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Buttons Panel Component
function ButtonsPanel({ config, updateConfig, onBack }: any) {
  const currentStyle = config.theme.buttonStyle.style ?? 'solid'
  const currentRadius = config.theme.buttonStyle.borderRadius ?? 20
  const currentShadow = config.theme.buttonStyle.shadowStyle ?? 'none'
  const buttonColor = config.theme.colors.buttonDefault || '#D3D1C7'
  const buttonTextColor = config.theme.colors.buttonText || '#39342C'

  const buttonStyles = [
    { id: 'solid', label: 'Solid', icon: '⬤' },
    { id: 'glass', label: 'Glass', icon: '◐' },
    { id: 'outline', label: 'Outline', icon: '○' },
  ]

  const cornerOptions = [
    { radius: 0, icon: '▢' },
    { radius: 8, icon: '▢' },
    { radius: 16, icon: '▢' },
    { radius: 50, icon: '▢' },
  ]

  const shadowOptions = [
    { style: 'none', label: 'None' },
    { style: 'soft', label: 'Soft' },
    { style: 'strong', label: 'Strong' },
    { style: 'hard', label: 'Hard' },
  ]

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Buttons</h2>
      </div>

      {/* Button style */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900">Button style</label>
        <div className="grid grid-cols-3 gap-3">
          {buttonStyles.map((style) => {
            const isSelected = currentStyle === style.id
            return (
              <button
                key={style.id}
                onClick={() => updateConfig('theme.buttonStyle.style', style.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
                
                {/* Preview button */}
                <div className="flex flex-col items-center gap-3 mb-2">
                  <div
                    className={`w-full h-10 rounded-full flex items-center justify-center text-xs font-semibold ${
                      style.id === 'solid'
                        ? 'bg-[#D3D1C7] text-[#39342C]'
                        : style.id === 'glass'
                        ? 'bg-white/40 backdrop-blur-sm border border-slate-200 text-slate-900'
                        : 'bg-transparent border-2 border-slate-900 text-slate-900'
                    }`}
                  >
                    {/* Empty preview */}
                  </div>
                </div>
                
                <div className="text-center text-sm font-medium text-slate-900">
                  {style.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Corner roundness */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900">Corner roundness</label>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { radius: 0, visual: 0 },
            { radius: 8, visual: 8 },
            { radius: 16, visual: 16 },
            { radius: 50, visual: 9999 },
          ].map((option, idx) => {
            const isSelected = 
              (option.radius === 0 && currentRadius === 0) ||
              (option.radius === 8 && currentRadius > 0 && currentRadius <= 8) ||
              (option.radius === 16 && currentRadius > 8 && currentRadius <= 20) ||
              (option.radius === 50 && currentRadius > 20)
            
            return (
              <button
                key={option.radius}
                onClick={() => updateConfig('theme.buttonStyle.borderRadius', option.radius)}
                className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center h-10">
                  <div
                    className="w-12 h-8 bg-slate-900"
                    style={{ borderRadius: option.visual === 9999 ? '9999px' : `${option.visual}px` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Button shadow */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900">Button shadow</label>
        <div className="grid grid-cols-4 gap-2.5">
          {shadowOptions.map((shadow) => {
            const isSelected = currentShadow === shadow.style
            return (
              <button
                key={shadow.style}
                onClick={() => {
                  updateConfig([
                    { path: 'theme.buttonStyle.shadowStyle', value: shadow.style },
                    { path: 'theme.buttonStyle.shadow', value: shadow.style !== 'none' },
                  ])
                }}
                className={`py-3 px-3 rounded-xl border-2 transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-medium text-slate-900">{shadow.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Button color */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900">Button color</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="color"
              value={buttonColor}
              onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
              style={{ backgroundColor: buttonColor }}
            />
          </div>
          <input
            type="text"
            value={buttonColor.toUpperCase()}
            onChange={(e) => {
              const value = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                updateConfig('theme.colors.buttonDefault', value)
              }
            }}
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
            placeholder="#D3D1C7"
          />
        </div>
      </div>

      {/* Button text color */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-slate-900">Button text color</label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="color"
              value={buttonTextColor}
              onChange={(e) => updateConfig('theme.colors.buttonText', e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
              style={{ backgroundColor: buttonTextColor }}
            />
          </div>
          <input
            type="text"
            value={buttonTextColor.toUpperCase()}
            onChange={(e) => {
              const value = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                updateConfig('theme.colors.buttonText', value)
              }
            }}
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
            placeholder="#39342C"
          />
        </div>
      </div>

      {/* Animation Options */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-slate-900">Button animations</label>
            <p className="text-xs text-slate-500 mt-0.5">Add hover effects to your buttons</p>
          </div>
          <button
            role="switch"
            aria-checked={config.theme.buttonStyle?.enableAnimations ?? true}
            onClick={() => updateConfig('theme.buttonStyle.enableAnimations', !(config.theme.buttonStyle?.enableAnimations ?? true))}
            className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
              (config.theme.buttonStyle?.enableAnimations ?? true) ? 'bg-slate-900' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                (config.theme.buttonStyle?.enableAnimations ?? true) ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        
        {/* Animation Style Selector */}
        {(config.theme.buttonStyle?.enableAnimations ?? true) && (
          <div className="grid grid-cols-4 gap-2.5 mt-3">
            {[
              { id: 'bounce', label: 'Bounce', icon: '↗' },
              { id: 'pulse', label: 'Pulse', icon: '○' },
              { id: 'wobble', label: 'Wobble', icon: '↻' },
              { id: 'slide', label: 'Slide', icon: '→' },
            ].map((anim) => {
              const isSelected = (config.theme.buttonStyle?.animation ?? 'bounce') === anim.id
              return (
                <button
                  key={anim.id}
                  onClick={() => updateConfig('theme.buttonStyle.animation', anim.id)}
                  className={`py-3 px-2 rounded-xl border-2 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-lg mb-1">{anim.icon}</div>
                  <span className="text-xs font-medium text-slate-900">{anim.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// Links Panel Component (Link management)
// ── helper: pick the right SVG icon for a link row ────────────────────────
function LinkRowIcon({ link }: { link: LinkItem }) {
  const map: Record<string, React.FC<{ size?: number; className?: string }>> = {
    instagram:   InstagramIcon,
    tiktok:      TikTokIcon,
    youtube:     YouTubeIcon,
    spotify:     SpotifyIcon,
    twitter:     TwitterIcon,
    facebook:    FacebookIcon,
    linkedin:    LinkedInIcon,
    discord:     DiscordIcon,
    github:      GitHubIcon,
    whatsapp:    WhatsAppIcon,
    telegram:    TelegramIcon,
    soundcloud:  SoundCloudIcon,
    shopify:     ShopifyIcon,
    email:       EmailIcon,
    phone:       PhoneIcon,
    website:     WebsiteIcon,
    'apple-music': AppleMusicIcon,
  }
  const Icon = link.platform && map[link.platform] ? map[link.platform] : null
  const cls = 'w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0'
  if (Icon) return <div className={cls}><Icon size={18} className="text-gray-700" /></div>
  if (link.type === 'shop')    return <div className={cls}><ShoppingBag className="w-4 h-4 text-gray-600" /></div>
  if (link.type === 'header')  return <div className={cls}><Layout className="w-4 h-4 text-gray-600" /></div>
  if (link.type === 'text')    return <div className={cls}><Type className="w-4 h-4 text-gray-600" /></div>
  if (link.type === 'contact') return <div className={cls}><User className="w-4 h-4 text-gray-600" /></div>
  if (link.type === 'event')   return <div className={cls}><Globe className="w-4 h-4 text-gray-600" /></div>
  if (link.type === 'music')   return <div className={cls}><Share2 className="w-4 h-4 text-gray-600" /></div>
  if (link.type === 'video')   return <div className={cls}><Smartphone className="w-4 h-4 text-gray-600" /></div>
  return <div className={cls}><LinkIcon className="w-4 h-4 text-gray-600" /></div>
}

// ── type-specific expanded edit form ──────────────────────────────────────
function LinkEditForm({ link, updateLink, removeLink, onDone, toggleLinkVisibility }: {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
  removeLink: (id: string) => void
  onDone: () => void
  toggleLinkVisibility: (id: string) => void
}) {
  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={(link as any)[key] || ''}
        onChange={e => updateLink(link.id, key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-colors"
      />
    </div>
  )

  const textarea = (label: string, key: string, placeholder = '', rows = 2) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
      <textarea
        value={(link as any)[key] || ''}
        onChange={e => updateLink(link.id, key, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-colors resize-none"
      />
    </div>
  )

  const select = (label: string, key: string, options: { value: string; label: string }[]) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{label}</label>
      <select
        value={(link as any)[key] || ''}
        onChange={e => updateLink(link.id, key, e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-colors"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  return (
    <div className="px-4 py-4 space-y-3">
      {/* Always: icon + title */}
      <div className="flex items-center gap-3">
        <LinkRowIcon link={link} />
        <input
          autoFocus
          type="text"
          value={link.text}
          onChange={e => updateLink(link.id, 'text', e.target.value)}
          placeholder="Title"
          className="flex-1 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-colors"
        />
      </div>

      {/* ── LAYOUT OPTIONS (for video, music, media types) ── */}
      {(['video', 'music', 'shop'].includes(link.type)) && (
        <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-purple-900 uppercase tracking-wide">Display Layout</label>
            <span className="text-[10px] text-purple-600 bg-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateLink(link.id, 'layout', 'classic')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                (link.layout || 'classic') === 'classic'
                  ? 'bg-white border-purple-500 text-purple-700 shadow-sm'
                  : 'bg-white/50 border-purple-200 text-gray-600 hover:border-purple-300'
              }`}
            >
              📋 Classic
            </button>
            <button
              type="button"
              onClick={() => updateLink(link.id, 'layout', 'featured')}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                link.layout === 'featured'
                  ? 'bg-white border-purple-500 text-purple-700 shadow-sm'
                  : 'bg-white/50 border-purple-200 text-gray-600 hover:border-purple-300'
              }`}
            >
              ✨ Featured
            </button>
          </div>
          <p className="text-[10px] text-purple-600 mt-2">
            {link.layout === 'featured' 
              ? '✓ Show large preview with thumbnail' 
              : 'Compact text-based link'}
          </p>
        </div>
      )}
      {/* ── PRIORITY / PIN ── */}
      <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={link.isPinned || false}
            onChange={e => updateLink(link.id, 'isPinned', e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded cursor-pointer"
          />
          <label className="text-xs font-semibold text-gray-700">📌 Pin to top</label>
        </div>
        <span className="text-[10px] text-gray-500">Priority link</span>
      </div>

      {/* ── MODULAR BLOCK EDITOR DISPATCHER ── */}
      <BlockEditorDispatcher link={link as any} updateLink={updateLink} />

      {/* ── SCHEDULING OPTIONS ── */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Schedule Link
          </label>
          <input
            type="checkbox"
            checked={link.isScheduled || false}
            onChange={e => {
              updateLink(link.id, 'isScheduled', e.target.checked)
              if (!e.target.checked) {
                updateLink(link.id, 'scheduleStart', '')
                updateLink(link.id, 'scheduleEnd', '')
              }
            }}
            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
          />
        </div>
        {link.isScheduled && (
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] font-semibold text-blue-700 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                value={link.scheduleStart || ''}
                onChange={e => updateLink(link.id, 'scheduleStart', e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-blue-700 mb-1">End Date & Time (Optional)</label>
              <input
                type="datetime-local"
                value={link.scheduleEnd || ''}
                onChange={e => updateLink(link.id, 'scheduleEnd', e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <p className="text-[10px] text-blue-600">
              🕐 Link will auto-publish/hide based on schedule
            </p>
          </div>
        )}
        {!link.isScheduled && (
          <p className="text-[10px] text-blue-600">
            Set dates to auto-publish content at specific times
          </p>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleLinkVisibility(link.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            {link.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {link.isVisible ? 'Visible' : 'Hidden'}
          </button>
          <button
            onClick={() => { removeLink(link.id); onDone() }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
        <button
          onClick={onDone}
          className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  )
}

function LinksPanel({ config, onOpenAddModal, removeLink, toggleLinkVisibility, updateLink, selectedLinkId, setSelectedLinkId, reorderLinks }: any) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Add a transparent drag image to avoid showing the full element
    if (e.dataTransfer.setDragImage) {
      const img = new Image()
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      e.dataTransfer.setDragImage(img, 0, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderLinks(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Links</h2>
        <p className="text-sm text-gray-500">Add and manage your links</p>
      </div>

      {/* Add button */}
      <button
        onClick={onOpenAddModal}
        className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all group"
      >
        <Plus className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
        <span className="text-sm font-semibold text-gray-500 group-hover:text-purple-700">Add link</span>
      </button>

      {/* Link list */}
      <div className="space-y-2">
        {config.links.length === 0 && (
          <div className="text-center py-14 text-gray-300">
            <LinkIcon className="w-10 h-10 mx-auto mb-3" />
            <p className="text-sm font-medium">No links yet</p>
            <p className="text-xs mt-1">Click "Add link" to get started</p>
          </div>
        )}

        {config.links.map((link: LinkItem, index: number) => (
          <div
            key={link.id}
            draggable={selectedLinkId !== link.id}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`bg-white border rounded-xl transition-all ${
              !link.isVisible ? 'opacity-40' : ''
            } ${
              selectedLinkId === link.id
                ? 'border-purple-400 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              draggedIndex === index ? 'opacity-50' : ''
            } ${
              dragOverIndex === index ? 'border-purple-500 border-2' : ''
            }`}
          >
            {/* Collapsed row — identical for every type */}
            {selectedLinkId !== link.id && (
              <div className="flex items-center gap-3 px-3 py-3">
                <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                <LinkRowIcon link={link} />
                <button
                  onClick={() => setSelectedLinkId(link.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                    {link.text || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                    {link.type === 'shop' && link.price
                      ? `${link.currency || '$'}${link.price} · ${link.stockStatus || 'in-stock'}`
                      : link.type === 'contact' && link.contactValue
                      ? link.contactValue
                      : link.type === 'event' && link.eventDate
                      ? `${link.eventDate}${link.eventTime ? ' · ' + link.eventTime : ''}`
                      : link.url
                      ? link.url
                      : <span className="italic text-gray-300">tap to edit</span>
                    }
                  </p>
                </button>
                <button
                  onClick={() => toggleLinkVisibility(link.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  {link.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeLink(link.id)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Expanded form — fields change based on type */}
            {selectedLinkId === link.id && (
              <LinkEditForm
                link={link}
                updateLink={updateLink}
                removeLink={removeLink}
                onDone={() => setSelectedLinkId(null)}
                toggleLinkVisibility={toggleLinkVisibility}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Colors Panel Component (Color customization)
function ColorsPanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Colors</h2>
        <p className="text-gray-600">Customize all colors for your page</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Background</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.background}
            onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.background}
              onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Buttons</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.buttonDefault}
            onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.buttonDefault}
              onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Button text</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.buttonText}
            onChange={(e) => updateConfig('theme.colors.buttonText', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.buttonText}
              onChange={(e) => updateConfig('theme.colors.buttonText', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Page text</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.profileBio}
            onChange={(e) => updateConfig('theme.colors.profileBio', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.profileBio}
              onChange={(e) => updateConfig('theme.colors.profileBio', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#666666"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Title text</label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={config.theme.colors.profileText}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
          />
          <div className="flex-1">
            <input
              type="text"
              value={config.theme.colors.profileText}
              onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings Panel Component
function SettingsPanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Settings</h2>
        <p className="text-xs text-gray-500">Manage your Linktree settings & social icons</p>
      </div>

      {/* Social Icons / Channels Section */}
      <section className="space-y-4">
        <SocialMediaPanel config={config} updateConfig={updateConfig} />
      </section>

      {/* Additional Info Section */}
      <section className="space-y-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900">Additional Profile Info</h3>
        
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={config.profile.location || ''}
            onChange={(e) => updateConfig('profile.location', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Website</label>
          <input
            type="url"
            value={config.profile.website || ''}
            onChange={(e) => updateConfig('profile.website', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </section>
    </div>
  )
}

// Social Media Panel Component
function SocialMediaPanel({ config, updateConfig }: any) {
  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', placeholder: '@username or https://instagram.com/username' },
    { id: 'tiktok', name: 'TikTok', placeholder: '@username or https://tiktok.com/@username' },
    { id: 'youtube', name: 'YouTube', placeholder: '@channel or https://youtube.com/@channel' },
    { id: 'twitter', name: 'Twitter / X', placeholder: '@handle or https://x.com/handle' },
    { id: 'github', name: 'GitHub', placeholder: 'username or https://github.com/username' },
    { id: 'linkedin', name: 'LinkedIn', placeholder: 'in/username or https://linkedin.com/in/username' },
    { id: 'facebook', name: 'Facebook', placeholder: 'username or https://facebook.com/username' },
    { id: 'discord', name: 'Discord', placeholder: 'invite-code or https://discord.gg/invite' },
    { id: 'whatsapp', name: 'WhatsApp', placeholder: '+1234567890 (phone number)' },
    { id: 'telegram', name: 'Telegram', placeholder: '@username or https://t.me/username' },
    { id: 'spotify', name: 'Spotify', placeholder: 'artist-id or https://open.spotify.com/artist/...' },
    { id: 'soundcloud', name: 'SoundCloud', placeholder: 'username or https://soundcloud.com/username' },
    { id: 'apple-music', name: 'Apple Music', placeholder: 'https://music.apple.com/...' },
    { id: 'shopify', name: 'Shopify Store', placeholder: 'https://yourstore.myshopify.com' },
  ]

  const handleInputChange = (platformId: string, val: string) => {
    updateConfig(`socialLinks.${platformId}`, val)
  }

  const handleInputBlur = (platformId: string, val: string) => {
    if (val) {
      const formatted = formatSocialUrl(platformId, val)
      if (formatted !== val) {
        updateConfig(`socialLinks.${platformId}`, formatted)
      }
    }
  }

  const activeCount = Object.values(config.socialLinks || {}).filter(Boolean).length

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Social Channels</h2>
          <p className="text-xs text-gray-500 mt-0.5">Connect your social media profiles & channels</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-800 rounded-lg">
          {activeCount} Connected
        </span>
      </div>

      <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center p-2 flex-shrink-0 shadow-2xs">
          <Share2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm text-purple-950">Official Brand Icons</h3>
          <p className="text-xs text-purple-800 mt-0.5 leading-relaxed">
            Enter your handle (e.g. <code className="bg-purple-100 px-1 py-0.5 rounded font-mono text-purple-900">@username</code>) or full URL. Icons display as small circular buttons below your profile.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {socialPlatforms.map((platform) => {
          const rawVal = config.socialLinks?.[platform.id] || ''
          const isConnected = Boolean(rawVal)
          return (
            <div 
              key={platform.id}
              className={`p-3.5 bg-white border rounded-2xl transition-all shadow-2xs ${
                isConnected ? 'border-purple-300 ring-2 ring-purple-500/10' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 transition-colors flex-shrink-0 ${
                  isConnected ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  <ServiceIcon iconId={platform.id} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900 flex items-center gap-2">
                      <span>{platform.name}</span>
                      {isConnected && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> Connected
                        </span>
                      )}
                    </label>
                    {isConnected && (
                      <button
                        onClick={() => updateConfig(`socialLinks.${platform.id}`, '')}
                        className="text-[11px] font-semibold text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={rawVal}
                    onChange={(e) => handleInputChange(platform.id, e.target.value)}
                    onBlur={(e) => handleInputBlur(platform.id, e.target.value)}
                    placeholder={platform.placeholder}
                    className="w-full bg-gray-50/50 border border-gray-200 focus:border-purple-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Shop Panel Component
function ShopPanel({ config, onOpenAddModal }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Shop</h2>
        <p className="text-gray-600">Add products and services to sell</p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Start Selling</h3>
            <p className="text-sm text-gray-700 mb-4">Add products with prices, descriptions, and images. Perfect for creators, artists, and small businesses.</p>
            <button
              onClick={onOpenAddModal}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-sm shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Shop Features</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">Product Listings</h4>
            <p className="text-xs text-gray-600">Add unlimited products</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">Pricing</h4>
            <p className="text-xs text-gray-600">Set prices & currency</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">Stock Status</h4>
            <p className="text-xs text-gray-600">Show availability</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mb-2" />
            <h4 className="font-semibold text-sm mb-1">Descriptions</h4>
            <p className="text-xs text-gray-600">Detailed product info</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong> After adding a product, go to the "Links" tab to edit its details, price, and description.
        </p>
      </div>
    </div>
  )
}

// SEO Panel Component
function SEOPanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Settings</h2>
        <p className="text-gray-600">Optimize your page for search engines</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Search className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-1">Search Engine Optimization</h3>
            <p className="text-sm text-green-700">Help people find your page on Google and other search engines.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Page Title</label>
          <input
            type="text"
            value={config.profile.title || ''}
            onChange={(e) => updateConfig('profile.title', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Your Name or Brand"
            maxLength={60}
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
          <textarea
            value={config.profile.bio || ''}
            onChange={(e) => updateConfig('profile.bio', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows={3}
            placeholder="Brief description of your page..."
            maxLength={160}
          />
          <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Keywords</label>
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">SEO Checklist</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Page title is set</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Meta description added</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">Profile image uploaded</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Analytics Panel Component
function AnalyticsPanel({ config }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Track your page performance</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Track Your Success</h3>
            <p className="text-sm text-gray-700 mb-4">View detailed analytics after you save and publish your page. Track views, clicks, and engagement.</p>
            <button
              onClick={() => window.open('/my-cards', '_blank')}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-sm shadow-md"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Full Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg text-center">
          <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-600">Total Views</p>
        </div>
        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg text-center">
          <ExternalLink className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-600">Link Clicks</p>
        </div>
        <div className="p-4 bg-white border-2 border-gray-200 rounded-lg text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900">0%</p>
          <p className="text-sm text-gray-600">Click Rate</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Features</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Page Views</h4>
              <p className="text-xs text-gray-600">Track how many people visit your page</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Link Clicks</h4>
              <p className="text-xs text-gray-600">See which links get the most engagement</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Click-Through Rate</h4>
              <p className="text-xs text-gray-600">Measure your conversion performance</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Export Data</h4>
              <p className="text-xs text-gray-600">Download your analytics as CSV</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── tiny icon for preview phone ───────────────────────────────────────────
function PreviewIcon({ link, color }: { link: LinkItem; color: string }) {
  const map: Record<string, React.FC<{ size?: number; className?: string }>> = {
    instagram: InstagramIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
    spotify: SpotifyIcon, twitter: TwitterIcon, facebook: FacebookIcon,
    linkedin: LinkedInIcon, discord: DiscordIcon, github: GitHubIcon,
    whatsapp: WhatsAppIcon, telegram: TelegramIcon, soundcloud: SoundCloudIcon,
    'apple-music': AppleMusicIcon,
  }
  const Icon = link.platform && map[link.platform] ? map[link.platform] : null
  if (Icon) return <Icon size={10} className="flex-shrink-0" />
  if (link.type === 'shop')    return <ShoppingBag className="w-2.5 h-2.5 flex-shrink-0" />
  if (link.type === 'contact') return <User        className="w-2.5 h-2.5 flex-shrink-0" />
  if (link.type === 'event')   return <Globe       className="w-2.5 h-2.5 flex-shrink-0" />
  return <LinkIcon className="w-2.5 h-2.5 flex-shrink-0" />
}

// ── Preview Component — matches Linktree's exact layout ─────────────────
// ── Preview Component — compact, fits 500px screen height, no scroll ─────
function BioLinkPreview({ config }: { config: BioLinkConfig }) {
  const [playingVideos, setPlayingVideos] = useState<Record<string, boolean | string>>({})
  const [latestVideoDetails, setLatestVideoDetails] = useState<Record<string, { thumbnailUrl?: string; title?: string; latestUrl?: string }>>({})

  useEffect(() => {
    if (!config?.links) return
    const targetLinks = config.links.filter(l => (l.videoClickOption === 'open_latest' || l.videoClickOption === 'display_latest') && l.url)
    if (targetLinks.length === 0) return

    targetLinks.forEach(async (link) => {
      try {
        const res = await fetch(`/api/youtube-latest?url=${encodeURIComponent(link.url)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.thumbnailUrl || data.title) {
            setLatestVideoDetails(prev => ({
              ...prev,
              [link.id]: {
                thumbnailUrl: data.thumbnailUrl,
                title: data.title,
                latestUrl: data.latestUrl,
              }
            }))
          }
        }
      } catch {
        // ignore
      }
    })
  }, [config?.links])

  if (!config) return null

  // Use formatAndNormalizeTheme for button/font/palette — but read background
  // fields DIRECTLY from config.theme.colors so no normalization can drop them.
  const theme = formatAndNormalizeTheme(config.theme)
  const rawColors = config.theme.colors  // direct — never normalized away
  const c: typeof theme.colors = {
    ...theme.colors,
    backgroundVideo:   rawColors?.backgroundVideo   ?? '',
    backgroundIframe:  rawColors?.backgroundIframe  ?? '',
    backgroundImage:   rawColors?.backgroundImage   ?? '',
    backgroundOverlay: rawColors?.backgroundOverlay ?? '',
    backgroundMesh:    rawColors?.backgroundMesh    ?? theme.colors.backgroundMesh,
    backgroundGradient: rawColors?.backgroundGradient ?? theme.colors.backgroundGradient,
    backgroundType:    (rawColors?.backgroundType || undefined) as typeof theme.colors.backgroundType,
  }
  // The preview renders its overlay as a separate layer below, so avoid
  // compositing it into the background image a second time.
  const bg = themeBackground({ ...theme, colors: { ...c, backgroundOverlay: '' } })
  const profile = config.profile || { title: 'satvikpatel8373', bio: '', avatar: '' }
  const links = config.links || []

  const bs = theme.buttonStyle || {}
  const bStyle = bs?.style ?? 'solid'
  const animEnabled = bs?.enableAnimations ?? true
  const animStyle = bs?.animation ?? 'bounce'

  let animClasses = 'cursor-pointer hover:opacity-95 active:scale-[0.97] transition-all duration-200'
  if (animEnabled) {
    if (animStyle === 'bounce') animClasses = 'cursor-pointer hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out'
    else if (animStyle === 'pulse') animClasses = 'cursor-pointer animate-pulse hover:animate-none hover:scale-[1.02] transition-all'
    else if (animStyle === 'wobble') animClasses = 'cursor-pointer hover:animate-bounce hover:scale-[1.02] transition-all'
    else if (animStyle === 'slide') animClasses = 'cursor-pointer hover:translate-x-1.5 transition-transform duration-200 ease-out'
  }

  const makeBtnStyle = (overrideHeight?: number | string, flexDir?: any): React.CSSProperties => {
    const r = bs?.borderRadius ?? 20
    const shStyle = bs?.shadowStyle ?? (bs?.shadow ? 'soft' : 'none')
    const bWidth = bs?.borderWidth ?? 0
    const bColor = bs?.borderColor || c.buttonText || '#000000'

    let boxShadow = 'none'
    if (shStyle === 'soft') boxShadow = '0 3px 12px rgba(0,0,0,0.08)'
    else if (shStyle === 'strong') boxShadow = '0 8px 24px rgba(0,0,0,0.22)'
    else if (shStyle === 'hard') boxShadow = `3px 3px 0px ${bColor}`

    const base: React.CSSProperties = {
      fontFamily: theme.fonts?.body || 'Inter, sans-serif',
      borderRadius: r > 20 ? '9999px' : `${r}px`,
      width: '100%',
      display: 'flex',
      flexDirection: flexDir || 'row',
      alignItems: flexDir === 'column' ? 'stretch' : 'center',
      justifyContent: 'space-between',
      height: overrideHeight !== undefined ? overrideHeight : 44,
      padding: flexDir === 'column' ? '0' : (overrideHeight === 32 ? '0 10px' : '0 12px'),
      flexShrink: 0,
      position: 'relative',
      textDecoration: 'none',
      overflow: 'hidden',
      boxShadow,
    }
    const getSmartContrast = (bgHex?: string, fallbackText?: string) => {
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
      return fallbackText || c.profileText || '#0f172a'
    }

    switch (bStyle) {
      case 'clay':
        const isClayWhite = !c.buttonDefault || c.buttonDefault === '#ffffff' || c.buttonDefault === '#FFFFFF'
        const clayBg = isClayWhite ? 'rgba(255, 255, 255, 0.92)' : c.buttonDefault
        return {
          ...base,
          backgroundColor: clayBg,
          color: getSmartContrast(isClayWhite ? '#ffffff' : c.buttonDefault, c.buttonText),
          border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : '1px solid rgba(255, 255, 255, 0.65)',
          boxShadow: 'inset 0 3px 6px rgba(255, 255, 255, 0.8), inset 0 -3px 6px rgba(0, 0, 0, 0.12), 0 12px 26px -4px rgba(0, 0, 0, 0.26)',
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
          boxShadow: boxShadow !== 'none' ? boxShadow : '0 4px 18px rgba(0,0,0,0.1)',
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
          color: getSmartContrast(hardBg, c.buttonText),
          border: `${Math.max(bWidth, 2)}px solid ${hardBorder}`,
          boxShadow: `3px 3px 0px ${hardBorder}`,
        }
      case 'fill':
        const fillBg = c.buttonDefault || '#ffffff'
        return {
          ...base,
          backgroundColor: fillBg,
          color: getSmartContrast(fillBg, c.buttonText),
          border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : 'none',
          boxShadow: 'none',
        }
      case 'soft':
        const softBg = c.buttonDefault || '#ffffff'
        return {
          ...base,
          backgroundColor: softBg,
          color: getSmartContrast(softBg, c.buttonText),
          border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow: '0 12px 28px -6px rgba(0, 0, 0, 0.22), 0 6px 12px -4px rgba(0, 0, 0, 0.12)',
        }
      default: // solid
        const solidBg = c.buttonDefault || '#ffffff'
        return {
          ...base,
          backgroundColor: solidBg,
          color: getSmartContrast(solidBg, c.buttonText),
          border: bWidth > 0 ? `${bWidth}px solid ${bColor}` : 'none',
          boxShadow: boxShadow !== 'none' ? boxShadow : '0 3px 10px rgba(0,0,0,0.1)',
        }
    }
  }

  const btnStyle = makeBtnStyle()
  
  // Filter visible links and check schedule
  const now = new Date()
  const visible = config.links.filter(l => {
    if (l.isVisible === false) return false
    
    // Check scheduling
    if (l.isScheduled) {
      if (l.scheduleStart) {
        const start = new Date(l.scheduleStart)
        if (now < start) return false
      }
      if (l.scheduleEnd) {
        const end = new Date(l.scheduleEnd)
        if (now > end) return false
      }
    }
    
    return true
  })
  
  // Sort: pinned first, then by order
  const sortedLinks = [...visible].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })
  
  const displayLinks = sortedLinks

  // Active social icons come EXCLUSIVELY from config.socialLinks
  const activeSocialIcons: { platform: string; url: string }[] = []
  if (config.socialLinks) {
    Object.entries(config.socialLinks).forEach(([platform, url]) => {
      if (url && url.trim()) {
        activeSocialIcons.push({ platform: platform.toLowerCase(), url: url.trim() })
      }
    })
  }

  function extractYouTubeThumb(url?: string): string | null {
    if (!url) return null
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
    if (match && match[1]) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    if (url.toLowerCase().includes('youtube.com') || url.toLowerCase().includes('youtu.be')) {
      return `https://img.youtube.com/vi/hqdefault.jpg`
    }
    return null
  }

  const PlatformThumb = ({ link }: { link: LinkItem }) => {
    const map: Record<string, React.FC<{ size?: number; className?: string }>> = {
      instagram: InstagramIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
      spotify: SpotifyIcon, twitter: TwitterIcon, facebook: FacebookIcon,
      linkedin: LinkedInIcon, discord: DiscordIcon, github: GitHubIcon,
      whatsapp: WhatsAppIcon, telegram: TelegramIcon, soundcloud: SoundCloudIcon,
      shopify: ShopifyIcon, email: EmailIcon, phone: PhoneIcon, website: WebsiteIcon,
      'apple-music': AppleMusicIcon,
    }
    const url = (link.url || '').toLowerCase()
    let iconKey = (link.platform || link.icon || '').toLowerCase()

    if (!map[iconKey]) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) iconKey = 'youtube'
      else if (url.includes('instagram.com')) iconKey = 'instagram'
      else if (url.includes('spotify.com')) iconKey = 'spotify'
      else if (url.includes('twitter.com') || url.includes('x.com')) iconKey = 'twitter'
      else if (url.includes('facebook.com')) iconKey = 'facebook'
      else if (url.includes('tiktok.com')) iconKey = 'tiktok'
      else if (url.includes('github.com')) iconKey = 'github'
      else if (url.includes('linkedin.com')) iconKey = 'linkedin'
    }

    const Icon = map[iconKey] || null
    const isYouTube = iconKey === 'youtube'

    return (
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
        isYouTube ? 'bg-red-600 text-white' : 'bg-black/10 text-current'
      }`}>
        {link.thumbnail ? (
          <img src={link.thumbnail} alt="" className="w-full h-full object-cover" />
        ) : Icon ? (
          <Icon size={14} />
        ) : link.type === 'shop' ? (
          <ShoppingBag className="w-3.5 h-3.5" />
        ) : link.type === 'contact' ? (
          <User className="w-3.5 h-3.5" />
        ) : link.type === 'event' ? (
          <Globe className="w-3.5 h-3.5" />
        ) : (
          <LinkIcon className="w-3.5 h-3.5" />
        )}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', ...bg }}>
      {c.backgroundImage && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `url(${c.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: theme.backgroundFilter || 'none',
          }}
        />
      )}
      {/* Video Background */}
      {c.backgroundVideo && (
        <video
          key={c.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          src={c.backgroundVideo}
        />
      )}

      {/* YouTube / Vimeo / iframe Background */}
      {c.backgroundIframe && (
        <iframe
          src={getEmbedIframeUrl(c.backgroundIframe)}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none border-0 scale-150"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
        />
      )}

      {/* Overlay */}
      {c.backgroundOverlay && (
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: c.backgroundOverlay }} />
      )}

      {theme.noiseOpacity && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: theme.noiseOpacity, mixBlendMode: 'overlay' as any
        }} />
      )}

      {/* ── Outer Card Wrapper matching user reference image ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', padding: '16px 14px 10px', overflowY: 'auto' }}>

        {/* ── Top Bar Action Buttons (Inside Card) ── */}
        <div className="flex items-center justify-between w-full mb-3 flex-shrink-0 relative z-30">
          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-white/30 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-white/30 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* ── Avatar Profile Header (Dynamic Layouts) ── */}
        {(() => {
          const headerLayout = (profile as any)?.headerLayout || 'classic'
          const headerShape = (profile as any)?.headerShape || 'loop'
          const bannerImage = (profile as any)?.bannerImage || ''
          const avatarSrc = profile?.avatar && profile?.avatar !== 'user' ? profile.avatar : ''
          const hasImg = (src?: string) => Boolean(src && (src.startsWith('http') || src.startsWith('data:') || src.length > 10))

          // 1. HERO LAYOUT
          if (headerLayout === 'hero') {
            return (
              <div className="flex flex-col items-center text-center flex-shrink-0 mb-4 -mx-[14px] -mt-[56px] pt-14 relative h-[260px] overflow-hidden justify-end p-4">
                {hasImg(avatarSrc) ? (
                  <img
                    src={avatarSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.8) 75%, transparent 100%)'
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold"
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

                <div className="relative z-10 text-center pb-1">
                  <h2 className="text-sm font-black leading-snug tracking-tight mb-0.5 text-white drop-shadow-md" style={{ fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                    {config.profile.title || 'satvikpatel8373'}
                  </h2>
                  {config.profile.bio && (
                    <p className="text-[11px] opacity-95 max-w-[200px] mx-auto line-clamp-2 font-medium leading-tight text-white drop-shadow-sm" style={{ fontFamily: theme.fonts?.body || 'Inter, sans-serif' }}>
                      {config.profile.bio}
                    </p>
                  )}
                </div>
              </div>
            )
          }

          // 2. BANNER LAYOUT
          if (headerLayout === 'banner') {
            return (
              <div className="flex flex-col items-center text-center flex-shrink-0 mb-4">
                <div className="w-[calc(100%+28px)] h-32 -mx-[14px] -mt-[56px] relative bg-slate-200 border-b border-white/20 shadow-sm overflow-hidden flex items-center justify-center">
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
                      <ImageIcon size={24} opacity={0.7} />
                    </div>
                  )}
                </div>

                <div className="mb-2 flex justify-center relative z-10 -mt-10">
                  {hasImg(avatarSrc) ? (
                    <img src={avatarSrc} alt="" className="w-20 h-20 rounded-full object-cover shadow-md" />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shadow-md"
                      style={{
                        backgroundColor: c.buttonDefault || '#1e293b',
                        color: c.buttonText || c.profileText || '#ffffff'
                      }}
                    >
                      {(config.profile.title || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="text-xs font-black leading-snug tracking-tight mb-0.5" style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                  {config.profile.title || 'satvikpatel8373'}
                </h2>
                {config.profile.bio && (
                  <p className="text-[10px] opacity-85 max-w-[200px] mx-auto line-clamp-2 font-medium leading-tight" style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter, sans-serif' }}>
                    {config.profile.bio}
                  </p>
                )}
              </div>
            )
          }

          // 4. SHAPE LAYOUT
          if (headerLayout === 'shape') {
            const shapeBorderRadius =
              headerShape === 'flower' ? '38% 62% 63% 37% / 41% 44% 56% 59%' :
              headerShape === 'loop' ? '60% 40% 30% 70% / 60% 30% 70% 40%' :
              headerShape === 'oval' ? '50% / 35%' :
              headerShape === 'burst' ? '30% 70% 70% 30% / 50% 30% 70% 50%' : '26px'

            return (
              <div className="flex flex-col items-center text-center flex-shrink-0 mb-3">
                <div className="mb-2 flex justify-center">
                  <div
                    className="w-36 h-28 overflow-hidden shadow-2xl flex items-center justify-center relative transition-all duration-300 border-2 border-white/40"
                    style={{
                      borderRadius: shapeBorderRadius,
                      backgroundColor: c.buttonDefault || c.accent || '#4F46E5'
                    }}
                  >
                    {hasImg(avatarSrc) ? (
                      <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold" style={{ color: c.buttonText || '#ffffff' }}>
                        {(config.profile.title || '?')[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xs font-black leading-snug tracking-tight mb-0.5" style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter, sans-serif' }}>
                  {config.profile.title || 'satvikpatel8373'}
                </h2>
                {config.profile.bio && (
                  <p className="text-[10px] opacity-85 max-w-[200px] mx-auto line-clamp-2 font-medium leading-tight" style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter, sans-serif' }}>
                    {config.profile.bio}
                  </p>
                )}
              </div>
            )
          }

          // 5. CLASSIC LAYOUT (DEFAULT)
          return (
            <div className="flex flex-col items-center text-center flex-shrink-0 mb-4">
              <div className="mb-2">
                {hasImg(avatarSrc) ? (
                  <img
                    src={avatarSrc}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-md">
                    {avatarSrc || <User className="w-7 h-7 text-white/70" />}
                  </div>
                )}
              </div>

              <h2
                className="text-xs font-black leading-snug tracking-tight mb-0.5"
                style={{ color: c.profileText, fontFamily: theme.fonts?.heading || 'Inter' }}
              >
                {config.profile.title || 'satvikpatel8373'}
              </h2>

              {config.profile.bio && (
                <p
                  className="text-[10px] opacity-85 max-w-[200px] mx-auto line-clamp-2 font-medium leading-tight"
                  style={{ color: c.profileBio, fontFamily: theme.fonts?.body || 'Inter' }}
                >
                  {config.profile.bio}
                </p>
              )}
            </div>
          )
        })()}

        {/* ── Social Icons Bar (Top Position) ── */}
        {activeSocialIcons.length > 0 && (config.socialIconPosition || 'top') === 'top' && (
          <div className="flex justify-center items-center gap-2 mb-3 px-2 flex-wrap flex-shrink-0">
            {activeSocialIcons.map(({ platform, url }) => (
              <a
                key={platform}
                href={url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!url || url === '#') e.preventDefault() }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: c.profileText || '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                title={platform}
              >
                <ServiceIcon iconId={platform} size={14} />
              </a>
            ))}
          </div>
        )}

        {/* ── Stacked Linktree Link Buttons ── */}
        <div className="w-full flex flex-col gap-2 flex-shrink-0 mb-3">
          {displayLinks.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: 10, color: c.profileBio, opacity: 0.4, padding: '12px 0' }}>
              No links added yet
            </p>
          )}
          {(() => {
            const renderSinglePreviewLink = (link: LinkItem) => {
              if (link.type === 'header') {
                const text = (link.groupTitle || link.text || '').trim()
                const isDefault = !text || text.toLowerCase() === 'add collection title' || text.toLowerCase() === 'new section' || text.toLowerCase() === 'section header'
                if (isDefault) return null

                return (
                  <div key={link.id} className="flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-white/20" />
                    <span className="text-[9px] font-bold tracking-wider uppercase opacity-60" style={{ color: c.profileText }}>
                      {text}
                    </span>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>
                )
              }
              if (link.type === 'text') return (
                <p key={link.id} className="text-center text-[10px] opacity-75 font-medium leading-relaxed px-1" style={{ color: c.profileBio }}>
                  {link.description || link.text}
                </p>
              )

              const isFeatured = link.layout === 'featured'
              const isCompact = link.layout === 'compact'
              const customStyle = isCompact 
                ? makeBtnStyle(32) 
                : isFeatured 
                ? makeBtnStyle('auto', 'column') 
                : makeBtnStyle(44)

              const isYouTube = (link.url || '').toLowerCase().includes('youtube.com') || (link.url || '').toLowerCase().includes('youtu.be')
              const ytThumb = isYouTube ? extractYouTubeThumb(link.url) : null
              const latestInfo = latestVideoDetails[link.id]
              const cardThumb = latestInfo?.thumbnailUrl || link.thumbnail || ytThumb
              const cardTitle = latestInfo?.title || link.text || 'YouTube Video'
              const clickOpt = link.videoClickOption || 'display_video'

              // ── YOUTUBE VIDEO CARD FORMAT 1: "Display my video on my Linktree" (display_video / display_latest) ──
              if (isYouTube && (clickOpt === 'display_video' || clickOpt === 'display_latest')) {
                const isPlaying = Boolean(playingVideos[link.id])

                if (isPlaying) {
                  const playingTarget = typeof playingVideos[link.id] === 'string' ? (playingVideos[link.id] as unknown as string) : ''
                  const embedSrc = getEmbedIframeUrl(playingTarget || link.embedUrl || link.url || '')
                  const autoSrc = embedSrc ? `${embedSrc}${embedSrc.includes('?') ? '&' : '?'}autoplay=1${link.videoMute ? '&mute=1' : ''}` : ''
                  return (
                    <div key={link.id} className="relative w-full h-[140px] rounded-lg overflow-hidden shadow-md border border-white/10 bg-black flex flex-col justify-center">
                      <iframe
                        src={autoSrc}
                        className="w-full h-full absolute inset-0 border-0 rounded-md"
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
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                }

                return (
                  <a
                    key={link.id}
                    href={link.url || '#'}
                    onClick={async (e) => {
                      e.preventDefault()
                      if (clickOpt === 'display_latest') {
                        const preEmbed = latestInfo?.latestUrl
                        if (preEmbed) {
                          setPlayingVideos(prev => ({ ...prev, [link.id]: preEmbed }))
                          return
                        }
                        try {
                          const res = await fetch(`/api/youtube-latest?url=${encodeURIComponent(link.url || '')}`)
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
                    className={`group relative w-full h-[140px] flex flex-col justify-end rounded-lg overflow-hidden shadow-md border border-white/10 block text-decoration-none transition-all ${animClasses}`}
                  >
                    {/* Background Image */}
                    {cardThumb ? (
                      <img
                        src={cardThumb}
                        alt={cardTitle}
                        className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full absolute inset-0 bg-slate-900 flex items-center justify-center">
                        <YouTubeIcon size={36} className="text-red-600" />
                      </div>
                    )}

                    {/* Center Translucent Play Button Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4.5 h-4.5 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Gradient & Video Info */}
                    <div className="relative bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5 z-10 text-left w-full pt-8">
                      <h4 className="font-bold text-white text-xs leading-tight drop-shadow-md line-clamp-2">
                        {cardTitle}
                      </h4>
                    </div>
                  </a>
                )
              }

              // ── YOUTUBE VIDEO CARD FORMAT 2: "Open YouTube video" (open_youtube) ──
              if (isYouTube && clickOpt === 'open_youtube') {
                return (
                  <a
                    key={link.id}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!link.url || link.url === '#') e.preventDefault()
                    }}
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

              // ── YOUTUBE VIDEO CARD FORMAT 3: "Open my channel's latest video" (open_latest) ──
              if (isYouTube && clickOpt === 'open_latest') {
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={async () => {
                      try {
                        const targetUrl = latestInfo?.latestUrl
                        if (targetUrl) {
                          window.open(targetUrl, '_blank', 'noopener,noreferrer')
                          return
                        }
                        const res = await fetch(`/api/youtube-latest?url=${encodeURIComponent(link.url || '')}`)
                        const data = await res.json()
                        const target = data.latestUrl || link.url
                        window.open(target, '_blank', 'noopener,noreferrer')
                      } catch {
                        window.open(link.url || '', '_blank', 'noopener,noreferrer')
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

              // ── 2. COMPACT ROW LAYOUT (Slim Chip Bar) ──
              if (isCompact) {
                return (
                  <a
                    key={link.id}
                    href={link.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!link.url || link.url === '#') e.preventDefault()
                    }}
                    style={{ ...makeBtnStyle(32), padding: '0 10px' }}
                    className={`group ${animClasses}`}
                  >
                    <PlatformThumb link={link} />
                    <span className="flex-1 text-left font-bold text-[10px] truncate px-2" style={{ color: c.buttonText }}>
                      {link.text}
                    </span>
                    <div className="w-4 flex items-center justify-end opacity-40 group-hover:opacity-80 transition-opacity">
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </a>
                )
              }

              // CLASSIC BUTTON LAYOUT (DEFAULT)
              return (
                <a
                  key={link.id}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!link.url || link.url === '#') e.preventDefault()
                  }}
                  style={customStyle}
                  className={`group ${animClasses}`}
                >
                  <PlatformThumb link={link} />
                  <div className="flex-1 min-w-0 text-center px-2">
                    <p className="font-extrabold text-[11px] leading-tight truncate" style={{ color: c.buttonText }}>
                      {link.text}
                    </p>
                    {link.description && (
                      <p className="text-[9.5px] truncate opacity-65 leading-tight mt-0.5" style={{ color: c.buttonText }}>
                        {link.description}
                      </p>
                    )}
                  </div>
                  <div className="w-5 flex items-center justify-end opacity-40 group-hover:opacity-80 transition-opacity">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              )
            }

            return displayLinks.map((link) => {
              if (link.groupId && !link.isGroupHeader) return null

              if (link.isGroupHeader) {
                const groupLinks = displayLinks.filter(l => l.groupId === link.id && !l.isGroupHeader)
                const layout = link.collectionLayout || 'stack'

                return (
                  <div key={link.id} className="w-full space-y-2">
                    {renderSinglePreviewLink(link)}

                    {groupLinks.length > 0 && (
                      <div className="w-full">
                        {layout === 'grid' && (
                          <div className="grid grid-cols-2 gap-2.5 w-full items-stretch">
                            {groupLinks.map(gLink => (
                              <div key={gLink.id} className="w-full h-full flex flex-col">
                                {renderSinglePreviewLink(gLink)}
                              </div>
                            ))}
                          </div>
                        )}

                        {layout === 'carousel' && (
                          <div className="-mx-1 px-1 flex gap-3 overflow-x-auto pb-3 pt-1.5 w-full snap-x snap-mandatory scrollbar-none items-stretch">
                            {groupLinks.map(gLink => (
                              <div key={gLink.id} className="w-[220px] shrink-0 snap-center flex flex-col">
                                {renderSinglePreviewLink(gLink)}
                              </div>
                            ))}
                          </div>
                        )}

                        {layout === 'showcase' && (
                          <div className="w-full space-y-2">
                            {renderSinglePreviewLink({ ...groupLinks[0], layout: 'featured' })}
                            {groupLinks.length > 1 && (
                              <div className="grid grid-cols-2 gap-2 w-full">
                                {groupLinks.slice(1).map(renderSinglePreviewLink)}
                              </div>
                            )}
                          </div>
                        )}

                        {layout === 'stack' && (
                          <div className="w-full space-y-2">
                            {groupLinks.map(renderSinglePreviewLink)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              }

              return renderSinglePreviewLink(link)
            })
          })()}
        </div>

        <div className="flex-1" />

        {/* ── Social Icons Bar (Bottom Position) ── */}
        {activeSocialIcons.length > 0 && config.socialIconPosition === 'bottom' && (
          <div className="flex justify-center items-center gap-2 mb-3 px-2 flex-wrap flex-shrink-0">
            {activeSocialIcons.map(({ platform, url }) => (
              <a
                key={platform}
                href={url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!url || url === '#') e.preventDefault() }}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: c.profileText || '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                title={platform}
              >
                <ServiceIcon iconId={platform} size={14} />
              </a>
            ))}
          </div>
        )}

        {/* ── Bottom Linktree Join Pill Button ── */}
        <div className="w-full flex-shrink-0 flex items-center justify-center py-2 px-3 rounded-full bg-white text-slate-900 shadow-md mb-2 cursor-pointer hover:bg-slate-50 active:scale-95 transition-all">
          <span className="text-[10px] font-extrabold text-center truncate">
            Join {config.profile.title || 'satvikpatel8373'} on BioLink
          </span>
        </div>

        <p style={{ fontSize: 8, color: c.profileBio, opacity: 0.28, textAlign: 'center', flexShrink: 0 }}>Report · Privacy</p>
      </div>
    </div>
  )
}



interface LinkOption {
  id: string; label: string; description: string
  bg: string; SvgIcon: React.FC<{ size?: number; className?: string }>
  type: LinkItem['type']; platform?: string
}
const PatreonSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M14.82 2.41C18.78 2.41 22 5.65 22 9.62c0 3.96-3.22 7.19-7.18 7.19-3.95 0-7.17-3.23-7.17-7.19 0-3.97 3.22-7.21 7.17-7.21M2 21.6h3.5V2.41H2V21.6z"/></svg>
)
const KoFiSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>
)
const EtsySvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M9.16 4.81c0-.49.07-1.64.07-1.64s.07-.73.8-.73h7.6s.73 0 .73.73v2.18s0 .73-.73.73H9.9s-.73 0-.73-.73v-.54zm0 14.38c0 .49-.07 1.64-.07 1.64s-.07.73-.8.73H.73S0 21.57 0 20.84V3.16S0 2.43.73 2.43h7.6s.73 0 .73.73v16.03zm5.45-7.19c0-.49.07-1.64.07-1.64s.07-.73.8-.73h7.6s.73 0 .73.73v2.18s0 .73-.73.73h-7.6s-.73 0-.73-.73v-.54z"/></svg>
)
const GumroadSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19.2c-3.975 0-7.2-3.225-7.2-7.2S8.025 4.8 12 4.8c2.7 0 5.04 1.485 6.3 3.675H14.4v2.4h6.6c.12-.615.2-1.245.2-1.875C21.2 5.37 17.03 1.2 12 1.2S2.8 5.37 2.8 10.4 6.97 19.6 12 19.6c3.15 0 5.94-1.545 7.65-3.9H16.2c-1.005 1.14-2.46 1.5-4.2 1.5z"/></svg>
)
const SnapchatSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.017 0C8.396 0 5.29 2.69 5.29 6.3c0 .42.04.83.12 1.23-.27.14-.56.22-.87.22-.5 0-.96-.2-1.3-.52l-.01-.01c-.1-.09-.23-.14-.37-.14-.28 0-.5.22-.5.5 0 .16.08.31.2.41.52.46 1.2.74 1.95.74.17 0 .34-.02.5-.05-.02.22-.03.44-.03.67 0 3.61 3.11 6.3 6.73 6.3.18 0 .36-.01.54-.02.28.5.44 1.07.44 1.67 0 .28-.04.55-.11.81-.07.26.08.53.34.6.26.07.53-.08.6-.34.1-.35.15-.71.15-1.07 0-.74-.19-1.44-.52-2.05 3.28-.42 5.82-3.04 5.82-6.3 0-3.61-3.11-6.3-6.73-6.3z"/></svg>
)
const PinterestSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
)

const CORE_BLOCKS = [
  { id: 'link',      label: 'Link',       description: 'Add any URL button with smart platform auto-detection', bg: 'bg-indigo-600', SvgIcon: WebsiteIcon,   type: 'link' as LinkItem['type'] },
  { id: 'header',    label: 'Header',     description: 'Section heading to organize your page',                 bg: 'bg-slate-700',  SvgIcon: ({ size, className }: any) => <Layout size={size} className={className} />, type: 'header' as LinkItem['type'] },
  { id: 'text',      label: 'Text',       description: 'Add body text, announcements, or bio notes',            bg: 'bg-slate-500',  SvgIcon: ({ size, className }: any) => <Type size={size} className={className} />, type: 'text' as LinkItem['type'] },
  { id: 'video',     label: 'Video',      description: 'Embed playable YouTube, TikTok, or Vimeo video',         bg: 'bg-red-600',    SvgIcon: YouTubeIcon,  type: 'video' as LinkItem['type'], platform: 'youtube' },
  { id: 'form',      label: 'Form',       description: 'Collect emails, feedback, survey & waitlist signups',    bg: 'bg-purple-600', SvgIcon: ({ size, className }: any) => <User size={size} className={className} />, type: 'form' as LinkItem['type'] },
  { id: 'contact',   label: 'Contact',    description: 'Email, phone, WhatsApp, or Telegram chat link',          bg: 'bg-sky-500',    SvgIcon: PhoneIcon,  type: 'contact' as LinkItem['type'] },
  { id: 'file',      label: 'File',       description: 'Share Google Drive docs, PDFs, & file downloads',       bg: 'bg-blue-600',   SvgIcon: ({ size, className }: any) => <Upload size={size} className={className} />, type: 'link' as LinkItem['type'], platform: 'google-drive' },
  { id: 'embed',     label: 'Embed',      description: 'Embed Spotify, SoundCloud, or custom web iFrames',       bg: 'bg-pink-600',   SvgIcon: SpotifyIcon,  type: 'music' as LinkItem['type'], platform: 'spotify' },
  { id: 'gallery',   label: 'Gallery',    description: 'Showcase photos in grid, stack, or carousel',           bg: 'bg-amber-600',  SvgIcon: ({ size, className }: any) => <ImageIcon size={size} className={className} />, type: 'link' as LinkItem['type'] },
  { id: 'divider',   label: 'Divider',    description: 'Add a subtle visual separator line',                    bg: 'bg-slate-400',  SvgIcon: ({ size, className }: any) => <Asterisk size={size} className={className} />, type: 'text' as LinkItem['type'] },
  { id: 'store',     label: 'Store',      description: 'Sell products & digital downloads with pricing', bg: 'bg-purple-700', SvgIcon: ShopifyIcon, type: 'shop' as LinkItem['type'] },
  { id: 'donation',  label: 'Donation',   description: 'Accept tips, coffee donations & one-time payments',     bg: 'bg-emerald-500',SvgIcon: ({ size, className }: any) => <User size={size} className={className} />, type: 'payment' as LinkItem['type'] },
  { id: 'countdown', label: 'Countdown',  description: 'Display countdown timer for launches & events',         bg: 'bg-blue-700',   SvgIcon: ({ size, className }: any) => <Calendar size={size} className={className} />, type: 'event' as LinkItem['type'] },
  { id: 'rss',       label: 'RSS Feed',   description: 'Stream latest blog posts, news & RSS updates',           bg: 'bg-orange-500', SvgIcon: ({ size, className }: any) => <Globe size={size} className={className} />, type: 'link' as LinkItem['type'] },
]

function LegacyAddLinkModal({ onClose, onAdd }: { onClose: () => void; onAdd: (preset: Partial<LinkItem>) => void }) {
  const [search, setSearch] = useState('')

  const detected = search.trim() ? detectPlatformFromUrl(search.trim()) : null

  const filteredBlocks = search.trim()
    ? CORE_BLOCKS.filter(b =>
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
      )
    : CORE_BLOCKS

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Add Block</h2>
            <p className="text-xs text-gray-500">Choose a core block or paste a URL for instant auto-detection</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search & URL Input */}
        <div className="px-6 py-3 flex-shrink-0">
          <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3 space-x-3 border border-gray-200/80">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Paste URL (e.g. instagram.com/john) or search block..."
              className="bg-transparent flex-1 text-sm font-semibold text-gray-800 placeholder-gray-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="cursor-pointer">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0 space-y-3">

          {/* Auto Detection Card if URL pasted */}
          {detected && (
            <div className="p-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200 rounded-2xl flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${detected.bgGradient || 'bg-purple-600'}`}>
                  <ServiceIcon iconId={detected.icon} size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wide">Auto-Detected Platform</p>
                  <p className="text-sm font-extrabold text-slate-900">{detected.name} ({detected.category})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onAdd({
                    type: detected.category === 'video' ? 'video' : detected.category === 'music' ? 'music' : 'link',
                    text: detected.defaultTitle || detected.name,
                    url: search,
                    icon: detected.icon,
                    platform: detected.id
                  })
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                + Add {detected.name}
              </button>
            </div>
          )}

          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider px-1">
            {search ? 'Matching Blocks' : 'Core Block Library (15)'}
          </p>

          <div className="space-y-1.5 pb-4">
            {filteredBlocks.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  const urlValue = search.trim().startsWith('http') ? search.trim() : ''
                  onAdd({ type: opt.type, text: opt.label, icon: opt.id, platform: opt.platform, url: urlValue })
                }}
                className="w-full flex items-center space-x-3.5 px-3.5 py-3 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all group text-left cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-2xs ${opt.bg}`}>
                  <opt.SvgIcon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-gray-900 leading-tight">{opt.label}</p>
                  <p className="text-xs text-gray-500 leading-tight truncate">{opt.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-600 flex-shrink-0 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Share Modal Component
function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [cardId, setCardId] = useState('')
  const [cardUrl, setCardUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('editorPreviewCardId') || ''
      const savedConfig = localStorage.getItem('currentBioLinkConfig')
      let handle = ''
      if (savedConfig) {
        try {
          const parsed = JSON.parse(savedConfig)
          handle = parsed.profile?.handle || parsed.profile?.title || ''
        } catch (e) {
          console.error('Failed to parse config in ShareModal', e)
        }
      }
      const url = getCardPublicUrl(id, handle)
      console.log('📋 Share Modal - cardId:', id, 'handle:', handle, 'url:', url)
      setCardId(id)
      setCardUrl(url || `${window.location.origin}/create`)
    }
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      alert('Failed to copy link')
    }
  }

  const shareToSocial = (platform: string) => {
    const text = 'Check out my Linktree!'
    const encodedUrl = encodeURIComponent(cardUrl)
    const encodedText = encodeURIComponent(text)
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    }
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">🎉 Your link is ready!</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">Share your bio link with the world</p>

        {/* Copy Link Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cardUrl}
                readOnly
                className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <button
              onClick={() => window.open(cardUrl, '_blank')}
              className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors border border-indigo-200"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in New Tab
            </button>
          </div>
        </div>

        {/* Share to Social Media */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Share to Social Media
          </label>
          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={() => shareToSocial('twitter')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              title="Share on Twitter"
            >
              <TwitterIcon size={24} className="text-gray-600 group-hover:text-[#1DA1F2]" />
              <span className="text-[10px] text-gray-500 font-medium">Twitter</span>
            </button>
            <button
              onClick={() => shareToSocial('facebook')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              title="Share on Facebook"
            >
              <FacebookIcon size={24} className="text-gray-600 group-hover:text-[#1877F2]" />
              <span className="text-[10px] text-gray-500 font-medium">Facebook</span>
            </button>
            <button
              onClick={() => shareToSocial('linkedin')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              title="Share on LinkedIn"
            >
              <LinkedInIcon size={24} className="text-gray-600 group-hover:text-[#0A66C2]" />
              <span className="text-[10px] text-gray-500 font-medium">LinkedIn</span>
            </button>
            <button
              onClick={() => shareToSocial('whatsapp')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              title="Share on WhatsApp"
            >
              <WhatsAppIcon size={24} className="text-gray-600 group-hover:text-[#25D366]" />
              <span className="text-[10px] text-gray-500 font-medium">WhatsApp</span>
            </button>
            <button
              onClick={() => shareToSocial('telegram')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
              title="Share on Telegram"
            >
              <TelegramIcon size={24} className="text-gray-600 group-hover:text-[#0088cc]" />
              <span className="text-[10px] text-gray-500 font-medium">Telegram</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              window.open(cardUrl, '_blank')
            }}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Live
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

