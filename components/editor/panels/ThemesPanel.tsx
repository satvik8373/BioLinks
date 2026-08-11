'use client'

import React, { useState } from 'react'
import { Theme, THEMES } from '@/lib/themes'
import { ArrowLeft, Shuffle, Zap, Paintbrush } from 'lucide-react'
import Button from '@/components/ui/Button'

function themeBackground(theme: Theme): React.CSSProperties {
  const c = theme.colors
  if (c.backgroundVideo || c.backgroundIframe) return { backgroundColor: 'transparent' }
  if (c.backgroundImage) {
    return {
      backgroundImage: `${c.backgroundOverlay ? `linear-gradient(${c.backgroundOverlay},${c.backgroundOverlay}),` : ''}url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  if (c.backgroundMesh) return { background: c.backgroundMesh, backgroundSize: 'cover', backgroundPosition: 'center' }
  if (c.backgroundGradient) {
    const g = c.backgroundGradient
    return { background: `linear-gradient(${g.direction || '135deg'}, ${g.from}, ${g.to})` }
  }
  return { background: c.background || '#111827' }
}

interface Props {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

export default function ThemesPanel({ config, updateConfig, onBack }: Props) {
  const [subTab, setSubTab] = useState<'customizable' | 'curated'>('customizable')

  const applyTheme = (targetTheme: Theme) => {
    const cleanTheme: Theme = structuredClone(targetTheme)
    cleanTheme.colors.backgroundVideo  = ''
    cleanTheme.colors.backgroundIframe = ''
    cleanTheme.colors.backgroundImage  = targetTheme.colors.backgroundImage || ''
    cleanTheme.colors.backgroundType   = targetTheme.colors.backgroundType || (targetTheme.colors.backgroundImage ? 'image' : 'fill')
    updateConfig('theme', cleanTheme)
  }

  const handleShuffle = () => {
    const selectable = THEMES.filter(t => t.id !== 'custom')
    if (selectable.length > 0) applyTheme(selectable[Math.floor(Math.random() * selectable.length)])
  }

  const displayThemes = THEMES.filter(t => t.id !== 'custom')

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} title="Back to Design">
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </Button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Theme</h1>
        </div>
        <Button variant="secondary" size="sm" shape="pill" onClick={handleShuffle}>
          <Shuffle className="w-4 h-4 text-slate-700" />
          Shuffle
        </Button>
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200/80">
        {(['customizable', 'curated'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer capitalize ${
              subTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
            {subTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Themes grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5 pt-1">
        {/* Custom card */}
        <div className="flex flex-col items-center group">
          <button
            onClick={() => applyTheme(THEMES.find(t => t.id === 'custom') || THEMES[0])}
            className={`w-full aspect-[3/4] rounded-[22px] border-2 bg-slate-100/90 flex flex-col items-center justify-center transition-all cursor-pointer ${
              config.theme.id === 'custom'
                ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                : 'border-slate-900 hover:bg-slate-200/80'
            }`}
          >
            <Paintbrush className="w-6 h-6 text-slate-700 stroke-[1.5]" />
          </button>
          <span className="text-xs font-semibold text-slate-700 mt-2 text-center truncate max-w-full">Custom</span>
        </div>

        {/* Theme cards */}
        {displayThemes.map((theme) => {
          const isSelected = config.theme.id === theme.id
          const isProTheme = Boolean(theme.isPremium)
          return (
            <div key={theme.id} className="flex flex-col items-center group">
              <button
                onClick={() => applyTheme(theme)}
                className={`w-full aspect-[3/4] rounded-[22px] relative overflow-hidden border-2 transition-all cursor-pointer shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md scale-[1.02]'
                    : 'border-slate-200/80 hover:border-slate-400'
                }`}
                style={themeBackground(theme)}
              >
                <span
                  className="absolute top-2.5 left-3 text-lg md:text-xl font-bold tracking-tight"
                  style={{ color: theme.colors.profileText || '#FFFFFF', fontFamily: theme.fonts?.heading || 'sans-serif' }}
                >
                  Aa
                </span>
                <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-0.5 ${
                  isProTheme
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                    : 'bg-slate-900/60 backdrop-blur-xs text-white'
                }`}>
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  {isProTheme ? 'PRO' : ''}
                </div>
                <div
                  className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[82%] h-6 rounded-full backdrop-blur-xs border border-white/20 shadow-2xs flex items-center justify-center"
                  style={{ background: theme.colors.buttonDefault || 'rgba(255,255,255,0.35)' }}
                >
                  <div className="w-[50%] h-1 rounded-full bg-white/70" />
                </div>
              </button>
              <span className="text-xs font-semibold text-slate-700 mt-2 text-center truncate max-w-full">{theme.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
