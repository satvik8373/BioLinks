'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { THEMES, getThemesByCategory, Theme } from '@/lib/themes'
import { 
  ArrowRight, 
  ArrowLeft, 
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
  if (c.backgroundImage) {
    return {
      backgroundImage: `url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  if (c.backgroundMesh) {
    return { background: c.backgroundMesh }
  }
  if (c.backgroundGradient) {
    const g = c.backgroundGradient
    return { background: `linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})` }
  }
  return { backgroundColor: c.background || '#FFFFFF' }
}

// Sample links per theme category so every card has distinct, realistic content
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
  }

  if (b.style === 'outline') {
    styleObj.backgroundColor = 'transparent'
    styleObj.border = `${Math.max(b.borderWidth, 1.5)}px solid ${c.accent || c.buttonText}`
  } else if (b.style === 'glass') {
    styleObj.backgroundColor = 'rgba(255, 255, 255, 0.18)'
    styleObj.backdropFilter = 'blur(8px)'
    styleObj.border = '1px solid rgba(255, 255, 255, 0.3)'
    styleObj.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
  } else if (b.style === 'hard-shadow') {
    styleObj.backgroundColor = c.buttonDefault
    styleObj.border = '2px solid #000000'
    styleObj.boxShadow = '3px 3px 0px #000000'
  } else {
    styleObj.backgroundColor = c.buttonDefault
    if (b.borderWidth > 0) {
      styleObj.border = `${b.borderWidth}px solid ${c.accent || 'transparent'}`
    }
    if (b.shadow) {
      styleObj.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'
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

    const profileData = userProfile || {
      displayName: 'My Name',
      username: 'myusername',
      bio: 'Welcome to my bio card',
      avatar: 'user'
    }

    const sampleLinks = CATEGORY_SAMPLE_LINKS[theme.category] || CATEGORY_SAMPLE_LINKS.minimal

    const bioLinkConfig = {
      theme,
      profile: {
        avatar: profileData.avatar,
        title: profileData.displayName || profileData.username,
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
    router.push('/editor')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
          <p className="font-bold text-slate-900 text-sm">Loading theme templates...</p>
        </div>
      </div>
    )
  }

  const filteredThemes = activeCategory === 'all' 
    ? THEMES 
    : getThemesByCategory(activeCategory as any)

  return (
    <div className="min-h-screen pb-20 bg-slate-50">

      {/* ── Top Header ── */}
      <div className="max-w-[1600px] mx-auto px-6 pt-6 pb-3">
        <div className="clay-card-flat p-5 bg-white flex items-center justify-between border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/my-cards')}
              className="clay-btn clay-btn-ghost p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex-shrink-0"
              title="Back to My Cards"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Choose Theme Template</h1>
                <span className="text-[10px] font-extrabold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                  {THEMES.length} Unique Themes
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Explore our collection of custom theme designs. Click <span className="font-bold text-slate-800">"Use Theme"</span> to open in editor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="max-w-[1600px] mx-auto px-6 py-1">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>

        {/* ── HIGHLY DIVERSE 9:16 THEME CARDS GRID ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredThemes.map((theme) => {
            const isSelected = selectedTheme.id === theme.id
            const bgStyle = getThemeBackgroundStyle(theme)
            const btnStyle = renderButtonStyle(theme)
            const sampleLinks = CATEGORY_SAMPLE_LINKS[theme.category] || CATEGORY_SAMPLE_LINKS.minimal

            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`w-full aspect-[9/16] rounded-[22px] p-3.5 flex flex-col justify-between items-center text-center relative shadow-md overflow-hidden border transition-all duration-200 group cursor-pointer ${
                  isSelected
                    ? 'border-2 border-brand-600 ring-2 ring-brand-500/20 shadow-xl scale-[1.02]'
                    : 'border-slate-200/80 hover:border-slate-400 hover:shadow-lg hover:-translate-y-1'
                }`}
                style={bgStyle}
              >
                {/* Background Overlay for Image Themes */}
                {theme.colors.backgroundOverlay && (
                  <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ backgroundColor: theme.colors.backgroundOverlay }} 
                  />
                )}

                {/* Top Badge */}
                <div className="w-full flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900/60 text-white backdrop-blur-sm capitalize border border-white/20 truncate max-w-[95px]">
                    {theme.name}
                  </span>
                  {isSelected ? (
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-brand-600 text-white flex items-center gap-0.5 shadow-sm">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full bg-black/30 capitalize">
                      {theme.buttonStyle.style}
                    </span>
                  )}
                </div>

                {/* Profile Header */}
                <div className="my-auto w-full px-1 relative z-10">
                  <Avatar 
                    src={userProfile?.avatar} 
                    size="md" 
                    className="mx-auto mb-2 border-2 border-white/50 shadow-md"
                  />
                  <h3 
                    className="font-extrabold text-xs leading-snug mb-0.5 truncate max-w-[140px] mx-auto"
                    style={{ color: theme.colors.profileText, fontFamily: theme.fonts.heading }}
                  >
                    {userProfile?.displayName || 'Alex Rivera'}
                  </h3>
                  <p 
                    className="text-[10px] max-w-[150px] mx-auto line-clamp-1 opacity-85 font-medium leading-tight mb-2.5"
                    style={{ color: theme.colors.profileBio, fontFamily: theme.fonts.body }}
                  >
                    {userProfile?.bio || 'Digital Creator'}
                  </p>

                  {/* Category-Specific Unique Link Buttons */}
                  <div className="space-y-1.5 w-full">
                    {sampleLinks.map((item, idx) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={idx}
                          className="w-full py-1.5 px-2.5 text-[10px] font-bold text-center flex items-center justify-between"
                          style={btnStyle}
                        >
                          <Icon className="w-3 h-3 opacity-80 flex-shrink-0" />
                          <span className="truncate mx-1">{item.text}</span>
                          <ChevronRight className="w-3 h-3 opacity-50 flex-shrink-0" />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="w-full pt-2 flex items-center justify-between relative z-10 border-t border-white/20">
                  <div className="flex items-center gap-2 opacity-90" style={{ color: theme.colors.accent }}>
                    <Instagram className="w-3 h-3" />
                    <Twitter className="w-3 h-3" />
                    <Globe className="w-3 h-3" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedTheme(theme)
                      handleCreateBioLink(theme)
                    }}
                    className="clay-btn clay-btn-primary px-2.5 py-1 text-[10px] font-extrabold flex items-center gap-0.5 shadow-sm"
                  >
                    Use Theme <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}