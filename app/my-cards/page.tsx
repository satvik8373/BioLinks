'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAllCards, deleteCard } from '@/lib/storage'
import {
  Plus, Eye, Edit3, Trash2, Copy, CheckCircle, Loader2,
  Layout, ExternalLink, Sparkles
} from 'lucide-react'

interface CardData {
  id: string
  handle?: string
  title: string
  bio: string
  avatar: string
  views: number
  clicks: number
  createdAt: string
  themeName: string
  bgStyle: React.CSSProperties
  profileText: string
}

function getBannerStyle(config: any): { bgStyle: React.CSSProperties; profileText: string } {
  const c = config?.theme?.colors
  if (!c) return { bgStyle: { background: 'linear-gradient(135deg, #0F172A, #1E293B)' }, profileText: '#fff' }
  let bgStyle: React.CSSProperties = {}
  if (c.backgroundImage) {
    bgStyle = { backgroundImage: `url(${c.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
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
        // Simple: Just load from Firestore (single source of truth)
        const result = await getAllCards()
        
        if (result.success) {
          const list: CardData[] = result.cards.map((card: any) => {
            const { bgStyle, profileText } = getBannerStyle(card.config)
            return {
              id: card.id,
              handle: card.handle || card.id,
              title: card.config?.profile?.title || 'My BioLink Card',
              bio: card.config?.profile?.bio || '',
              avatar: card.config?.profile?.avatar || '',
              views: card.analytics?.views || 0,
              clicks: card.analytics?.clicks || 0,
              createdAt: card.createdAt || new Date().toISOString(),
              themeName: card.config?.theme?.name || card.config?.theme?.id || 'Custom',
              bgStyle,
              profileText,
            }
          })

          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setCards(list)
        }
      } catch (err) {
        console.error('Load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserCards()
  }, [router])

  const handleEdit = (cardId: string) => {
    const loadCard = async () => {
      const result = await getAllCards()
      if (result.success) {
        const card = result.cards.find((c: any) => c.id === cardId)
        if (card?.config) {
          localStorage.setItem('currentBioLinkConfig', JSON.stringify(card.config))
          localStorage.setItem('editorPreviewCardId', cardId)
          router.push('/editor')
        }
      }
    }
    loadCard()
  }

  const handleDelete = async (cardId: string) => {
    if (!confirm('Delete this card? This cannot be undone.')) return
    setDeletingId(cardId)
    
    try {
      // Delete from Firestore (single source of truth)
      await deleteCard(cardId)
      
      // Clear editor config if this was the active card
      const activeId = localStorage.getItem('editorPreviewCardId')
      if (activeId === cardId) {
        localStorage.removeItem('currentBioLinkConfig')
        localStorage.removeItem('editorPreviewCardId')
      }
      
      // Update UI
      setCards(prev => prev.filter(c => c.id !== cardId))
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete card')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopy = (cardId: string) => {
    navigator.clipboard.writeText(`${origin}/card/${cardId}`).then(() => {
      setCopyMsg(cardId)
      setTimeout(() => setCopyMsg(null), 2200)
    })
  }

  const handleDeleteAll = async () => {
    if (!confirm('Delete ALL cards? This will permanently delete all your bio link cards. This cannot be undone!')) return
    if (!confirm('Are you absolutely sure? Type DELETE below to confirm.') || 
        prompt('Type DELETE to confirm:') !== 'DELETE') {
      return
    }
    
    setLoading(true)
    
    try {
      // Delete each card from Firestore
      for (const card of cards) {
        await deleteCard(card.id)
      }
      
      // Clear editor config
      localStorage.removeItem('currentBioLinkConfig')
      localStorage.removeItem('editorPreviewCardId')
      
      // Clear UI
      setCards([])
    } catch (err) {
      console.error('Delete all error:', err)
      alert('Failed to delete all cards')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header Container */}
      <div className="max-w-6xl mx-auto px-5 pt-6 pb-2">
        <div className="clay-card-flat p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">My Bio Cards</h1>
              <p className="text-slate-500 text-xs font-medium mt-0.5">
                {cards.length === 0 ? 'No active cards' : `${cards.length} card${cards.length !== 1 ? 's' : ''} published`}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Link href="/create" className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" /> New Bio Card
            </Link>
            {cards.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="clay-btn bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 text-xs font-bold border border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-1.5" /> Delete All Cards
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        {cards.length === 0 ? (
          <div className="clay-card-flat p-14 text-center bg-white">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto mb-4 shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">No cards built yet</h2>
            <p className="text-slate-500 text-xs font-medium mb-6 max-w-xs mx-auto">
              Create your first bio link card and share your portfolio with your audience.
            </p>
            <Link href="/create" className="clay-btn clay-btn-primary px-6 py-2.5 text-xs font-bold">
              <Plus className="w-4 h-4 mr-1.5" /> Create First Card
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map(card => (
              <div
                key={card.id}
                className="clay-card overflow-hidden bg-white flex flex-col justify-between"
              >
                <div>
                  {/* Card Theme Banner */}
                  <div className="relative h-32 flex flex-col items-center justify-center gap-2 px-4 shadow-sm" style={card.bgStyle}>
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/60 text-white backdrop-blur-sm capitalize border border-white/10">
                        {card.themeName}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 backdrop-blur-sm border border-emerald-400/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                      </span>
                    </div>

                    <AvatarDisplay avatar={card.avatar} title={card.title} color={card.profileText} />
                    <div className="text-center">
                      <p className="text-sm font-extrabold leading-tight" style={{ color: card.profileText }}>{card.title}</p>
                      {card.bio && (
                        <p className="text-[11px] mt-0.5 opacity-80 line-clamp-1 max-w-[180px]" style={{ color: card.profileText }}>{card.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Card Analytics Stats */}
                  <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                      <Eye className="w-3.5 h-3.5 text-slate-400" /> {card.views} Views
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-brand-600 font-bold">
                      <ExternalLink className="w-3.5 h-3.5 text-brand-500" /> {card.clicks} Clicks
                    </span>
                  </div>

                  {/* URL Bar */}
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2 bg-white">
                    <span className="text-xs font-mono text-slate-500 truncate flex-1 font-semibold">
                      {origin}/card/{card.id}
                    </span>
                    <button
                      onClick={() => handleCopy(card.id)}
                      className="flex-shrink-0 flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 font-bold transition-colors"
                    >
                      {copyMsg === card.id ? (
                        <><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /><span className="text-emerald-600">Copied</span></>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3 flex items-center gap-2 bg-white">
                  <a
                    href={`/card/${card.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn clay-btn-ghost px-3 py-1.5 text-xs font-bold flex-1 text-center"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" /> Preview
                  </a>
                  <button
                    onClick={() => handleEdit(card.id)}
                    className="clay-btn clay-btn-primary px-3 py-1.5 text-xs font-bold flex-1 text-center"
                  >
                    <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    disabled={deletingId === card.id}
                    className="clay-btn bg-red-50 text-red-600 hover:bg-red-100 p-1.5 text-xs font-bold border border-red-200"
                    title="Delete card"
                  >
                    {deletingId === card.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
