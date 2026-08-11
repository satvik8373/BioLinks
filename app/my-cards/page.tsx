'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Button from '@/components/ui/Button'
import { getAllCards, deleteCard, saveCard } from '@/lib/storage'
import { parseGoogleDriveUrl } from '@/lib/themes'
import {
  Plus, Eye, Edit3, Trash2, Copy, CheckCircle, Loader2,
  ExternalLink, Sparkles, Check, Star
} from 'lucide-react'

interface CardData {
  id: string
  handle: string
  title: string
  bio: string
  avatar: string
  views: number
  clicks: number
  createdAt: string
  themeName: string
  bgStyle: React.CSSProperties
  profileText: string
  config: any
}

function getBannerStyle(config: any): { bgStyle: React.CSSProperties; profileText: string } {
  const c = config?.theme?.colors
  if (!c) return { bgStyle: { background: 'linear-gradient(135deg, #1a2211, #2d3b1e)' }, profileText: '#fff' }
  let bgStyle: React.CSSProperties = {}
  if (c.backgroundVideo || c.backgroundIframe) {
    bgStyle = { background: 'linear-gradient(135deg, #1a2211, #2d3b1e)' }
  } else if (c.backgroundImage) {
    const driveObj = parseGoogleDriveUrl(c.backgroundImage)
    const imgUrl = driveObj.directUrl || c.backgroundImage
    bgStyle = { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  } else if (c.backgroundMesh) {
    bgStyle = { background: c.backgroundMesh }
  } else if (c.backgroundGradient) {
    const g = c.backgroundGradient
    bgStyle = { background: `linear-gradient(${g.direction || '135deg'},${g.from},${g.to})` }
  } else {
    bgStyle = { backgroundColor: c.background || '#1a2211' }
  }
  return { bgStyle, profileText: c.profileText || '#fff' }
}

function AvatarDisplay({ avatar, title, color }: { avatar: string; title: string; color: string }) {
  const initials = (title || '?')[0].toUpperCase()
  if (!avatar || avatar === 'user') {
    return (
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-extrabold shadow-sm border border-white/30"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)', color }}>
        {initials}
      </div>
    )
  }
  if (avatar.startsWith('http') || avatar.startsWith('data:')) {
    return <img src={avatar} alt={title} className="w-12 h-12 rounded-full object-cover border-2 border-white/40 shadow-sm" />
  }
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl border border-white/30 shadow-sm"
      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
      {avatar}
    </div>
  )
}

export default function MyCardsPage() {
  const router = useRouter()
  const [cards, setCards] = useState<CardData[]>([])
  const [activeCardId, setActiveCardId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copyMsg, setCopyMsg] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
    const profile = localStorage.getItem('userProfile')
    if (!profile) { router.push('/login'); return }

    const loadUserCards = async () => {
      try {
        const result = await getAllCards()

        if (result.success) {
          const rawList: CardData[] = result.cards.map((card: any) => {
            const handle = (card.handle || card.config?.profile?.handle || card.id || '').toLowerCase()
            const { bgStyle, profileText } = getBannerStyle(card.config)
            return {
              id: handle,
              handle,
              title: card.config?.profile?.title || 'My BioLink Card',
              bio: card.config?.profile?.bio || '',
              avatar: card.config?.profile?.avatar || '',
              views: card.analytics?.views || 0,
              clicks: card.analytics?.clicks || 0,
              createdAt: card.createdAt || new Date().toISOString(),
              themeName: card.config?.theme?.name || card.config?.theme?.id || 'Custom',
              bgStyle,
              profileText,
              config: card.config,
            }
          })

          const uniqueMap = new Map<string, CardData>()
          rawList.forEach(item => {
            const key = item.handle
            const existing = uniqueMap.get(key)
            if (!existing || new Date(item.createdAt) > new Date(existing.createdAt)) {
              uniqueMap.set(key, item)
            }
          })

          const list = Array.from(uniqueMap.values()).slice(0, 1)
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setCards(list)

          if (list.length > 0) {
            const accountHandle = (() => {
              try {
                const p = JSON.parse(localStorage.getItem('userProfile') || '{}')
                return (p.username || '').toLowerCase().replace(/[^a-z0-9]/g, '')
              } catch { return '' }
            })()
            const preferred = accountHandle && list.some(c => c.handle === accountHandle)
              ? accountHandle
              : list[0].handle
            setActiveCardId(preferred)
            localStorage.setItem('activeBioCardId', preferred)
            localStorage.setItem('editorPreviewCardId', preferred)
          }
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserCards()
  }, [router])

  const handleSetActiveCard = async (card: CardData) => {
    setActiveCardId(card.handle)
    localStorage.setItem('activeBioCardId', card.handle)
    localStorage.setItem('editorPreviewCardId', card.handle)
    if (card.config) {
      localStorage.setItem('currentBioLinkConfig', JSON.stringify(card.config))
      try {
        await fetch(`/api/cards/${card.handle}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: card.config, handle: card.handle }),
        })
        await saveCard(card.handle, {
          id: card.handle,
          handle: card.handle,
          config: card.config,
          analytics: { views: card.views, clicks: card.clicks },
          createdAt: card.createdAt,
        })
      } catch (err) {}
    }
  }

  const handleEdit = (card: CardData) => {
    handleSetActiveCard(card)
    router.push('/editor')
  }

  const handleDelete = async (cardHandle: string) => {
    if (!confirm('Delete this card? This cannot be undone.')) return
    setDeletingId(cardHandle)

    try {
      await fetch(`/api/cards/${cardHandle}`, { method: 'DELETE' }).catch(() => {})
      await deleteCard(cardHandle)

      const newCards = cards.filter(c => c.handle !== cardHandle)
      setCards(newCards)

      if (activeCardId === cardHandle) {
        if (newCards.length > 0) {
          await handleSetActiveCard(newCards[0])
        } else {
          localStorage.removeItem('currentBioLinkConfig')
          localStorage.removeItem('editorPreviewCardId')
          localStorage.removeItem('activeBioCardId')
          setActiveCardId('')
        }
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete card')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopy = (handleOrId: string) => {
    navigator.clipboard.writeText(`${origin}/${handleOrId}`).then(() => {
      setCopyMsg(handleOrId)
      setTimeout(() => setCopyMsg(null), 2200)
    })
  }

  const handleNewCard = () => {
    if (cards.length > 0) {
      const active = cards.find(c => c.id === activeCardId) || cards[0]
      handleSetActiveCard(active)
      router.push('/editor')
    } else {
      router.push('/create')
    }
  }

  if (loading) {
    return <LoadingScreen title="Loading dashboard..." subtitle="Fetching your BioLink cards" />
  }

  const totalViews = cards.reduce((sum, c) => sum + c.views, 0)
  const totalClicks = cards.reduce((sum, c) => sum + c.clicks, 0)

  return (
    <main className="min-h-screen bg-[#c7d2ab] text-[#1a2211] font-sans flex flex-col justify-between pt-36 pb-12">
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        
        {/* Banner Card Header */}
        <Card className="bg-white border border-black/10 p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2">
              <Badge variant="success" size="md">Account Dashboard</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              My BioLink Cards
            </h1>
            <p className="text-sm font-semibold text-[#1a2211]/80">
              Manage your active bio cards, customize design themes & track analytics
            </p>
          </div>

          <button
            onClick={handleNewCard}
            className="px-7 py-3.5 rounded-full font-black text-xs bg-[#1a2211] text-[#c7d2ab] transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center gap-2 shrink-0"
          >
            {cards.length > 0 ? (
              <><Edit3 className="w-4 h-4" /> Edit Active Card</>
            ) : (
              <><Plus className="w-4 h-4" /> Create New Card</>
            )}
          </button>
        </Card>

        {/* Dashboard Analytics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: 'Total Cards', value: cards.length },
            { label: 'Total Pageviews', value: totalViews.toLocaleString() },
            { label: 'Link Clicks', value: totalClicks.toLocaleString() },
          ].map(({ label, value }) => (
            <Card key={label} className="bg-white border border-black/10 p-6 rounded-3xl shadow-md">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">{label}</p>
              <p className="text-3xl font-black text-slate-900">{value}</p>
            </Card>
          ))}
        </div>

        {/* Card Management List */}
        {cards.length === 0 ? (
          <Card className="bg-white border border-black/10 p-16 text-center rounded-3xl shadow-xl space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#1a2211] text-[#c7d2ab] flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">No Bio Card Created Yet</h2>
            <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">
              Create your custom bio link card now to share your links, social channels, and products everywhere.
            </p>
            <Link href="/create">
              <button
                type="button"
                className="px-8 py-4 rounded-full font-black text-xs bg-[#1a2211] text-[#c7d2ab] transition-all shadow-md hover:scale-[1.02]"
              >
                Create Bio Link Card
              </button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(card => {
              const isActive = card.handle === activeCardId
              return (
                <Card
                  key={card.id}
                  className={`bg-white border transition-all duration-300 overflow-hidden rounded-3xl flex flex-col justify-between shadow-xl ${
                    isActive ? 'border-[#1a2211] ring-2 ring-[#1a2211]/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Banner Top */}
                    <div className="relative h-40 flex flex-col items-center justify-center gap-2 p-4 shadow-sm" style={card.bgStyle}>
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">
                          {card.themeName}
                        </span>
                        <button
                          onClick={() => handleSetActiveCard(card)}
                          className={`flex items-center gap-1.5 text-[10px] font-black px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                            isActive
                              ? 'bg-emerald-500 text-white border border-emerald-400'
                              : 'bg-black/40 text-white/90 hover:bg-black/60 border border-white/20'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                          {isActive ? 'ACTIVE' : 'SET ACTIVE'}
                        </button>
                      </div>

                      <AvatarDisplay avatar={card.avatar} title={card.title} color={card.profileText} />
                      <div className="text-center">
                        <p className="text-base font-black leading-tight" style={{ color: card.profileText }}>{card.title}</p>
                        {card.bio && (
                          <p className="text-xs mt-0.5 opacity-80 line-clamp-1 max-w-[200px]" style={{ color: card.profileText }}>{card.bio}</p>
                        )}
                      </div>
                    </div>

                    {/* Analytics Bar */}
                    <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50">
                      <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                        <Eye className="w-4 h-4 text-slate-400" /> {card.views.toLocaleString()} Views
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[#1a2211] font-bold">
                        <ExternalLink className="w-4 h-4" /> {card.clicks.toLocaleString()} Clicks
                      </span>
                    </div>

                    {/* Handle URL Bar */}
                    <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
                      <span className="text-xs font-mono text-slate-700 truncate font-bold">
                        {origin}/{card.handle}
                      </span>
                      <button
                        onClick={() => handleCopy(card.handle)}
                        className="flex items-center gap-1.5 text-xs text-slate-900 hover:text-black font-extrabold transition-colors cursor-pointer shrink-0 ml-2"
                      >
                        {copyMsg === card.handle ? (
                          <><CheckCircle className="w-4 h-4 text-emerald-600" /><span className="text-emerald-600">Copied</span></>
                        ) : (
                          <><Copy className="w-4 h-4" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="p-4 flex items-center gap-2 bg-slate-50 border-t border-slate-100">
                    <button
                      onClick={() => handleEdit(card)}
                      className="flex-1 py-2.5 px-4 rounded-full font-black text-xs bg-[#1a2211] text-[#c7d2ab] transition-all shadow-sm hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Card
                    </button>
                    <a
                      href={`/${card.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors shadow-xs"
                      title="Preview card"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(card.handle)}
                      disabled={deletingId === card.handle}
                      className="p-2.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors shadow-xs"
                      title="Delete card"
                    >
                      {deletingId === card.handle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
