'use client'

import React, { useState, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import { ArrowLeft, Upload, Pencil, Image as ImageIcon, Plus, Zap } from 'lucide-react'

const compressImageFile = (file: File, maxDimension = 800, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', quality))
        } else {
          resolve(e.target?.result as string)
        }
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

interface Props {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

export default function ProfilePanel({ config, updateConfig, onBack }: Props) {
  const selectedLayout = config.profile?.headerLayout || 'classic'
  const titleStyle = config.profile?.titleStyle || 'text'
  const altFontEnabled = config.profile?.altFont || false
  const [showImageInput, setShowImageInput] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressed = await compressImageFile(file, 800, 0.85)
        updateConfig('profile.avatar', compressed)
      } catch (err) {
        console.error('Failed to compress avatar:', err)
      }
    }
  }

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressed = await compressImageFile(file, 1200, 0.85)
        updateConfig('profile.bannerImage', compressed)
      } catch (err) {
        console.error('Failed to compress banner:', err)
      }
    }
  }

  const layouts = [
    { id: 'classic', label: 'Classic', isPro: false, showZap: false },
    { id: 'hero',    label: 'Hero',    isPro: true,  showZap: true  },
    { id: 'banner',  label: 'Banner',  isPro: false, showZap: true  },
    { id: 'shape',   label: 'Shape',   isPro: false, showZap: true  },
  ]

  const fonts = [
    'Manrope', 'Inter', 'Roboto', 'Outfit', 'Plus Jakarta Sans', 'Playfair Display', 'Space Grotesk'
  ]

  return (
    <div className="space-y-7">
      {/* Hidden file input pickers */}
      <input
        type="file"
        ref={avatarInputRef}
        accept="image/*"
        onChange={handleAvatarFile}
        className="hidden"
      />
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/*"
        onChange={handleBannerFile}
        className="hidden"
      />

      {/* ── Top Bar: ← Header title ── */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer"
            title="Back to Design"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Header</h1>
      </div>

      {/* ── 1. Layout Section ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Layout</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => updateConfig('profile.headerLayout', l.id)}
              className={`w-28 sm:w-32 aspect-square rounded-[22px] border-2 bg-white flex flex-col items-center justify-between p-3 relative overflow-hidden transition-all cursor-pointer flex-shrink-0 ${
                selectedLayout === l.id
                  ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                  : 'border-slate-200/80 hover:border-slate-400'
              }`}
            >
              {/* Badge */}
              {l.isPro ? (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <span>Pro</span>
                  <Zap className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              ) : l.showZap ? (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-3 h-3 fill-white text-white" />
                </div>
              ) : null}

              {/* Mockup layout graphic tailored for each layout */}
              <div className="flex-1 flex items-center justify-center w-full pt-1.5 pb-1">
                {l.id === 'classic' && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden border border-slate-200 shadow-xs flex items-center justify-center">
                      <Avatar src={config.profile.avatar} size="xs" fallback="user" />
                    </div>
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                  </div>
                )}
                {l.id === 'hero' && (
                  <div className="w-full h-11 bg-slate-900 rounded-t-lg relative overflow-hidden flex flex-col justify-end p-1.5 border border-slate-700 shadow-xs">
                    {config.profile.avatar && (config.profile.avatar.startsWith('http') || config.profile.avatar.startsWith('data:')) ? (
                      <img src={config.profile.avatar} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-indigo-900 opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="relative z-10 w-10 h-1 bg-white rounded-full mx-auto" />
                  </div>
                )}
                {l.id === 'banner' && (
                  <div className="w-full flex flex-col items-center relative">
                    <div className="w-full h-6 rounded-t-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 relative overflow-hidden">
                      {config.profile.bannerImage && (
                        <img src={config.profile.bannerImage} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white -mt-3.5 relative z-10 overflow-hidden shadow-xs flex items-center justify-center">
                      <Avatar src={config.profile.avatar} size="xs" fallback="user" />
                    </div>
                  </div>
                )}
                {l.id === 'shape' && (
                  <div className="w-8 h-8 bg-rose-600 overflow-hidden shadow-xs flex items-center justify-center" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                    <Avatar src={config.profile.avatar} size="xs" fallback="user" />
                  </div>
                )}
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-slate-800">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Dynamic Sub-Section: Shape Selector (When Layout === 'shape') ── */}
      {selectedLayout === 'shape' && (
        <div className="pt-2 pb-2">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Shape</h2>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'loop',    label: 'Loop',    iconPath: 'M10 25C10 15 25 10 40 10C55 10 70 15 70 25C70 35 55 40 40 40C25 40 10 35 10 25Z' },
              { id: 'flower',  label: 'Flower',  iconPath: 'M25 10C30 5 45 5 50 10C55 15 65 20 65 30C65 40 55 45 50 50C45 55 30 55 25 50C20 45 10 40 10 30C10 20 20 15 25 10Z' },
              { id: 'oval',    label: 'Oval',    iconPath: 'M15 25C15 14 26 10 40 10C54 10 65 14 65 25C65 36 54 40 40 40C26 40 15 36 15 25Z' },
              { id: 'rounded', label: 'Rounded', iconPath: 'M15 15C15 10 20 10 40 10C60 10 65 10 65 15C65 35 65 35 65 35C65 40 60 40 40 40C20 40 15 40 15 35Z' },
              { id: 'burst',   label: 'Burst',   iconPath: 'M40 5L46 16L58 12L54 24L65 30L55 38L62 48L50 46L44 57L36 48L24 53L27 41L15 38L24 28L18 18L30 20L40 5Z' },
            ].map((s) => {
              const currentShape = config.profile?.headerShape || 'loop'
              const isSelected = currentShape === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => updateConfig('profile.headerShape', s.id)}
                  className={`w-20 sm:w-24 aspect-square rounded-[20px] border-2 bg-white flex flex-col items-center justify-center p-2.5 transition-all cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-md'
                      : 'border-slate-200/80 hover:border-slate-400'
                  }`}
                >
                  <div className="w-10 h-6 flex items-center justify-center mb-1">
                    <svg viewBox="0 0 80 50" className="w-9 h-6 fill-slate-800">
                      <path d={s.iconPath} />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 2. Profile image ── */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Profile image</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[16px] flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload image
          </button>
          <div className="relative group">
            <div
              onClick={() => avatarInputRef.current?.click()}
              className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer"
            >
              <Avatar src={config.profile.avatar} size="lg" fallback="user" />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Upload new image"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showImageInput && (
        <div className="bg-slate-50 p-3.5 rounded-[18px] border border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-700">Or enter Image URL / Emoji</label>
          <input
            type="text"
            value={config.profile.avatar}
            onChange={(e) => updateConfig('profile.avatar', e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-[14px] bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="https://... or emoji 😀"
          />
        </div>
      )}

      {/* ── Dynamic Sub-Section: Banner Image (When Layout === 'banner') ── */}
      {selectedLayout === 'banner' && (
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-900">Banner image</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[16px] flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload banner
            </button>
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="w-14 h-14 rounded-[18px] bg-slate-100 border border-slate-200 flex flex-col items-center justify-center cursor-pointer shadow-xs hover:bg-slate-200/70 transition-colors relative overflow-hidden"
              title="Upload Banner Image"
            >
              {config.profile.bannerImage ? (
                <img src={config.profile.bannerImage} alt="banner" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                  <Plus className="w-3 h-3 -ml-1 -mt-2 stroke-[3]" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title</label>
        <input
          type="text"
          value={config.profile.title}
          onChange={(e) => updateConfig('profile.title', e.target.value)}
          className="w-full sm:w-80 bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          placeholder="satvikpatel8373"
        />
      </div>

      {/* ── 4. Bio ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900 pt-3">Bio</label>
        <div className="w-full sm:w-80 relative">
          <textarea
            value={config.profile.bio || ''}
            onChange={(e) => {
              if (e.target.value.length <= 160) {
                updateConfig('profile.bio', e.target.value)
              }
            }}
            maxLength={160}
            className="w-full bg-white border border-slate-200 rounded-[20px] p-4 text-sm font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none min-h-[105px] pr-4 pb-8"
            placeholder="Add a short bio"
          />
          <span className="absolute bottom-3 right-4 text-xs font-semibold text-slate-400 pointer-events-none">
            {config.profile.bio?.length || 0}/160
          </span>
        </div>
      </div>

      {/* ── 5. Title style ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title style</label>
        <div className="flex items-center gap-3">
          {/* Aa Text */}
          <button
            onClick={() => updateConfig('profile.titleStyle', 'text')}
            className={`w-28 py-3 rounded-[18px] border-2 bg-white flex flex-col items-center justify-center transition-all cursor-pointer ${
              titleStyle === 'text'
                ? 'border-slate-900 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-400'
            }`}
          >
            <span className="text-lg font-bold text-slate-900 leading-none">Aa</span>
            <span className="text-xs font-semibold text-slate-700 mt-1">Text</span>
          </button>

          {/* Logo */}
          <button
            onClick={() => updateConfig('profile.titleStyle', 'logo')}
            className={`w-28 py-3 rounded-[18px] border-2 bg-white flex flex-col items-center justify-center transition-all cursor-pointer relative ${
              titleStyle === 'logo'
                ? 'border-slate-900 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-400'
            }`}
          >
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center">
              <Zap className="w-3 h-3 fill-white text-white" />
            </div>
            <ImageIcon className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-semibold text-slate-700 mt-1">Logo</span>
          </button>
        </div>
      </div>

      {/* ── 6. Alternative title font ── */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <div>
          <label className="text-sm font-bold text-slate-900 block">Alternative title font</label>
          <span className="text-xs text-slate-400 font-normal">Matches page font by default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-3 h-3 fill-white text-white" />
          </div>
          <button
            onClick={() => updateConfig('profile.altFont', !altFontEnabled)}
            className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
              altFontEnabled ? 'bg-emerald-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                altFontEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── 7. Title font ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title font</label>
        <select
          value={config.theme.fonts?.heading || 'Manrope'}
          onChange={(e) => updateConfig('theme.fonts.heading', e.target.value)}
          className="w-full sm:w-80 bg-white border border-slate-200 rounded-[18px] px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* ── 8. Title color ── */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title color</label>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-[18px] px-4 py-2.5 shadow-2xs">
          <input
            type="color"
            value={config.theme.colors?.profileText || '#FFFFFF'}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-6 h-6 rounded-lg border border-slate-200 cursor-pointer shadow-xs"
          />
          <input
            type="text"
            value={config.theme.colors?.profileText || '#FFFFFF'}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-20 font-mono text-sm font-bold text-slate-900 uppercase focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
