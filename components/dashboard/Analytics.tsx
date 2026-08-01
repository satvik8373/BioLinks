'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { 
  ArrowLeft, 
  Eye, 
  ExternalLink, 
  TrendingUp, 
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Users,
  Clock
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
      url: string
      clickCount?: number
    }>
  }
  analytics: {
    views: number
    clicks: number
  }
  createdAt: string
}

export default function Analytics() {
  const [cards, setCards] = useState<{ [key: string]: CardData }>({})
  const [selectedCard, setSelectedCard] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('7d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCards = () => {
      try {
        const savedCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
        setCards(savedCards)
      } catch (error) {
        console.error('Error loading cards:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [])

  const exportToExcel = () => {
    const cardArray = Object.values(cards)
    let csvContent = "Card Name,Views,Clicks,Links,Created Date,Click Rate\n"
    
    cardArray.forEach(card => {
      const clickRate = card.analytics.views > 0 ? 
        ((card.analytics.clicks / card.analytics.views) * 100).toFixed(2) : '0'
      
      csvContent += `"${card.config.profile.title}",${card.analytics.views || 0},${card.analytics.clicks || 0},${card.config.links.length},"${new Date(card.createdAt).toLocaleDateString()}",${clickRate}%\n`
    })

    // Add link-level data
    csvContent += "\n\nLink Performance\n"
    csvContent += "Card Name,Link Text,Link URL,Clicks\n"
    
    cardArray.forEach(card => {
      card.config.links.forEach(link => {
        csvContent += `"${card.config.profile.title}","${link.text}","${link.url}",${link.clickCount || 0}\n`
      })
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `bio-link-analytics-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const cardArray = Object.values(cards)
  const filteredCards = selectedCard === 'all' ? cardArray : cardArray.filter(card => card.id === selectedCard)
  
  const totalViews = filteredCards.reduce((sum, card) => sum + (card.analytics.views || 0), 0)
  const totalClicks = filteredCards.reduce((sum, card) => sum + (card.analytics.clicks || 0), 0)
  const totalLinks = filteredCards.reduce((sum, card) => sum + card.config.links.length, 0)
  const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0'

  // Get top performing links
  const allLinks = cardArray.flatMap(card => 
    card.config.links.map(link => ({
      ...link,
      cardName: card.config.profile.title,
      cardId: card.id
    }))
  ).sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))

  const topLinks = allLinks.slice(0, 10)

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-neo-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-bold">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Header */}
      <div className="bg-neo-cyan border-b-4 border-neo-black px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  BACK
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-2">ANALYTICS</h1>
                <p className="font-medium text-neo-gray">Detailed insights and performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={exportToExcel} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                EXPORT DATA
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div>
            <label className="block text-sm font-bold mb-2">CARD</label>
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="px-4 py-2 border-3 border-neo-black bg-white font-bold"
            >
              <option value="all">All Cards</option>
              {cardArray.map(card => (
                <option key={card.id} value={card.id}>
                  {card.config.profile.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">TIME RANGE</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border-3 border-neo-black bg-white font-bold"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-neo-pink">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL VIEWS</p>
                <p className="text-3xl font-bold text-neo-black">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-neo-black/70 mt-1">Profile visits</p>
              </div>
              <Eye className="w-10 h-10 text-neo-black/50" />
            </div>
          </Card>

          <Card className="bg-neo-yellow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL CLICKS</p>
                <p className="text-3xl font-bold text-neo-black">{totalClicks.toLocaleString()}</p>
                <p className="text-sm text-neo-black/70 mt-1">Link interactions</p>
              </div>
              <ExternalLink className="w-10 h-10 text-neo-black/50" />
            </div>
          </Card>

          <Card className="bg-neo-green">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">CLICK RATE</p>
                <p className="text-3xl font-bold text-neo-black">{clickRate}%</p>
                <p className="text-sm text-neo-black/70 mt-1">Clicks per view</p>
              </div>
              <TrendingUp className="w-10 h-10 text-neo-black/50" />
            </div>
          </Card>

          <Card className="bg-neo-orange">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-neo-black/70">TOTAL LINKS</p>
                <p className="text-3xl font-bold text-neo-black">{totalLinks}</p>
                <p className="text-sm text-neo-black/70 mt-1">Active links</p>
              </div>
              <BarChart3 className="w-10 h-10 text-neo-black/50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Performance */}
          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              CARD PERFORMANCE
            </h3>
            
            {cardArray.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neo-gray">No cards to analyze yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cardArray
                  .sort((a, b) => (b.analytics.views || 0) - (a.analytics.views || 0))
                  .slice(0, 5)
                  .map((card, index) => {
                    const cardClickRate = card.analytics.views > 0 ? 
                      ((card.analytics.clicks / card.analytics.views) * 100).toFixed(1) : '0'
                    
                    return (
                      <div key={card.id} className="flex items-center justify-between p-3 bg-neo-white border-2 border-neo-black">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-neo-yellow border-2 border-neo-black rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{card.config.profile.title}</p>
                            <p className="text-xs text-neo-gray">{card.config.links.length} links</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{card.analytics.views || 0} views</p>
                          <p className="text-xs text-neo-gray">{cardClickRate}% click rate</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </Card>

          {/* Top Links */}
          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              TOP PERFORMING LINKS
            </h3>
            
            {topLinks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neo-gray">No link data available yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topLinks.map((link, index) => (
                  <div key={`${link.cardId}-${link.id}`} className="flex items-center justify-between p-3 bg-neo-white border-2 border-neo-black">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-neo-pink border-2 border-neo-black rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{link.text}</p>
                        <p className="text-xs text-neo-gray truncate">{link.cardName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{link.clickCount || 0}</p>
                      <p className="text-xs text-neo-gray">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Detailed Card List */}
        {cardArray.length > 0 && (
          <Card className="mt-8">
            <h3 className="text-xl font-bold mb-6">DETAILED BREAKDOWN</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-neo-black">
                    <th className="text-left font-bold py-3 px-2">CARD</th>
                    <th className="text-left font-bold py-3 px-2">VIEWS</th>
                    <th className="text-left font-bold py-3 px-2">CLICKS</th>
                    <th className="text-left font-bold py-3 px-2">CLICK RATE</th>
                    <th className="text-left font-bold py-3 px-2">LINKS</th>
                    <th className="text-left font-bold py-3 px-2">CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {cardArray.map((card) => {
                    const cardClickRate = card.analytics.views > 0 ? 
                      ((card.analytics.clicks / card.analytics.views) * 100).toFixed(1) : '0'
                    
                    return (
                      <tr key={card.id} className="border-b border-neo-gray/20">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-neo-yellow border border-neo-black rounded-full flex items-center justify-center text-xs">
                              {card.config.profile.avatar}
                            </div>
                            <span className="font-bold text-sm">{card.config.profile.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-bold">{card.analytics.views || 0}</td>
                        <td className="py-3 px-2 font-bold">{card.analytics.clicks || 0}</td>
                        <td className="py-3 px-2 font-bold">{cardClickRate}%</td>
                        <td className="py-3 px-2">{card.config.links.length}</td>
                        <td className="py-3 px-2 text-sm text-neo-gray">
                          {new Date(card.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {cardArray.length === 0 && (
          <Card className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-neo-gray" />
            <h3 className="text-xl font-bold mb-2">NO DATA TO ANALYZE</h3>
            <p className="text-neo-gray mb-6">Create your first bio link card to start tracking analytics</p>
            <Link href="/create">
              <Button>
                CREATE YOUR FIRST CARD
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}