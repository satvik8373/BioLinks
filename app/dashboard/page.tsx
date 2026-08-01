'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { 
  Plus, 
  Eye, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Copy, 
  BarChart3, 
  Settings,
  Palette,
  Link as LinkIcon,
  ShoppingBag,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Move,
  Archive,
  Globe,
  Download,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  CreditCard,
  Store,
  Shield,
  Share2,
  User,
  GripVertical,
  MoreHorizontal
} from 'lucide-react'

interface LinkData {
  id: string
  text: string
  url: string
  clickCount: number
  isActive: boolean
  isArchived: boolean
}

interface CardData {
  id: string
  config: {
    profile: {
      title: string
      bio: string
      avatar: string
    }
    links: LinkData[]
    theme: string
    colors: {
      background: string
      text: string
      accent: string
    }
  }
  analytics: {
    views: number
    clicks: number
  }
  createdAt: string
}

type DashboardSection = 'links' | 'appearance' | 'analytics' | 'integrations' | 'commerce' | 'settings'

export default function Dashboard() {
  const router = useRouter()
  const [cards, setCards] = useState<{ [key: string]: CardData }>({})
  const [userProfile, setUserProfile] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<DashboardSection>('links')
  const [loading, setLoading] = useState(true)
  const [newLinkText, setNewLinkText] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')

  const dashboardSections = [
    {
      id: 'links' as const,
      name: 'Links',
      icon: LinkIcon,
      description: 'Manage your links',
      subsections: ['Add New Link', 'Link List', 'Archived Links']
    },
    {
      id: 'appearance' as const,
      name: 'Appearance',
      icon: Palette,
      description: 'Customize design',
      subsections: ['Themes', 'Colors & Fonts', 'Backgrounds']
    },
    {
      id: 'analytics' as const,
      name: 'Analytics',
      icon: BarChart3,
      description: 'Track performance',
      subsections: ['Chart Views', 'Link Stats', 'Export Data']
    },
    {
      id: 'integrations' as const,
      name: 'Integrations',
      icon: Zap,
      description: 'Connect services',
      subsections: ['Social Feeds', 'Mailing Lists', 'Pixels & Tracking']
    },
    {
      id: 'commerce' as const,
      name: 'Commerce',
      icon: ShoppingBag,
      description: 'Sell products',
      subsections: ['Shop Links', 'Payment Setup', 'Store Previews']
    },
    {
      id: 'settings' as const,
      name: 'Settings',
      icon: Settings,
      description: 'Account & sharing',
      subsections: ['Account', 'Privacy', 'Sharing']
    }
  ]

  useEffect(() => {
    // Check if user has completed onboarding
    const profile = localStorage.getItem('userProfile')
    const onboardingCompleted = localStorage.getItem('onboardingCompleted')
    
    if (!profile || !onboardingCompleted) {
      router.push('/onboarding')
      return
    }

    setUserProfile(JSON.parse(profile))

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
  }, [router])

  const addNewLink = () => {
    if (!newLinkText.trim() || !newLinkUrl.trim()) return

    const cardId = Object.keys(cards)[0] // For demo, use first card
    if (!cardId) return

    const newLink: LinkData = {
      id: Math.random().toString(36).substring(2, 9),
      text: newLinkText,
      url: newLinkUrl,
      clickCount: 0,
      isActive: true,
      isArchived: false
    }

    const updatedCards = {
      ...cards,
      [cardId]: {
        ...cards[cardId],
        config: {
          ...cards[cardId].config,
          links: [...cards[cardId].config.links, newLink]
        }
      }
    }

    setCards(updatedCards)
    localStorage.setItem('bioCards', JSON.stringify(updatedCards))
    setNewLinkText('')
    setNewLinkUrl('')
  }

  const toggleLinkArchive = (cardId: string, linkId: string) => {
    const updatedCards = {
      ...cards,
      [cardId]: {
        ...cards[cardId],
        config: {
          ...cards[cardId].config,
          links: cards[cardId].config.links.map(link =>
            link.id === linkId ? { ...link, isArchived: !link.isArchived } : link
          )
        }
      }
    }

    setCards(updatedCards)
    localStorage.setItem('bioCards', JSON.stringify(updatedCards))
  }

  const deleteLink = (cardId: string, linkId: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    const updatedCards = {
      ...cards,
      [cardId]: {
        ...cards[cardId],
        config: {
          ...cards[cardId].config,
          links: cards[cardId].config.links.filter(link => link.id !== linkId)
        }
      }
    }

    setCards(updatedCards)
    localStorage.setItem('bioCards', JSON.stringify(updatedCards))
  }

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

  const cardArray = Object.values(cards)
  const totalViews = cardArray.reduce((sum, card) => sum + (card.analytics.views || 0), 0)
  const totalClicks = cardArray.reduce((sum, card) => sum + (card.analytics.clicks || 0), 0)
  const totalLinks = cardArray.reduce((sum, card) => sum + card.config.links.length, 0)

  const renderLinksSection = () => {
    const firstCard = cardArray[0]
    if (!firstCard) {
      return (
        <div className="text-center py-12">
          <LinkIcon className="w-12 h-12 mx-auto mb-4 text-neo-gray" />
          <h3 className="text-xl font-bold mb-2">No cards found</h3>
          <p className="text-neo-gray mb-4">Create your first card to start managing links</p>
          <Link href="/create">
            <Button>Create New Card</Button>
          </Link>
        </div>
      )
    }

    const activeLinks = firstCard.config.links.filter(link => !link.isArchived)
    const archivedLinks = firstCard.config.links.filter(link => link.isArchived)

    return (
      <div className="space-y-6">
        {/* Add New Link */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Add New Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Link Text</label>
              <Input
                type="text"
                value={newLinkText}
                onChange={(e) => setNewLinkText(e.target.value)}
                placeholder="Enter link text"
                
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Link URL</label>
              <Input
                type="url"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <Button onClick={addNewLink} disabled={!newLinkText.trim() || !newLinkUrl.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>
        </Card>

        {/* Active Links */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Active Links ({activeLinks.length})</h3>
            <Button variant="outline" size="sm">
              <Move className="w-4 h-4 mr-2" />
              Reorder
            </Button>
          </div>
          {activeLinks.length === 0 ? (
            <div className="text-center py-8 text-neo-gray">
              <LinkIcon className="w-8 h-8 mx-auto mb-2" />
              <p>No active links yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border-2 border-neo-black bg-neo-white">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-4 h-4 text-neo-gray cursor-move" />
                    <div>
                      <p className="font-bold">{link.text}</p>
                      <p className="text-sm text-neo-gray">{link.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neo-gray">{link.clickCount} clicks</span>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toggleLinkArchive(firstCard.id, link.id)}>
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteLink(firstCard.id, link.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Archived Links */}
        {archivedLinks.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Archived Links ({archivedLinks.length})</h3>
            <div className="space-y-3">
              {archivedLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-4 border-2 border-neo-gray bg-neo-gray/10 opacity-60">
                  <div>
                    <p className="font-bold">{link.text}</p>
                    <p className="text-sm text-neo-gray">{link.url}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neo-gray">{link.clickCount} clicks</span>
                    <Button variant="outline" size="sm" onClick={() => toggleLinkArchive(firstCard.id, link.id)}>
                      Restore
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteLink(firstCard.id, link.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )
  }

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      {/* Themes */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Classic', 'Modern', 'Minimal', 'Bold'].map((theme) => (
            <div key={theme} className="p-4 border-2 border-neo-black bg-neo-pink cursor-pointer hover:bg-neo-yellow transition-colors">
              <div className="w-full h-20 bg-neo-white border-2 border-neo-black mb-2"></div>
              <p className="font-bold text-sm text-center">{theme}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Colors & Fonts */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Colors & Fonts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold mb-2">Background Color</label>
            <div className="flex space-x-2">
              {['#FFFFFF', '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'].map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 border-2 border-neo-black cursor-pointer"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Font Family</label>
            <select className="w-full p-2 border-2 border-neo-black bg-neo-white font-bold">
              <option>Inter (Default)</option>
              <option>Roboto</option>
              <option>Open Sans</option>
              <option>Montserrat</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Backgrounds */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Backgrounds</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['Solid Color', 'Gradient', 'Pattern', 'Image Upload'].map((bg) => (
            <div key={bg} className="p-4 border-2 border-neo-black bg-neo-cyan cursor-pointer hover:bg-neo-green transition-colors text-center">
              <p className="font-bold">{bg}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      {/* Chart Views */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-neo-pink border-2 border-neo-black">
            <p className="text-2xl font-bold">{totalViews}</p>
            <p className="text-sm font-bold">Total Views</p>
          </div>
          <div className="text-center p-4 bg-neo-cyan border-2 border-neo-black">
            <p className="text-2xl font-bold">{totalClicks}</p>
            <p className="text-sm font-bold">Total Clicks</p>
          </div>
          <div className="text-center p-4 bg-neo-green border-2 border-neo-black">
            <p className="text-2xl font-bold">{totalLinks}</p>
            <p className="text-sm font-bold">Total Links</p>
          </div>
        </div>
        <div className="h-64 bg-neo-gray/20 border-2 border-neo-black flex items-center justify-center">
          <p className="text-neo-gray">Chart visualization would go here</p>
        </div>
      </Card>

      {/* Link Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Link Performance</h3>
        {cardArray.length > 0 && cardArray[0].config.links.length > 0 ? (
          <div className="space-y-3">
            {cardArray[0].config.links
              .sort((a, b) => b.clickCount - a.clickCount)
              .map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 border border-neo-gray">
                  <div>
                    <p className="font-bold">{link.text}</p>
                    <p className="text-sm text-neo-gray">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{link.clickCount} clicks</p>
                    <p className="text-sm text-neo-gray">
                      {totalClicks > 0 ? Math.round((link.clickCount / totalClicks) * 100) : 0}%
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neo-gray">
            <BarChart3 className="w-8 h-8 mx-auto mb-2" />
            <p>No link data available</p>
          </div>
        )}
      </Card>

      {/* Export Data */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Export Data</h3>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF Report
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      {/* Social Feeds */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Social Feeds</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Instagram', icon: Instagram, connected: false },
            { name: 'Twitter', icon: Twitter, connected: true },
            { name: 'Facebook', icon: Facebook, connected: false }
          ].map((social) => (
            <div key={social.name} className="p-4 border-2 border-neo-black bg-neo-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <social.icon className="w-5 h-5" />
                  <span className="font-bold">{social.name}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${social.connected ? 'bg-neo-green' : 'bg-neo-gray'}`}></div>
              </div>
              <Button variant={social.connected ? 'danger' : 'outline'} size="sm" className="w-full">
                {social.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Mailing Lists */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Mailing Lists</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border-2 border-neo-black bg-neo-pink">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5" />
              <div>
                <p className="font-bold">Mailchimp</p>
                <p className="text-sm text-neo-gray">Connect your mailing list</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Connect</Button>
          </div>
        </div>
      </Card>

      {/* Pixels & Tracking */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Pixels & Tracking</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Google Analytics ID</label>
            <Input placeholder="GA-XXXXXXXXX-X" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Facebook Pixel ID</label>
            <Input placeholder="Enter Facebook Pixel ID" />
          </div>
          <Button>Save Tracking Settings</Button>
        </div>
      </Card>
    </div>
  )

  const renderCommerceSection = () => (
    <div className="space-y-6">
      {/* Shop Links */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Shop Links</h3>
        <div className="text-center py-8">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-neo-gray" />
          <h4 className="text-lg font-bold mb-2">Start Selling</h4>
          <p className="text-neo-gray mb-4">Add product links and start earning</p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product Link
          </Button>
        </div>
      </Card>

      {/* Payment Setup */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Payment Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-neo-black bg-neo-cyan">
            <CreditCard className="w-8 h-8 mb-3" />
            <h4 className="font-bold mb-2">Stripe</h4>
            <p className="text-sm text-neo-gray mb-3">Accept credit card payments</p>
            <Button variant="outline" size="sm">Connect Stripe</Button>
          </div>
          <div className="p-4 border-2 border-neo-black bg-neo-green">
            <Store className="w-8 h-8 mb-3" />
            <h4 className="font-bold mb-2">PayPal</h4>
            <p className="text-sm text-neo-gray mb-3">Accept PayPal payments</p>
            <Button variant="outline" size="sm">Connect PayPal</Button>
          </div>
        </div>
      </Card>

      {/* Store Previews */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Store Previews</h3>
        <div className="text-center py-8 text-neo-gray">
          <Store className="w-8 h-8 mx-auto mb-2" />
          <p>No products added yet</p>
        </div>
      </Card>
    </div>
  )

  const renderSettingsSection = () => (
    <div className="space-y-6">
      {/* Account Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Display Name</label>
            <Input value={userProfile?.displayName || ''} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <Input value={userProfile?.email || ''} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Username</label>
            <Input value={userProfile?.username || ''} />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Profile Visibility</p>
              <p className="text-sm text-neo-gray">Make your profile public</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Analytics Tracking</p>
              <p className="text-sm text-neo-gray">Allow analytics collection</p>
            </div>
            <input type="checkbox" className="w-5 h-5" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Sharing Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Sharing Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Custom Domain</label>
            <Input placeholder="yourdomain.com" />
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Your link: {window.location.origin}/{userProfile?.username}</span>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button>Update Domain</Button>
        </div>
      </Card>
    </div>
  )

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'links':
        return renderLinksSection()
      case 'appearance':
        return renderAppearanceSection()
      case 'analytics':
        return renderAnalyticsSection()
      case 'integrations':
        return renderIntegrationsSection()
      case 'commerce':
        return renderCommerceSection()
      case 'settings':
        return renderSettingsSection()
      default:
        return renderLinksSection()
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-bold text-lg mb-4">Dashboard</h2>
              <nav className="space-y-2">
                {dashboardSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 text-left border-2 transition-colors ${
                        activeSection === section.id
                          ? 'border-neo-black bg-neo-pink'
                          : 'border-transparent hover:border-neo-gray hover:bg-neo-gray/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <p className="font-bold text-sm">{section.name}</p>
                        <p className="text-xs text-neo-gray">{section.description}</p>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {dashboardSections.find(s => s.id === activeSection)?.name}
              </h2>
              <div className="flex space-x-2 text-sm">
                {dashboardSections.find(s => s.id === activeSection)?.subsections.map((sub, index) => (
                  <span key={sub} className="text-neo-gray">
                    {sub}
                    {index < (dashboardSections.find(s => s.id === activeSection)?.subsections.length || 0) - 1 && ' • '}
                  </span>
                ))}
              </div>
            </div>

            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  )
}