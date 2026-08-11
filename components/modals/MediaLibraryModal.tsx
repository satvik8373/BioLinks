'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import {
  X,
  Upload,
  Image as ImageIcon,
  Search,
  Trash2,
  Check,
  Sparkles,
  FolderOpen,
  User,
  Layers
} from 'lucide-react'
import {
  getUserMediaLibrary,
  saveMediaToLibrary,
  removeFromMediaLibrary,
  PRESET_LIBRARY,
  getCurrentUserId,
  MediaItem,
} from '@/lib/mediaLibrary'
import { uploadImageToFirebase } from '@/lib/firebaseStorage'

interface MediaLibraryModalProps {
  onClose: () => void
  onSelectImage: (url: string) => void
  title?: string
}

export default function MediaLibraryModal({
  onClose,
  onSelectImage,
  title = 'Media Library & Asset Upload',
}: MediaLibraryModalProps) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'my_uploads' | 'presets' | 'upload'>('my_uploads')
  const [userMedia, setUserMedia] = useState<MediaItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    const uid = getCurrentUserId()
    setCurrentUserId(uid)
    setUserMedia(getUserMediaLibrary(uid))
  }, [])

  const handleFileSelect = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, GIF)')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('File size must be under 15MB')
      return
    }

    setIsUploading(true)

    // Process upload and save single deduplicated entry
    const reader = new FileReader()
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string

      try {
        const cloudUrl = await uploadImageToFirebase(file, 'user_uploads')
        const finalUrl = cloudUrl || dataUrl
        if (finalUrl) {
          const updated = saveMediaToLibrary(finalUrl, file.name, currentUserId)
          setUserMedia(updated)
          setSelectedUrl(finalUrl)
          setActiveTab('my_uploads')
        }
      } catch (err) {
        if (dataUrl) {
          const updated = saveMediaToLibrary(dataUrl, file.name, currentUserId)
          setUserMedia(updated)
          setSelectedUrl(dataUrl)
          setActiveTab('my_uploads')
        }
      } finally {
        setIsUploading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteItem = (e: React.MouseEvent, idOrUrl: string) => {
    e.stopPropagation()
    const updated = removeFromMediaLibrary(idOrUrl, currentUserId)
    setUserMedia(updated)
    if (selectedUrl === idOrUrl) setSelectedUrl(null)
  }

  const currentDisplayItems = activeTab === 'my_uploads' ? userMedia : PRESET_LIBRARY

  const filteredMedia = currentDisplayItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleConfirmSelect = () => {
    if (selectedUrl) {
      onSelectImage(selectedUrl)
      onClose()
    }
  }

  if (!mounted) return null

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">Your personal cloud uploads & design assets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation & Search Bar */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('my_uploads')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'my_uploads'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-violet-600" />
                  My Uploads ({userMedia.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  Stock Presets
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  Upload New
                </span>
              </button>
            </div>

            {/* Search Filter */}
            {activeTab !== 'upload' && (
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-violet-500 focus:bg-white transition-all"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab !== 'upload' && (
            <div>
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.url
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedUrl(item.url)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedUrl(item.url) } }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-violet-600 ring-4 ring-violet-500/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <Image
                          src={item.url}
                          alt={item.name}
                          unoptimized
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Selected Indicator Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 text-white">
                          <div className="flex justify-end">
                            {activeTab === 'my_uploads' && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteItem(e, item.id)}
                                className="p-1.5 rounded-lg bg-black/50 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                                title="Remove from your uploads"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <span className="text-[10px] font-bold truncate drop-shadow-md">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-600">
                    {activeTab === 'my_uploads'
                      ? 'No personal uploads found yet'
                      : 'No stock presets found'}
                  </p>
                  {activeTab === 'my_uploads' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-4 py-2 bg-violet-600 text-white text-xs font-extrabold rounded-xl hover:bg-violet-700 transition-colors cursor-pointer"
                    >
                      Upload Your First Image
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="py-6 space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
                }}
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
                className="w-full py-12 border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-3xl flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-violet-50/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-extrabold text-slate-800">
                    {isUploading ? 'Uploading to your account library...' : 'Click to Upload Image'}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Images will be stored separately in your personal media library
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {selectedUrl ? 'Image selected' : 'Select an image to use'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedUrl}
              onClick={handleConfirmSelect}
              className={`px-5 py-2 text-xs font-extrabold text-white rounded-xl shadow-xs transition-all cursor-pointer ${
                selectedUrl
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              Use Selected Image
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
