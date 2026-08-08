'use client'

import React, { useState, useRef } from 'react'
import {
  ArrowLeft, Image as ImageIcon, Video, Upload, Trash2, CheckCircle2,
  AlertTriangle, Loader2, Sparkles, Wand2
} from 'lucide-react'
import { uploadWallpaperFile } from '@/lib/storage'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface Props {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

const COLOR_SWATCHES = [
  '#FFFFFF', '#090D16', '#0F172A', '#1E1B4B', '#064E3B',
  '#4C1D95', '#831843', '#7B3200', '#7F2AEB', '#DC2626',
]

const GRADIENT_PRESETS = [
  { name: 'Sunset',    from: '#FF512F', to: '#DD2476' },
  { name: 'Ocean',     from: '#2B5876', to: '#4E4376' },
  { name: 'Neon',      from: '#8A2387', to: '#E94057' },
  { name: 'Emerald',   from: '#0F766E', to: '#047857' },
  { name: 'Royal',     from: '#6D28D9', to: '#9333EA' },
  { name: 'Peach',     from: '#F43F5E', to: '#FB923C' },
  { name: 'Ice',       from: '#06B6D4', to: '#3B82F6' },
  { name: 'Forest',    from: '#166534', to: '#15803D' },
]

const FILTER_EFFECTS = [
  { id: 'none',       label: 'None' },
  { id: 'blur-sm',    label: 'Blur (Soft)' },
  { id: 'blur-md',    label: 'Blur (Medium)' },
  { id: 'brightness', label: 'Brightness' },
  { id: 'contrast',   label: 'Contrast' },
  { id: 'grayscale',  label: 'Grayscale' },
  { id: 'sepia',      label: 'Sepia' },
]

export default function WallpaperPanel({ config, updateConfig, onBack }: Props) {
  const c = config.theme.colors
  const activeType = c.backgroundType || (
    c.backgroundVideo || c.backgroundIframe ? 'video' :
    c.backgroundImage ? 'image' :
    c.backgroundMesh  ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
    c.backgroundGradient ? 'gradient' : 'fill'
  )

  const setBgType = (type: string) => {
    const base = [
      { path: 'theme.colors.backgroundType',     value: type },
      { path: 'theme.colors.backgroundGradient', value: null },
      { path: 'theme.colors.backgroundMesh',     value: '' },
      { path: 'theme.colors.backgroundImage',    value: '' },
      { path: 'theme.colors.backgroundVideo',    value: '' },
      { path: 'theme.colors.backgroundIframe',   value: '' },
    ]
    if (type === 'gradient') {
      updateConfig([...base, { path: 'theme.colors.backgroundGradient', value: c.backgroundGradient || { from: c.background || '#4F46E5', to: c.accent || '#EC4899', direction: '135deg' } }])
    } else if (type === 'blur') {
      updateConfig([...base, { path: 'theme.colors.backgroundMesh', value: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(109,40,217,0.8) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(124,58,237,0.7) 0%, transparent 55%), linear-gradient(160deg, #1E1035 0%, #2D1B69 100%)' }])
    } else if (type === 'pattern') {
      updateConfig([...base, { path: 'theme.colors.backgroundMesh', value: 'radial-gradient(circle, rgba(255,255,255,0.18) 15%, transparent 16%)' }])
    } else {
      updateConfig(base)
    }
  }

  const [videoState,    setVideoState]    = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [videoProgress, setVideoProgress] = useState(0)
  const [uploadError,   setUploadError]   = useState('')
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'].includes(file.type)) {
      setUploadError('Please upload an MP4, WebM, or MOV file.'); return
    }
    if (file.size > 50 * 1024 * 1024) { setUploadError('Max file size is 50 MB.'); return }
    setVideoState('uploading'); setVideoProgress(0); setUploadError('')
    try {
      const url = await uploadWallpaperFile(file, (config as any).id || 'wallpaper', (pct) => setVideoProgress(pct))
      updateConfig([
        { path: 'theme.colors.backgroundVideo', value: url },
        { path: 'theme.colors.backgroundIframe', value: '' },
        { path: 'theme.colors.backgroundImage',  value: '' },
        { path: 'theme.colors.backgroundType',   value: 'video' },
      ])
      setVideoState('done')
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed.'); setVideoState('error')
    }
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const clearVideo = () => {
    updateConfig([
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
      { path: 'theme.colors.backgroundType',  value: 'fill' },
    ])
    setVideoState('idle'); setVideoProgress(0); setUploadError('')
  }

  const handleImageUrl = (url: string) => {
    const trimmed = url.trim()
    updateConfig([
      { path: 'theme.colors.backgroundImage',  value: trimmed },
      { path: 'theme.colors.backgroundVideo',  value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
      { path: 'theme.colors.backgroundType',   value: trimmed ? 'image' : 'fill' },
    ])
  }

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadError('Please choose an image file.'); return }
    if (file.size > 10 * 1024 * 1024)   { setUploadError('Max image size is 10 MB.'); return }
    try {
      const url = await uploadWallpaperFile(file, (config as any).id || 'wallpaper')
      handleImageUrl(url); setUploadError('')
    } catch (err: any) { setUploadError(err?.message || 'Could not upload the image.') }
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const imageUrl = c.backgroundImage || ''
  const styleTypes = [
    { type: 'fill',     label: 'Fill',    icon: <div className="w-10 h-10 rounded-xl shadow-xs" style={{ backgroundColor: c.background || '#7F2AEB' }} /> },
    { type: 'gradient', label: 'Gradient', icon: <div className="w-10 h-10 rounded-xl shadow-xs" style={{ background: c.backgroundGradient ? `linear-gradient(135deg, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` : 'linear-gradient(135deg,#7F2AEB,#A78BFA)' }} /> },
    { type: 'blur',     label: 'Blur',    icon: <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-pink-500 to-brand-400 blur-[1px] shadow-xs" /> },
    { type: 'pattern',  label: 'Pattern', icon: <div className="w-10 h-10 rounded-xl bg-brand-600 relative overflow-hidden shadow-xs"><div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle,#fff 15%,transparent 16%)', backgroundSize: '8px 8px' }} /></div> },
    { type: 'image',    label: 'Image',   icon: <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=120&q=80)' }}><ImageIcon className="w-4 h-4 text-white absolute top-1 right-1" /></div> },
    { type: 'video',    label: 'Video',   icon: <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shadow-xs"><Video className="w-5 h-5 text-slate-500" /></div> },
  ]

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} title="Back">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Wallpaper</h2>
          <p className="text-xs text-slate-500 font-medium">Customize your page background</p>
        </div>
      </div>

      {/* Style selector */}
      <div className="flex gap-3 overflow-x-auto py-2 px-1 -mx-1 scrollbar-none">
        {styleTypes.map(({ type, label, icon }) => (
          <Button
            key={type}
            type="button"
            variant={activeType === type ? 'secondary' : 'ghost'}
            size="md"
            onClick={() => setBgType(type)}
            className={`flex-shrink-0 flex-col gap-1.5 h-auto py-3 px-4 min-w-[88px] ${
              activeType === type ? 'ring-2 ring-slate-900/20' : ''
            }`}
          >
            {icon}
            <span className="text-[11px]">{label}</span>
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-5 shadow-clay-sm">

        {/* Fill / Pattern */}
        {(activeType === 'fill' || activeType === 'pattern') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">Background color</span>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-clay-sm">
                <input
                  type="color"
                  value={c.background || '#7F2AEB'}
                  onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
                  className="w-6 h-6 rounded-md border-0 cursor-pointer p-0"
                />
                <span className="font-mono text-sm font-bold text-slate-700 uppercase">{c.background || '#7F2AEB'}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {COLOR_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  onClick={() => updateConfig('theme.colors.background', hex)}
                  title={hex}
                  className={`w-10 h-10 rounded-xl border-2 transition-transform hover:scale-105 cursor-pointer ${c.background?.toUpperCase() === hex.toUpperCase() ? 'border-slate-800 scale-105 ring-2 ring-slate-900/20' : 'border-slate-200'}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Gradient */}
        {activeType === 'gradient' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start Color</label>
                <input type="color" value={c.backgroundGradient?.from || '#4F46E5'} onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, from: e.target.value })} className="w-full h-11 rounded-xl border border-slate-200 cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">End Color</label>
                <input type="color" value={c.backgroundGradient?.to || '#EC4899'} onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, to: e.target.value })} className="w-full h-11 rounded-xl border border-slate-200 cursor-pointer" />
              </div>
            </div>
            <Select
              label="Direction"
              value={c.backgroundGradient?.direction || '135deg'}
              onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, direction: e.target.value })}
            >
              <option value="0deg">Top → Bottom</option>
              <option value="90deg">Left → Right</option>
              <option value="135deg">Diagonal ↘</option>
              <option value="180deg">Bottom → Top</option>
            </Select>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-600">Presets</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => {
                    const rand = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)]
                    updateConfig('theme.colors.backgroundGradient', { from: rand.from, to: rand.to, direction: '135deg' })
                  }}
                >
                  <Wand2 className="w-3 h-3" /> Random
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_PRESETS.map((gp) => (
                  <button
                    key={gp.name}
                    onClick={() => updateConfig('theme.colors.backgroundGradient', { from: gp.from, to: gp.to, direction: '135deg' })}
                    className="rounded-xl border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer hover:scale-105"
                    title={gp.name}
                  >
                    <div className="h-10 w-full" style={{ background: `linear-gradient(135deg,${gp.from},${gp.to})` }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blur / Mesh */}
        {activeType === 'blur' && (
          <Textarea
            label="Mesh Blur Gradient"
            hint="Multiple CSS radial gradient stops layered to form a custom mesh."
            rows={3}
            value={c.backgroundMesh || ''}
            onChange={(e) => updateConfig('theme.colors.backgroundMesh', e.target.value)}
            placeholder="radial-gradient(ellipse …)"
            className="font-mono text-xs"
          />
        )}

        {/* Image */}
        {activeType === 'image' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">Wallpaper Image Link</label>
              {imageUrl && (
                <Button variant="danger" size="xs" onClick={() => handleImageUrl('')}>
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </Button>
              )}
            </div>
            <Input
              type="text"
              value={imageUrl}
              onChange={(e) => handleImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageFile} />
            <Button variant="outline" size="md" fullWidth onClick={() => imageInputRef.current?.click()}>
              <Upload className="w-4 h-4" /> Upload Image File
            </Button>

            {imageUrl && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-600">Image Filter</label>
                <div className="grid grid-cols-2 gap-2">
                  {FILTER_EFFECTS.map((fx) => (
                    <Button
                      key={fx.id}
                      type="button"
                      variant={c.backgroundFilter === fx.id ? 'secondary' : 'ghost'}
                      size="xs"
                      onClick={() => updateConfig('theme.colors.backgroundFilter', fx.id === 'none' ? '' : fx.id)}
                    >
                      {fx.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Video */}
        {activeType === 'video' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800">Background Video</label>
            <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" className="hidden" onChange={handleVideoFile} />
            {c.backgroundVideo ? (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">Video Active</span>
                  </div>
                  <Button variant="danger" size="xs" onClick={clearVideo}>
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="md"
                fullWidth
                disabled={videoState === 'uploading'}
                isLoading={videoState === 'uploading'}
                onClick={() => videoInputRef.current?.click()}
              >
                {videoState === 'uploading'
                  ? <>Uploading… {videoProgress}%</>
                  : <><Upload className="w-4 h-4" /> Upload MP4 / WebM Video</>}
              </Button>
            )}
            {uploadError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
