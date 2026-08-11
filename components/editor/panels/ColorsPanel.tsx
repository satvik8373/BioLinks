'use client'

import React from 'react'
import { ArrowLeft, Sparkles, Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ColorsPanelProps {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

const PALETTES = [
  {
    name: 'Sleek Dark',
    bg: '#0F172A',
    text: '#F8FAFC',
    button: '#1E293B',
    buttonText: '#F8FAFC',
  },
  {
    name: 'Soft Lavender',
    bg: '#FAF5FF',
    text: '#3B0764',
    button: '#F3E8FF',
    buttonText: '#581C87',
  },
  {
    name: 'Fresh Mint',
    bg: '#F0FDF4',
    text: '#052E16',
    button: '#DCFCE7',
    buttonText: '#14532D',
  },
  {
    name: 'Warm Sunset',
    bg: '#FFF7ED',
    text: '#431407',
    button: '#FFEDD5',
    buttonText: '#7C2D12',
  },
  {
    name: 'Ocean breeze',
    bg: '#F0F9FF',
    text: '#0C4A6E',
    button: '#E0F2FE',
    buttonText: '#0369A1',
  },
  {
    name: 'Retro LCD GameBoy',
    bg: '#e2e8f0',
    text: '#1a2211',
    button: 'rgba(255, 255, 255, 0.05)',
    buttonText: '#1a2211',
  },
]

export default function ColorsPanel({ config, updateConfig, onBack }: ColorsPanelProps) {
  const c = config.theme?.colors || {}
  const bgColor = c.background || '#FFFFFF'
  const profileTextColor = c.profileText || '#0F172A'
  const buttonDefaultColor = c.buttonDefault || '#F1F5F9'
  const buttonTextColor = c.buttonText || '#0F172A'

  const applyPalette = (p: typeof PALETTES[0]) => {
    updateConfig([
      { path: 'theme.colors.background', value: p.bg },
      { path: 'theme.colors.profileText', value: p.text },
      { path: 'theme.colors.buttonDefault', value: p.button },
      { path: 'theme.colors.buttonText', value: p.buttonText },
    ])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onBack}
            title="Back to Appearance"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Colors</h2>
          <p className="text-xs text-slate-500 font-medium">Customize individual colors or apply curated color palettes.</p>
        </div>
      </div>

      {/* Preset Palettes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Curated Color Palettes</label>
          <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Apply
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PALETTES.map((p) => {
            const isMatch = bgColor === p.bg && buttonDefaultColor === p.button
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPalette(p)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-left relative ${
                  isMatch ? 'border-slate-900 bg-slate-50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isMatch && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: p.bg }} />
                  <div className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: p.button }} />
                  <div className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: p.text }} />
                </div>
                <span className="text-xs font-bold text-slate-800 block truncate">{p.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Individual Color Fields */}
      <div className="space-y-4 pt-3 border-t border-slate-200/80">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Color Settings</label>
        
        {/* Background Color */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Page Background</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs cursor-pointer"
                style={{ backgroundColor: bgColor }}
              />
            </div>
            <Input
              type="text"
              value={bgColor.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  updateConfig('theme.colors.background', val)
                }
              }}
              placeholder="#FFFFFF"
            />
          </div>
        </div>

        {/* Profile Text Color */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Profile Text</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <input
                type="color"
                value={profileTextColor}
                onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs cursor-pointer"
                style={{ backgroundColor: profileTextColor }}
              />
            </div>
            <Input
              type="text"
              value={profileTextColor.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  updateConfig('theme.colors.profileText', val)
                }
              }}
              placeholder="#0F172A"
            />
          </div>
        </div>

        {/* Button Background Color */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Button Background</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <input
                type="color"
                value={buttonDefaultColor}
                onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs cursor-pointer"
                style={{ backgroundColor: buttonDefaultColor }}
              />
            </div>
            <Input
              type="text"
              value={buttonDefaultColor.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  updateConfig('theme.colors.buttonDefault', val)
                }
              }}
              placeholder="#F1F5F9"
            />
          </div>
        </div>

        {/* Button Text Color */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Button Text</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <input
                type="color"
                value={buttonTextColor}
                onChange={(e) => updateConfig('theme.colors.buttonText', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs cursor-pointer"
                style={{ backgroundColor: buttonTextColor }}
              />
            </div>
            <Input
              type="text"
              value={buttonTextColor.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  updateConfig('theme.colors.buttonText', val)
                }
              }}
              placeholder="#0F172A"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
