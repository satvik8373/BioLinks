'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Image as ImageIcon, Share2, X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { gsap } from 'gsap'

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
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  const backdropRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const mainImageRef = useRef<HTMLImageElement>(null)
  const photoListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (currentIndex >= photos.length && photos.length > 0) {
      setCurrentIndex(0)
    }
  }, [photos.length, currentIndex])

  // GSAP Image Transition on Slide Change
  useEffect(() => {
    if (mainImageRef.current) {
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0.6, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  }, [currentIndex])

  // Auto-slide transition every 4 seconds — pauses when modal is open
  useEffect(() => {
    if (photos.length <= 1 || isModalOpen) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
    }, 4000)
    return () => clearInterval(timer)
  }, [photos.length, isModalOpen])

  // GSAP Open Modal Animation
  useEffect(() => {
    if (isModalOpen && backdropRef.current && modalRef.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      tl.fromTo(
        modalRef.current,
        { y: '100%', scale: 0.95, opacity: 0 },
        { y: '0%', scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.05)' },
        '-=0.2'
      )

      if (photoListRef.current?.children) {
        tl.fromTo(
          Array.from(photoListRef.current.children),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
          '-=0.15'
        )
      }
    }
  }, [isModalOpen])

  const openModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsModalOpen(true)
  }

  const closeModal = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (backdropRef.current && modalRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setIsModalOpen(false),
      })
      tl.to(modalRef.current, { y: '100%', scale: 0.95, opacity: 0, duration: 0.28, ease: 'power3.in' })
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.15')
    } else {
      setIsModalOpen(false)
    }
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
  let cleanRadius = 16
  if (typeof rawRadius === 'number') {
    cleanRadius = Math.min(rawRadius, 20)
  } else if (typeof rawRadius === 'string') {
    const parsed = parseInt(rawRadius, 10)
    cleanRadius = isNaN(parsed) ? 16 : Math.min(parsed, 20)
  }
  const frameRadiusPx = `${cleanRadius}px`

  const frameStyle: React.CSSProperties = {
    borderRadius: frameRadiusPx,
    border: btnStyle?.border ?? '1px solid rgba(255, 255, 255, 0.35)',
    boxShadow: btnStyle?.boxShadow !== 'none' ? btnStyle?.boxShadow : '0 10px 25px -5px rgba(0, 0, 0, 0.25)',
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

  const currentPhoto = photos[currentIndex] || photos[0]

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof window === 'undefined') return
    if (navigator.share) {
      navigator.share({ title: title || 'Gallery', url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const renderCtaButton = () => {
    if (!ctaUrl) return null
    return (
      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="w-full mt-2 py-3 px-4 bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/50 group/cta select-none"
      >
        <span>{ctaLabel || 'Visit Gallery Link'}</span>
        <ExternalLink className="w-3.5 h-3.5 text-purple-600 group-hover/cta:translate-x-0.5 transition-transform" />
      </a>
    )
  }

  const renderFloatingModal = () => {
    if (!isModalOpen || !mounted) return null

    const phonePreviewEl = typeof document !== 'undefined' ? document.getElementById('bio-phone-preview') : null
    const targetEl = phonePreviewEl || (typeof document !== 'undefined' ? document.body : null)
    if (!targetEl) return null

    const isMockup = Boolean(phonePreviewEl)

    return createPortal(
      <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans select-none ${isMockup ? 'absolute' : ''}`}>
        {/* Backdrop */}
        <div
          ref={backdropRef}
          onClick={closeModal}
          className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        />

        {/* Floating Sheet Drawer Modal */}
        <div
          ref={modalRef}
          className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh] border border-slate-200"
        >
          {/* Top Drag Handle */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 flex-shrink-0" />

          {/* Modal Header */}
          <div className="pt-2 pb-3 px-5 text-center border-b border-slate-100 flex-shrink-0 bg-white shadow-2xs">
            <h3 className="font-extrabold text-sm text-slate-900 leading-tight truncate">
              {title || 'Gallery'}
            </h3>
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Gallery · {photos.length} photo{photos.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          {/* Scrollable Photos List */}
          <div ref={photoListRef} className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/60 no-scrollbar touch-pan-y">
            {photos.map((photo, i) => (
              <div key={photo.id || i} className="space-y-1.5">
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm bg-slate-900 border border-slate-200/80 relative group">
                  <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold rounded-full">
                    {i + 1} / {photos.length}
                  </span>
                </div>
                {(photo.title || photo.description) && (
                  <div className="px-1 text-left">
                    {photo.title && <h4 className="font-extrabold text-xs text-slate-900">{photo.title}</h4>}
                    {photo.description && <p className="text-[10px] text-slate-500 mt-0.5">{photo.description}</p>}
                  </div>
                )}
              </div>
            ))}
            {renderCtaButton()}
          </div>

          {/* Floating Actions */}
          <div className="absolute bottom-3.5 right-3.5 z-50 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200/80 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              title={copied ? 'Copied link!' : 'Share gallery'}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xl border border-slate-200/80 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              title="Close gallery"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>,
      targetEl
    )
  }

  // ── 1. GRID LAYOUT ──
  if (layout === 'grid') {
    return (
      <div className={`w-full mb-3 space-y-2 ${animClasses}`}>
        {title && (
          <p className="font-extrabold text-xs text-white/90 text-left px-1 drop-shadow-xs">
            {title}
          </p>
        )}
        <div className={`grid ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={openModal}
              style={{ borderRadius: frameRadiusPx }}
              className="group relative aspect-square overflow-hidden shadow-md border border-white/20 bg-black/20 cursor-pointer"
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
      <div className={`w-full mb-3 space-y-2 ${animClasses}`}>
        {title && (
          <p className="font-extrabold text-xs text-white/90 text-left px-1 drop-shadow-xs">
            {title}
          </p>
        )}
        <div
          onClick={(e) => {
            // Cycle stack slide first, open lightbox on double tap or button
            setCurrentIndex((prev) => (prev + 1) % photos.length)
            openModal(e)
          }}
          className={`relative w-full cursor-pointer select-none ${compact ? 'h-[130px]' : 'aspect-video'}`}
        >
          {photos.slice(0, 3).map((_, i) => {
            const actualIdx = (currentIndex + i) % photos.length
            const photoItem = photos[actualIdx]
            const zIndex = 30 - i * 10
            const scale = 1 - i * 0.05
            const translateY = i * 8

            return (
              <div
                key={photoItem.id || actualIdx}
                style={{
                  ...frameStyle,
                  zIndex,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity: 1 - i * 0.2,
                }}
                className="absolute inset-0 overflow-hidden bg-black/40 transition-all duration-500 ease-out"
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
                    <p className="text-[9px] text-white/70">Tap to cycle photos ({currentIndex + 1}/{photos.length}) →</p>
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
      <div className={`w-full mb-3 space-y-2 ${animClasses}`}>
        {/* Featured Hero Photo */}
        <div
          onClick={openModal}
          style={frameStyle}
          className={`relative w-full overflow-hidden bg-black/40 cursor-pointer ${compact ? 'h-[130px]' : 'aspect-video'}`}
        >
          <img
            key={currentPhoto.url}
            src={currentPhoto.url}
            alt={currentPhoto.title || title || 'Hero image'}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-2.5 left-3 right-3 text-left pointer-events-none">
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
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
            {photos.map((p, idx) => (
              <button
                key={p.id || idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                style={{ borderRadius: frameRadiusPx }}
                className={`w-10 h-10 overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  idx === currentIndex
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

  // ── 4. DEFAULT SLIDER (CAROUSEL) LAYOUT ──
  return (
    <div className={`w-full mb-3 space-y-1.5 ${animClasses}`}>
      {title && (
        <p className="font-extrabold text-xs text-white/90 text-left px-1 drop-shadow-xs">
          {title}
        </p>
      )}
      <div
        onClick={openModal}
        style={frameStyle}
        className={`group relative w-full overflow-hidden bg-black/40 cursor-pointer ${
          compact ? 'h-[130px]' : 'aspect-video'
        }`}
      >
        <img
          ref={mainImageRef}
          key={currentPhoto.url + '_' + currentIndex}
          src={currentPhoto.url}
          alt={currentPhoto.title || title || 'Gallery image'}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 pointer-events-none" />

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
        <div className="absolute bottom-3 left-3 right-3 z-10 text-left pointer-events-none pr-8 pb-3">
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
                  idx === currentIndex
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
