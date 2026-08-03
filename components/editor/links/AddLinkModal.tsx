'use client'

import React, { useState } from 'react'
import { 
  X, Search, Sparkles, Share2, ShoppingBag, Video, Phone, Calendar, Type, 
  Globe, Music, MessageCircle, DollarSign, ArrowRight, Check, Plus
} from 'lucide-react'
import { 
  LinkItem, LINK_CATEGORIES, LINK_OPTIONS, QUICK_TILES, LinkOption, detectLinkTypeFromUrl 
} from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'

interface AddLinkModalProps {
  onClose: () => void
  onAdd: (preset: Partial<LinkItem>) => void
}

const CategoryIconMap: Record<string, React.ElementType> = {
  Sparkles,
  Share2,
  ShoppingBag,
  Video,
  Phone,
  Calendar,
  Type,
}

const TileIconMap: Record<string, React.ElementType> = {
  Globe,
  Type,
  ShoppingBag,
  Video,
  Music,
  MessageCircle,
  DollarSign,
  Calendar,
}

export default function AddLinkModal({ onClose, onAdd }: AddLinkModalProps) {
  const [activeCategory, setActiveCategory] = useState('suggested')
  const [searchQuery, setSearchQuery] = useState('')

  // Smart Auto-Detector based on pasted URL in search input
  const detectedPreset = searchQuery.trim().startsWith('http://') || 
    searchQuery.trim().startsWith('https://') || 
    searchQuery.trim().includes('.') 
    ? detectLinkTypeFromUrl(searchQuery.trim()) 
    : null

  const allOptions: LinkOption[] = Object.values(LINK_OPTIONS).flat()
  const options: LinkOption[] = searchQuery.trim()
    ? allOptions.filter(o =>
        o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (LINK_OPTIONS[activeCategory] || [])

  const handleSelectOption = (option: LinkOption) => {
    onAdd({
      type: option.type,
      text: option.defaultText,
      url: option.defaultUrl || '',
      icon: option.icon,
      platform: option.platform,
      layout: option.defaultLayout || 'classic',
      ...option.defaultFields,
    })
  }

  const handleAddDetectedUrl = () => {
    if (detectedPreset) {
      onAdd(detectedPreset)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="clay-container w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Add Feature or Link
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Select a category or paste any URL below</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & URL Input Bar */}
        <div className="px-6 py-3.5 bg-gray-50/70 border-b border-gray-100">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Paste any link URL (YouTube, Spotify, TikTok, WhatsApp) or search..."
              className="w-full bg-white border border-gray-200 focus:border-purple-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-xs outline-none transition-all"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Smart URL Auto-Detected Card */}
          {detectedPreset && (
            <div className="mt-3 bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center p-2">
                  <ServiceIcon iconId={detectedPreset.icon || 'website'} size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-purple-200 text-purple-800 rounded-md capitalize">
                      Auto Detected: {detectedPreset.type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-purple-950 mt-0.5">{detectedPreset.text}</p>
                  <p className="text-xs text-purple-600 truncate max-w-sm">{detectedPreset.url}</p>
                </div>
              </div>
              <button
                onClick={handleAddDetectedUrl}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
              >
                <span>Add Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden min-h-[350px]">

          {/* Left Categories Sidebar */}
          {!searchQuery && (
            <div className="w-48 border-r border-gray-100 overflow-y-auto py-2 bg-gray-50/40">
              {LINK_CATEGORIES.map(cat => {
                const IconComp = CategoryIconMap[cat.iconName] || Sparkles
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'bg-purple-100/70 border-r-4 border-purple-600 text-purple-900 font-bold'
                        : 'text-gray-600 hover:bg-gray-100/70 hover:text-gray-900 font-medium'
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                    <span className="text-xs">{cat.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Main Options Grid / List */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* Quick Tiles — shown under Suggested category when no search */}
            {activeCategory === 'suggested' && !searchQuery && (
              <div className="mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </p>
                <div className="grid grid-cols-4 gap-2.5">
                  {QUICK_TILES.map(tile => {
                    const TileIcon = TileIconMap[tile.iconName] || Globe
                    return (
                      <button
                        key={tile.id}
                        onClick={() => onAdd({ type: tile.type, text: tile.text, icon: tile.iconKey, url: '' })}
                        className="flex flex-col items-center justify-center p-3 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl transition-all shadow-2xs group text-center"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center mb-1.5 transition-colors p-2">
                          <ServiceIcon iconId={tile.iconKey} size={18} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-950">
                          {tile.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Section Header Label */}
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              {searchQuery ? 'Search Results' : LINK_CATEGORIES.find(c => c.id === activeCategory)?.description}
            </p>

            {/* Options List */}
            <div className="space-y-2">
              {options.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-sm">No matching features found</p>
                  <p className="text-xs mt-1 text-gray-400">Try pasting a direct link in the top input</p>
                </div>
              )}

              {options.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt)}
                  className="flex items-center justify-between p-3.5 bg-white hover:bg-purple-50/50 border border-gray-100 hover:border-purple-200 rounded-xl cursor-pointer transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-purple-100 text-gray-700 group-hover:text-purple-700 flex items-center justify-center p-2 transition-colors flex-shrink-0">
                      <ServiceIcon iconId={opt.icon} size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-purple-950">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-gray-400 group-hover:text-gray-600 mt-0.5">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-100 group-hover:bg-purple-600 text-gray-700 group-hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
