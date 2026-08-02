'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'

export default function ButtonLayoutPage() {
  const router = useRouter()
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    // Load current config from localStorage
    const stored = localStorage.getItem('currentBioLinkConfig')
    if (stored) {
      try {
        setConfig(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse config', e)
      }
    }
  }, [])

  const updateConfig = (updates: any) => {
    if (!config) return

    let newConfig = { ...config }

    if (Array.isArray(updates)) {
      // Handle multiple updates
      updates.forEach(({ path, value }) => {
        const keys = path.split('.')
        let current = newConfig
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {}
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
      })
    } else if (typeof updates === 'string') {
      // Handle single path update (path, value) - but this signature expects two args
      // For now, treat as path only
      return
    } else {
      // Handle object updates
      newConfig = { ...newConfig, ...updates }
    }

    setConfig(newConfig)
    localStorage.setItem('currentBioLinkConfig', JSON.stringify(newConfig))
  }

  const updateConfigPath = (path: string, value: any) => {
    if (!config) return

    const newConfig = { ...config }
    const keys = path.split('.')
    let current = newConfig
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setConfig(newConfig)
    localStorage.setItem('currentBioLinkConfig', JSON.stringify(newConfig))
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">Loading button settings...</p>
        </div>
      </div>
    )
  }

  const currentStyle = config.theme?.buttonStyle?.style ?? 'solid'
  const currentRadius = config.theme?.buttonStyle?.borderRadius ?? 20
  const currentShadow = config.theme?.buttonStyle?.shadowStyle ?? 'none'
  const buttonColor = config.theme?.colors?.buttonDefault || '#D3D1C7'
  const buttonTextColor = config.theme?.colors?.buttonText || '#39342C'

  const buttonStyles = [
    { id: 'solid', label: 'Solid', icon: '⬤' },
    { id: 'glass', label: 'Glass', icon: '◐' },
    { id: 'outline', label: 'Outline', icon: '○' },
  ]

  const shadowOptions = [
    { style: 'none', label: 'None' },
    { style: 'soft', label: 'Soft' },
    { style: 'strong', label: 'Strong' },
    { style: 'hard', label: 'Hard' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Buttons</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Button style */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">Button style</label>
            <div className="grid grid-cols-3 gap-3">
              {buttonStyles.map((style) => {
                const isSelected = currentStyle === style.id
                return (
                  <button
                    key={style.id}
                    onClick={() => updateConfigPath('theme.buttonStyle.style', style.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                    
                    {/* Preview button */}
                    <div className="flex flex-col items-center gap-3 mb-2">
                      <div
                        className={`w-full h-10 rounded-full flex items-center justify-center text-xs font-semibold ${
                          style.id === 'solid'
                            ? 'bg-[#D3D1C7] text-[#39342C]'
                            : style.id === 'glass'
                            ? 'bg-white/40 backdrop-blur-sm border border-slate-200 text-slate-900'
                            : 'bg-transparent border-2 border-slate-900 text-slate-900'
                        }`}
                      >
                        {/* Empty preview */}
                      </div>
                    </div>
                    
                    <div className="text-center text-sm font-medium text-slate-900">
                      {style.label}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Corner roundness */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">Corner roundness</label>
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { radius: 0, visual: 0 },
                { radius: 8, visual: 8 },
                { radius: 16, visual: 16 },
                { radius: 50, visual: 9999 },
              ].map((option) => {
                const isSelected = 
                  (option.radius === 0 && currentRadius === 0) ||
                  (option.radius === 8 && currentRadius > 0 && currentRadius <= 8) ||
                  (option.radius === 16 && currentRadius > 8 && currentRadius <= 20) ||
                  (option.radius === 50 && currentRadius > 20)
                
                return (
                  <button
                    key={option.radius}
                    onClick={() => updateConfigPath('theme.buttonStyle.borderRadius', option.radius)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center h-10">
                      <div
                        className="w-12 h-8 bg-slate-900"
                        style={{ borderRadius: option.visual === 9999 ? '9999px' : `${option.visual}px` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Button shadow */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">Button shadow</label>
            <div className="grid grid-cols-4 gap-2.5">
              {shadowOptions.map((shadow) => {
                const isSelected = currentShadow === shadow.style
                return (
                  <button
                    key={shadow.style}
                    onClick={() => {
                      updateConfig([
                        { path: 'theme.buttonStyle.shadowStyle', value: shadow.style },
                        { path: 'theme.buttonStyle.shadow', value: shadow.style !== 'none' },
                      ])
                    }}
                    className={`py-3 px-3 rounded-xl border-2 transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-900">{shadow.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Button color */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">Button color</label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => updateConfigPath('theme.colors.buttonDefault', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                  style={{ backgroundColor: buttonColor }}
                />
              </div>
              <input
                type="text"
                value={buttonColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    updateConfigPath('theme.colors.buttonDefault', value)
                  }
                }}
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                placeholder="#D3D1C7"
              />
            </div>
          </div>

          {/* Button text color */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">Button text color</label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={buttonTextColor}
                  onChange={(e) => updateConfigPath('theme.colors.buttonText', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer"
                  style={{ backgroundColor: buttonTextColor }}
                />
              </div>
              <input
                type="text"
                value={buttonTextColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    updateConfigPath('theme.colors.buttonText', value)
                  }
                }}
                className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900"
                placeholder="#39342C"
              />
            </div>
          </div>

          {/* Animation Options */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-slate-900">Button animations</label>
                <p className="text-xs text-slate-500 mt-0.5">Add hover effects to your buttons</p>
              </div>
              <button
                role="switch"
                aria-checked={config.theme?.buttonStyle?.enableAnimations ?? true}
                onClick={() => updateConfigPath('theme.buttonStyle.enableAnimations', !(config.theme?.buttonStyle?.enableAnimations ?? true))}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  (config.theme?.buttonStyle?.enableAnimations ?? true) ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                    (config.theme?.buttonStyle?.enableAnimations ?? true) ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            {/* Animation Style Selector */}
            {(config.theme?.buttonStyle?.enableAnimations ?? true) && (
              <div className="grid grid-cols-4 gap-2.5 mt-3">
                {[
                  { id: 'bounce', label: 'Bounce', icon: '↗' },
                  { id: 'pulse', label: 'Pulse', icon: '○' },
                  { id: 'wobble', label: 'Wobble', icon: '↻' },
                  { id: 'slide', label: 'Slide', icon: '→' },
                ].map((anim) => {
                  const isSelected = (config.theme?.buttonStyle?.animation ?? 'bounce') === anim.id
                  return (
                    <button
                      key={anim.id}
                      onClick={() => updateConfigPath('theme.buttonStyle.animation', anim.id)}
                      className={`py-3 px-2 rounded-xl border-2 transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{anim.icon}</div>
                      <span className="text-xs font-medium text-slate-900">{anim.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={() => router.push('/editor')}
              className="w-full py-3 px-6 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
