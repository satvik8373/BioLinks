import React, { useState, useRef } from 'react'
import {
  ArrowLeft, Upload, Sparkles, Check, Image as ImageIcon,
  Video as VideoIcon, Palette, Zap, Layers, RefreshCw, X, Grid, Sliders, Link as LinkIcon
} from 'lucide-react'
import {
  PATTERN_PRESETS,
  BLUR_MESH_PRESETS,
  WALLPAPER_PRESETS,
  VIDEO_PRESETS,
  PatternPreset,
  WallpaperPreset,
  VideoPreset,
  BlurMeshPreset
} from '@/lib/wallpapers'
import { uploadWallpaperFile } from '@/lib/storage'

interface WallpaperPanelProps {
  config: any
  updateConfig: (pathOrUpdates: any, value?: any) => void
  onBack: () => void
}

export default function WallpaperPanel({ config, updateConfig, onBack }: WallpaperPanelProps) {
  const c = config.theme.colors || {}
  const activeType = c.backgroundType || (
    c.backgroundVideo || c.backgroundIframe ? 'video' :
    c.backgroundImage ? 'image' :
    c.backgroundMesh ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
    c.backgroundGradient ? 'gradient' : 'fill'
  )

  const [videoUploadState, setVideoUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [wallpaperCategory, setWallpaperCategory] = useState<string>('All')

  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const setBgType = (type: string) => {
    const base = [
      { path: 'theme.colors.backgroundType', value: type },
    ]

    if (type === 'fill') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundGradient', value: null },
        { path: 'theme.colors.backgroundMesh', value: '' },
        { path: 'theme.colors.backgroundImage', value: '' },
        { path: 'theme.colors.backgroundVideo', value: '' },
        { path: 'theme.colors.backgroundIframe', value: '' },
      ])
    } else if (type === 'gradient') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundGradient', value: c.backgroundGradient || { from: c.background || '#4F46E5', to: c.accent || '#EC4899', direction: '135deg' } },
        { path: 'theme.colors.backgroundMesh', value: '' },
        { path: 'theme.colors.backgroundImage', value: '' },
        { path: 'theme.colors.backgroundVideo', value: '' },
        { path: 'theme.colors.backgroundIframe', value: '' },
      ])
    } else if (type === 'blur') {
      const firstMesh = BLUR_MESH_PRESETS[0].cssMesh
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundMesh', value: c.backgroundMesh || firstMesh },
        { path: 'theme.colors.backgroundImage', value: '' },
        { path: 'theme.colors.backgroundVideo', value: '' },
        { path: 'theme.colors.backgroundIframe', value: '' },
      ])
    } else if (type === 'pattern') {
      const firstPattern = PATTERN_PRESETS[0]
      const currentBg = c.background || ''
      const validHex = (typeof currentBg === 'string' && /^#[0-9A-F]{6}$/i.test(currentBg.trim()))
        ? currentBg.trim()
        : '#4F46E5'
      updateConfig([
        ...base,
        { path: 'theme.colors.background', value: validHex },
        { path: 'theme.colors.backgroundMesh', value: c.backgroundMesh || firstPattern.cssPattern },
        { path: 'theme.colors.backgroundPatternSize', value: firstPattern.backgroundSize },
        { path: 'theme.colors.backgroundImage', value: '' },
        { path: 'theme.colors.backgroundVideo', value: '' },
        { path: 'theme.colors.backgroundIframe', value: '' },
      ])
    } else if (type === 'image') {
      const firstImage = WALLPAPER_PRESETS[0].url
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundImage', value: c.backgroundImage || firstImage },
        { path: 'theme.colors.backgroundVideo', value: '' },
        { path: 'theme.colors.backgroundIframe', value: '' },
      ])
    } else if (type === 'video') {
      const firstVideo = VIDEO_PRESETS[0].url
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundVideo', value: c.backgroundVideo || firstVideo },
        { path: 'theme.colors.backgroundIframe', value: '' },
      ])
    }
  }

  // Handle Image URL or Upload
  const handleImageUrlChange = (url: string) => {
    const trimmed = url.trim()
    updateConfig([
      { path: 'theme.colors.backgroundImage', value: trimmed },
      { path: 'theme.colors.backgroundType', value: 'image' },
    ])
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose an image file (JPG, PNG, WebP, GIF).')
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      setUploadError('Image is too large. Maximum size is 12 MB.')
      return
    }
    try {
      const imageUrl = await uploadWallpaperFile(file, (config as any).id || 'wallpaper')
      handleImageUrlChange(imageUrl)
      setUploadError('')
    } catch (err: any) {
      setUploadError(err?.message || 'Could not upload image.')
    }
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  // Handle Video URL or Upload
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload an MP4, WebM, or MOV video.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File is too large. Maximum size is 50 MB.')
      return
    }

    setVideoUploadState('uploading')
    setVideoUploadProgress(0)
    setUploadError('')

    try {
      const downloadUrl = await uploadWallpaperFile(file, (config as any).id || 'wallpaper', (pct) => {
        setVideoUploadProgress(pct)
      })
      updateConfig([
        { path: 'theme.colors.backgroundVideo', value: downloadUrl },
        { path: 'theme.colors.backgroundIframe', value: '' },
        { path: 'theme.colors.backgroundType', value: 'video' },
      ])
      setVideoUploadState('done')
      setUploadError('')
    } catch (err: any) {
      setUploadError(err?.message || 'Video upload failed.')
      setVideoUploadState('error')
    }
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const imageUrl = c.backgroundImage || ''
  const videoUrl = c.backgroundVideo || ''
  const tintMatch = String(c.backgroundOverlay || '').match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/i)
  const tintAmount = tintMatch ? Math.round(Number(tintMatch[1]) * 100) : 0

  const colorSwatches = [
    '#FFFFFF', '#090D16', '#0F172A', '#1E1B4B', '#064E3B', '#4C1D95', '#831843', '#7F2AEB', '#EC4899', '#3B82F6'
  ]

  const gradientPresets = [
    { name: 'Sunset', from: '#FF512F', to: '#DD2476' },
    { name: 'Ocean', from: '#2B5876', to: '#4E4376' },
    { name: 'Neon', from: '#8A2387', to: '#E94057' },
    { name: 'Emerald', from: '#0F766E', to: '#047857' },
    { name: 'Royal', from: '#6D28D9', to: '#9333EA' },
    { name: 'Peach', from: '#F43F5E', to: '#FB923C' },
    { name: 'Midnight', from: '#090D16', to: '#1E1B4B' },
    { name: 'Aurora', from: '#00C9FF', to: '#92FE9D' },
  ]

  const categories = ['All', 'Abstract', 'Dark Neon', 'Pastel', 'Nature', 'Cyberpunk', 'Minimalist']
  const filteredWallpapers = wallpaperCategory === 'All'
    ? WALLPAPER_PRESETS
    : WALLPAPER_PRESETS.filter(w => w.category === wallpaperCategory)

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Heading with Back Button */}
      <div className="flex items-center justify-between border-b border-slate-100/90 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-800 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Wallpaper & Background</h2>
            <p className="text-xs font-semibold text-slate-400">Customize solid fills, gradients, mesh blurs, SVG patterns, wallpapers & motion videos</p>
          </div>
        </div>
      </div>

      {/* ── Style Selector Cards (Matching Linktree Pro Specs) ── */}
      <div className="space-y-2.5">
        <p className="text-xs font-extrabold text-slate-600 uppercase tracking-widest">WALLPAPER STYLE</p>
        
        <div className="flex gap-3 overflow-x-auto py-2 px-1 -mx-1 scrollbar-none">
          {[
            {
              type: 'fill',
              label: 'Fill',
              preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/80 shadow-2xs" style={{ backgroundColor: c.background || '#7F2AEB' }} />
            },
            {
              type: 'gradient',
              label: 'Gradient',
              preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/80 shadow-2xs" style={{ background: c.backgroundGradient ? `linear-gradient(135deg, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` : 'linear-gradient(135deg, #7F2AEB, #A78BFA)' }} />
            },
            {
              type: 'blur',
              label: 'Blur',
              preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/80 shadow-2xs bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 blur-[0.5px]" />
            },
            {
              type: 'pattern',
              label: 'Pattern',
              preview: (
                <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/80 bg-indigo-600 relative overflow-hidden shadow-2xs">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 15%, transparent 16%)', backgroundSize: '8px 8px' }} />
                </div>
              )
            },
            {
              type: 'image',
              label: 'Image',
              preview: (
                <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs bg-cover bg-center relative" style={{ backgroundImage: `url(${c.backgroundImage || 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=120&q=80'})` }}>
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900/80 text-white flex items-center justify-center shadow-xs">
                    <ImageIcon size={10} />
                  </div>
                </div>
              )
            },
            {
              type: 'video',
              label: 'Video',
              preview: (
                <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/80 bg-slate-100 flex items-center justify-center shadow-2xs relative">
                  <VideoIcon className="w-5 h-5 text-slate-600" />
                </div>
              )
            }
          ].map(({ type, label, preview }) => {
            const isSelected = activeType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => setBgType(type)}
                className={`flex-shrink-0 p-2 pb-3 rounded-[22px] border-2 bg-white flex flex-col items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10 scale-[1.02]'
                    : 'border-transparent hover:border-slate-300 hover:shadow-2xs'
                }`}
                style={{ width: '92px' }}
              >
                {preview}
                <span className={`text-xs font-black tracking-tight ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main Controls Container ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-6 shadow-sm">

        {/* 1. SOLID FILL MODE */}
        {activeType === 'fill' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">Background Color</span>
                <p className="text-xs text-slate-400 font-semibold">Select a clean solid fill for your profile page</p>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-2xs">
                <input
                  type="color"
                  value={c.background || '#7F2AEB'}
                  onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                />
                <span className="font-mono text-xs font-extrabold text-slate-800 uppercase">{c.background || '#7F2AEB'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {colorSwatches.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => updateConfig('theme.colors.background', hex)}
                  title={hex}
                  className={`w-10 h-10 rounded-2xl border-2 transition-all hover:scale-105 cursor-pointer shadow-2xs ${
                    c.background?.toUpperCase() === hex.toUpperCase() ? 'border-slate-900 scale-105 ring-2 ring-slate-900/10' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2. GRADIENT MODE */}
        {activeType === 'gradient' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Start Color</label>
                <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <input
                    type="color"
                    value={c.backgroundGradient?.from || '#4F46E5'}
                    onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, from: e.target.value })}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 uppercase">{c.backgroundGradient?.from || '#4F46E5'}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">End Color</label>
                <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <input
                    type="color"
                    value={c.backgroundGradient?.to || '#EC4899'}
                    onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, to: e.target.value })}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs font-bold text-slate-800 uppercase">{c.backgroundGradient?.to || '#EC4899'}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Direction</label>
              <select
                value={c.backgroundGradient?.direction || '135deg'}
                onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, direction: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-2xl text-xs font-extrabold bg-white text-slate-800 outline-none"
              >
                <option value="135deg">Diagonal (↘)</option>
                <option value="0deg">Top → Bottom (↓)</option>
                <option value="90deg">Left → Right (→)</option>
                <option value="180deg">Bottom → Top (↑)</option>
                <option value="radial">Radial Circle (⭕)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-2">Curated Gradients</label>
              <div className="grid grid-cols-4 gap-2.5">
                {gradientPresets.map((gp) => (
                  <button
                    key={gp.name}
                    type="button"
                    onClick={() => updateConfig('theme.colors.backgroundGradient', { from: gp.from, to: gp.to, direction: '135deg' })}
                    className="rounded-2xl border border-slate-200 overflow-hidden hover:border-slate-900 transition-all cursor-pointer text-left group shadow-2xs"
                  >
                    <div className="h-10 w-full" style={{ background: `linear-gradient(135deg, ${gp.from}, ${gp.to})` }} />
                    <span className="block text-[10px] font-extrabold text-slate-800 py-1.5 text-center truncate px-1">{gp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. BLUR MODE */}
        {activeType === 'blur' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-1">Glassmorphic Mesh Blurs</h4>
              <p className="text-[11px] text-slate-400 font-semibold mb-3">Vibrant multi-gradient mesh blurs with glassmorphism glow</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {BLUR_MESH_PRESETS.map((blur) => {
                const isSelected = c.backgroundMesh === blur.cssMesh
                return (
                  <button
                    key={blur.id}
                    type="button"
                    onClick={() => updateConfig([
                      { path: 'theme.colors.backgroundMesh', value: blur.cssMesh },
                      { path: 'theme.colors.backgroundType', value: 'blur' },
                    ])}
                    className={`rounded-2xl border-2 p-2.5 transition-all cursor-pointer text-left ${
                      isSelected ? 'border-slate-900 shadow-md scale-[1.02] ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="h-16 rounded-xl w-full mb-2 shadow-inner" style={{ background: blur.cssMesh }} />
                    <span className="text-xs font-extrabold text-slate-900 block truncate">{blur.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* 4. PATTERN MODE */}
        {activeType === 'pattern' && (() => {
          const rawPatternBg = c.background || '#4F46E5'
          const validPatternHex = (typeof rawPatternBg === 'string' && /^#[0-9A-F]{6}$/i.test(rawPatternBg.trim()))
            ? rawPatternBg.trim()
            : '#4F46E5'

          return (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">Pattern Base Color</span>
                  <p className="text-[11px] text-slate-400 font-semibold">Background color behind SVG pattern texture</p>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <input
                    type="color"
                    value={validPatternHex}
                    onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
                    className="w-6 h-6 rounded-lg border-0 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs font-extrabold text-slate-800 uppercase">{validPatternHex}</span>
                </div>
              </div>

              {/* Base Color Swatches */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                {colorSwatches.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => updateConfig('theme.colors.background', hex)}
                    title={hex}
                    className={`w-7 h-7 rounded-xl border-2 transition-transform hover:scale-105 cursor-pointer shadow-2xs ${
                      validPatternHex.toUpperCase() === hex.toUpperCase() ? 'border-slate-900 scale-105 ring-2 ring-slate-900/10' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-900 mb-2">Pattern Textures</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PATTERN_PRESETS.map((pat) => {
                    const isSelected = c.backgroundMesh === pat.cssPattern
                    return (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => updateConfig([
                          { path: 'theme.colors.background', value: validPatternHex },
                          { path: 'theme.colors.backgroundMesh', value: pat.cssPattern },
                          { path: 'theme.colors.backgroundPatternSize', value: pat.backgroundSize },
                          { path: 'theme.colors.backgroundType', value: 'pattern' },
                        ])}
                        className={`rounded-2xl border-2 p-2.5 transition-all cursor-pointer text-center ${
                          isSelected ? 'border-slate-900 shadow-md bg-slate-50 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div
                          className="h-16 rounded-xl w-full mb-2 border border-slate-200/80 shadow-2xs"
                          style={{
                            backgroundColor: validPatternHex,
                            backgroundImage: pat.cssPattern,
                            backgroundSize: pat.backgroundSize,
                          }}
                        />
                        <span className="text-xs font-extrabold text-slate-900 block truncate">{pat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })()}

        {/* 5. IMAGE MODE (Redesigned Wallpaper Gallery + Modern Upload Box) */}
        {activeType === 'image' && (
          <div className="space-y-6">
            {/* Custom Image Drag & Drop Upload + URL Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Upload Custom Wallpaper</span>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => handleImageUrlChange('')}
                    className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear image
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Upload Dropzone Box */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="sm:col-span-1 border-2 border-dashed border-slate-200 hover:border-slate-900 bg-slate-50/80 hover:bg-slate-100/60 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center group"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Upload size={16} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">Browse image file</span>
                  <span className="text-[10px] text-slate-400 font-semibold">JPG, PNG, WebP up to 12MB</span>
                </button>

                {/* Direct Image URL input */}
                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <LinkIcon size={13} className="text-slate-500" />
                    <span>Paste Direct Wallpaper Link</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono bg-white outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Curated Wallpapers Grid */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Curated Wallpaper Library</span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setWallpaperCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex-shrink-0 ${
                      wallpaperCategory === cat
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Wallpaper Grid (3 columns, rounded-2xl, smooth gradient overlay) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {filteredWallpapers.map((wp) => {
                  const isSelected = imageUrl === wp.url
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => handleImageUrlChange(wp.url)}
                      className={`relative h-28 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group shadow-2xs ${
                        isSelected ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10 scale-[1.02]' : 'border-transparent hover:border-slate-400'
                      }`}
                    >
                      <img src={wp.thumbnail} alt={wp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5 text-left">
                        <span className="text-xs font-extrabold text-white block truncate">{wp.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter Effects & Overlay Controls */}
            {imageUrl && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-extrabold text-slate-900">Filter Effect</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[
                    { id: '', label: 'None' },
                    { id: 'grayscale(1)', label: 'Mono' },
                    { id: 'blur(5px)', label: 'Blur' },
                    { id: 'contrast(1.35) saturate(0.65)', label: 'Halftone' },
                  ].map((effect) => (
                    <button
                      key={effect.label}
                      type="button"
                      onClick={() => updateConfig('theme.backgroundFilter', effect.id)}
                      className={`rounded-2xl border px-3 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                        (config.theme.backgroundFilter || '') === effect.id
                          ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {effect.label}
                    </button>
                  ))}
                </div>

                {/* Dark Overlay Tint Slider */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900">Dark Overlay Tint</span>
                    <span className="text-xs font-mono font-extrabold text-slate-500">{tintAmount}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="85"
                    value={tintAmount}
                    onChange={(e) => updateConfig('theme.colors.backgroundOverlay', `rgba(0,0,0,${Number(e.target.value) / 100})`)}
                    className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. VIDEO MODE */}
        {activeType === 'video' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">Custom Video Upload / MP4 Link</span>
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => updateConfig([
                      { path: 'theme.colors.backgroundVideo', value: '' },
                      { path: 'theme.colors.backgroundType', value: 'fill' }
                    ])}
                    className="text-xs font-extrabold text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear video
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => updateConfig([
                    { path: 'theme.colors.backgroundVideo', value: e.target.value.trim() },
                    { path: 'theme.colors.backgroundType', value: 'video' },
                  ])}
                  placeholder="Paste direct MP4/WebM video URL"
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-2xl text-xs font-semibold bg-slate-50 outline-none focus:bg-white focus:border-slate-900"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  onChange={handleVideoFileChange}
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-4 py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-2xl hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-2xs"
                >
                  <Upload size={13} />
                  <span>Upload MP4</span>
                </button>
              </div>

              {videoUploadState === 'uploading' && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs font-extrabold text-purple-700 flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Uploading video ({videoUploadProgress}%)...</span>
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-extrabold text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-200">{uploadError}</p>
              )}
            </div>

            {/* Video Motion Presets Grid */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 block">Motion Video Presets</span>
              <div className="grid grid-cols-2 gap-3">
                {VIDEO_PRESETS.map((vp) => {
                  const isSelected = videoUrl === vp.url
                  return (
                    <button
                      key={vp.id}
                      type="button"
                      onClick={() => updateConfig([
                        { path: 'theme.colors.backgroundVideo', value: vp.url },
                        { path: 'theme.colors.backgroundType', value: 'video' },
                      ])}
                      className={`relative h-28 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group text-left shadow-2xs ${
                        isSelected ? 'border-slate-900 shadow-md ring-2 ring-slate-900/10 scale-[1.02]' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img src={vp.thumbnail} alt={vp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                          <VideoIcon size={15} />
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2.5">
                        <span className="text-xs font-extrabold text-white block truncate">{vp.name}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
