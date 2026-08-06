'use client'

import React, { useState, useRef } from 'react'
import { ArrowLeft, Image as ImageIcon, Video, Upload, Trash2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { uploadWallpaperFile } from '@/lib/storage'

interface Props {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

export default function BackgroundPanel({ config, updateConfig, onBack }: Props) {
  const c = config.theme.colors
  const activeType = c.backgroundType || (
    c.backgroundVideo || c.backgroundIframe ? 'video' :
    c.backgroundImage ? 'image' :
    c.backgroundMesh ? (c.backgroundMesh.includes('radial-gradient(circle') ? 'pattern' : 'blur') :
    c.backgroundGradient ? 'gradient' : 'fill'
  )

  const setBgType = (type: string) => {
    const base = [
      { path: 'theme.colors.backgroundType', value: type },
      { path: 'theme.colors.backgroundGradient', value: null },
      { path: 'theme.colors.backgroundMesh', value: '' },
      { path: 'theme.colors.backgroundImage', value: '' },
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
    ]
    if (type === 'gradient') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundGradient', value: c.backgroundGradient || { from: c.background || '#4F46E5', to: c.accent || '#EC4899', direction: '135deg' } },
      ])
    } else if (type === 'blur') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundMesh', value: 'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(109,40,217,0.8) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 90%, rgba(124,58,237,0.7) 0%, transparent 55%), linear-gradient(160deg, #1E1035 0%, #2D1B69 100%)' },
      ])
    } else if (type === 'pattern') {
      updateConfig([
        ...base,
        { path: 'theme.colors.backgroundMesh', value: 'radial-gradient(circle, rgba(255,255,255,0.18) 15%, transparent 16%)' },
      ])
    } else {
      updateConfig(base)
    }
  }

  const [videoUploadState, setVideoUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [videoUploadProgress, setVideoUploadProgress] = useState(0)
  const [videoUploadError, setVideoUploadError] = useState('')
  const videoInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const currentVideoUrl = c.backgroundVideo || ''

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setVideoUploadError('Please upload an MP4, WebM, or MOV video file.')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      setVideoUploadError('File is too large. Maximum size is 50 MB.')
      return
    }

    setVideoUploadState('uploading')
    setVideoUploadProgress(0)
    setVideoUploadError('')

    const cardId = (config as any).id || 'wallpaper'

    try {
      const downloadUrl = await uploadWallpaperFile(file, cardId, (pct) => {
        setVideoUploadProgress(pct)
      })
      updateConfig([
        { path: 'theme.colors.backgroundVideo', value: downloadUrl },
        { path: 'theme.colors.backgroundIframe', value: '' },
        { path: 'theme.colors.backgroundImage', value: '' },
        { path: 'theme.colors.backgroundType', value: 'video' },
      ])
      setVideoUploadState('done')
      setVideoUploadError('')
    } catch (err: any) {
      const msg = err?.message || 'Upload failed. Please try again.'
      setVideoUploadError(msg)
      setVideoUploadState('error')
      console.error('❌ Video upload error:', err)
    }

    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleClearVideo = () => {
    updateConfig([
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
      { path: 'theme.colors.backgroundType', value: 'fill' },
    ])
    setVideoUploadState('idle')
    setVideoUploadProgress(0)
    setVideoUploadError('')
  }

  const handleImageUrlChange = (url: string) => {
    const trimmed = url.trim()
    updateConfig([
      { path: 'theme.colors.backgroundImage', value: trimmed },
      { path: 'theme.colors.backgroundVideo', value: '' },
      { path: 'theme.colors.backgroundIframe', value: '' },
      { path: 'theme.colors.backgroundType', value: trimmed ? 'image' : 'fill' },
    ])
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setVideoUploadError('Please choose an image file (JPG, PNG, WebP, or GIF).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setVideoUploadError('Image is too large. Maximum size is 10 MB.')
      return
    }
    try {
      const imageUrl = await uploadWallpaperFile(file, (config as any).id || 'wallpaper')
      handleImageUrlChange(imageUrl)
      setVideoUploadError('')
    } catch (err: any) {
      setVideoUploadError(err?.message || 'Could not upload the image.')
    }
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const imageUrl = c.backgroundImage || ''
  const tintMatch = String(c.backgroundOverlay || '').match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/i)
  const tintAmount = tintMatch ? Math.round(Number(tintMatch[1]) * 100) : 0

  const colorSwatches = [
    '#FFFFFF', '#090D16', '#0F172A', '#1E1B4B', '#064E3B', '#4C1D95', '#831843', '#7B3200', '#7F2AEB'
  ]
  const gradientPresets = [
    { name: 'Sunset', from: '#FF512F', to: '#DD2476' },
    { name: 'Ocean', from: '#2B5876', to: '#4E4376' },
    { name: 'Neon', from: '#8A2387', to: '#E94057' },
    { name: 'Emerald', from: '#0F766E', to: '#047857' },
    { name: 'Royal', from: '#6D28D9', to: '#9333EA' },
    { name: 'Peach', from: '#F43F5E', to: '#FB923C' },
  ]

  return (
    <div className="space-y-6">
      {/* Heading with Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-slate-800" />
        </button>
        <h2 className="text-xl font-bold text-slate-900">Wallpaper</h2>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-600 mb-3">Wallpaper style</p>
      </div>

      {/* Style selector matching Linktree */}
      <div className="flex gap-3.5 overflow-x-auto py-2 px-1 -mx-1 scrollbar-none">
        {[
          {
            type: 'fill',
            label: 'Fill',
            preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 shadow-xs" style={{ backgroundColor: c.background || '#7F2AEB' }} />
          },
          {
            type: 'gradient',
            label: 'Gradient',
            preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 shadow-xs" style={{ background: c.backgroundGradient ? `linear-gradient(135deg, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` : 'linear-gradient(135deg, #7F2AEB, #A78BFA)' }} />
          },
          {
            type: 'blur',
            label: 'Blur',
            preview: <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 shadow-xs bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 blur-[0.5px]" />
          },
          {
            type: 'pattern',
            label: 'Pattern',
            preview: (
              <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 bg-indigo-600 relative overflow-hidden shadow-xs">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 15%, transparent 16%)', backgroundSize: '6px 6px' }} />
              </div>
            )
          },
          {
            type: 'image',
            label: 'Image',
            preview: (
              <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 overflow-hidden shadow-xs bg-cover bg-center relative" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=120&q=80)' }}>
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-slate-900/80 text-white flex items-center justify-center">
                  <ImageIcon size={10} />
                </div>
              </div>
            )
          },
          {
            type: 'video',
            label: 'Video',
            preview: (
              <div className="w-[72px] h-[52px] rounded-xl border border-slate-200/60 bg-slate-100 flex items-center justify-center shadow-xs relative">
                <Video className="w-5 h-5 text-slate-500" />
              </div>
            )
          }
        ].map(({ type, label, preview }) => (
          <button
            key={type}
            onClick={() => setBgType(type)}
            className={`flex-shrink-0 p-1.5 pb-2.5 rounded-[20px] border-2 bg-white flex flex-col items-center gap-2 transition-all cursor-pointer ${
              activeType === type
                ? 'border-slate-850 shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                : 'border-transparent hover:border-slate-200'
            }`}
            style={{ width: '88px' }}
          >
            {preview}
            <span className={`text-[11px] font-bold tracking-tight ${activeType === type ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
          </button>
        ))}
      </div>

      {/* Controls for each mode */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">

        {/* Flat Color / Pattern */}
        {(activeType === 'fill' || activeType === 'pattern') && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-700">Background color</span>
              <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-xs">
                <input
                  type="color"
                  value={c.background || '#7F2AEB'}
                  onChange={(e) => updateConfig('theme.colors.background', e.target.value)}
                  className="w-6 h-6 rounded-md border-0 cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-md"
                />
                <span className="font-mono text-sm font-bold text-slate-700 uppercase">{c.background || '#7F2AEB'}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {colorSwatches.map((hex) => (
                <button
                  key={hex}
                  onClick={() => updateConfig('theme.colors.background', hex)}
                  title={hex}
                  className={`w-9 h-9 rounded-xl border-2 transition-transform hover:scale-105 cursor-pointer ${c.background?.toUpperCase() === hex.toUpperCase() ? 'border-slate-800 scale-105' : 'border-slate-200'}`}
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
                <input
                  type="color"
                  value={c.backgroundGradient?.from || '#4F46E5'}
                  onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, from: e.target.value })}
                  className="w-full h-11 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">End Color</label>
                <input
                  type="color"
                  value={c.backgroundGradient?.to || '#EC4899'}
                  onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, to: e.target.value })}
                  className="w-full h-11 rounded-xl border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Direction</label>
              <select
                value={c.backgroundGradient?.direction || '135deg'}
                onChange={(e) => updateConfig('theme.colors.backgroundGradient', { ...c.backgroundGradient, direction: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-white"
              >
                <option value="0deg">Top → Bottom</option>
                <option value="90deg">Left → Right</option>
                <option value="135deg">Diagonal ↘</option>
                <option value="180deg">Bottom → Top</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Presets</label>
              <div className="grid grid-cols-3 gap-2">
                {gradientPresets.map((gp) => (
                  <button
                    key={gp.name}
                    onClick={() => updateConfig('theme.colors.backgroundGradient', { from: gp.from, to: gp.to, direction: '135deg' })}
                    className="rounded-xl border border-slate-200 overflow-hidden hover:border-slate-400 transition-all cursor-pointer"
                  >
                    <div className="h-8 w-full" style={{ background: `linear-gradient(135deg, ${gp.from}, ${gp.to})` }} />
                    <span className="block text-[11px] font-semibold text-slate-700 py-1 text-center">{gp.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mesh / Blur */}
        {activeType === 'blur' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800">Mesh Blur Gradient</label>
            <textarea
              rows={3}
              value={c.backgroundMesh || ''}
              onChange={(e) => updateConfig('theme.colors.backgroundMesh', e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-50 focus:bg-white"
              placeholder="radial-gradient(ellipse ...)"
            />
            <p className="text-xs text-slate-500">Provide multiple CSS radial gradient stops layered to form a custom mesh.</p>
          </div>
        )}

        {/* Image */}
        {activeType === 'image' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800">Wallpaper Image Link</label>
              {imageUrl && (
                <button onClick={() => handleImageUrlChange('')} className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer">
                  Clear
                </button>
              )}
            </div>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm font-mono bg-slate-50 focus:bg-white transition-colors"
              placeholder="https://example.com/image.jpg"
            />

            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageFileChange}
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              Upload Image File
            </button>
          </div>
        )}

        {/* Video */}
        {activeType === 'video' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-800">Background Video</label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              className="hidden"
              onChange={handleVideoFileChange}
            />

            {currentVideoUrl ? (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs font-bold text-slate-800 truncate">Video Active</span>
                  </div>
                  <button
                    onClick={handleClearVideo}
                    className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => videoInputRef.current?.click()}
                disabled={videoUploadState === 'uploading'}
                className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-slate-400 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {videoUploadState === 'uploading' ? (
                  <>
                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                    Uploading... {videoUploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-slate-500" />
                    Upload MP4 / WebM Video
                  </>
                )}
              </button>
            )}

            {videoUploadError && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{videoUploadError}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
