'use client'

import React, { useState, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Toggle from '@/components/ui/Toggle'
import { ArrowLeft, Upload, Pencil, Image as ImageIcon, Plus, Zap } from 'lucide-react'

const compressImage = (file: File, maxDim = 800, quality = 0.85): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width, h = img.height
        if (w > h) { if (w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim } }
        else        { if (h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim } }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx ? (ctx.drawImage(img, 0, 0, w, h), resolve(canvas.toDataURL('image/jpeg', quality))) : resolve(e.target?.result as string)
      }
      img.onerror = () => resolve(e.target?.result as string)
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })

interface Props {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

const FONTS = ['Manrope', 'Inter', 'Roboto', 'Outfit', 'Plus Jakarta Sans', 'Playfair Display', 'Space Grotesk']

const LAYOUTS = [
  { id: 'classic', label: 'Classic', isPro: false },
  { id: 'hero',    label: 'Hero',    isPro: true  },
  { id: 'banner',  label: 'Banner',  isPro: false },
  { id: 'shape',   label: 'Shape',   isPro: false },
]

export default function ProfilePanel({ config, updateConfig, onBack }: Props) {
  const selectedLayout = config.profile?.headerLayout || 'classic'
  const titleStyle     = config.profile?.titleStyle   || 'text'
  const altFont        = config.profile?.altFont      || false

  const avatarRef = useRef<HTMLInputElement>(null)
  const bannerRef = useRef<HTMLInputElement>(null)

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) updateConfig('profile.avatar', await compressImage(file, 800, 0.85))
  }
  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) updateConfig('profile.bannerImage', await compressImage(file, 1200, 0.85))
  }

  return (
    <div className="space-y-7">
      <input type="file" ref={avatarRef} accept="image/*" onChange={handleAvatarFile} className="hidden" />
      <input type="file" ref={bannerRef} accept="image/*" onChange={handleBannerFile} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-2">
        {onBack && (
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-slate-100 text-slate-900 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Header</h1>
      </div>

      {/* Layout */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3">Layout</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => updateConfig('profile.headerLayout', l.id)}
              className={`w-28 aspect-square rounded-[22px] border-2 bg-white flex flex-col items-center justify-between p-3 relative overflow-hidden transition-all cursor-pointer flex-shrink-0 ${
                selectedLayout === l.id
                  ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-clay'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              {l.isPro && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <span>Pro</span><Zap className="w-2.5 h-2.5 fill-white text-white" />
                </div>
              )}
              <div className="flex-1 flex items-center justify-center w-full">
                {l.id === 'classic' && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
                      <Avatar src={config.profile.avatar} size="xs" />
                    </div>
                    <div className="w-10 h-1 bg-slate-300 rounded-full" />
                  </div>
                )}
                {l.id === 'hero' && (
                  <div className="w-full h-11 bg-slate-900 rounded-t-lg relative overflow-hidden flex flex-col justify-end p-1.5">
                    {config.profile.avatar?.startsWith('http') || config.profile.avatar?.startsWith('data:')
                      ? <img src={config.profile.avatar} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                      : <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-brand-900 opacity-80" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="relative z-10 w-10 h-1 bg-white rounded-full mx-auto" />
                  </div>
                )}
                {l.id === 'banner' && (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-full h-6 rounded-t-lg bg-gradient-to-r from-pink-500 via-brand-500 to-brand-600 relative overflow-hidden">
                      {config.profile.bannerImage && <img src={config.profile.bannerImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white -mt-3.5 relative z-10 overflow-hidden shadow-xs flex items-center justify-center">
                      <Avatar src={config.profile.avatar} size="xs" />
                    </div>
                  </div>
                )}
                {l.id === 'shape' && (
                  <div className="w-8 h-8 bg-rose-600 overflow-hidden shadow-xs flex items-center justify-center" style={{ borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }}>
                    <Avatar src={config.profile.avatar} size="xs" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-800">{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile image */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Profile image</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => avatarRef.current?.click()}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[16px] flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-clay-sm cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Upload image
          </button>
          <div className="relative group">
            <div onClick={() => avatarRef.current?.click()} className="w-14 h-14 rounded-full overflow-hidden cursor-pointer">
              <Avatar src={config.profile.avatar} size="lg" />
            </div>
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-clay-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Banner image (banner layout only) */}
      {selectedLayout === 'banner' && (
        <div className="flex items-center justify-between py-2 border-t border-slate-100">
          <label className="text-sm font-bold text-slate-900">Banner image</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => bannerRef.current?.click()}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-[16px] flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-clay-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Upload banner
            </button>
            <div
              onClick={() => bannerRef.current?.click()}
              className="w-14 h-14 rounded-[18px] bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors relative overflow-hidden shadow-clay-sm"
            >
              {config.profile.bannerImage
                ? <img src={config.profile.bannerImage} alt="banner" className="w-full h-full object-cover" />
                : <div className="flex items-center justify-center text-slate-500"><ImageIcon className="w-5 h-5" /><Plus className="w-3 h-3 -ml-1 -mt-2 stroke-[3]" /></div>}
            </div>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title</label>
        <div className="w-full sm:w-80">
          <Input
            type="text"
            value={config.profile.title}
            onChange={(e) => updateConfig('profile.title', e.target.value)}
            placeholder="Your display name"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900 pt-3">Bio</label>
        <div className="w-full sm:w-80">
          <Textarea
            value={config.profile.bio || ''}
            onChange={(e) => {
              if (e.target.value.length <= 160) updateConfig('profile.bio', e.target.value)
            }}
            maxLength={160}
            counter
            rows={4}
            placeholder="Add a short bio"
          />
        </div>
      </div>

      {/* Title style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title style</label>
        <div className="flex items-center gap-3">
          {[
            { id: 'text', label: 'Text', content: <span className="text-lg font-bold text-slate-900 leading-none">Aa</span> },
            { id: 'logo', label: 'Logo', content: <ImageIcon className="w-5 h-5 text-slate-700" /> },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => updateConfig('profile.titleStyle', s.id)}
              className={`w-28 py-3 rounded-[18px] border-2 bg-white flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                titleStyle === s.id ? 'border-slate-900 shadow-clay-sm' : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              {s.id === 'logo' && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-slate-500 text-white flex items-center justify-center">
                  <Zap className="w-3 h-3 fill-white text-white" />
                </div>
              )}
              {s.content}
              <span className="text-xs font-semibold text-slate-700 mt-1">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alt title font toggle */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <div>
          <label className="text-sm font-bold text-slate-900 block">Alternative title font</label>
          <span className="text-xs text-slate-400 font-normal">Matches page font by default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-500 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-3 h-3 fill-white text-white" />
          </div>
          <Toggle checked={altFont} onChange={(v) => updateConfig('profile.altFont', v)} />
        </div>
      </div>

      {/* Title font */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title font</label>
        <div className="w-full sm:w-80">
          <Select
            value={config.theme.fonts?.heading || 'Manrope'}
            onChange={(e) => updateConfig('theme.fonts.heading', e.target.value)}
          >
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </div>
      </div>

      {/* Title color */}
      <div className="flex items-center justify-between py-2 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-900">Title color</label>
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-[18px] px-4 py-2.5 shadow-clay-sm">
          <input
            type="color"
            value={config.theme.colors?.profileText || '#FFFFFF'}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-6 h-6 rounded-lg border border-slate-200 cursor-pointer shadow-xs"
          />
          <Input
            type="text"
            value={config.theme.colors?.profileText || '#FFFFFF'}
            onChange={(e) => updateConfig('theme.colors.profileText', e.target.value)}
            className="w-24 font-mono text-sm font-bold text-slate-900 uppercase border-none shadow-none p-0 focus:ring-0 bg-transparent"
          />
        </div>
      </div>
    </div>
  )
}
