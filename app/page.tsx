'use client'

import { useEffect, useState } from 'react'
import Hero from '@/components/landing/Hero'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { 
  BarChart3, 
  Plus, 
  Eye, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Hand,
  Rocket
} from 'lucide-react'

export default function Home() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [recentCards, setRecentCards] = useState<any[]>([])

  useEffect(() => {
    const profile = localStorage.getItem('userProfile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
      
      // Load recent cards
      const savedCards = JSON.parse(localStorage.getItem('bioCards') || '{}')
      const cardArray = Object.values(savedCards)
      const recent = cardArray
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
      setRecentCards(recent)
    }
  }, [])

  // If user is authenticated, show dashboard-style home
  if (userProfile) {
    const totalCards = recentCards.length
    const totalViews = recentCards.reduce((sum: number, card: any) => sum + (card.analytics?.views || 0), 0)
    const totalClicks = recentCards.reduce((sum: number, card: any) => sum + (card.analytics?.clicks || 0), 0)

    return (
      <main className="min-h-screen bg-neo-white">
        {/* Welcome Header */}
        <div className="bg-neo-yellow border-b-4 border-neo-black px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center">
                  Welcome back, {userProfile.displayName}! <Hand className="w-10 h-10 ml-3" />
                </h1>
                <p className="text-xl text-neo-gray">
                  Ready to create something amazing today?
                </p>
              </div>
              
              <Link href="/create">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  CREATE NEW CARD
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-neo-pink">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-neo-black/70">YOUR CARDS</p>
                  <p className="text-2xl font-bold text-neo-black">{totalCards}</p>
                </div>
                <Users className="w-8 h-8 text-neo-black/50" />
              </div>
            </Card>

            <Card className="bg-neo-cyan">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-neo-black/70">TOTAL VIEWS</p>
                  <p className="text-2xl font-bold text-neo-black">{totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-neo-black/50" />
              </div>
            </Card>

            <Card className="bg-neo-green">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-neo-black/70">TOTAL CLICKS</p>
                  <p className="text-2xl font-bold text-neo-black">{totalClicks}</p>
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

            <Link href="/dashboard">
              <Card hover className="text-center cursor-pointer">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-neo-cyan" />
                <h3 className="font-bold text-lg mb-2">VIEW DASHBOARD</h3>
                <p className="text-sm text-neo-gray">Manage all your cards and analytics</p>
              </Card>
            </Link>

            <Link href="/dashboard/analytics">
              <Card hover className="text-center cursor-pointer">
                <Eye className="w-12 h-12 mx-auto mb-4 text-neo-green" />
                <h3 className="font-bold text-lg mb-2">VIEW ANALYTICS</h3>
                <p className="text-sm text-neo-gray">Detailed insights and performance</p>
              </Card>
            </Link>
          </div>

          {/* Recent Cards */}
          {recentCards.length > 0 && (
            <Card className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">RECENT CARDS</h2>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentCards.map((card: any) => (
                  <div key={card.id} className="p-4 border-2 border-neo-black bg-neo-white hover:bg-neo-yellow transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-neo-pink border-2 border-neo-black rounded-full flex items-center justify-center text-sm">
                        {card.config.profile.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{card.config.profile.title}</h3>
                        <p className="text-xs text-neo-gray">{card.config.links.length} links</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center text-neo-gray">
                        <Eye className="w-3 h-3 mr-1" />
                        {card.analytics?.views || 0}
                      </span>
                      <Link href={`/editor/${card.id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Get Started Section for New Users */}
          {recentCards.length === 0 && (
            <Card className="text-center py-12 mb-8">
              <Rocket className="w-24 h-24 mx-auto mb-4 text-neo-pink" />
              <h2 className="text-2xl font-bold mb-4">Ready to create your first bio link?</h2>
              <p className="text-neo-gray mb-6 max-w-md mx-auto">
                Choose from our collection of professionally designed themes and customize it to match your style.
              </p>
              <Link href="/create">
                <Button size="lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  BROWSE THEMES
                </Button>
              </Link>
            </Card>
          )}
        </div>

        <Footer />
      </main>
    )
  }

  // Default home page for non-authenticated users
  return (
    <main className="min-h-screen">
      <Hero />
      <Footer />
    </main>
  )
}