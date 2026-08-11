'use client'

import React from 'react'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'

interface ButtonsPanelProps {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack: () => void
}

export default function ButtonsPanel({ config, updateConfig, onBack }: ButtonsPanelProps) {
  const currentStyle = config.theme?.buttonStyle?.style ?? 'solid'
  const currentRadius = config.theme?.buttonStyle?.borderRadius ?? 20
  const currentShadow = config.theme?.buttonStyle?.shadowStyle ?? 'none'
  const enableAnim = config.theme?.buttonStyle?.enableAnimations ?? true
  const currentAnim = config.theme?.buttonStyle?.animation ?? 'bounce'
  const buttonColor = config.theme?.colors?.buttonDefault || '#D3D1C7'
  const buttonTextColor = config.theme?.colors?.buttonText || '#39342C'

  const buttonStyles = [
    { id: 'solid', label: 'Solid' },
    { id: 'glass', label: 'Glass' },
    { id: 'outline', label: 'Outline' },
    { id: 'retro-lcd', label: 'Retro LCD' },
  ]

  const cornerOptions = [
    { radius: 0, label: 'Square', visual: 0 },
    { radius: 8, label: 'Soft', visual: 6 },
    { radius: 16, label: 'Rounded', visual: 12 },
    { radius: 50, label: 'Pill', visual: 9999 },
  ]

  const shadowOptions = [
    { style: 'none', label: 'None' },
    { style: 'soft', label: 'Soft' },
    { style: 'strong', label: 'Strong' },
    { style: 'hard', label: 'Hard' },
  ]

  const animationOptions = [
    { id: 'bounce', label: 'Bounce', icon: '↗' },
    { id: 'pulse', label: 'Pulse', icon: '○' },
    { id: 'wobble', label: 'Wobble', icon: '↻' },
    { id: 'slide', label: 'Slide', icon: '→' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          title="Back to Appearance"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Buttons</h2>
          <p className="text-xs text-slate-500 font-medium">Customize button styles, corners, shadows and hover effects.</p>
        </div>
      </div>

      {/* Button Style */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Button Style</label>
        <div className="grid grid-cols-3 gap-3">
          {buttonStyles.map((style) => {
            const isSelected = currentStyle === style.id
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => updateConfig('theme.buttonStyle.style', style.id)}
                className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center h-10 mb-2">
                  <div
                    className={`w-full h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      style.id === 'solid'
                        ? 'bg-slate-900 text-white'
                        : style.id === 'glass'
                        ? 'bg-white/60 backdrop-blur-xs border border-slate-300 text-slate-900 shadow-2xs'
                        : 'bg-transparent border-2 border-slate-900 text-slate-900'
                    }`}
                  />
                </div>
                
                <div className="text-center text-xs font-bold text-slate-900">
                  {style.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Corner Roundness */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Corner Roundness</label>
        <div className="grid grid-cols-4 gap-2.5">
          {cornerOptions.map((option) => {
            const isSelected = 
              (option.radius === 0 && currentRadius === 0) ||
              (option.radius === 8 && currentRadius > 0 && currentRadius <= 8) ||
              (option.radius === 16 && currentRadius > 8 && currentRadius <= 20) ||
              (option.radius === 50 && currentRadius > 20)
            
            return (
              <button
                key={option.radius}
                type="button"
                onClick={() => updateConfig('theme.buttonStyle.borderRadius', option.radius)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-center h-8 w-full">
                  <div
                    className="w-10 h-7 bg-slate-900"
                    style={{ borderRadius: option.visual === 9999 ? '9999px' : `${option.visual}px` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-800">{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Button Shadow */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Button Shadow</label>
        <div className="grid grid-cols-4 gap-2.5">
          {shadowOptions.map((shadow) => {
            const isSelected = currentShadow === shadow.style
            return (
              <button
                key={shadow.style}
                type="button"
                onClick={() => updateConfig('theme.buttonStyle.shadowStyle', shadow.style)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                  isSelected
                    ? 'border-slate-900 bg-slate-50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-900">{shadow.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Button Color Pickers */}
      <div className="space-y-4 pt-2 border-t border-slate-200/80">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Button Colors</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button Background Color */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Button Fill</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => updateConfig('theme.colors.buttonDefault', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-xl border border-slate-300 shadow-2xs cursor-pointer"
                  style={{ backgroundColor: buttonColor }}
                />
              </div>
              <Input
                type="text"
                value={buttonColor.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    updateConfig('theme.colors.buttonDefault', val)
                  }
                }}
                placeholder="#D3D1C7"
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
                placeholder="#39342C"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Button Animation Options */}
      <div className="space-y-3 pt-3 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-bold text-slate-900">Hover Animations</label>
            <p className="text-xs text-slate-500 font-medium">Add subtle micro-animations when visitors hover over buttons.</p>
          </div>
          <Toggle
            checked={enableAnim}
            onChange={(v) => updateConfig('theme.buttonStyle.enableAnimations', v)}
            variant="dark"
            size="md"
          />
        </div>
        
        {enableAnim && (
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {animationOptions.map((anim) => {
              const isSelected = currentAnim === anim.id
              return (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => updateConfig('theme.buttonStyle.animation', anim.id)}
                  className={`py-3 px-2 rounded-2xl border-2 transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-base mb-0.5">{anim.icon}</div>
                  <span className="text-xs font-bold text-slate-900">{anim.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
