'use client'

import { useState, useEffect } from 'react'
import { getAvailableThemes, activateTheme, type ThemeMetadata } from '@/lib/themeEngine'
import { Check, Sparkles, Lock } from 'lucide-react'

interface ThemeSelectorProps {
  currentThemeId?: string
  onThemeChange?: (themeId: string) => void
  showProBadge?: boolean
}

export default function ThemeSelector({ 
  currentThemeId, 
  onThemeChange,
  showProBadge = true 
}: ThemeSelectorProps) {
  const [themes, setThemes] = useState<ThemeMetadata[]>([])
  const [selectedTheme, setSelectedTheme] = useState(currentThemeId || 'minimal-light')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const allThemes = getAvailableThemes()
    setThemes(allThemes)
  }, [])

  useEffect(() => {
    if (currentThemeId) {
      setSelectedTheme(currentThemeId)
    }
  }, [currentThemeId])

  const categories = [
    { id: 'all', label: 'All Themes', icon: '🎨' },
    { id: 'minimal', label: 'Minimal', icon: '✨' },
    { id: 'glass', label: 'Glass', icon: '💎' },
    { id: 'gradient', label: 'Gradient', icon: '🌈' },
    { id: 'clay', label: 'Clay', icon: '🎭' },
    { id: 'luxury', label: 'Luxury', icon: '👑' },
  ]

  const filteredThemes = activeCategory === 'all' 
    ? themes 
    : themes.filter(t => t.category === activeCategory)

  const handleThemeSelect = async (themeId: string) => {
    setIsLoading(true)
    setSelectedTheme(themeId)
    
    try {
      const success = await activateTheme(themeId)
      if (success && onThemeChange) {
        onThemeChange(themeId)
      }
    } catch (error) {
      console.error('Failed to activate theme:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const freeThemes = filteredThemes.filter(t => !t.isPro)
  const proThemes = filteredThemes.filter(t => t.isPro)

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all
              ${activeCategory === cat.id 
                ? 'bg-brand-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Free Themes */}
      {freeThemes.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            Free Themes ({freeThemes.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {freeThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                isLoading={isLoading && selectedTheme === theme.id}
                onSelect={handleThemeSelect}
                showProBadge={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pro Themes */}
      {proThemes.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Pro Themes ({proThemes.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {proThemes.map(theme => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                isLoading={isLoading && selectedTheme === theme.id}
                onSelect={handleThemeSelect}
                showProBadge={showProBadge}
              />
            ))}
          </div>
        </div>
      )}

      {filteredThemes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No themes found in this category</p>
          <p className="text-sm mt-2">Try selecting a different category</p>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface ThemeCardProps {
  theme: ThemeMetadata
  isSelected: boolean
  isLoading: boolean
  onSelect: (themeId: string) => void
  showProBadge: boolean
}

function ThemeCard({ theme, isSelected, isLoading, onSelect, showProBadge }: ThemeCardProps) {
  const [previewColor, setPreviewColor] = useState('#FFFFFF')

  useEffect(() => {
    // Load theme config to get preview color
    fetch(`/themes/${theme.id}/config.json`)
      .then(res => res.json())
      .then(config => {
        setPreviewColor(config.colors.background)
      })
      .catch(() => {
        // Fallback colors by category
        const fallbacks: Record<string, string> = {
          minimal: '#F8FAFC',
          glass: '#667eea',
          gradient: '#FF6B6B',
          clay: '#F0F0F3',
          luxury: '#0F0F0F',
        }
        setPreviewColor(fallbacks[theme.category] || '#FFFFFF')
      })
  }, [theme.id, theme.category])

  return (
    <button
      onClick={() => onSelect(theme.id)}
      disabled={isLoading}
      className={`
        relative group rounded-xl overflow-hidden transition-all duration-200
        ${isSelected 
          ? 'ring-4 ring-brand-600 shadow-xl scale-105' 
          : 'ring-2 ring-gray-200 hover:ring-gray-300 hover:shadow-lg hover:scale-102'
        }
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
    >
      {/* Preview */}
      <div 
        className="w-full aspect-square relative"
        style={{ 
          background: previewColor.includes('gradient') || previewColor.includes('radial')
            ? previewColor
            : previewColor
        }}
      >
        {/* Pro Badge */}
        {theme.isPro && showProBadge && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Lock className="w-3 h-3" />
            PRO
          </div>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center">
              <Check className="w-8 h-8 text-brand-600" strokeWidth={3} />
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
      </div>

      {/* Name */}
      <div className="bg-white px-3 py-2 border-t-2 border-gray-100">
        <p className={`text-sm font-bold truncate ${isSelected ? 'text-brand-600' : 'text-gray-900'}`}>
          {theme.name}
        </p>
        <p className="text-xs text-gray-500 capitalize">{theme.category}</p>
      </div>
    </button>
  )
}
