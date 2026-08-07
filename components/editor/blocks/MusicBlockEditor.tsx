'use client'

import React, { useState, useEffect } from 'react'
import {
  Info,
  X,
  ArrowUpDown,
  RefreshCw,
  Plus,
  ChevronRight,
  Check,
  Music as MusicIcon,
  ExternalLink,
  Pencil,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import { BlockEditorContainer, BlockRadioOption } from './BlockEditorContainer'

interface StreamingServiceItem {
  id: string
  name: string
  platformKey: string
  url?: string
  isVisible: boolean
}

const DEFAULT_MUSIC_SERVICES: StreamingServiceItem[] = [
  { id: 'spotify', name: 'Spotify', platformKey: 'spotify', url: '', isVisible: true },
  { id: 'apple-music', name: 'Apple Music', platformKey: 'apple-music', url: '', isVisible: true },
  { id: 'youtube', name: 'YouTube', platformKey: 'youtube', url: '', isVisible: true },
  { id: 'youtube-music', name: 'YouTube Music', platformKey: 'youtube-music', url: '', isVisible: true },
  { id: 'soundcloud', name: 'SoundCloud', platformKey: 'soundcloud', url: '', isVisible: true },
  { id: 'tidal', name: 'TIDAL', platformKey: 'tidal', url: '', isVisible: true },
  { id: 'itunes', name: 'iTunes', platformKey: 'itunes', url: '', isVisible: true },
]

function extractSongQueryFromUrl(url: string): string {
  if (!url) return ''
  try {
    const cleanUrl = url.split('?')[0]
    const parts = cleanUrl.split('/')
    const lastPart = parts[parts.length - 1] || ''
    const secondLastPart = parts[parts.length - 2] || ''

    if (lastPart.match(/^[a-zA-Z0-9]{15,}$/)) {
      if (secondLastPart && secondLastPart !== 'track' && secondLastPart !== 'album') {
        return secondLastPart.replace(/[-_]/g, ' ')
      }
      return 'song'
    }

    return lastPart.replace(/[-_]/g, ' ')
  } catch {
    return ''
  }
}

function autoSyncSongPlatforms(url: string, existingServices: StreamingServiceItem[]): StreamingServiceItem[] {
  if (!url) return existingServices

  const songQuery = extractSongQueryFromUrl(url) || 'song'
  const encodedQuery = encodeURIComponent(songQuery)

  return existingServices.map((service) => {
    let serviceUrl = service.url || ''
    let isVisible = service.isVisible

    if (!serviceUrl || serviceUrl === '#' || serviceUrl === url) {
      if (service.id === 'spotify') {
        serviceUrl = url.includes('spotify.com') ? url : `https://open.spotify.com/search/${encodedQuery}`
        isVisible = true
      } else if (service.id === 'apple-music') {
        serviceUrl = url.includes('music.apple.com') ? url : `https://music.apple.com/us/search?term=${encodedQuery}`
        isVisible = true
      } else if (service.id === 'youtube') {
        serviceUrl = url.includes('youtube.com') || url.includes('youtu.be') ? url : `https://www.youtube.com/results?search_query=${encodedQuery}`
        isVisible = true
      } else if (service.id === 'youtube-music') {
        serviceUrl = `https://music.youtube.com/search?q=${encodedQuery}`
        isVisible = true
      } else if (service.id === 'soundcloud') {
        serviceUrl = `https://soundcloud.com/search?q=${encodedQuery}`
        isVisible = true
      } else if (service.id === 'tidal') {
        serviceUrl = `https://listen.tidal.com/search?q=${encodedQuery}`
        isVisible = true
      } else if (service.id === 'itunes') {
        serviceUrl = `https://itunes.apple.com/search?term=${encodedQuery}`
        isVisible = true
      }
    }

    return {
      ...service,
      url: serviceUrl || '',
      isVisible,
    }
  })
}

interface MusicBlockEditorProps {
  link: LinkItem
  onUpdate: (updated: LinkItem) => void
  onClose?: () => void
}

export default function MusicBlockEditor({ link, onUpdate, onClose }: MusicBlockEditorProps) {
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [tempServiceUrl, setTempServiceUrl] = useState('')
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  const currentOption = link.musicClickOption || 'display_services_preview'

  const baseServices: StreamingServiceItem[] =
    link.streamingServices && link.streamingServices.length > 0
      ? link.streamingServices
      : DEFAULT_MUSIC_SERVICES

  const services = autoSyncSongPlatforms(link.url || '', baseServices)

  useEffect(() => {
    if (link.url && (!link.streamingServices || link.streamingServices.length === 0)) {
      const synced = autoSyncSongPlatforms(link.url, DEFAULT_MUSIC_SERVICES)
      onUpdate({ ...link, streamingServices: synced })
    }
  }, [link.url])

  const handleManualSync = () => {
    const synced = autoSyncSongPlatforms(link.url || '', services)
    onUpdate({ ...link, streamingServices: synced })
    setSyncStatus('Song platforms synced!')
    setTimeout(() => setSyncStatus(null), 2500)
  }

  const handleOptionChange = (option: LinkItem['musicClickOption']) => {
    onUpdate({
      ...link,
      musicClickOption: option,
    })
  }

  const handleToggleServiceVisibility = (serviceId: string) => {
    const updatedServices = services.map((s) =>
      s.id === serviceId ? { ...s, isVisible: !s.isVisible } : s
    )
    onUpdate({ ...link, streamingServices: updatedServices })
  }

  const handleSaveServiceUrl = (serviceId: string) => {
    const updatedServices = services.map((s) =>
      s.id === serviceId
        ? { ...s, url: tempServiceUrl.trim(), isVisible: Boolean(tempServiceUrl.trim()) }
        : s
    )
    onUpdate({ ...link, streamingServices: updatedServices })
    setEditingServiceId(null)
    setTempServiceUrl('')
  }

  const handleAddService = () => {
    const newService: StreamingServiceItem = {
      id: `custom-${Date.now()}`,
      name: 'Custom Platform',
      platformKey: 'music',
      url: link.url || '',
      isVisible: true,
    }
    const updatedServices = [...services, newService]
    onUpdate({ ...link, streamingServices: updatedServices })
  }

  return (
    <BlockEditorContainer
      title="Music link"
      description="Show visitors everywhere they can listen to your music, or link to it directly."
      actionLink={{
        text: 'Connect affiliate programs to earn commission from your links.',
        href: '#affiliate',
      }}
    >
      {/* Radio Choices ("When a visitor clicks:") */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-extrabold text-slate-900">When a visitor clicks:</h4>

        <div className="space-y-2.5">
          <BlockRadioOption
            selected={currentOption === 'display_services_preview'}
            onClick={() => handleOptionChange('display_services_preview')}
            title="Display available streaming services and Spotify audio preview"
          />

          <BlockRadioOption
            selected={currentOption === 'direct_url'}
            onClick={() => handleOptionChange('direct_url')}
            title="Go directly to URL (Tap to open direct link)"
          />
        </div>
      </div>

      {/* Streaming Services List (Linktree Official Match) */}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-gray-900">Streaming services</h4>
          <p className="text-xs text-gray-500 font-medium">
            Visitors may see a different order depending on their location or preferences.
          </p>
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              className="text-xs font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-700" />
              <span>Reorder</span>
            </button>
            <button
              type="button"
              onClick={handleManualSync}
              className="text-xs font-bold text-gray-700 hover:text-gray-900 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-700" />
              <span>Sync</span>
            </button>
            {syncStatus && (
              <span className="text-xs font-bold text-emerald-600 animate-pulse ml-auto">
                {syncStatus}
              </span>
            )}
          </div>
        </div>

        {/* Platform List Rows */}
        <div className="space-y-1 pt-1">
          {services.map((service) => {
            const isEditing = editingServiceId === service.id
            return (
              <div key={service.id} className="space-y-2">
                <div
                  onClick={() => handleToggleServiceVisibility(service.id)}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-100/70 transition-all cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <ServiceIcon name={service.platformKey} size={18} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{service.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingServiceId(isEditing ? null : service.id)
                        setTempServiceUrl(service.url || '')
                      }}
                      className="p-1 text-gray-400 hover:text-gray-700 transition-colors mr-1 cursor-pointer"
                      title="Edit link"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-xs font-medium ${service.isVisible ? 'text-gray-700' : 'text-gray-400'}`}>
                      {service.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </div>

                {isEditing && (
                  <div className="p-3 bg-gray-50/80 rounded-xl space-y-2 animate-in fade-in duration-150 border border-gray-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700">Edit {service.name} URL</span>
                      <button
                        type="button"
                        onClick={() => setEditingServiceId(null)}
                        className="text-[11px] font-bold text-gray-400 hover:text-gray-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={tempServiceUrl}
                        onChange={(e) => setTempServiceUrl(e.target.value)}
                        placeholder={`https://... (${service.name} URL)`}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-900 outline-none focus:border-purple-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveServiceUrl(service.id)}
                        className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={handleAddService}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200/80 text-gray-800 font-bold text-xs rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add a service</span>
        </button>
      </div>
    </BlockEditorContainer>
  )
}
