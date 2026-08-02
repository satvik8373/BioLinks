'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function ColorSettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentBioLinkConfig')
    if (stored) {
      try {
        setConfig(JSON.parse(stored))
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

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F3F0' }}>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">Loading color settings...</p>
        </div>
      </div>
    )
  }

  const buttonColor = config.theme?.colors?.buttonDefault || '#D3D1C7'
  const buttonTextColor = config.theme?.colors?.buttonText || '#39342C'
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
          <h1 className="text-xl font-bold" style={{ color: '#000000' }}>Colors</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-5 py-6">
        <div className="space-y-0">
          {/* Buttons */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Buttons
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={buttonColor}
                  onChange={(e) => updateConfigPath('theme.colors.buttonDefault', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-white"
                style={{ width: '100px' }}
              />
            </div>
          </div>

          {/* Button text */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Button text
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={buttonTextColor}
                  onChange={(e) => updateConfigPath('theme.colors.buttonText', e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
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
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono bg-white"
                style={{ width: '100px' }}
              />
            </div>
          </div>

          {/* Page text */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Page text
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

          {/* Title */}
          <div className="bg-white py-5 border-b border-gray-200 flex items-center justify-between">
            <label className="text-base font-normal" style={{ color: '#000000' }}>
              Title
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
