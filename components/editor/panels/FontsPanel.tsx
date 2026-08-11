'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ChevronDown, X, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'

export interface FontSpec {
  id: string
  name: string
  family: string
  isPro?: boolean
  googleFont?: string
}

export const AVAILABLE_FONTS: FontSpec[] = [
  { id: 'albert-sans', name: 'Albert Sans', family: "'Albert Sans', sans-serif", googleFont: 'Albert+Sans:wght@400;700' },
  { id: 'belanosima', name: 'Belanosima', family: "'Belanosima', sans-serif", isPro: true, googleFont: 'Belanosima:wght@400;700' },
  { id: 'bricolage', name: 'Bricolage Grotesque', family: "'Bricolage Grotesque', sans-serif", isPro: true, googleFont: 'Bricolage+Grotesque:wght@400;700' },
  { id: 'dm-sans', name: 'DM Sans', family: "'DM Sans', sans-serif", googleFont: 'DM+Sans:wght@400;700' },
  { id: 'epilogue', name: 'Epilogue', family: "'Epilogue', sans-serif", googleFont: 'Epilogue:wght@400;700' },
  { id: 'ibm-plex', name: 'IBM Plex Sans', family: "'IBM Plex Sans', sans-serif", googleFont: 'IBM+Plex+Sans:wght@400;700' },
  { id: 'inter', name: 'Inter', family: "'Inter', sans-serif", googleFont: 'Inter:wght@400;700' },
  { id: 'lato', name: 'Lato', family: "'Lato', sans-serif", isPro: true, googleFont: 'Lato:wght@400;700' },
  { id: 'link-sans', name: 'Link Sans', family: "'Plus Jakarta Sans', sans-serif", googleFont: 'Plus+Jakarta+Sans:wght@400;700' },
  { id: 'm-plus', name: 'M Plus Rounded', family: "'M PLUS Rounded 1c', sans-serif", isPro: true, googleFont: 'M+PLUS+Rounded+1c:wght@400;700' },
  { id: 'manrope', name: 'Manrope', family: "'Manrope', sans-serif", googleFont: 'Manrope:wght@400;700' },
  { id: 'oxanium', name: 'Oxanium', family: "'Oxanium', cursive", googleFont: 'Oxanium:wght@400;700' },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif", isPro: true, googleFont: 'Poppins:wght@400;700' },
  { id: 'red-hat', name: 'Red Hat Display', family: "'Red Hat Display', sans-serif", googleFont: 'Red+Hat+Display:wght@400;700' },
  { id: 'roboto', name: 'Roboto', family: "'Roboto', sans-serif", isPro: true, googleFont: 'Roboto:wght@400;700' },
  { id: 'rubik', name: 'Rubik', family: "'Rubik', sans-serif", isPro: true, googleFont: 'Rubik:wght@400;700' },
  { id: 'silkscreen', name: 'Silkscreen', family: "'Silkscreen', monospace", googleFont: 'Silkscreen:wght@400;700' },
  { id: 'space-grotesk', name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", isPro: true, googleFont: 'Space+Grotesk:wght@400;700' },
  { id: 'syne', name: 'Syne', family: "'Syne', sans-serif", isPro: true, googleFont: 'Syne:wght@400;700' },
]

interface FontsPanelProps {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

export default function FontsPanel({ config, updateConfig, onBack }: FontsPanelProps) {
  const [showFontModal, setShowFontModal] = useState(false)
  const [altTitleFont, setAltTitleFont] = useState(false)

  const currentFontName = config?.theme?.fonts?.body || 'Inter'
  const currentFontSpec = AVAILABLE_FONTS.find(
    f => f.name.toLowerCase() === currentFontName.toLowerCase() || f.family.includes(currentFontName)
  ) || AVAILABLE_FONTS[0]

  const textColor  = config?.theme?.colors?.profileBio  || config?.theme?.colors?.profileText || '#FFFFFF'
  const titleColor = config?.theme?.colors?.profileText || '#FFFFFF'

  useEffect(() => {
    const linkId = 'linktree-font-picker-stylesheet'
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;700&family=Belanosima:wght@400;700&family=Bricolage+Grotesque:wght@400;700&family=DM+Sans:wght@400;700&family=Epilogue:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=Inter:wght@400;700&family=Lato:wght@400;700&family=M+PLUS+Rounded+1c:wght@400;700&family=Manrope:wght@400;700&family=Oxanium:wght@400;700&family=Plus+Jakarta+Sans:wght@400;700&family=Poppins:wght@400;700&family=Red+Hat+Display:wght@400;700&family=Roboto:wght@400;700&family=Rubik:wght@400;700&family=Silkscreen:wght@400;700&family=Space+Grotesk:wght@400;700&family=Syne:wght@400;700&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const handleSelectFont = (font: FontSpec) => {
    updateConfig([
      { path: 'theme.fonts.body',    value: font.name },
      { path: 'theme.fonts.heading', value: font.name },
    ])
    setShowFontModal(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button type="button" variant="ghost" size="icon" onClick={onBack} title="Back to Design">
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </Button>
        )}
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Text</h1>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">

        {/* Page Font Dropdown */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-extrabold text-slate-900">Page font</label>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() => setShowFontModal(true)}
            className="w-64 justify-between"
          >
            <span style={{ fontFamily: currentFontSpec.family, fontSize: '15px' }}>
              {currentFontSpec.name}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500 stroke-[2.5]" />
          </Button>
        </div>

        {/* Page Text Color */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-extrabold text-slate-900">Page text color</label>
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 pr-4 shadow-2xs">
            <input
              type="color"
              value={textColor}
              onChange={(e) => updateConfig([
                { path: 'theme.colors.profileBio',  value: e.target.value },
                { path: 'theme.colors.profileText', value: e.target.value },
              ])}
              className="w-8 h-8 rounded-xl border border-slate-300 cursor-pointer overflow-hidden bg-transparent"
            />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide font-mono">
              {textColor}
            </span>
          </div>
        </div>

        {/* Alternative Title Font toggle */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div>
            <label className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              Alternative title font
            </label>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Matches page font by default</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <Zap className="w-3.5 h-3.5 fill-slate-500 text-slate-500" />
            </div>
            <Toggle
              checked={altTitleFont}
              onChange={setAltTitleFont}
              variant="dark"
              size="md"
            />
          </div>
        </div>

        {/* Title Color */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-extrabold text-slate-900">Title color</label>
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 pr-4 shadow-2xs">
            <input
              type="color"
              value={titleColor}
              onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
              className="w-8 h-8 rounded-xl border border-slate-300 cursor-pointer overflow-hidden bg-transparent"
            />
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide font-mono">
              {titleColor}
            </span>
          </div>
        </div>
      </div>

      {/* Font Modal */}
      {showFontModal && (
        <FontSelectionModal
          selectedFontName={currentFontSpec.name}
          onClose={() => setShowFontModal(false)}
          onSelectFont={handleSelectFont}
        />
      )}
    </div>
  )
}

function FontSelectionModal({
  selectedFontName,
  onClose,
  onSelectFont,
}: {
  selectedFontName: string
  onClose: () => void
  onSelectFont: (font: FontSpec) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 relative">
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight mx-auto">Page font</h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Font Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3.5">
            {AVAILABLE_FONTS.map((font) => {
              const isSelected = font.name.toLowerCase() === selectedFontName.toLowerCase()
              return (
                <Button
                  key={font.id}
                  type="button"
                  variant={isSelected ? 'secondary' : 'ghost'}
                  size="md"
                  onClick={() => onSelectFont(font)}
                  className={`relative justify-center ${isSelected ? 'ring-2 ring-slate-900' : ''}`}
                >
                  <span style={{ fontFamily: font.family, fontSize: '15px' }} className="truncate">
                    {font.name}
                  </span>
                  {font.isPro && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-400/30 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-slate-700 fill-slate-700" />
                    </div>
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
