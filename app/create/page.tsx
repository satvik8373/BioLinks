'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Avatar from '@/components/ui/Avatar'
import { THEMES, getThemesByCategory, Theme, parseGoogleDriveUrl } from '@/lib/themes'
import { getCleanUsernameSlug } from '@/lib/urlHelper'
import { 
  ArrowLeft, 
  ArrowRight,
  Sparkles, 
  Circle,
  Rainbow,
  Briefcase,
  Palette as PaletteIcon,
  Moon,
  Loader2,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  ChevronRight,
  Check,
  Music,
  ShoppingBag,
  Send,
  Zap,
  Star,
  FileText
} from 'lucide-react'

function getThemeBackgroundStyle(theme: Theme): React.CSSProperties {
  const c = theme.colors
  
  if (c.backgroundGradient) {
    const g = c.backgroundGradient
    return { 
      background: `linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})`,
      backgroundSize: '100% 100%',
      position: 'relative' as const,
    }
  }
  
  if (c.backgroundMesh) {
    return { 
      background: c.backgroundMesh,
      backgroundSize: '100% 100%',
      position: 'relative' as const,
    }
  }
  
  if (c.backgroundImage) {
    const driveObj = parseGoogleDriveUrl(c.backgroundImage)
    const imgUrl = driveObj.directUrl || c.backgroundImage
    return {
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative' as const,
    }
  }
  
  return { 
    backgroundColor: c.background || '#FFFFFF',
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.025) 1px, transparent 0)',
    backgroundSize: '20px 20px',
  }
}

const CATEGORY_SAMPLE_LINKS: Record<string, Array<{ text: string; icon: any }>> = {
  minimal: [
    { text: 'Read My Newsletter', icon: FileText },
    { text: 'Design Portfolio 2026', icon: Globe },
    { text: 'Book 1-on-1 Mentorship', icon: Star },
  ],
  dark: [
    { text: 'Cyberpunk Soundtracks', icon: Music },
    { text: 'Join Discord Community', icon: Send },
    { text: 'GitHub Code Repos', icon: Zap },
  ],
  gradient: [
    { text: 'Watch Latest YouTube Video', icon: Youtube },
    { text: 'Shop Digital Preset Collection', icon: ShoppingBag },
    { text: 'Follow Me on Instagram', icon: Instagram },
  ],
  mesh: [
    { text: 'Explore Creative Projects', icon: Sparkles },
    { text: 'Listen to Podcast Episode', icon: Music },
    { text: 'Connect on Twitter / X', icon: Twitter },
  ],
  image: [
    { text: 'Photography Portfolio', icon: Globe },
    { text: 'Book Photo Shoot Session', icon: Star },
    { text: 'Instagram Gallery', icon: Instagram },
  ],
  vibrant: [
    { text: '⚡ Limited Merch Drop', icon: ShoppingBag },
    { text: '🔥 Join VIP Membership', icon: Star },
    { text: '▶ Stream New Single', icon: Music },
  ],
}

function renderButtonStyle(theme: Theme): React.CSSProperties {
  const c = theme.colors
  const b = theme.buttonStyle

  let styleObj: React.CSSProperties = {
    color: c.buttonText,
    borderRadius: b.borderRadius > 20 ? '9999px' : `${b.borderRadius}px`,
    fontWeight: 600,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  if (b.style === 'outline') {
    styleObj.backgroundColor = 'transparent'
    styleObj.border = `${Math.max(b.borderWidth, 2)}px solid ${c.accent || c.buttonText}`
    styleObj.boxShadow = 'none'
  } else if (b.style === 'glass') {
    styleObj.backgroundColor = 'rgba(255, 255, 255, 0.12)'
    styleObj.backdropFilter = 'blur(16px) saturate(200%)'
    styleObj.WebkitBackdropFilter = 'blur(16px) saturate(200%)'
    styleObj.border = '1.5px solid rgba(255, 255, 255, 0.3)'
    styleObj.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)'
  } else if (b.style === 'clay') {
    styleObj.background = c.buttonDefault
    styleObj.border = 'none'
    styleObj.boxShadow = '8px 8px 16px rgba(163, 177, 198, 0.5)'
  } else if (b.style === 'soft') {
    styleObj.backgroundColor = c.buttonDefault
    styleObj.border = 'none'
    styleObj.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
  } else if (b.style === 'hard-shadow') {
    styleObj.backgroundColor = c.buttonDefault
    styleObj.border = '2.5px solid #000000'
    styleObj.boxShadow = '5px 5px 0px #000000'
  } else {
    if (c.buttonDefault.includes('gradient')) {
      styleObj.background = c.buttonDefault
    } else {
      styleObj.backgroundColor = c.buttonDefault
    }
    if (b.borderWidth > 0) {
      styleObj.border = `${b.borderWidth}px solid ${b.borderColor || c.accent || 'transparent'}`
    }
    if (b.shadow) {
      styleObj.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)'
    }
  }

  return styleObj
}

export default function CreatePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'all',      name: 'All Themes', icon: Sparkles,    description: 'Explore all styles' },
    { id: 'minimal',  name: 'Minimal',    icon: Circle,      description: 'Clean & minimal' },
    { id: 'dark',     name: 'Dark',       icon: Moon,        description: 'Dark mode' },
    { id: 'gradient', name: 'Gradient',   icon: Rainbow,     description: 'Vibrant gradients' },
    { id: 'mesh',     name: 'Mesh',       icon: PaletteIcon, description: 'Multi-color mesh' },
    { id: 'image',    name: 'Image',      icon: Briefcase,   description: 'Photo backdrops' },
    { id: 'vibrant',  name: 'Vibrant',    icon: Rainbow,     description: 'Bold & expressive' },
  ] as const

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    } else {
      setUserProfile({
        displayName: 'Alex Rivera',
        username: 'alexrivera',
        bio: 'Digital Creator & Designer • Crafting modern web experiences',
        avatar: 'user',
        website: 'https://alexrivera.design'
      })
    }

    setSelectedTheme(THEMES[0])
    setLoading(false)
  }, [])

  const handleCreateBioLink = (themeToUse?: Theme) => {
    const theme = themeToUse || selectedTheme
    if (!theme) return

    const existingConfig = localStorage.getItem('currentBioLinkConfig')
    const existingId = localStorage.getItem('editorPreviewCardId')
    if (existingConfig && existingId) {
      router.push('/editor')
      return
    }

    const profileData = userProfile || {
      displayName: 'My Name',
      username: 'myusername',
      bio: 'Welcome to my bio card',
      avatar: 'user'
    }

    const accountUsername = getCleanUsernameSlug(profileData.username) || 'myusername'
    const sampleLinks = CATEGORY_SAMPLE_LINKS[theme.category] || CATEGORY_SAMPLE_LINKS.minimal

    const bioLinkConfig = {
      theme,
      profile: {
        avatar: profileData.avatar,
        title: profileData.displayName || profileData.username,
        handle: accountUsername,
        bio: profileData.bio || 'Welcome to my bio link card',
        location: profileData.location || '',
        website: profileData.website || '',
        profession: profileData.profession || ''
      },
      links: sampleLinks.map((item, i) => ({
        id: `${i + 1}`,
        type: 'link' as const,
        text: item.text,
        url: profileData.website || 'https://example.com',
        icon: 'globe',
        isVisible: true
      })),
      socialLinks: {
        instagram: 'alexrivera',
        twitter: 'alexrivera',
        youtube: 'alexrivera',
        website: profileData.website || ''
      }
    }

    localStorage.setItem('currentBioLinkConfig', JSON.stringify(bioLinkConfig))
    localStorage.setItem('editorPreviewCardId', accountUsername)
    localStorage.setItem('activeBioCardId', accountUsername)

    const userId = profileData.id || profileData.uid || ''
    if (userId) {
      fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          draftData: {
            version: 0,
            theme: bioLinkConfig.theme,
            profile: bioLinkConfig.profile,
            links: bioLinkConfig.links,
            socialLinks: bioLinkConfig.socialLinks,
            settings: {},
          }
        })
      }).catch(err => console.warn('Initial draft save warning:', err))
    }

    router.push('/editor')
  }

  if (loading) {
    return <LoadingScreen title="Loading theme templates..." subtitle="Preparing design presets" />
  }

  const filteredThemes = activeCategory === 'all' 
    ? THEMES 
    : getThemesByCategory(activeCategory as any)

  return (
    <main className="min-h-screen bg-[#c7d2ab] text-[#1a2211] font-sans flex flex-col justify-between pt-36 pb-12">
      <div className="flex-1 max-w-7xl mx-auto px-6 py-4 w-full space-y-6">

        {/* ── Top Header Banner Card ── */}
        <Card className="bg-white border border-black/10 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/my-cards')}
              className="p-3 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors shrink-0 shadow-xs"
              title="Back to My Cards"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success" size="md">{THEMES.length} Theme Templates</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Choose Theme Template
              </h1>
              <p className="text-sm font-semibold text-slate-500">
                Explore custom theme presets. Select a style and click <span className="font-bold text-slate-900">"Use Theme"</span> to start.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCreateBioLink()}
            className="px-7 py-3.5 rounded-full font-black text-xs bg-[#1a2211] text-[#c7d2ab] transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center gap-2 shrink-0"
          >
            Start with Selected <ArrowRight className="w-4 h-4" />
          </button>
        </Card>

        {/* ── Category Filter Pills ── */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition-all shadow-sm ${
                  isActive
                    ? 'bg-[#1a2211] text-[#c7d2ab]'
                    : 'bg-white text-slate-800 hover:bg-slate-100 border border-black/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c7d2ab]' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* ── HIGHLY DIVERSE 9:16 THEME CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredThemes.map((theme) => {
            const isSelected = selectedTheme.id === theme.id
            const bgStyle = getThemeBackgroundStyle(theme)
            const btnStyle = renderButtonStyle(theme)
            const sampleLinks = CATEGORY_SAMPLE_LINKS[theme.category] || CATEGORY_SAMPLE_LINKS.minimal

            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedTheme(theme) } }}
                className={`w-full aspect-[9/16] rounded-3xl p-5 flex flex-col justify-between items-center text-center relative overflow-hidden border-2 transition-all duration-300 group cursor-pointer ${
                  isSelected
                    ? 'border-[#1a2211] ring-4 ring-[#1a2211]/20 shadow-2xl scale-[1.03]'
                    : 'border-white/30 hover:border-[#1a2211] hover:shadow-2xl shadow-xl'
                }`}
                style={bgStyle}
              >
                {theme.colors.backgroundOverlay && (
                  <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ backgroundColor: theme.colors.backgroundOverlay }} 
                  />
                )}

                {/* Top Badge */}
                <div className="w-full flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 truncate max-w-[100px] shadow-md">
                      {theme.name}
                    </span>
                    {theme.isPremium && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-black flex items-center gap-0.5 shadow-md">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        PRO
                      </span>
                    )}
                  </div>
                  {isSelected ? (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-white/90 backdrop-blur-md px-2.5 py-1 rounded-full bg-black/40 capitalize border border-white/20 shadow-sm">
                      {theme.buttonStyle.style}
                    </span>
                  )}
                </div>

                {/* Profile Header */}
                <div className="my-auto w-full px-2 relative z-10">
                  <Avatar 
                    src={userProfile?.avatar} 
                    size="md" 
                    className="mx-auto mb-3 border-2 shadow-xl"
                    style={{ borderColor: theme.colors.accent }}
                  />
                  <h3 
                    className="font-black text-sm leading-tight mb-1 truncate max-w-[160px] mx-auto"
                    style={{ color: theme.colors.profileText, fontFamily: theme.fonts.heading }}
                  >
                    {userProfile?.displayName || 'Alex Rivera'}
                  </h3>
                  <p 
                    className="text-[11px] max-w-[170px] mx-auto line-clamp-1 opacity-85 font-medium leading-tight mb-3"
                    style={{ color: theme.colors.profileBio, fontFamily: theme.fonts.body }}
                  >
                    {userProfile?.bio || 'Digital Creator'}
                  </p>

                  {/* Category-Specific Unique Link Buttons */}
                  <div className="space-y-2 w-full">
                    {sampleLinks.map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={idx}
                          className="w-full py-2 px-3 text-xs font-bold text-center flex items-center justify-between shadow-sm"
                          style={btnStyle}
                        >
                          <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                          <span className="truncate mx-1">{item.text}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="w-full pt-3 flex items-center justify-between relative z-10 border-t border-white/20">
                  <div className="flex items-center gap-2 opacity-90" style={{ color: theme.colors.accent }}>
                    <Instagram className="w-3.5 h-3.5" />
                    <Twitter className="w-3.5 h-3.5" />
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTheme(theme)
                      handleCreateBioLink(theme)
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#1a2211] text-[#c7d2ab] flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    Use Theme <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </main>
  )
}
