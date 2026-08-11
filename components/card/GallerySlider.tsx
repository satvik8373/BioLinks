'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Image as ImageIcon, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { gsap } from 'gsap'
import MusicSheetModal from '@/components/modals/MusicSheetModal'

interface PhotoItem {
  id?: string
  url: string
  title?: string
  description?: string
}

interface GallerySliderProps {
  title?: string
  photos?: PhotoItem[]
  animClasses?: string
  compact?: boolean
  layout?: 'slider' | 'grid' | 'stack' | 'hero'
  ctaUrl?: string
  ctaLabel?: string
  btnStyle?: React.CSSProperties
}

export default function GallerySlider({
  title,
  photos = [],
  animClasses = '',
  compact = false,
  layout = 'slider',
  ctaUrl,
  ctaLabel,
  btnStyle,
}: GallerySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  const trackRef = useRef<HTMLDivElement>(null)
  const heroImageRef = useRef<HTMLImageElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof document !== 'undefined') {
      const phonePreviewEl = document.getElementById('bio-phone-preview')
      setPortalTarget(phonePreviewEl || document.body)
    }
  }, [])

  const activeIndex = currentIndex >= photos.length ? 0 : currentIndex

  // Smooth GSAP Horizontal Right-to-Left Slide Animation
  useEffect(() => {
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        xPercent: -100 * activeIndex,
        duration: 0.55,
        ease: 'power2.out',
      })
    }
    if (heroImageRef.current) {
      gsap.killTweensOf(heroImageRef.current)
      gsap.fromTo(
        heroImageRef.current,
        { opacity: 0.3, scale: 1.04 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
      )
    }
    if (captionRef.current) {
      gsap.killTweensOf(captionRef.current)
      gsap.fromTo(
        captionRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
      )
    }
  }, [activeIndex])

  // Auto-slide transition every 4 seconds (pause when modal open)
  useEffect(() => {
    if (photos.length <= 1 || isModalOpen) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [photos.length, isModalOpen])

  const openModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsModalOpen(true)
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  const rawRadius = btnStyle?.borderRadius ?? 16
  const frameRadiusPx = typeof rawRadius === 'number' ? `${rawRadius}px` : String(rawRadius || '20px')

  const frameStyle: React.CSSProperties = {
    borderRadius: frameRadiusPx,
    border: btnStyle?.border && btnStyle.border !== 'none' ? btnStyle.border : 'none',
    boxShadow: btnStyle?.boxShadow && btnStyle.boxShadow !== 'none' ? btnStyle.boxShadow : '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
    backgroundColor: btnStyle?.backgroundColor || 'rgba(0, 0, 0, 0.4)',
    backdropFilter: btnStyle?.backdropFilter,
    WebkitBackdropFilter: (btnStyle as any)?.WebkitBackdropFilter,
  }

  if (!photos || photos.length === 0) {
    return (
      <div
        style={frameStyle}
        className={`w-full aspect-video bg-black/10 flex flex-col items-center justify-center p-4 text-center space-y-2 mb-3 ${animClasses}`}
      >
        <ImageIcon className="w-8 h-8 text-white/50" />
        <p className="text-xs font-bold text-white/80">{title || 'Photo Gallery'}</p>
        <p className="text-[10px] text-white/50">No photos uploaded yet</p>
      </div>
    )
  }

  const currentPhoto = photos[activeIndex] || photos[0]

  const renderCtaButton = () => {
    if (!ctaUrl) return null
    return (
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="w-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer select-none bg-black/10 hover:bg-black/20 border-t border-white/10"
        style={{ color: btnStyle?.color || 'currentColor' }}
      >
        <span>{ctaLabel || 'Visit Gallery Link'}</span>
        <ExternalLink className="w-3.5 h-3.5" style={{ color: btnStyle?.color || 'currentColor' }} />
      </a>
    )
  }

  const renderFloatingModal = () => {
    if (!isModalOpen || !mounted || !portalTarget) return null

    return createPortal(
      <MusicSheetModal
        link={{
          type: 'gallery',
          text: title || 'Photo Gallery',
          description: `Gallery · ${photos.length} photo${photos.length === 1 ? '' : 's'}`,
          galleryPhotos: photos,
          url: ctaUrl,
          ctaLabel: ctaLabel,
        }}
        onClose={() => setIsModalOpen(false)}
      />,
      portalTarget
    )
  }

  // ── 1. GRID LAYOUT ──
  if (layout === 'grid') {
    return (
      <div style={frameStyle} className={`w-full mb-3 overflow-hidden flex flex-col ${animClasses}`}>
        <div className={`grid ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 p-2`}>
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              role="button"
              tabIndex={0}
              onClick={openModal}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(e as any) }}
              className="group relative aspect-square overflow-hidden rounded-xl shadow-md border border-white/20 bg-black/20 cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.title || title || 'Photo'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                <p className="text-[10px] font-extrabold text-white truncate leading-tight">
                  {photo.title || `Photo #${idx + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {renderCtaButton()}
        {renderFloatingModal()}
      </div>
    )
  }

  // ── 2. CARD STACK LAYOUT ──
  if (layout === 'stack') {
    return (
      <div style={frameStyle} className={`w-full mb-3 overflow-hidden flex flex-col p-2 ${animClasses}`}>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            setCurrentIndex((prev) => (prev + 1) % photos.length)
            openModal(e)
          }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setCurrentIndex((prev) => (prev + 1) % photos.length); openModal(e as any) } }}
          className={`relative w-full cursor-pointer select-none ${compact ? 'h-[130px]' : 'aspect-video'}`}
        >
          {photos.slice(0, 3).map((_, i) => {
            const actualIdx = (activeIndex + i) % photos.length
            const photoItem = photos[actualIdx]
            const zIndex = 30 - i * 10
            const scale = 1 - i * 0.05
            const translateY = i * 8

            return (
              <div
                key={photoItem.id || actualIdx}
                style={{
                  zIndex,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity: 1 - i * 0.2,
                  borderRadius: frameRadiusPx,
                }}
                className="absolute inset-0 overflow-hidden bg-black/40 border border-white/20 transition-all duration-500 ease-out"
              >
                <img
                  src={photoItem.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {i === 0 && (
                  <div className="absolute bottom-2.5 left-3 right-3 text-left">
                    <p className="font-extrabold text-white text-xs truncate drop-shadow-md">
                      {photoItem.title || title || 'Photo Deck'}
                    </p>
                    <p className="text-[9px] text-white/70">Tap to cycle photos ({activeIndex + 1}/{photos.length}) →</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {renderCtaButton()}
        {renderFloatingModal()}
      </div>
    )
  }

  // ── 3. HERO SHOWCASE LAYOUT ──
  if (layout === 'hero') {
    return (
      <div style={frameStyle} className={`w-full mb-3 overflow-hidden flex flex-col ${animClasses}`}>
        {/* Featured Hero Photo */}
        <div
          role="button"
          tabIndex={0}
          onClick={openModal}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(e as any) }}
          className={`relative w-full overflow-hidden bg-black/40 cursor-pointer ${compact ? 'h-[130px]' : 'aspect-video'}`}
        >
          <img
            ref={heroImageRef}
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title || title || 'Hero image'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          <div ref={captionRef} className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
            <p className="font-extrabold text-white text-xs leading-tight drop-shadow-md truncate">
              {currentPhoto.title || title || 'Featured Showcase'}
            </p>
            {currentPhoto.description && (
              <p className="text-[10px] text-white/80 line-clamp-1 font-medium mt-0.5">
                {currentPhoto.description}
              </p>
            )}
          </div>
        </div>

        {/* Thumbnail Selector Row */}
        {photos.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 no-scrollbar select-none">
            {photos.map((p, idx) => (
              <button
                key={p.id || idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`w-10 h-10 overflow-hidden rounded-xl flex-shrink-0 border-2 transition-all cursor-pointer ${
                  idx === activeIndex
                    ? 'border-white scale-105 shadow-md ring-2 ring-purple-500/50'
                    : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {renderCtaButton()}
        {renderFloatingModal()}
      </div>
    )
  }

  // ── 4. DEFAULT SLIDER (HORIZONTAL GSAP TRACK RIGHT-TO-LEFT) LAYOUT ──
  return (
    <div style={frameStyle} className={`w-full mb-3 overflow-hidden flex flex-col ${animClasses}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={openModal}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(e as any) }}
        className={`group relative w-full overflow-hidden bg-black/40 cursor-pointer ${
          compact ? 'h-[130px]' : 'aspect-video'
        }`}
      >
        {/* Horizontal Sliding Track (GSAP animated right-to-left) */}
        <div
          ref={trackRef}
          className="flex w-full h-full"
        >
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              className="relative w-full h-full min-w-full flex-shrink-0 overflow-hidden"
            >
              <img
                src={photo.url}
                alt={photo.title || title || `Slide ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Left/Right Arrows for Desktop */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Info & Title */}
        <div ref={captionRef} className="absolute bottom-3 left-3 right-3 z-10 text-left pointer-events-none pr-8 pb-3">
          {(currentPhoto.title || title) && (
            <p className="font-extrabold text-white text-xs leading-tight drop-shadow-md truncate">
              {currentPhoto.title || title}
            </p>
          )}
          {currentPhoto.description && (
            <p className="text-[10px] text-white/80 line-clamp-1 font-medium mt-0.5 drop-shadow-xs">
              {currentPhoto.description}
            </p>
          )}
        </div>

        {/* Bottom Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 select-none">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setCurrentIndex(idx)
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === activeIndex
                    ? 'w-4 h-1.5 bg-white shadow-md'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                title={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {renderCtaButton()}
      {renderFloatingModal()}
    </div>
  )
}
