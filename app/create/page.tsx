'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { THEMES, getThemesByCategory, Theme } from '@/lib/themes'
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Palette,
  User,
  Check,
  Circle,
  Rainbow,
  Briefcase,
  Palette as PaletteIcon,
  Moon
} from 'lucide-react'

export default function CreatePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [activeCategory, setActiveCategory] = useState<Theme['category']>('minimal')
  const [loading, setLoading] = useState(true)

  const categories = [
    { id: 'minimal',  name: 'Minimal',  icon: Circle,      description: 'Clean and simple'       },
    { id: 'dark',     name: 'Dark',     icon: Moon,        description: 'Dark mode themes'        },
    { id: 'gradient', name: 'Gradient', icon: Rainbow,     description: 'Colorful gradients'      },
    { id: 'mesh',     name: 'Mesh',     icon: PaletteIcon, description: 'Multi-color mesh'        },
    { id: 'image',    name: 'Image',    icon: Briefcase,   description: 'Photo backgrounds'       },
    { id: 'vibrant',  name: 'Vibrant',  icon: Rainbow,     description: 'Bold and colorful'       },
  ] as const

  useEffect(() => {
    // Check if user has completed onboarding
    const profile = localStorage.getItem('userProfile')
    const onboardingCompleted = localStorage.getItem('onboardingCompleted')
    
    if (!profile || !onboardingCompleted) {
      router.push('/onboarding')
      return
    }

    setUserProfile(JSON.parse(profile))
    setSelectedTheme(THEMES[0]) // Default to first theme
    setLoading(false)
  }, [router])

  const handleCreateBioLink = () => {
    if (!selectedTheme || !userProfile) return

    // Create the bio link configuration
    const bioLinkConfig = {
      theme: selectedTheme,
      profile: {
        avatar: userProfile.avatar,
        title: userProfile.displayName || userProfile.username,
        bio: userProfile.bio,
        location: userProfile.location,
        website: userProfile.website,
        profession: userProfile.profession
      },
      links: [
        {
          id: '1',
          type: 'link' as const,
          text: 'My Website',
          url: userProfile.website || '',
          icon: 'link',
          isVisible: true
        }
      ],
      socialLinks: {
        instagram: '',
        twitter: '',
        youtube: '',
        tiktok: '',
        linkedin: '',
        website: userProfile.website || ''
      }
    }

    // Store the configuration
    localStorage.setItem('currentBioLinkConfig', JSON.stringify(bioLinkConfig))
    
    // Navigate to editor
    router.push('/editor')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-neo-black border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-bold">Loading themes...</p>
        </div>
      </div>
    )
  }

  const themesInCategory = getThemesByCategory(activeCategory)

  return (
    <div className="min-h-screen bg-neo-white">
      {/* Header */}
      <div className="bg-neo-yellow border-b-4 border-neo-black px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="outline" 
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-3xl font-bold">Choose Your Theme</h1>
              </div>
              <p className="font-medium text-neo-gray">Pick a theme that matches your style - you can customize it further in the editor</p>
            </div>
            
            {userProfile && (
              <div className="flex items-center space-x-3 px-4 py-2 bg-neo-white border-2 border-neo-black">
                <Avatar src={userProfile.avatar} size="sm" />
                <div>
                  <div className="font-bold text-sm">{userProfile.displayName}</div>
                  <div className="text-xs text-neo-gray">@{userProfile.username}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Theme Categories - Left Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-3 border-2 border-neo-black font-bold text-sm transition-all ${
                      activeCategory === category.id
                        ? 'bg-neo-pink text-neo-black shadow-neo'
                        : 'bg-white text-neo-black hover:bg-neo-yellow'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {React.createElement(category.icon, { className: "w-5 h-5" })}
                      <div>
                        <div>{category.name}</div>
                        <div className="text-xs text-neo-gray font-normal">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Theme Info */}
              {selectedTheme && (
                <div className="mt-6 pt-6 border-t-2 border-neo-gray">
                  <h4 className="font-bold text-sm mb-3">Selected Theme</h4>
                  <div className="p-3 bg-neo-gray/10 border-2 border-neo-gray">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-6 h-6 border border-neo-black rounded" 
                        style={{ backgroundColor: selectedTheme.preview }}
                      />
                      <span className="font-bold text-sm">{selectedTheme.name}</span>
                    </div>
                    <div className="flex space-x-1 mb-2">
                      <div 
                        className="w-4 h-4 border border-neo-black" 
                        style={{ backgroundColor: selectedTheme.colors.background }}
                      />
                      <div 
                        className="w-4 h-4 border border-neo-black" 
                        style={{ backgroundColor: selectedTheme.colors.buttonDefault }}
                      />
                      <div 
                        className="w-4 h-4 border border-neo-black" 
                        style={{ backgroundColor: selectedTheme.colors.accent }}
                      />
                    </div>
                    <div className="text-xs text-neo-gray">
                      {selectedTheme.fonts.heading} font • {selectedTheme.buttonStyle.borderRadius}px radius
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Theme Grid - Center */}
          <div className="lg:col-span-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 capitalize">{activeCategory} Themes</h2>
              <p className="text-neo-gray">
                {categories.find(c => c.id === activeCategory)?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themesInCategory.map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`cursor-pointer transition-all ${
                    selectedTheme?.id === theme.id
                      ? 'ring-4 ring-neo-pink'
                      : 'hover:ring-2 hover:ring-neo-yellow'
                  }`}
                >
                  <Card className="relative overflow-hidden">
                    {selectedTheme?.id === theme.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-neo-pink border-2 border-neo-black rounded-full flex items-center justify-center z-10">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    
                    {/* Theme Preview */}
                    <div 
                      className="h-48 p-4 flex flex-col items-center justify-center text-center relative"
                      style={{
                        background: theme.colors.backgroundGradient 
                          ? `linear-gradient(135deg, ${theme.colors.backgroundGradient.from}, ${theme.colors.backgroundGradient.to})`
                          : theme.colors.background
                      }}
                    >
                      {/* Mini Profile Preview */}
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-lg mb-2 mx-auto overflow-hidden">
                          {userProfile?.avatar === 'user' || !userProfile?.avatar ? (
                            <User className="w-6 h-6" />
                          ) : userProfile.avatar.startsWith('http') ? (
                            <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{userProfile.avatar.slice(0, 2)}</span>
                          )}
                        </div>
                        <h3 
                          className="font-bold text-sm mb-1"
                          style={{ 
                            color: theme.colors.profileText,
                            fontFamily: theme.fonts.heading
                          }}
                        >
                          {userProfile?.displayName || 'Your Name'}
                        </h3>
                        <p 
                          className="text-xs"
                          style={{ 
                            color: theme.colors.profileBio,
                            fontFamily: theme.fonts.body
                          }}
                        >
                          {userProfile?.bio?.slice(0, 30) || 'Your bio here...'}
                        </p>
                      </div>

                      {/* Mini Button Previews */}
                      <div className="space-y-2 w-full max-w-32">
                        <div
                          className="w-full py-2 px-3 text-xs font-bold text-center transition-colors"
                          style={{
                            backgroundColor: theme.colors.buttonDefault,
                            color: theme.colors.buttonText,
                            borderRadius: `${theme.buttonStyle.borderRadius}px`,
                            border: theme.buttonStyle.borderWidth > 0 ? `${theme.buttonStyle.borderWidth}px solid ${theme.colors.accent}` : 'none',
                            boxShadow: theme.buttonStyle.shadow ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          Link 1
                        </div>
                        <div
                          className="w-full py-2 px-3 text-xs font-bold text-center transition-colors"
                          style={{
                            backgroundColor: theme.colors.buttonDefault,
                            color: theme.colors.buttonText,
                            borderRadius: `${theme.buttonStyle.borderRadius}px`,
                            border: theme.buttonStyle.borderWidth > 0 ? `${theme.buttonStyle.borderWidth}px solid ${theme.colors.accent}` : 'none',
                            boxShadow: theme.buttonStyle.shadow ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          Link 2
                        </div>
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div className="p-4 bg-white border-t-2 border-neo-black">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{theme.name}</h3>
                        <div 
                          className="w-6 h-6 border border-neo-black rounded" 
                          style={{ backgroundColor: theme.preview }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <div 
                          className="w-4 h-4 border border-neo-black rounded" 
                          style={{ backgroundColor: theme.colors.background }}
                        />
                        <div 
                          className="w-4 h-4 border border-neo-black rounded" 
                          style={{ backgroundColor: theme.colors.buttonDefault }}
                        />
                        <div 
                          className="w-4 h-4 border border-neo-black rounded" 
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                        <span className="text-xs text-neo-gray ml-2">{theme.fonts.heading}</span>
                      </div>
                      
                      <div className="text-xs text-neo-gray">
                        {theme.buttonStyle.borderRadius}px radius • {theme.buttonStyle.shadow ? 'Shadow' : 'No shadow'}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Preview & Action - Right Sidebar */}
          <div className="lg:col-span-3">
            <Card className="sticky top-6">
              <h3 className="font-bold text-lg mb-4">Ready to Create?</h3>
              
              {selectedTheme && (
                <div className="mb-6">
                  <div className="text-center p-6 border-2 border-neo-gray bg-neo-gray/5">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 text-neo-pink" />
                    <h4 className="font-bold mb-2">You've selected:</h4>
                    <p className="text-lg font-bold">{selectedTheme.name}</p>
                    <p className="text-sm text-neo-gray capitalize">{selectedTheme.category} theme</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Button 
                  onClick={handleCreateBioLink}
                  disabled={!selectedTheme}
                  className="w-full"
                  size="lg"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  CREATE & CUSTOMIZE
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="text-xs text-neo-gray text-center">
                  You can change themes and customize everything in the editor
                </div>
              </div>

              {/* What's Next */}
              <div className="mt-6 pt-6 border-t-2 border-neo-gray">
                <h4 className="font-bold text-sm mb-3">What's Next?</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neo-green border border-neo-black rounded-full flex items-center justify-center text-xs">1</div>
                    <span>Customize your theme</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neo-cyan border border-neo-black rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Add your links</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-neo-pink border border-neo-black rounded-full flex items-center justify-center text-xs">3</div>
                    <span>Share your bio link</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}