'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ExternalLink, Share2, Image as ImageIcon, Film, ShoppingBag, Music, Link2, Copy, Check, Eye } from 'lucide-react'
import { gsap } from 'gsap'
import { LinkItem } from '@/lib/types/link'
import { ServiceIcon, SpotifyIcon, YouTubeIcon, AppleMusicIcon, SoundCloudIcon } from '@/components/icons/ServiceIcons'

interface SheetModalProps {
  link: LinkItem | any
  onClose: () => void
}

function getSpotifyEmbedUrl(url?: string): string | null {
  if (!url) return null
  const clean = url.trim()
  if (clean.includes('open.spotify.com/embed/')) {
    return clean.includes('utm_source=generator') ? clean : `${clean}?utm_source=generator`
  }

  const match = clean.match(/(?:open\.spotify\.com|spotify\.com)\/(?:[a-zA-Z0-9_-]+\/)?(track|album|playlist|artist|show|episode)\/([a-zA-Z0-9]+)/)
  if (match && match[1] && match[2]) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`
  }

  return null
}

function getVideoEmbedUrl(url?: string): string | null {
  if (!url) return null
  const clean = url.trim()
  
  // YouTube watch / shorts / share link
  const ytMatch = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
  }

  // Vimeo
  const vimeoMatch = clean.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  }

  return null
}

function ensureAbsoluteUrl(url?: string): string {
  if (!url) return '#'
  const trimmed = url.trim()
  if (!trimmed) return '#'
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed
  }
  return `https://${trimmed}`
}

export default function MusicSheetModal({ link, onClose }: SheetModalProps) {
  const [copied, setCopied] = useState(false)

  const backdropRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Determine item type
  const isGallery = link?.type === 'gallery' || Boolean(link?.galleryPhotos?.length || link?.photos?.length)
  const isVideo = link?.type === 'video' || Boolean(getVideoEmbedUrl(link?.url || link?.embedUrl))
  const isShop = link?.type === 'shop' || Boolean(link?.price)
  const isMusic = link?.type === 'music' || Boolean(link?.streamingServices?.length || getSpotifyEmbedUrl(link?.url))

  // Extract photos for gallery
  const photos = link?.galleryPhotos || link?.photos || []

  // Extract video embed for video
  const videoEmbedUrl = getVideoEmbedUrl(link?.url || link?.embedUrl || link?.videoUrl)

  // Extract spotify embed for music
  const spotifyEmbed = getSpotifyEmbedUrl(link?.url || link?.embedUrl)

  // Extract streaming services for music
  const services = (link?.streamingServices && link?.streamingServices.length > 0)
    ? link.streamingServices.filter((s: any) => s.isVisible !== false)
    : [
      { id: 'spotify', name: 'Spotify', platformKey: 'spotify', url: link?.url },
      { id: 'apple-music', name: 'Apple Music', platformKey: 'apple-music', url: link?.url },
      { id: 'youtube', name: 'YouTube', platformKey: 'youtube', url: link?.url },
      { id: 'youtube-music', name: 'YouTube Music', platformKey: 'youtube-music', url: link?.url },
      { id: 'soundcloud', name: 'SoundCloud', platformKey: 'soundcloud', url: link?.url },
      { id: 'tidal', name: 'TIDAL', platformKey: 'tidal', url: link?.url },
    ]

  // GSAP Smooth Enter Animation
  useEffect(() => {
    if (!link) return
    if (backdropRef.current && modalRef.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      tl.fromTo(
        modalRef.current,
        { y: '100%', scale: 0.94, opacity: 0 },
        { y: '0%', scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.15'
      )
      if (contentRef.current?.children) {
        tl.fromTo(
          Array.from(contentRef.current.children),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out' },
          '-=0.2'
        )
      }
    }
  }, [link])

  // GSAP Smooth Exit Animation
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (backdropRef.current && modalRef.current) {
      const tl = gsap.timeline({
        onComplete: () => onClose(),
      })
      tl.to(modalRef.current, { y: '100%', scale: 0.95, opacity: 0, duration: 0.26, ease: 'power3.in' })
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15')
    } else {
      onClose()
    }
  }

  const handleShare = () => {
    if (!link) return
    const targetUrl = link.url || (typeof window !== 'undefined' ? window.location.href : '')
    if (navigator.share) {
      navigator.share({ title: link.text || link.title || 'Linktree Item', url: targetUrl }).catch(() => {})
    } else if (targetUrl) {
      navigator.clipboard?.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Bail out safely if link is null (e.g. during initial render before state is set)
  if (!link) return null

  // Header Title & Subtitle
  const modalTitle = link.text || link.title || (isGallery ? 'Photo Gallery' : isVideo ? 'Video' : isShop ? 'Product' : 'Link Details')
  const modalSubtitle = link.description || (
    isGallery ? `Gallery · ${photos.length} photo${photos.length === 1 ? '' : 's'}` :
    isMusic ? 'Song · Stream everywhere' :
    isVideo ? 'Video · Watch now' :
    isShop ? `${link.currency || '$'}${link.price || '0.00'}` :
    'Tap link to open'
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans select-none overflow-hidden">
      {/* Backdrop */}
      <button
        ref={backdropRef}
        type="button"
        onClick={handleClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-xs cursor-pointer opacity-0 border-0 p-0 w-full h-full"
      />

      {/* Floating Sheet Modal Container */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-3xl w-[94%] max-w-[420px] sm:max-w-md my-auto max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-900 border border-slate-100/90 z-10 translate-y-full opacity-0"
      >
        {/* Top Drag Pill Handle */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 flex-shrink-0" />

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="min-w-0 flex-1 text-center pr-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 truncate leading-tight">
              {modalTitle}
            </h3>
            <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
              {modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer flex-shrink-0 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content depending on item type */}
        <div ref={contentRef} className="p-4 overflow-y-auto flex-1 min-h-0 space-y-4 bg-slate-50/50">

          {/* 1. GALLERY CONTENT */}
          {isGallery && (
            <div className="space-y-3.5">
              {photos.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto opacity-50" />
                  <p className="text-xs font-bold">No photos in this gallery</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {photos.map((photo: any, index: number) => (
                    <div
                      key={photo.id || index}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs group"
                    >
                      <div className="relative w-full bg-slate-100 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.url}
                          alt={photo.title || `Photo ${index + 1}`}
                          className="w-full h-auto object-cover block group-hover:scale-105 transition-transform duration-300"
                          style={{ maxHeight: '320px', objectFit: 'cover', width: '100%' }}
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {index + 1} / {photos.length}
                        </div>
                      </div>
                      {(photo.title || photo.description) && (
                        <div className="p-3 bg-white space-y-0.5">
                          {photo.title && (
                            <h4 className="text-xs font-extrabold text-slate-900">{photo.title}</h4>
                          )}
                          {photo.description && (
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{photo.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. VIDEO CONTENT */}
          {isVideo && (
            <div className="space-y-3">
              {videoEmbedUrl ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm bg-black border border-slate-200">
                  <iframe
                    src={videoEmbedUrl}
                    title={modalTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : link.thumbnail ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-sm bg-black">
                  <Image src={link.thumbnail} alt={modalTitle} unoptimized fill sizes="(max-width: 640px) 100vw, 420px" className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Film className="w-12 h-12 text-white opacity-80" />
                  </div>
                </div>
              ) : null}

              {link.description && (
                <p className="text-xs text-slate-600 font-medium leading-relaxed px-1">
                  {link.description}
                </p>
              )}
            </div>
          )}

          {/* 3. MUSIC CONTENT */}
          {isMusic && (
            <div className="space-y-3.5">
              {/* Spotify Audio Embed Player */}
              {spotifyEmbed && (
                <iframe
                  title="Music Embed Player"
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
                  style={{ borderRadius: '14px', minHeight: '352px', overflow: 'hidden' }}
                />
              )}

              {/* Streaming Platforms List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider px-0.5">Listen on</h4>
                <div className="space-y-1.5">
                  {services.map((service: any) => (
                    <a
                      key={service.id}
                      href={ensureAbsoluteUrl(service.url || link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80 transition-all group cursor-pointer text-decoration-none"
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
          )}

          {/* 4. SHOP / PRODUCT CONTENT */}
          {isShop && (
            <div className="space-y-3">
              {link.thumbnail && (
                <div className="relative w-full aspect-square max-h-[260px] rounded-2xl overflow-hidden border border-slate-200 bg-white">
                  <Image src={link.thumbnail} alt={modalTitle} unoptimized fill sizes="260px" className="object-cover" />
                </div>
              )}
              <div className="flex items-center justify-between px-1">
                <span className="text-lg font-black text-slate-900">
                  {link.currency || '$'}{link.price || '0.00'}
                </span>
                {link.stockStatus && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
                    {link.stockStatus}
                  </span>
                )}
              </div>
              {link.description && (
                <p className="text-xs text-slate-600 leading-relaxed">{link.description}</p>
              )}
            </div>
          )}

          {/* 5. GENERIC / DEFAULT CONTENT */}
          {!isGallery && !isVideo && !isMusic && !isShop && (
            <div className="space-y-3 text-center py-4">
              {link.thumbnail ? (
                <div className="relative w-20 h-20 rounded-2xl mx-auto overflow-hidden border border-slate-200 shadow-sm">
                  <Image src={link.thumbnail} alt={modalTitle} unoptimized fill sizes="80px" className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100">
                  <Link2 className="w-8 h-8" />
                </div>
              )}
              <h4 className="text-sm font-extrabold text-slate-900">{modalTitle}</h4>
              {link.description && (
                <p className="text-xs text-slate-500 font-medium px-4">{link.description}</p>
              )}
            </div>
          )}

        </div>

        {/* Fixed Bottom Actions */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 flex-shrink-0">
          {(link.url || link.ctaUrl) && (
            <a
              href={ensureAbsoluteUrl(link.ctaUrl || link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-10 px-4 bg-slate-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-decoration-none"
            >
              {isMusic ? <SpotifyIcon size={18} /> : isGallery ? <ImageIcon size={16} /> : <ExternalLink size={16} />}
              <span className="truncate">
                {link.ctaLabel || (isMusic ? 'Open in Spotify' : isGallery ? 'Visit Gallery Link' : isVideo ? 'Watch Video' : isShop ? 'Buy Now' : 'Open Link')}
              </span>
            </a>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 relative"
            title="Share link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Aliases for domain clarity
export { MusicSheetModal as ItemSheetModal, MusicSheetModal as LinkSheetModal, MusicSheetModal as GenericSheetModal }
