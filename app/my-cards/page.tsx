'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAllCards, deleteCard, saveCard } from '@/lib/storage'
import { parseGoogleDriveUrl } from '@/lib/themes'
import {
  Plus, Eye, Edit3, Trash2, Copy, CheckCircle, Loader2,
  Layout, ExternalLink, Sparkles, Check, Star
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
  if (!c) return { bgStyle: { background: 'linear-gradient(135deg, #0F172A, #1E293B)' }, profileText: '#fff' }
  let bgStyle: React.CSSProperties = {}
  if (c.backgroundVideo || c.backgroundIframe) {
    // video background — show a dark placeholder in the banner
    bgStyle = { background: 'linear-gradient(135deg, #0F172A, #1E293B)' }
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
    bgStyle = { backgroundColor: c.background || '#0F172A' }
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

    const savedActiveId = localStorage.getItem('activeBioCardId') || localStorage.getItem('editorPreviewCardId') || ''

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

          // One card per account username — keep most recently updated
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

  // Set a card as the active one being edited, load it into editor state
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

    const card = cards.find(c => c.handle === cardHandle)

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

  // "New Card" button — if a card already exists, go to editor (edit current).
  // Only go to /create if there are truly no cards yet.
  const handleNewCard = () => {
    if (cards.length > 0) {
      // Load the active card and go straight to editor
      const active = cards.find(c => c.id === activeCardId) || cards[0]
      handleSetActiveCard(active)
      router.push('/editor')
    } else {
      router.push('/create')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16 bg-slate-50/50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-5 pt-6 pb-2">
        <div className="clay-card-flat p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">My Bio Card</h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                {cards.length === 0 ? 'No card yet' : `${cards.length} card${cards.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNewCard}
              className="clay-btn clay-btn-primary px-4 py-2.5 text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
            >
              {cards.length > 0 ? (
                <><Edit3 className="w-4 h-4" /> Edit Card</>
              ) : (
                <><Plus className="w-4 h-4" /> Create Card</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        {cards.length === 0 ? (
          <div className="clay-card-flat p-14 text-center bg-white border border-slate-200 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">No card built yet</h2>
            <p className="text-slate-500 text-xs font-medium mb-6 max-w-xs mx-auto">
              Create your bio link card and share it with your audience.
            </p>
            <Link href="/create" className="clay-btn clay-btn-primary px-6 py-2.5 text-xs font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Create Card
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(card => {
              const isActive = card.handle === activeCardId
              return (
                <div
                  key={card.id}
                  className={`clay-card overflow-hidden bg-white flex flex-col justify-between rounded-2xl transition-all duration-200 ${
                    isActive ? 'ring-2 ring-emerald-500 shadow-xl scale-[1.01]' : 'border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Banner */}
                    <div className="relative h-36 flex flex-col items-center justify-center gap-2 px-4 shadow-sm" style={card.bgStyle}>
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/60 text-white backdrop-blur-sm capitalize border border-white/10">
                          {card.themeName}
                        </span>
                        <button
                          onClick={() => handleSetActiveCard(card)}
                          className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                            isActive
                              ? 'bg-emerald-500 text-white border border-emerald-400 ring-2 ring-emerald-300/40'
                              : 'bg-black/40 text-white/90 hover:bg-black/60 border border-white/20'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                          {isActive ? 'ACTIVE' : 'SET ACTIVE'}
                        </button>
                      </div>
                      <AvatarDisplay avatar={card.avatar} title={card.title} color={card.profileText} />
                      <div className="text-center">
                        <p className="text-sm font-extrabold leading-tight" style={{ color: card.profileText }}>{card.title}</p>
                        {card.bio && (
                          <p className="text-[11px] mt-0.5 opacity-80 line-clamp-1 max-w-[180px]" style={{ color: card.profileText }}>{card.bio}</p>
                        )}
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                      <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                        <Eye className="w-3.5 h-3.5 text-slate-400" /> {card.views} Views
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-500" /> {card.clicks} Clicks
                      </span>
                    </div>

                    {/* URL Bar */}
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-white">
                      <span className="text-xs font-mono text-slate-600 truncate flex-1 font-semibold">
                        {origin}/{card.handle}
                      </span>
                      <button
                        onClick={() => handleCopy(card.handle)}
                        className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 font-bold transition-colors"
                      >
                        {copyMsg === card.handle ? (
                          <><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-600">Copied</span></>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 flex items-center gap-2 bg-white">
                    <button
                      onClick={() => handleSetActiveCard(card)}
                      className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex-1 flex items-center justify-center gap-1 ${
                        isActive ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isActive ? <Check className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5 text-slate-400" />}
                      {isActive ? 'Active' : 'Make Active'}
                    </button>
                    <button
                      onClick={() => handleEdit(card)}
                      className="clay-btn clay-btn-primary px-3 py-1.5 text-xs font-bold flex-1 text-center"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                    </button>
                    <a
                      href={`/${card.handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-btn clay-btn-ghost p-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                      title="Preview card"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(card.handle)}
                      disabled={deletingId === card.handle}
                      className="clay-btn bg-rose-50 text-rose-600 hover:bg-rose-100 p-2 text-xs font-bold border border-rose-200 rounded-xl"
                      title="Delete card"
                    >
                      {deletingId === card.handle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
