'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowUpDown,
  RefreshCw,
  Plus,
  ChevronRight,
  Pencil,
} from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import { ServiceIcon } from '@/components/icons/ServiceIcons'
import { BlockEditorContainer, BlockFieldLabel, BlockRadioOption } from './BlockEditorContainer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface StreamingServiceItem {
  id: string
  name: string
  platformKey: string
  url?: string
  isVisible: boolean
}

const DEFAULT_MUSIC_SERVICES: StreamingServiceItem[] = [
  { id: 'spotify',       name: 'Spotify',       platformKey: 'spotify',       url: '', isVisible: true },
  { id: 'apple-music',   name: 'Apple Music',   platformKey: 'apple-music',   url: '', isVisible: true },
  { id: 'youtube',       name: 'YouTube',       platformKey: 'youtube',       url: '', isVisible: true },
  { id: 'youtube-music', name: 'YouTube Music', platformKey: 'youtube-music', url: '', isVisible: true },
  { id: 'soundcloud',    name: 'SoundCloud',    platformKey: 'soundcloud',    url: '', isVisible: true },
  { id: 'tidal',         name: 'TIDAL',         platformKey: 'tidal',         url: '', isVisible: true },
  { id: 'itunes',        name: 'iTunes',        platformKey: 'itunes',        url: '', isVisible: true },
]

function extractSongQuery(url: string): string {
  if (!url) return ''
  try {
    const clean = url.split('?')[0]
    const parts = clean.split('/')
    const last = parts[parts.length - 1] || ''
    const prev = parts[parts.length - 2] || ''
    if (last.match(/^[a-zA-Z0-9]{15,}$/)) {
      return prev && !['track', 'album'].includes(prev)
        ? prev.replace(/[-_]/g, ' ')
        : 'song'
    }
    return last.replace(/[-_]/g, ' ')
  } catch {
    return ''
  }
}

function autoSyncPlatforms(
  url: string,
  existing: StreamingServiceItem[]
): StreamingServiceItem[] {
  if (!url) return existing
  const q = encodeURIComponent(extractSongQuery(url) || 'song')

  return existing.map((s) => {
    let serviceUrl = s.url || ''
    let visible = s.isVisible

    if (!serviceUrl || serviceUrl === '#' || serviceUrl === url) {
      if (s.id === 'spotify') {
        serviceUrl = url.includes('spotify.com') ? url : `https://open.spotify.com/search/${q}`
        visible = true
      } else if (s.id === 'apple-music') {
        serviceUrl = url.includes('music.apple.com') ? url : `https://music.apple.com/us/search?term=${q}`
        visible = true
      } else if (s.id === 'youtube') {
        serviceUrl = url.includes('youtube.com') || url.includes('youtu.be') ? url : `https://www.youtube.com/results?search_query=${q}`
        visible = true
      } else if (s.id === 'youtube-music') {
        serviceUrl = `https://music.youtube.com/search?q=${q}`
        visible = true
      } else if (s.id === 'soundcloud') {
        serviceUrl = `https://soundcloud.com/search?q=${q}`
        visible = true
      } else if (s.id === 'tidal') {
        serviceUrl = `https://listen.tidal.com/search?q=${q}`
        visible = true
      } else if (s.id === 'itunes') {
        serviceUrl = `https://itunes.apple.com/search?term=${q}`
        visible = true
      }
    }

    return { ...s, url: serviceUrl, isVisible: visible }
  })
}

interface MusicBlockEditorProps {
  link: LinkItem
  updateLink: (id: string, field: string, value: any) => void
}

export default function MusicBlockEditor({ link, updateLink }: MusicBlockEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tempUrl, setTempUrl]     = useState('')
  const [syncMsg, setSyncMsg]     = useState<string | null>(null)

  const currentOption = link.musicClickOption || 'display_services_preview'

  const baseServices =
    link.streamingServices && link.streamingServices.length > 0
      ? link.streamingServices
      : DEFAULT_MUSIC_SERVICES

  const services = autoSyncPlatforms(link.url || '', baseServices)

  const handleSync = () => {
    const synced = autoSyncPlatforms(link.url || '', services)
    updateLink(link.id, 'streamingServices', synced)
    setSyncMsg('Song platforms synced!')
    setTimeout(() => setSyncMsg(null), 2500)
  }

  const toggleVisibility = (id: string) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    )
    updateLink(link.id, 'streamingServices', updated)
  }

  const saveServiceUrl = (id: string) => {
    const updated = services.map((s) =>
      s.id === id
        ? { ...s, url: tempUrl.trim(), isVisible: Boolean(tempUrl.trim()) }
        : s
    )
    updateLink(link.id, 'streamingServices', updated)
    setEditingId(null)
    setTempUrl('')
  }

  const addService = () => {
    const newService: StreamingServiceItem = {
      id: `custom-${Date.now()}`,
      name: 'Custom Platform',
      platformKey: 'music',
      url: link.url || '',
      isVisible: true,
    }
    updateLink(link.id, 'streamingServices', [...services, newService])
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
      <div className="space-y-5">
        {/* Click behaviour */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            When a visitor clicks:
          </p>
          <div className="space-y-1">
            <BlockRadioOption
              selected={currentOption === 'display_services_preview'}
              onClick={() => updateLink(link.id, 'musicClickOption', 'display_services_preview')}
              title="Display available streaming services and Spotify audio preview"
              name={`musicOption-${link.id}`}
            />
            <BlockRadioOption
              selected={currentOption === 'direct_url'}
              onClick={() => updateLink(link.id, 'musicClickOption', 'direct_url')}
              title="Go directly to URL"
              name={`musicOption-${link.id}`}
            />
          </div>
        </div>

        {/* Streaming services */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="space-y-1">
            <BlockFieldLabel
              label="Streaming Services"
              hint="Visitors may see a different order depending on their location or preferences."
            />
            <div className="flex items-center gap-4 pt-0.5">
              <button
                type="button"
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                Reorder
              </button>
              <button
                type="button"
                onClick={handleSync}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sync
              </button>
              {syncMsg && (
                <span className="text-xs font-bold text-emerald-600 animate-pulse ml-auto">
                  {syncMsg}
                </span>
              )}
            </div>
          </div>

          {/* Platform rows */}
          <div className="space-y-1">
            {services.map((service) => {
              const isEditing = editingId === service.id
              return (
                <div key={service.id} className="space-y-2">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleVisibility(service.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVisibility(service.id) } }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer group select-none text-left bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-clay-sm">
                        <ServiceIcon name={service.platformKey} size={18} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {service.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingId(isEditing ? null : service.id)
                          setTempUrl(service.url || '')
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 transition-colors mr-1 cursor-pointer bg-transparent border-0"
                        title="Edit link"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <span
                        className={`text-xs font-medium ${
                          service.isVisible ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {service.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">
                          Edit {service.name} URL
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-[11px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            type="url"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder={`https://... (${service.name} URL)`}
                          />
                        </div>
                        <Button
                          size="sm"
                          onClick={() => saveServiceUrl(service.id)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addService}
            className="w-full rounded-full"
          >
            <Plus className="w-4 h-4" />
            Add a service
          </Button>
        </div>
      </div>
    </BlockEditorContainer>
  )
}
