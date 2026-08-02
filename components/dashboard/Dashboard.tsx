'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getAllCards, deleteCard as removeCard } from '@/lib/storage'
import { 
  Plus, 
  Eye, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Copy, 
  BarChart3, 
  Settings,
  QrCode,
  Calendar,
  Users,
  TrendingUp,
  User,
  Smartphone
} from 'lucide-react'

interface CardData {
  id: string
  config: {
    profile: {
      title: string
      bio: string
      avatar: string
    }
    links: Array<{
      id: string
      text: string
      clickCount?: number
    }>
  }
  analytics: {
    views: number
    clicks: number
  }
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [cards, setCards] = useState<{ [key: string]: CardData }>({})
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has completed onboarding
    const profile = localStorage.getItem('userProfile')
    const onboardingCompleted = localStorage.getItem('onboardingCompleted')
    
    if (!profile || !onboardingCompleted) {
      // Redirect to onboarding if not completed
      router.push('/onboarding')
      return
    }

    setUserProfile(JSON.parse(profile))

    const loadCards = async () => {
      try {
        // Load from Firestore (single source of truth)
        const result = await getAllCards()
        if (result.success) {
          const cardMap: { [key: string]: CardData } = {}
          result.cards.forEach((card: any) => {
            cardMap[card.id] = card
          })
          setCards(cardMap)
        }
      } catch (error) {
        console.error('Error loading cards:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [router])

  const deleteCard = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      // Delete from Firestore (single source of truth)
      await removeCard(cardId)
      
      // Update local state
      const updatedCards = { ...cards }
      delete updatedCards[cardId]
      setCards(updatedCards)
    }
  }

  const copyCardUrl = async (cardId: string) => {
    const url = `${window.location.origin}/card/${cardId}`
    try {
      await navigator.clipboard.writeText(url)
      alert('Card URL copied to clipboard!')
    } catch (err) {
      alert(`Card URL: ${url}`)
    }
  }

  const duplicateCard = (cardId: string) => {
    const originalCard = cards[cardId]
    if (!originalCard) return

    const newCardId = Math.random().toString(36).substr(2, 9)
    const duplicatedCard = {
      ...originalCard,
      id: newCardId,
      config: {
        ...originalCard.config,
        profile: {
          ...originalCard.config.profile,
          title: `${originalCard.config.profile.title} (Copy)`
        }
      },
      analytics: {
        views: 0,
        clicks: 0
      },
      createdAt: new Date().toISOString()
    }

    const updatedCards = { ...cards, [newCardId]: duplicatedCard }
    setCards(updatedCards)
    localStorage.setItem('bioCards', JSON.stringify(updatedCards))
  }

  const cardArray = Object.values(cards)
  const totalViews = cardArray.reduce((sum, card) => sum + (card.analytics.views || 0), 0)
  const totalClicks = cardArray.reduce((sum, card) => sum + (card.analytics.clicks || 0), 0)
  const totalLinks = cardArray.reduce((sum, card) => sum + card.config.links.length, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-neo-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-bold">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Header */}
      <div className="bg-neo-yellow border-b-4 border-neo-black px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold">DASHBOARD</h1>
                {userProfile && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-neo-white border-2 border-neo-black">
                    <User className="w-4 h-4" />
                    <span className="font-bold text-sm">{userProfile.displayName}</span>
                  </div>
                )}
              </div>
              <p className="font-medium text-neo-gray">Manage your bio link cards and view analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE NEW CARD
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neo-pink">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL CARDS</p>
                <p className="text-2xl font-bold text-neo-black">{cardArray.length}</p>
              </div>
              <Users className="w-8 h-8 text-neo-black/50" />
            </div>
          </Card>

          <Card className="bg-neo-cyan">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL VIEWS</p>
                <p className="text-2xl font-bold text-neo-black">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-neo-black/50" />
            </div>
          </Card>

          <Card className="bg-neo-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL CLICKS</p>
                <p className="text-2xl font-bold text-neo-black">{totalClicks.toLocaleString()}</p>
              </div>
              <ExternalLink className="w-8 h-8 text-neo-black/50" />
            </div>
          </Card>

          <Card className="bg-neo-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL LINKS</p>
                <p className="text-2xl font-bold text-neo-black">{totalLinks}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-neo-black/50" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/create">
            <Card hover className="text-center cursor-pointer">
              <Plus className="w-12 h-12 mx-auto mb-4 text-neo-pink" />
              <h3 className="font-bold text-lg mb-2">CREATE NEW CARD</h3>
              <p className="text-sm text-neo-gray">Choose a theme and customize your bio link</p>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card hover className="text-center cursor-pointer">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-neo-cyan" />
              <h3 className="font-bold text-lg mb-2">VIEW ANALYTICS</h3>
              <p className="text-sm text-neo-gray">Detailed insights and performance metrics</p>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card hover className="text-center cursor-pointer">
              <Settings className="w-12 h-12 mx-auto mb-4 text-neo-green" />
              <h3 className="font-bold text-lg mb-2">SETTINGS</h3>
              <p className="text-sm text-neo-gray">Customize your account and preferences</p>
            </Card>
          </Link>
        </div>

        {/* Cards List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">YOUR CARDS</h2>
            {cardArray.length > 0 && (
              <div className="text-sm text-neo-gray">
                {cardArray.length} card{cardArray.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {cardArray.length === 0 ? (
            <Card className="text-center py-12">
              <Smartphone className="w-24 h-24 mx-auto mb-4 text-neo-cyan" />
              <h3 className="text-xl font-bold mb-2">NO CARDS YET</h3>
              <p className="text-neo-gray mb-6">Create your first bio link card to get started</p>
              <Link href="/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  CREATE YOUR FIRST CARD
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardArray.map((card) => (
                <Card key={card.id} className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neo-yellow border-2 border-neo-black rounded-full flex items-center justify-center text-lg">
                        {card.config.profile.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{card.config.profile.title}</h3>
                        <p className="text-sm text-neo-gray">{card.config.links.length} links</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-neo-gray mb-4 line-clamp-2">
                    {card.config.profile.bio}
                  </p>

                  {/* Analytics */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-neo-gray">
                        <Eye className="w-4 h-4 mr-1" />
                        {card.analytics.views || 0}
                      </span>
                      <span className="flex items-center text-neo-gray">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {card.analytics.clicks || 0}
                      </span>
                    </div>
                    <span className="text-neo-gray">
                      {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link href={`/card/${card.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        VIEW
                      </Button>
                    </Link>
                    
                    <Link href={`/editor/${card.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyCardUrl(card.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => duplicateCard(card.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => deleteCard(card.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {cardArray.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold mb-4">RECENT ACTIVITY</h3>
            <div className="space-y-3">
              {cardArray
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((card) => (
                  <div key={card.id} className="flex items-center justify-between py-2 border-b border-neo-gray/20 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-neo-pink border-2 border-neo-black rounded-full flex items-center justify-center text-sm">
                        {card.config.profile.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{card.config.profile.title}</p>
                        <p className="text-xs text-neo-gray">
                          Created {new Date(card.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-bold">{card.analytics.views || 0} views</p>
                      <p className="text-neo-gray">{card.analytics.clicks || 0} clicks</p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}