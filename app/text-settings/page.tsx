'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function TextSettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<any>(null)
  const [useAlternativeTitleFont, setUseAlternativeTitleFont] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('currentBioLinkConfig')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setConfig(parsed)
        // Check if title font matches body font
        setUseAlternativeTitleFont(
          parsed.theme?.fonts?.heading !== parsed.theme?.fonts?.body
        )
      } catch (e) {
        console.error('Failed to parse config', e)
      }
    }
  }, [])

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

  const handleAlternativeTitleFontToggle = () => {
    const newValue = !useAlternativeTitleFont
    setUseAlternativeTitleFont(newValue)
    
    if (newValue) {
      // Set a different font for title
      updateConfigPath('theme.fonts.heading', 'Playfair Display')
    } else {
      // Match the body font
      updateConfigPath('theme.fonts.heading', config.theme.fonts.body)
    }
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F3F0' }}>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">Loading text settings...</p>
        </div>
      </div>
    )
  }

  const pageFont = config.theme?.fonts?.body || 'Inter'
  const titleFont = config.theme?.fonts?.heading || pageFont
  const pageTextColor = config.theme?.colors?.profileBio || '#39342C'
  const titleColor = config.theme?.colors?.profileText || '#39342C'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F3F0' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#000000' }} />
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#000000' }}>Text</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="space-y-0">
          {/* Page font */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Page font
            </label>
            <select
              value={pageFont}
              onChange={(e) => {
                updateConfigPath('theme.fonts.body', e.target.value)
                if (!useAlternativeTitleFont) {
                  updateConfigPath('theme.fonts.heading', e.target.value)
                }
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-xl text-base font-normal bg-white cursor-pointer"
              style={{ color: '#000000', minWidth: '200px' }}
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Epilogue">Epilogue</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>

          {/* Page text color */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Page text color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={pageTextColor}
                  onChange={(e) => updateConfigPath('theme.colors.profileBio', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: pageTextColor }}
                />
              </div>
              <input
                type="text"
                value={pageTextColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    updateConfigPath('theme.colors.profileBio', value)
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-white"
                style={{ width: '100px' }}
              />
            </div>
          </div>

          {/* Alternative title font toggle */}
          <div className="bg-white py-5 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-normal mb-1" style={{ color: '#000000' }}>
                  Alternative title font
                </p>
                <p className="text-sm" style={{ color: '#717171' }}>
                  Matches page font by default
                </p>
              </div>
              <button
                role="switch"
                aria-checked={useAlternativeTitleFont}
                onClick={handleAlternativeTitleFontToggle}
                className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                  useAlternativeTitleFont ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${
                    useAlternativeTitleFont ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Title font (conditional) */}
          {useAlternativeTitleFont && (
            <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
              <label className="text-base font-normal" style={{ color: '#000000' }}>
                Title font
              </label>
              <select
                value={titleFont}
                onChange={(e) => updateConfigPath('theme.fonts.heading', e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl text-base font-normal bg-white cursor-pointer"
                style={{ color: '#000000', minWidth: '200px' }}
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Epilogue">Epilogue</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Space Grotesk">Space Grotesk</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
          )}

          {/* Title color */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Title color
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => updateConfigPath('theme.colors.profileText', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: titleColor }}
                />
              </div>
              <input
                type="text"
                value={titleColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                    updateConfigPath('theme.colors.profileText', value)
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-white"
                style={{ width: '100px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
