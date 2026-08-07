'use client'

import React from 'react'
import { X, ExternalLink, Share2 } from 'lucide-react'
import { LinkItem } from '@/lib/types/link'
import { ServiceIcon, SpotifyIcon } from '@/components/icons/ServiceIcons'

interface MusicSheetModalProps {
  link: LinkItem | any
  onClose: () => void
}

function getSpotifyEmbedUrl(url?: string): string | null {
  if (!url) return null
  const clean = url.trim()
  if (clean.includes('open.spotify.com/embed/')) {
    return clean.includes('utm_source=generator') ? clean : `${clean}?utm_source=generator`
  }

  // Handle spotify URLs with query parameters like ?si=... or intl-xx/ prefixes
  const match = clean.match(/(?:open\.spotify\.com|spotify\.com)\/(?:[a-zA-Z0-9_-]+\/)?(track|album|playlist|artist|show|episode)\/([a-zA-Z0-9]+)/)
  if (match && match[1] && match[2]) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`
  }

  return null
}

function ensureAbsoluteUrl(url?: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (!trimmed) return '#'
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return `https://${trimmed}`
}

export default function MusicSheetModal({ link, onClose }: MusicSheetModalProps) {
  if (!link) return null

  const spotifyEmbed = getSpotifyEmbedUrl(link?.url)

  const services = (link.streamingServices && link.streamingServices.length > 0)
    ? link.streamingServices.filter((s: any) => s.isVisible)
    : [
      { id: 'apple-music', name: 'Apple Music', platformKey: 'apple-music', url: link.url },
      { id: 'youtube', name: 'YouTube', platformKey: 'youtube', url: link.url },
      { id: 'spotify', name: 'Spotify', platformKey: 'spotify', url: link.url },
      { id: 'soundcloud', name: 'SoundCloud', platformKey: 'soundcloud', url: link.url },
      { id: 'tidal', name: 'TIDAL', platformKey: 'tidal', url: link.url },
    ]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: link.text, url: link.url }).catch(() => { })
    } else {
      navigator.clipboard.writeText(link.url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-[94%] max-w-[380px] sm:max-w-md my-auto max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 cursor-default text-slate-900 font-sans border border-slate-100/90"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="min-w-0 flex-1 text-center pr-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-tight">
              {link.text || 'Music Track'}
            </h3>
            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
              {link.description || 'Song • Stream everywhere'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto flex-1 min-h-0 space-y-3.5">
          {/* Spotify Audio Embed Player (Official Spotify Snippet) */}
          {spotifyEmbed && (
            <iframe
              data-testid="embed-iframe"
              src={spotifyEmbed}
              width="100%"
              height="352"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full h-[352px] min-h-[352px] border-0 block flex-shrink-0"
              style={{ borderRadius: '12px', minHeight: '352px', overflow: 'hidden' }}
            />
          )}

          {/* Streaming Platforms List */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider px-0.5">Listen on</h4>
            <div className="space-y-1.5">
              {services.map((service: any) => (
                <a
                  key={service.id}
                  href={ensureAbsoluteUrl(service.url || link.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 transition-all group cursor-pointer text-decoration-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <ServiceIcon name={service.platformKey || service.id} size={18} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-none">{service.name}</span>
                  </div>
                  <ExternalLink size={15} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 flex-shrink-0">
          <a
            href={ensureAbsoluteUrl(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-10 px-4 bg-black hover:bg-slate-900 text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-decoration-none"
          >
            <SpotifyIcon size={18} />
            <span className="truncate">Open in Spotify</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            title="Share link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            title="Close sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
