'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import { THEMES, getThemeById, Theme } from '@/lib/themes'
import { getCardPublicUrl, getCleanUsernameSlug, getDisplayUrlSlug } from '@/lib/urlHelper'
import {
  InstagramIcon, TikTokIcon, YouTubeIcon, SpotifyIcon, TwitterIcon,
  FacebookIcon, LinkedInIcon, DiscordIcon, GitHubIcon, WhatsAppIcon,
  TelegramIcon, SoundCloudIcon, ShopifyIcon, EmailIcon, PhoneIcon,
  WebsiteIcon, AppleMusicIcon
} from '@/components/icons/ServiceIcons'
import { saveCard } from '@/lib/cardStorage'
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
  ChevronRight,
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
  Copy
} from 'lucide-react'

interface LinkItem {
  id: string
  type: 'link' | 'header' | 'text' | 'social' | 'shop' | 'music' | 'video' | 'contact' | 'event'
  text: string
  url: string
  icon: string
  isVisible: boolean
  platform?: string
  description?: string
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
}

export default function EditorPage() {
  const router = useRouter()
  const [config, setConfig] = useState<BioLinkConfig | null>(null)
  const [activeTab, setActiveTab] = useState<'links' | 'appearance' | 'profile' | 'background' | 'fonts' | 'buttons' | 'colors' | 'settings' | 'social' | 'shop' | 'seo' | 'analytics'>('links')
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showAddLinkModal, setShowAddLinkModal] = useState(false)
  const [savedAt, setSavedAt] = useState<string>('')
  // Collapsible sidebar groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ myLinktree: true, tools: false })
  // Stable preview card ID — created once per editor session, reused for live preview
  const [previewCardId, setPreviewCardId] = useState<string>('')

  // Undo & Redo History Stacks
  const [pastConfigs, setPastConfigs] = useState<BioLinkConfig[]>([])
  const [futureConfigs, setFutureConfigs] = useState<BioLinkConfig[]>([])

  const handleUndo = () => {
    if (pastConfigs.length === 0 || !config) return
    const previous = pastConfigs[pastConfigs.length - 1]
    const newPast = pastConfigs.slice(0, pastConfigs.length - 1)
    
    setPastConfigs(newPast)
    setFutureConfigs(prev => [config, ...prev])
    setConfig(previous)
  }

  const handleRedo = () => {
    if (futureConfigs.length === 0 || !config) return
    const next = futureConfigs[0]
    const newFuture = futureConfigs.slice(1)
    
    setPastConfigs(prev => [...prev, config])
    setFutureConfigs(newFuture)
    setConfig(next)
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

  // ── Write config to preview card & sync live to server store ──
  const syncPreviewCard = async (cfg: BioLinkConfig, pid: string) => {
    if (!pid) return
    try {
      const handleSlug = getCleanUsernameSlug(cfg.profile?.handle || cfg.profile?.title)
      const cardPayload = {
        id: pid,
        handle: handleSlug,
        config: {
          profile: cfg.profile,
          links: cfg.links,
          theme: cfg.theme,
          socialLinks: cfg.socialLinks,
        },
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString(),
      }
      
      // Save to Firestore + localStorage
      await saveCard(pid, cardPayload)
      
      // Also save by handle slug
      if (handleSlug) {
        await saveCard(handleSlug, cardPayload)
      }

      // Async live server sync
      fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: pid,
          handle: handleSlug,
          config: cardPayload.config,
        }),
      }).catch(() => {})
    } catch {}
  }

  useEffect(() => {
    const savedConfig = localStorage.getItem('currentBioLinkConfig')
    const profile = localStorage.getItem('userProfile')
    
    if (!savedConfig || !profile) {
      router.push('/create')
      return
    }

    try {
      const parsedConfig = JSON.parse(savedConfig)
      // Reuse existing preview ID or create a new one
      const existingId = localStorage.getItem('editorPreviewCardId') || Math.random().toString(36).substr(2, 9)
      localStorage.setItem('editorPreviewCardId', existingId)
      setPreviewCardId(existingId)
      setConfig(parsedConfig)
      syncPreviewCard(parsedConfig, existingId)
      setLoading(false)
    } catch (error) {
      console.error('Error loading config:', error)
      router.push('/create')
    }
  }, [router])

  const updateConfig = (path: string, value: any) => {
    if (!config) return

    // Save snapshot to pastConfigs stack before mutating
    setPastConfigs(prev => [...prev, JSON.parse(JSON.stringify(config))].slice(-30))
    setFutureConfigs([])

    setConfig(prev => {
      if (!prev) return prev
      
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: any = newConfig
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      
      return newConfig
    })
  }

  // Side effects moved to useEffect
  useEffect(() => {
    if (!config) return
    
    // Auto-save to localStorage
    localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))
    
    // Sync preview card
    syncPreviewCard(config, previewCardId)
    
    // Update timestamp
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }, [config, previewCardId])

  const addLink = (preset?: Partial<LinkItem>) => {
    if (!config) return

    const newLink: LinkItem = {
      id: Date.now().toString(),
      type: preset?.type || 'link',
      text: preset?.text || 'New Link',
      url: preset?.url || '',
      icon: preset?.icon || '🔗',
      isVisible: true,
      platform: preset?.platform,
      description: preset?.description,
      price: preset?.price,
      thumbnail: preset?.thumbnail,
    }

    updateConfig('links', [...config.links, newLink])
    setSelectedLinkId(newLink.id)
    setShowAddLinkModal(false)
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

  const saveBioLink = async () => {
    if (!config) return

    try {
      // Reuse the stable preview card ID so the URL never changes
      const cardId = previewCardId || localStorage.getItem('editorPreviewCardId') || Math.random().toString(36).substr(2, 9)
      const handleSlug = getCleanUsernameSlug(config.profile.handle || config.profile.title)

      console.log('💾 Saving card:', cardId, 'handle:', handleSlug)
      
      const cardPayload = {
        id: cardId,
        handle: handleSlug,
        config: {
          profile: config.profile,
          links: config.links,
          theme: config.theme,
          socialLinks: config.socialLinks,
        },
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Try saving to API (with fallback if API is unavailable)
      try {
        await fetch('/api/cards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardId,
            handle: handleSlug,
            config: cardPayload.config,
            analytics: cardPayload.analytics,
          }),
        })
      } catch (apiErr) {
        console.warn('⚠️ Backend API save fallback to local storage:', apiErr)
      }
      
      // Save to localStorage under both cardId and handle slug for 100% reliable retrieval
      const existingCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      existingCards[cardId] = cardPayload
      if (handleSlug) {
        existingCards[handleSlug] = cardPayload
      }
      localStorage.setItem('bioCards', JSON.stringify(existingCards))
      localStorage.setItem('editorPreviewCardId', cardId)
      localStorage.setItem('currentBioLinkConfig', JSON.stringify(config))

      // Keep userProfile in sync
      const currentProfile = JSON.parse(localStorage.getItem('userProfile') || '{}')
      const updatedProfile = {
        ...currentProfile,
        displayName: config.profile.title || currentProfile.displayName,
        username: handleSlug || currentProfile.username,
        bio: config.profile.bio || currentProfile.bio,
        avatar: config.profile.avatar || currentProfile.avatar,
        location: config.profile.location || currentProfile.location,
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile))

      const cardUrl = getCardPublicUrl(cardId, handleSlug)
      console.log('✅ Card saved successfully! Public URL:', cardUrl)
      
      try {
        await navigator.clipboard.writeText(cardUrl)
        setShowShareModal(true)
      } catch {
        setShowShareModal(true)
      }
    } catch (error: any) {
      console.error('❌ Error saving bio link:', error)
      alert(`Error saving bio link: ${error.message}`)
    }
  }

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* ── Left Sidebar ── */}
      <aside className="w-56 bg-white border-r border-indigo-100 flex flex-col flex-shrink-0 shadow-[4px_0_16px_rgba(79,70,229,0.04)]">

        {/* User profile row */}
        <div className="px-4 py-3 border-b border-indigo-50 flex-shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar src={config.profile.avatar} size="sm" fallback="user" />
            <span className="text-xs font-extrabold text-indigo-950 truncate">
              {config.profile.title || 'My BioLink'}
            </span>
          </div>

          {/* Undo / Redo controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleUndo}
              disabled={pastConfigs.length === 0}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded-lg border transition-all ${
                pastConfigs.length > 0
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 cursor-pointer shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={futureConfigs.length === 0}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded-lg border transition-all ${
                futureConfigs.length > 0
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 cursor-pointer shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nav — scrollable */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">

          {/* ── My Linktree group ── */}
          <button
            onClick={() => toggleGroup('myLinktree')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-indigo-950 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
                <LinkIcon className="w-3 h-3" />
              </div>
              <span>My Bio Card</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-indigo-400 transition-transform ${openGroups.myLinktree ? 'rotate-90' : ''}`} />
          </button>

          {openGroups.myLinktree && (
            <div className="ml-3 border-l-2 border-indigo-100 pl-2 space-y-1 my-1">
              {[
                { id: 'links',      label: 'Links',    dot: false },
                { id: 'shop',       label: 'Shop',     dot: false },
                { id: 'appearance', label: 'Design',   dot: true  },
              ].map(({ id, label, dot }) => (
                <button key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                    activeTab === id
                      ? 'bg-indigo-600 text-white font-extrabold shadow-[2px_3px_8px_rgba(79,70,229,0.25)]'
                      : 'text-indigo-900/70 hover:bg-indigo-50 font-bold'
                  }`}
                >
                  <span>{label}</span>
                  {dot && <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {/* ── Appearance group ── */}
          <button
            onClick={() => toggleGroup('appearance')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-indigo-950 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
                <Palette className="w-3 h-3" />
              </div>
              <span>Appearance</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-indigo-400 transition-transform ${openGroups.appearance ? 'rotate-90' : ''}`} />
          </button>

          {openGroups.appearance && (
            <div className="ml-3 border-l-2 border-indigo-100 pl-2 space-y-1 my-1">
              {[
                { id: 'profile',    label: 'Header'    },
                { id: 'background', label: 'Wallpaper' },
                { id: 'fonts',      label: 'Text'      },
                { id: 'buttons',    label: 'Buttons & Animations' },
                { id: 'colors',     label: 'Colors'    },
                { id: 'settings',   label: 'Footer'    },
              ].map(({ id, label }) => (
                <button key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all ${
                    activeTab === id
                      ? 'bg-indigo-600 text-white font-extrabold shadow-[2px_3px_8px_rgba(79,70,229,0.25)]'
                      : 'text-indigo-900/70 hover:bg-indigo-50 font-bold'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* ── Audience group ── */}
          <button
            onClick={() => toggleGroup('audience')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-black text-indigo-950 hover:bg-indigo-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span>Audience</span>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-indigo-400 transition-transform ${openGroups.audience ? 'rotate-90' : ''}`} />
          </button>

          {openGroups.audience && (
            <div className="ml-3 border-l-2 border-indigo-100 pl-2 space-y-1 my-1">
              {[
                { id: 'social',    label: 'Social Media' },
                { id: 'seo',       label: 'SEO'          },
              ].map(({ id, label }) => (
                <button key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-all ${
                    activeTab === id
                      ? 'bg-indigo-600 text-white font-extrabold shadow-[2px_3px_8px_rgba(79,70,229,0.25)]'
                      : 'text-indigo-900/70 hover:bg-indigo-50 font-bold'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* ── Insights ── */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-[2px_3px_8px_rgba(79,70,229,0.25)]'
                : 'text-indigo-950 hover:bg-indigo-50'
            }`}
          >
            <div className="w-5 h-5 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-3 h-3" />
            </div>
            <span>Insights</span>
          </button>
        </nav>

        {/* ── Bottom: auto-save status + actions ── */}
        <div className="flex-shrink-0 border-t border-indigo-50 p-3 space-y-2">
          {/* Share Link Button */}
          <button
            onClick={saveBioLink}
            className="w-full clay-btn clay-btn-secondary py-2.5 text-xs font-extrabold flex items-center justify-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            Save & Share Link
          </button>

          {/* Preview + Exit row */}
          <div className="flex gap-2">
            <button
              onClick={() => window.open(`/card/${previewCardId}`, '_blank')}
              className="clay-btn clay-btn-ghost flex-1 py-1.5 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              Preview
            </button>
            <button
              onClick={() => router.push('/my-cards')}
              className="clay-btn clay-btn-ghost flex-1 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Exit
            </button>
          </div>
        </div>
      </aside>

        {/* Middle Panel - Design Tools */}
        <main className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-6">
              {activeTab === 'links' && (
                <LinksPanel 
                  config={config}
                  updateConfig={updateConfig}
                  onOpenAddModal={() => setShowAddLinkModal(true)}
                  removeLink={removeLink}
                  toggleLinkVisibility={toggleLinkVisibility}
                  updateLink={updateLink}
                  selectedLinkId={selectedLinkId}
                  setSelectedLinkId={setSelectedLinkId}
                />
              )}

              {activeTab === 'appearance' && (
                <ThemesPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}
              
              {activeTab === 'profile' && (
                <ProfilePanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}
              
              {activeTab === 'background' && (
                <BackgroundPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}
              
              {activeTab === 'fonts' && (
                <FontsPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}
              
              {activeTab === 'buttons' && (
                <ButtonsPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}
              
              {activeTab === 'colors' && (
                <ColorsPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}
              
              {activeTab === 'settings' && (
                <SettingsPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeTab === 'social' && (
                <SocialMediaPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeTab === 'shop' && (
                <ShopPanel 
                  config={config}
                  updateConfig={updateConfig}
                  onOpenAddModal={() => setShowAddLinkModal(true)}
                />
              )}

              {activeTab === 'seo' && (
                <SEOPanel 
                  config={config}
                  updateConfig={updateConfig}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsPanel 
                  config={config}
                />
              )}
            </div>
          </div>
        </main>

        {/* Right Panel - Live Preview */}
        <aside className="w-[380px] bg-[#F4F4F2] border-l border-gray-200 flex flex-col items-center flex-shrink-0 overflow-hidden py-6 px-4">

          {/* ── Top Share URL Pill Bar (Matching Linktree) ── */}
          <div className="w-[270px] bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center justify-between shadow-sm mb-6 flex-shrink-0">
            <span className="text-xs font-semibold text-slate-700 truncate mr-2">
              {getDisplayUrlSlug(config.profile.handle || config.profile.title)}
            </span>
            <button
              onClick={async () => {
                const url = getCardPublicUrl(previewCardId, config.profile.handle || config.profile.title)
                try {
                  await navigator.clipboard.writeText(url)
                  setShowShareModal(true)
                } catch {
                  setShowShareModal(true)
                }
              }}
              className="text-slate-500 hover:text-slate-900 transition-colors p-0.5 rounded-full hover:bg-slate-100 flex-shrink-0"
              title="Share & Copy URL"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ── Bezel-less Floating Mobile Card Screen ── */}
          <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
            <div 
              className="relative flex-shrink-0 shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: 270,
                height: 520,
                borderRadius: 32,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.06)'
              }}
            >
              <BioLinkPreview config={config} />
            </div>
          </div>

          {/* Active Links Count */}
          <div className="pt-3 text-center flex-shrink-0">
            <p className="text-[11px] font-bold text-slate-400">
              {config.links.filter(l => l.isVisible !== false).length} active links
            </p>
          </div>
        </aside>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <AddLinkModal
          onClose={() => setShowAddLinkModal(false)}
          onAdd={addLink}
        />
      )}
    </div>
  )
}

// ── shared helper: compute CSS background for any theme type ──────────────
function themeBackground(theme: Theme): React.CSSProperties {
  const c = theme.colors
  if (c.backgroundImage) {
    return {
      backgroundImage: `${c.backgroundOverlay ? `linear-gradient(${c.backgroundOverlay},${c.backgroundOverlay}),` : ''}url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  if (c.backgroundMesh) {
    return { background: c.backgroundMesh }
  }
  if (c.backgroundGradient) {
    const g = c.backgroundGradient
    return { background: `linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})` }
  }
  return { backgroundColor: c.background }
}

// Themes Panel Component (was Appearance > Themes)
function ThemesPanel({ config, updateConfig }: any) {
  const categories = [
    { id: 'all',      name: 'All'      },
    { id: 'minimal',  name: 'Minimal'  },
    { id: 'dark',     name: 'Dark'     },
    { id: 'gradient', name: 'Gradient' },
    { id: 'mesh',     name: 'Mesh'     },
    { id: 'image',    name: 'Image'    },
    { id: 'vibrant',  name: 'Vibrant'  },
  ]

  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredThemes = selectedCategory === 'all'
    ? THEMES
    : THEMES.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Themes</h2>
        <p className="text-sm text-gray-500">Choose a professionally designed theme</p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filteredThemes.map(theme => (
          <button
            key={theme.id}
            onClick={() => updateConfig('theme', theme)}
            className={`group rounded-xl border-2 transition-all text-left relative overflow-hidden ${
              config.theme.id === theme.id
                ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {/* Selected check */}
            {config.theme.id === theme.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center z-20 shadow">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}

            {/* PRO badge */}
            {theme.isPremium && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded z-20">
                PRO
              </div>
            )}

            {/* Background preview — full bleed, shows real theme bg */}
            <div
              className="w-full aspect-[3/4] relative overflow-hidden"
              style={themeBackground(theme)}
            >
              {/* Noise overlay */}
              {theme.noiseOpacity && (
                <div className="absolute inset-0 z-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    opacity: theme.noiseOpacity,
                    mixBlendMode: 'overlay',
                  }}
                />
              )}

              {/* Mini phone mockup content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 z-10">
                {/* Avatar dot */}
                <div className="w-5 h-5 rounded-full mb-1.5 border border-white/30"
                  style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
                {/* Name line */}
                <div className="w-10 h-1 rounded-full mb-2"
                  style={{ backgroundColor: theme.colors.profileText, opacity: 0.7 }} />
                {/* Link buttons */}
                {[1,2,3].map(i => (
                  <div key={i}
                    className="w-full mb-1 h-3 rounded"
                    style={{
                      backgroundColor: theme.colors.buttonDefault,
                      borderRadius: `${Math.min(theme.buttonStyle.borderRadius, 6)}px`,
                      border: theme.buttonStyle.style === 'outline' ? `1px solid ${theme.colors.buttonText}` : 'none',
                      opacity: 1 - (i - 1) * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Theme name */}
            <div className="px-2 py-1.5 bg-white">
              <p className="text-[11px] font-semibold text-gray-800 truncate text-center">{theme.name}</p>
            </div>
          </button>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Palette className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No themes in this category</p>
        </div>
      )}
    </div>
  )
}

// Profile Panel Component (Header)
function ProfilePanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Header</h2>
        <p className="text-gray-600">Customize your profile information</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Profile Image</label>
        <div className="flex items-center space-x-4">
          <Avatar src={config.profile.avatar} size="xl" />
          <div className="flex-1">
            <input
              type="text"
              value={config.profile.avatar}
              onChange={(e) => updateConfig('profile.avatar', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Image URL or emoji"
            />
            <p className="text-xs text-gray-500 mt-1">Enter an image URL or use an emoji</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Title / Display Name</label>
        <input
          type="text"
          value={config.profile.title}
          onChange={(e) => updateConfig('profile.title', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Custom Username / URL Handle</label>
        <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
          <span className="bg-gray-100 text-gray-500 px-3.5 py-2.5 text-sm font-bold border-r border-gray-300 flex-shrink-0">
            biolink.ee/
          </span>
          <input
            type="text"
            value={config.profile.handle || ''}
            onChange={(e) => updateConfig('profile.handle', getCleanUsernameSlug(e.target.value))}
            className="w-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none font-bold"
            placeholder={getCleanUsernameSlug(config.profile.title || 'satvikpatel8373')}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Your public shareable URL link handle</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Bio</label>
        <textarea
          value={config.profile.bio}
          onChange={(e) => updateConfig('profile.bio', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          rows={3}
          placeholder="Tell people about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Location (Optional)</label>
        <input
          type="text"
          value={config.profile.location || ''}
          onChange={(e) => updateConfig('profile.location', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="City, Country"
        />
      </div>
    </div>
  )
}

// Background Panel Component (Wallpaper)
function BackgroundPanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallpaper</h2>
        <p className="text-gray-600">Customize your background</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Wallpaper style</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => updateConfig('theme.colors.backgroundGradient', null)}
            className={`p-4 rounded-lg border-2 font-medium transition-all text-center ${
              !config.theme.colors.backgroundGradient
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-16 rounded mb-2" style={{ backgroundColor: config.theme.colors.background }}></div>
            <p className="text-xs font-medium">Fill</p>
          </button>
          
          <button
            onClick={() => updateConfig('theme.colors.backgroundGradient', { 
              from: config.theme.colors.background, 
              to: config.theme.colors.accent,
              direction: '135deg'
            })}
            className={`p-4 rounded-lg border-2 font-medium transition-all text-center ${
              config.theme.colors.backgroundGradient
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="w-full h-16 rounded mb-2 bg-gradient-to-br from-purple-400 to-pink-400"></div>
            <p className="text-xs font-medium">Gradient</p>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">Background color</label>
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

      {config.theme.colors.backgroundGradient && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Gradient direction</label>
            <select
              value={config.theme.colors.backgroundGradient.direction || '135deg'}
              onChange={(e) => updateConfig('theme.colors.backgroundGradient', { 
                ...config.theme.colors.backgroundGradient, 
                direction: e.target.value 
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
            >
              <option value="0deg">Top to Bottom</option>
              <option value="90deg">Left to Right</option>
              <option value="135deg">Diagonal (Top-Left to Bottom-Right)</option>
              <option value="180deg">Bottom to Top</option>
              <option value="270deg">Right to Left</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Gradient start</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.theme.colors.backgroundGradient.from}
                onChange={(e) => updateConfig('theme.colors.backgroundGradient', { 
                  ...config.theme.colors.backgroundGradient, 
                  from: e.target.value 
                })}
                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={config.theme.colors.backgroundGradient.from}
                  onChange={(e) => updateConfig('theme.colors.backgroundGradient', { 
                    ...config.theme.colors.backgroundGradient, 
                    from: e.target.value 
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  placeholder="#667eea"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Gradient end</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.theme.colors.backgroundGradient.to}
                onChange={(e) => updateConfig('theme.colors.backgroundGradient', { 
                  ...config.theme.colors.backgroundGradient, 
                  to: e.target.value 
                })}
                className="w-16 h-16 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={config.theme.colors.backgroundGradient.to}
                  onChange={(e) => updateConfig('theme.colors.backgroundGradient', { 
                    ...config.theme.colors.backgroundGradient, 
                    to: e.target.value 
                  })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                  placeholder="#764ba2"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Fonts Panel Component (Text)
function FontsPanel({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Text</h2>
        <p className="text-gray-600">Customize typography and text colors</p>
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
function ButtonsPanel({ config, updateConfig }: any) {
  const currentStyle = config.theme.buttonStyle.style ?? 'solid'
  const currentRadius = config.theme.buttonStyle.borderRadius ?? 20
  const currentShadow = config.theme.buttonStyle.shadow ?? true

  const buttonStyles = [
    { id: 'solid',       label: 'Solid Fill',     preview: 'bg-slate-900 text-white' },
    { id: 'clay',        label: 'Claymorphism 3D', preview: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_6px_16px_rgba(79,70,229,0.3)]' },
    { id: 'glass',       label: 'Glassmorphism',  preview: 'bg-white/40 backdrop-blur-md border border-white/60 text-slate-900' },
    { id: 'outline',     label: 'Outline',        preview: 'bg-transparent border-2 border-slate-900 text-slate-900' },
    { id: 'soft',        label: 'Soft Elevation', preview: 'bg-white shadow-lg text-slate-900' },
  ]

  // Claymorphic active selection class (replaces cheap harsh border outline)
  const clayActive = 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(79,70,229,0.45)] scale-[1.02] border-transparent'
  const clayInactive = 'bg-slate-50/90 border border-slate-200/80 text-slate-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_2px_6px_rgba(0,0,0,0.03)] hover:bg-white hover:shadow-md hover:scale-[1.01]'

  const resetButtonStyle = () => {
    updateConfig('theme.buttonStyle.style', 'solid')
    updateConfig('theme.buttonStyle.borderRadius', 20)
    updateConfig('theme.buttonStyle.borderWidth', 0)
    updateConfig('theme.buttonStyle.borderColor', '')
    updateConfig('theme.buttonStyle.shadow', true)
    updateConfig('theme.buttonStyle.shadowStyle', 'soft')
    updateConfig('theme.buttonStyle.animation', 'bounce')
    updateConfig('theme.buttonStyle.enableAnimations', true)
    updateConfig('theme.colors.buttonDefault', '#ffffff')
    updateConfig('theme.colors.buttonText', '#000000')
  }

  const handleStyleChange = (styleId: string) => {
    updateConfig('theme.buttonStyle.style', styleId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Buttons & Animations</h2>
          <p className="text-sm text-slate-500 font-medium">Customize button shape, 3D Claymorphism fill, shadows, and animations</p>
        </div>
        <button
          onClick={resetButtonStyle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer"
          title="Reset button style to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Style</span>
        </button>
      </div>

      {/* ── 1. Button Style Fill ── */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-3">Button Fill Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {buttonStyles.map((s) => {
            const isSel = currentStyle === s.id
            return (
              <button
                key={s.id}
                onClick={() => handleStyleChange(s.id)}
                className={`p-3 rounded-2xl transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer ${
                  isSel ? clayActive : clayInactive
                }`}
              >
                <div className={`w-full h-9 rounded-xl flex items-center justify-center font-extrabold text-xs ${s.preview}`}>
                  Sample
                </div>
                <span className={`text-xs font-bold ${isSel ? 'text-white' : 'text-slate-800'}`}>{s.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 2. Corner Roundness ── */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-3">
          Corner Roundness
        </label>
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { radius: 0, label: 'Square' },
            { radius: 8, label: '8px' },
            { radius: 16, label: '16px' },
            { radius: 50, label: 'Full Pill' },
          ].map((item) => {
            const isSel = currentRadius === item.radius || (item.radius === 50 && currentRadius >= 24)
            return (
              <button
                key={item.radius}
                onClick={() => updateConfig('theme.buttonStyle.borderRadius', item.radius)}
                className={`p-3 rounded-2xl transition-all duration-200 flex flex-col items-center gap-2 cursor-pointer ${
                  isSel ? clayActive : clayInactive
                }`}
              >
                <div 
                  className={`w-full h-7 ${isSel ? 'bg-white/30 backdrop-blur-md' : 'bg-slate-800'}`}
                  style={{ borderRadius: item.radius > 20 ? '9999px' : `${item.radius}px` }}
                />
                <span className={`text-xs font-bold ${isSel ? 'text-white' : 'text-slate-800'}`}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 3. Button Shadow ── */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-3">Button Shadow</label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { style: 'none', shadow: false, label: 'None' },
            { style: 'soft', shadow: true, label: 'Soft Shadow' },
            { style: 'strong', shadow: true, label: 'Strong Shadow' },
          ].map((sh) => {
            const currentShStyle = config.theme.buttonStyle.shadowStyle ?? (config.theme.buttonStyle.shadow ? 'soft' : 'none')
            const isSel = currentShStyle === sh.style
            return (
              <button
                key={sh.style}
                onClick={() => {
                  updateConfig('theme.buttonStyle.shadowStyle', sh.style)
                  updateConfig('theme.buttonStyle.shadow', sh.shadow)
                }}
                className={`py-3.5 px-4 rounded-2xl transition-all duration-200 text-center cursor-pointer ${
                  isSel ? clayActive : clayInactive
                }`}
              >
                <span className={`text-xs font-bold ${isSel ? 'text-white' : 'text-slate-800'}`}>{sh.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 4. Animation Controls Section ── */}
      <div className="pt-5 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="block text-sm font-bold text-slate-900">Button Animations</label>
            <p className="text-xs text-slate-500 font-medium">Enable micro-interactions and hover effects</p>
          </div>
          <button
            onClick={() => updateConfig('theme.buttonStyle.enableAnimations', !(config.theme.buttonStyle.enableAnimations ?? true))}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-200 cursor-pointer flex items-center ${
              (config.theme.buttonStyle.enableAnimations ?? true) ? 'bg-indigo-600 justify-end shadow-inner' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {(config.theme.buttonStyle.enableAnimations ?? true) && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { id: 'bounce', label: 'Bounce' },
              { id: 'pulse', label: 'Pulse' },
              { id: 'wobble', label: 'Wobble' },
              { id: 'slide', label: 'Slide' },
            ].map((anim) => {
              const currentAnim = config.theme.buttonStyle.animation ?? 'bounce'
              const isSel = currentAnim === anim.id
              return (
                <button
                  key={anim.id}
                  onClick={() => updateConfig('theme.buttonStyle.animation', anim.id)}
                  className={`py-3 px-2 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                    isSel ? clayActive : clayInactive
                  }`}
                >
                  {anim.label}
                </button>
              )
            })}
          </div>
        )}
      </div>


      {/* ── 5. Button Colors & Borders ── */}
      <div className="pt-4 border-t border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Button Background Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={config.theme.colors.buttonDefault || '#FFFFFF'}
              onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={config.theme.colors.buttonDefault || '#FFFFFF'}
              onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm uppercase"
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Button Text Color</label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={config.theme.colors.buttonText || '#000000'}
              onChange={(e) => updateConfig('theme.colors.buttonText', e.target.value)}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={config.theme.colors.buttonText || '#000000'}
              onChange={(e) => updateConfig('theme.colors.buttonText', e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm uppercase"
              placeholder="#000000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Button Border Width</label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((w) => {
              const currentW = config.theme.buttonStyle.borderWidth ?? 0
              const isSel = currentW === w
              return (
                <button
                  key={w}
                  onClick={() => updateConfig('theme.buttonStyle.borderWidth', w)}
                  className={`p-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
                    isSel
                      ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {w === 0 ? 'None (0px)' : `${w}px`}
                </button>
              )
            })}
          </div>
        </div>

        {(config.theme.buttonStyle.borderWidth ?? 0) > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Button Border Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={config.theme.buttonStyle.borderColor || config.theme.colors.buttonText || '#000000'}
                onChange={(e) => updateConfig('theme.buttonStyle.borderColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={config.theme.buttonStyle.borderColor || config.theme.colors.buttonText || '#000000'}
                onChange={(e) => updateConfig('theme.buttonStyle.borderColor', e.target.value)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm uppercase"
                placeholder="#000000"
              />
            </div>
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

      {/* ── LINK / SOCIAL — just URL ── */}
      {(link.type === 'link' || link.type === 'social') && (
        field('URL', 'url', 'url', 'https://example.com')
      )}

      {/* ── SHOP / PRODUCT — URL + price + description + stock ── */}
      {link.type === 'shop' && (<>
        {field('Product URL', 'url', 'url', 'https://yourstore.com/product')}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Price</label>
            <div className="flex">
              <select
                value={link.currency || '$'}
                onChange={e => updateLink(link.id, 'currency', e.target.value)}
                className="px-2 py-2 text-sm border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 focus:outline-none"
              >
                {['$','€','£','¥','₹','₩'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input
                type="number"
                value={link.price || ''}
                onChange={e => updateLink(link.id, 'price', e.target.value)}
                placeholder="0.00"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-r-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white"
              />
            </div>
          </div>
          {select('Stock', 'stockStatus', [
            { value: 'in-stock', label: 'In Stock' },
            { value: 'limited', label: 'Limited' },
            { value: 'out-of-stock', label: 'Out of Stock' },
          ])}
        </div>
        {textarea('Description', 'description', 'Describe your product…')}
      </>)}

      {/* ── CONTACT — contact type + value ── */}
      {link.type === 'contact' && (<>
        {select('Contact Type', 'contactType', [
          { value: 'email',    label: 'Email' },
          { value: 'phone',    label: 'Phone' },
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'telegram', label: 'Telegram' },
          { value: 'address',  label: 'Address' },
        ])}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            {link.contactType === 'email' ? 'Email Address' :
             link.contactType === 'address' ? 'Address' : 'Number / Username'}
          </label>
          <input
            type={link.contactType === 'email' ? 'email' : 'text'}
            value={link.contactValue || ''}
            onChange={e => updateLink(link.id, 'contactValue', e.target.value)}
            placeholder={
              link.contactType === 'email'    ? 'you@example.com' :
              link.contactType === 'phone'    ? '+1 234 567 8900' :
              link.contactType === 'whatsapp' ? '+1 234 567 8900' :
              link.contactType === 'telegram' ? '@username' :
              link.contactType === 'address'  ? '123 Main St, City' :
              'Contact info'
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-colors"
          />
        </div>
      </>)}

      {/* ── EVENT — date + time + location + URL ── */}
      {link.type === 'event' && (<>
        <div className="grid grid-cols-2 gap-3">
          {field('Date', 'eventDate', 'date')}
          {field('Time', 'eventTime', 'time')}
        </div>
        {field('Location', 'eventLocation', 'text', 'Venue or online link')}
        {field('Event URL / Tickets', 'url', 'url', 'https://eventbrite.com/...')}
        {textarea('Description', 'description', 'What is this event about?')}
      </>)}

      {/* ── MUSIC — embed URL + description ── */}
      {link.type === 'music' && (<>
        {field('Music URL', 'url', 'url', 'https://open.spotify.com/track/...')}
        {field('Embed URL (optional)', 'embedUrl', 'url', 'Spotify / Apple Music embed link')}
        {textarea('Description', 'description', 'Album, artist, or playlist info…')}
      </>)}

      {/* ── VIDEO — URL + description ── */}
      {link.type === 'video' && (<>
        {field('Video URL', 'url', 'url', 'https://youtube.com/watch?v=...')}
        {textarea('Description', 'description', 'What is this video about?')}
      </>)}

      {/* ── HEADER — just a label, no URL ── */}
      {link.type === 'header' && (
        <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
          This is a section heading — it groups links below it. No URL needed.
        </p>
      )}

      {/* ── TEXT — text content ── */}
      {link.type === 'text' && (
        textarea('Text Content', 'description', 'Write your text here…', 3)
      )}

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

function LinksPanel({ config, onOpenAddModal, removeLink, toggleLinkVisibility, updateLink, selectedLinkId, setSelectedLinkId }: any) {
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

        {config.links.map((link: LinkItem) => (
          <div
            key={link.id}
            className={`bg-white border rounded-xl transition-all ${
              !link.isVisible ? 'opacity-40' : ''
            } ${
              selectedLinkId === link.id
                ? 'border-purple-400 shadow-sm'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Collapsed row — identical for every type */}
            {selectedLinkId !== link.id && (
              <div className="flex items-center gap-3 px-3 py-3">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your Linktree settings</p>
      </div>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Additional Info</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={config.profile.location || ''}
            onChange={(e) => updateConfig('profile.location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
          <input
            type="url"
            value={config.profile.website || ''}
            onChange={(e) => updateConfig('profile.website', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
    { id: 'instagram', name: 'Instagram', placeholder: 'https://instagram.com/username' },
    { id: 'twitter', name: 'Twitter/X', placeholder: 'https://twitter.com/username' },
    { id: 'facebook', name: 'Facebook', placeholder: 'https://facebook.com/username' },
    { id: 'linkedin', name: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { id: 'youtube', name: 'YouTube', placeholder: 'https://youtube.com/@username' },
    { id: 'tiktok', name: 'TikTok', placeholder: 'https://tiktok.com/@username' },
    { id: 'github', name: 'GitHub', placeholder: 'https://github.com/username' },
    { id: 'discord', name: 'Discord', placeholder: 'https://discord.gg/invite' },
    { id: 'twitch', name: 'Twitch', placeholder: 'https://twitch.tv/username' },
    { id: 'spotify', name: 'Spotify', placeholder: 'https://open.spotify.com/artist/...' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media</h2>
        <p className="text-gray-600">Add your social media profiles</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Instagram className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Social Icons</h3>
            <p className="text-sm text-blue-700">Add your social media links below. They'll appear as icons on your profile.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {socialPlatforms.map((platform) => (
          <div key={platform.id}>
            <label className="block text-sm font-semibold text-gray-900 mb-2">{platform.name}</label>
            <input
              type="url"
              value={config.socialLinks?.[platform.id] || ''}
              onChange={(e) => updateConfig(`socialLinks.${platform.id}`, e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={platform.placeholder}
            />
          </div>
        ))}
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
              onClick={() => window.open('/dashboard/analytics', '_blank')}
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
  const theme = config.theme
  const bg = themeBackground(theme)
  const c = theme.colors
  const bs = theme.buttonStyle
  const bStyle = bs?.style ?? 'solid'
  const animEnabled = theme.buttonStyle?.enableAnimations ?? true
  const animStyle = theme.buttonStyle?.animation ?? 'bounce'

  let animClasses = 'cursor-pointer hover:opacity-95 active:scale-[0.97] transition-all duration-200'
  if (animEnabled) {
    if (animStyle === 'bounce') animClasses = 'cursor-pointer hover:scale-[1.025] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 ease-out'
    else if (animStyle === 'pulse') animClasses = 'cursor-pointer animate-pulse hover:animate-none hover:scale-[1.02] transition-all'
    else if (animStyle === 'wobble') animClasses = 'cursor-pointer hover:animate-bounce hover:scale-[1.02] transition-all'
    else if (animStyle === 'slide') animClasses = 'cursor-pointer hover:translate-x-1.5 transition-transform duration-200 ease-out'
  }

  const makeBtnStyle = (): React.CSSProperties => {
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
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 42,
      padding: '0 8px',
      flexShrink: 0,
      position: 'relative',
      textDecoration: 'none',
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
  const visible = config.links.filter(l => l.isVisible !== false)
  const maxVisible = 5
  const displayLinks = visible.slice(0, maxVisible)
  const hasMore = visible.length > maxVisible

  const PlatformThumb = ({ link }: { link: LinkItem }) => {
    const map: Record<string, React.FC<{ size?: number; className?: string }>> = {
      instagram: InstagramIcon, tiktok: TikTokIcon, youtube: YouTubeIcon,
      spotify: SpotifyIcon, twitter: TwitterIcon, facebook: FacebookIcon,
      linkedin: LinkedInIcon, discord: DiscordIcon, github: GitHubIcon,
      whatsapp: WhatsAppIcon, telegram: TelegramIcon, soundcloud: SoundCloudIcon,
      shopify: ShopifyIcon, email: EmailIcon, phone: PhoneIcon, website: WebsiteIcon,
      'apple-music': AppleMusicIcon,
    }
    const Icon = link.platform ? map[link.platform] : null
    return (
      <div className="w-7 h-7 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 overflow-hidden text-current">
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
      {theme.noiseOpacity && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: theme.noiseOpacity, mixBlendMode: 'overlay' as any
        }} />
      )}

      {/* ── Outer Card Wrapper matching user reference image ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', flexDirection: 'column', padding: '16px 14px 10px' }}>

        {/* ── Top Bar Action Buttons (Inside Card) ── */}
        <div className="flex items-center justify-between w-full mb-3 flex-shrink-0">
          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-white/30 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-white/30 transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* ── Avatar Profile Header ── */}
        <div className="flex flex-col items-center text-center flex-shrink-0 mb-4">
          <div className="mb-2">
            {config.profile.avatar && config.profile.avatar !== 'user' ? (
              config.profile.avatar.startsWith('http') || config.profile.avatar.startsWith('data:') ? (
                <img
                  src={config.profile.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/40 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl shadow-md">
                  {config.profile.avatar}
                </div>
              )
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-md">
                <User className="w-7 h-7 text-white/70" />
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

        {/* ── Stacked Linktree Link Buttons ── */}
        <div className="w-full flex flex-col gap-2 flex-shrink-0 mb-3">
          {displayLinks.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: 10, color: c.profileBio, opacity: 0.4, padding: '12px 0' }}>
              No links added yet
            </p>
          )}
          {displayLinks.map(link => {
            if (link.type === 'header') return (
              <div key={link.id} className="flex items-center gap-2 py-1">
                <div className="flex-1 h-px bg-white/20" />
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-60" style={{ color: c.profileText }}>
                  {link.text}
                </span>
                <div className="flex-1 h-px bg-white/20" />
              </div>
            )
            if (link.type === 'text') return (
              <p key={link.id} className="text-center text-[10px] opacity-75 font-medium leading-relaxed" style={{ color: c.profileBio }}>
                {(link.description || link.text).slice(0, 60)}
              </p>
            )
            return (
              <a
                key={link.id}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!link.url || link.url === '#') e.preventDefault()
                }}
                style={btnStyle}
                className={`group ${animClasses}`}
              >
                <PlatformThumb link={link} />
                <span className="flex-1 text-center font-extrabold text-[11px] truncate px-2" style={{ color: c.buttonText }}>
                  {link.text}
                </span>
                <div className="w-6 flex items-center justify-end opacity-40 group-hover:opacity-80 transition-opacity">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </a>
            )
          })}
          {hasMore && (
            <p style={{ textAlign: 'center', fontSize: 9, color: c.profileBio, opacity: 0.5 }}>
              +{visible.length - maxVisible} more links
            </p>
          )}
        </div>

        <div className="flex-1" />

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

const LINK_CATEGORIES = [
  { id: 'suggested', label: 'Suggested' },
  { id: 'commerce',  label: 'Commerce'  },
  { id: 'social',    label: 'Social'    },
  { id: 'media',     label: 'Media'     },
  { id: 'contact',   label: 'Contact'   },
  { id: 'events',    label: 'Events'    },
  { id: 'text',      label: 'Text'      },
]

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
const ZoomSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zM9.5 7.5A1.5 1.5 0 0 0 8 9v6a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 18 15V9a1.5 1.5 0 0 0-1.5-1.5h-7zm8.5 2.25 2.25-1.5v7.5L18 14.25V9.75z"/></svg>
)
const SnapchatSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.017 0C8.396 0 5.29 2.69 5.29 6.3c0 .42.04.83.12 1.23-.27.14-.56.22-.87.22-.5 0-.96-.2-1.3-.52l-.01-.01c-.1-.09-.23-.14-.37-.14-.28 0-.5.22-.5.5 0 .16.08.31.2.41.52.46 1.2.74 1.95.74.17 0 .34-.02.5-.05-.02.22-.03.44-.03.67 0 3.61 3.11 6.3 6.73 6.3.18 0 .36-.01.54-.02.28.5.44 1.07.44 1.67 0 .28-.04.55-.11.81-.07.26.08.53.34.6.26.07.53-.08.6-.34.1-.35.15-.71.15-1.07 0-.74-.19-1.44-.52-2.05 3.28-.42 5.82-3.04 5.82-6.3 0-3.61-3.11-6.3-6.73-6.3z"/></svg>
)
const PinterestSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
)
const TwitchSvg = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
)

const LINK_OPTIONS: Record<string, LinkOption[]> = {
  suggested: [
    { id: 'instagram', label: 'Instagram',   description: 'Display your posts and reels',        bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', SvgIcon: InstagramIcon,  type: 'social',  platform: 'instagram'  },
    { id: 'tiktok',    label: 'TikTok',      description: 'Share your TikToks on your page',     bg: 'bg-black',       SvgIcon: TikTokIcon,    type: 'social',  platform: 'tiktok'     },
    { id: 'youtube',   label: 'YouTube',     description: 'Share YouTube videos on your page',   bg: 'bg-red-600',     SvgIcon: YouTubeIcon,   type: 'social',  platform: 'youtube'    },
    { id: 'spotify',   label: 'Spotify',     description: 'Share your latest or favorite music', bg: 'bg-green-500',   SvgIcon: SpotifyIcon,   type: 'social',  platform: 'spotify'    },
    { id: 'twitter',   label: 'Twitter / X', description: 'Share your tweets and profile',       bg: 'bg-black',       SvgIcon: TwitterIcon,   type: 'social',  platform: 'twitter'    },
    { id: 'link',      label: 'Link',        description: 'Add any URL to your page',            bg: 'bg-gray-600',    SvgIcon: WebsiteIcon,   type: 'link'                            },
    { id: 'product',   label: 'Product',     description: 'Sell a product or service',           bg: 'bg-purple-600',  SvgIcon: ShopifyIcon,   type: 'shop'                            },
  ],
  commerce: [
    { id: 'product',  label: 'Product',  description: 'Sell a product or service',     bg: 'bg-purple-600',  SvgIcon: ShopifyIcon,  type: 'shop'                         },
    { id: 'shopify',  label: 'Shopify',  description: 'Connect your Shopify store',    bg: 'bg-green-600',   SvgIcon: ShopifyIcon,  type: 'shop', platform: 'shopify'    },
    { id: 'etsy',     label: 'Etsy',     description: 'Link to your Etsy shop',        bg: 'bg-orange-500',  SvgIcon: EtsySvg,      type: 'shop', platform: 'etsy'       },
    { id: 'gumroad',  label: 'Gumroad',  description: 'Sell digital products',         bg: 'bg-pink-600',    SvgIcon: GumroadSvg,   type: 'shop', platform: 'gumroad'    },
    { id: 'patreon',  label: 'Patreon',  description: 'Support from your fans',        bg: 'bg-orange-600',  SvgIcon: PatreonSvg,   type: 'shop', platform: 'patreon'    },
    { id: 'ko-fi',    label: 'Ko-fi',    description: 'Accept tips and donations',     bg: 'bg-blue-400',    SvgIcon: KoFiSvg,      type: 'shop', platform: 'ko-fi'      },
  ],
  social: [
    { id: 'instagram', label: 'Instagram',   description: 'Display your posts and reels',     bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', SvgIcon: InstagramIcon,  type: 'social', platform: 'instagram'  },
    { id: 'tiktok',    label: 'TikTok',      description: 'Share your TikToks',               bg: 'bg-black',       SvgIcon: TikTokIcon,    type: 'social', platform: 'tiktok'     },
    { id: 'twitter',   label: 'Twitter / X', description: 'Share your tweets',                bg: 'bg-black',       SvgIcon: TwitterIcon,   type: 'social', platform: 'twitter'    },
    { id: 'facebook',  label: 'Facebook',    description: 'Link to your Facebook page',       bg: 'bg-blue-600',    SvgIcon: FacebookIcon,  type: 'social', platform: 'facebook'   },
    { id: 'linkedin',  label: 'LinkedIn',    description: 'Share your professional profile',  bg: 'bg-blue-700',    SvgIcon: LinkedInIcon,  type: 'social', platform: 'linkedin'   },
    { id: 'snapchat',  label: 'Snapchat',    description: 'Share your Snapchat',              bg: 'bg-yellow-400',  SvgIcon: SnapchatSvg,   type: 'social', platform: 'snapchat'   },
    { id: 'pinterest', label: 'Pinterest',   description: 'Share your boards',                bg: 'bg-red-600',     SvgIcon: PinterestSvg,  type: 'social', platform: 'pinterest'  },
    { id: 'discord',   label: 'Discord',     description: 'Invite to your server',            bg: 'bg-indigo-600',  SvgIcon: DiscordIcon,   type: 'social', platform: 'discord'    },
    { id: 'twitch',    label: 'Twitch',      description: 'Share your stream',                bg: 'bg-purple-600',  SvgIcon: TwitchSvg,     type: 'social', platform: 'twitch'     },
    { id: 'github',    label: 'GitHub',      description: 'Share your repositories',          bg: 'bg-gray-900',    SvgIcon: GitHubIcon,    type: 'social', platform: 'github'     },
  ],
  media: [
    { id: 'youtube',     label: 'YouTube',     description: 'Share YouTube videos',       bg: 'bg-red-600',    SvgIcon: YouTubeIcon,    type: 'social', platform: 'youtube'     },
    { id: 'spotify',     label: 'Spotify',     description: 'Share your music',           bg: 'bg-green-500',  SvgIcon: SpotifyIcon,    type: 'social', platform: 'spotify'     },
    { id: 'soundcloud',  label: 'SoundCloud',  description: 'Share your tracks',          bg: 'bg-orange-500', SvgIcon: SoundCloudIcon, type: 'social', platform: 'soundcloud'  },
    { id: 'apple-music', label: 'Apple Music', description: 'Share your Apple Music',     bg: 'bg-red-500',    SvgIcon: AppleMusicIcon, type: 'music',  platform: 'apple-music' },
    { id: 'tiktok',      label: 'TikTok',      description: 'Share your TikTok videos',   bg: 'bg-black',      SvgIcon: TikTokIcon,     type: 'social', platform: 'tiktok'      },
  ],
  contact: [
    { id: 'email',    label: 'Email',    description: 'Let people email you',     bg: 'bg-blue-500',  SvgIcon: EmailIcon,    type: 'contact', platform: 'email'    },
    { id: 'phone',    label: 'Phone',    description: 'Add your phone number',    bg: 'bg-green-600', SvgIcon: PhoneIcon,    type: 'contact', platform: 'phone'    },
    { id: 'whatsapp', label: 'WhatsApp', description: 'Chat on WhatsApp',         bg: 'bg-green-500', SvgIcon: WhatsAppIcon, type: 'contact', platform: 'whatsapp' },
    { id: 'telegram', label: 'Telegram', description: 'Chat on Telegram',         bg: 'bg-blue-400',  SvgIcon: TelegramIcon, type: 'contact', platform: 'telegram' },
    { id: 'website',  label: 'Website',  description: 'Link to your website',     bg: 'bg-gray-600',  SvgIcon: WebsiteIcon,  type: 'link',    platform: 'website'  },
  ],
  events: [
    { id: 'event',    label: 'Event',    description: 'Promote an upcoming event',      bg: 'bg-purple-500', SvgIcon: WebsiteIcon, type: 'event'                       },
    { id: 'calendar', label: 'Calendar', description: 'Let people book time with you',  bg: 'bg-blue-500',   SvgIcon: WebsiteIcon, type: 'event', platform: 'calendar' },
    { id: 'zoom',     label: 'Zoom',     description: 'Share a Zoom meeting link',      bg: 'bg-blue-600',   SvgIcon: ZoomSvg,     type: 'event', platform: 'zoom'     },
  ],
  text: [
    { id: 'header', label: 'Header', description: 'Add a section heading', bg: 'bg-gray-500', SvgIcon: WebsiteIcon, type: 'header' },
    { id: 'text',   label: 'Text',   description: 'Add a block of text',   bg: 'bg-gray-400', SvgIcon: WebsiteIcon, type: 'text'   },
  ],
}


// Category sidebar icons using Lucide
function CatIcon({ id }: { id: string }) {
  const cls = 'w-4 h-4'
  if (id === 'suggested') return <Sparkles className={cls} />
  if (id === 'commerce')  return <ShoppingBag className={cls} />
  if (id === 'social')    return <Share2 className={cls} />
  if (id === 'media')     return <Smartphone className={cls} />
  if (id === 'contact')   return <User className={cls} />
  if (id === 'events')    return <Globe className={cls} />
  if (id === 'text')      return <Type className={cls} />
  return <LinkIcon className={cls} />
}

// Quick-add tiles (top of Suggested) — Lucide icons, no emojis
const QUICK_TILES = [
  { id: 'collection', label: 'Collection', Icon: Layout,      type: 'header' as LinkItem['type'], text: 'New Collection' },
  { id: 'link',       label: 'Link',       Icon: LinkIcon,    type: 'link'   as LinkItem['type'], text: 'New Link'       },
  { id: 'product',    label: 'Product',    Icon: ShoppingBag, type: 'shop'   as LinkItem['type'], text: 'New Product'    },
  { id: 'form',       label: 'Form',       Icon: Type,        type: 'text'   as LinkItem['type'], text: 'New Form'       },
]

function AddLinkModal({ onClose, onAdd }: { onClose: () => void; onAdd: (preset: Partial<LinkItem>) => void }) {
  const [activeCategory, setActiveCategory] = useState('suggested')
  const [search, setSearch] = useState('')

  const allOptions: LinkOption[] = Object.values(LINK_OPTIONS).flat()
  const options: LinkOption[] = search.trim()
    ? allOptions.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        o.description.toLowerCase().includes(search.toLowerCase())
      )
    : (LINK_OPTIONS[activeCategory] || [])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '88vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Add</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pb-3 flex-shrink-0">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 space-x-3">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Paste or search a link"
              className="bg-transparent flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Left: categories */}
          {!search && (
            <div className="w-40 flex-shrink-0 border-r border-gray-100 overflow-y-auto py-1">
              {LINK_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <CatIcon id={cat.id} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Right: content */}
          <div className="flex-1 overflow-y-auto px-4 py-3">

            {/* Quick tiles — Suggested only, no search */}
            {activeCategory === 'suggested' && !search && (
              <div className="grid grid-cols-4 gap-2 mb-5">
                {QUICK_TILES.map(tile => (
                  <button
                    key={tile.id}
                    onClick={() => onAdd({ type: tile.type, text: tile.text, icon: tile.id, url: '' })}
                    className="flex flex-col items-center justify-center py-4 px-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-2">
                      <tile.Icon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{tile.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Section label */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              {search ? 'Search Results' : LINK_CATEGORIES.find(c => c.id === activeCategory)?.label}
            </p>

            {/* Uniform list rows — every row identical height & layout */}
            <div className="space-y-0.5">
              {options.length === 0 && (
                <p className="text-sm text-gray-400 py-8 text-center">No results found</p>
              )}
              {options.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => onAdd({ type: opt.type, text: opt.label, icon: opt.id, platform: opt.platform, url: '' })}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  {/* Icon — fixed 40×40 circle, same for every row */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white ${opt.bg}`}>
                    <opt.SvgIcon size={18} />
                  </div>
                  {/* Label + description */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{opt.label}</p>
                    <p className="text-xs text-gray-500 leading-tight truncate">{opt.description}</p>
                  </div>
                  {/* Chevron */}
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
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
        } catch (e) {}
      }
      const url = getCardPublicUrl(id, handle)
      setCardId(id)
      setCardUrl(url)
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
          <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Your Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={cardUrl}
              readOnly
              className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold flex items-center gap-2"
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

