'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'

// ─── Public config ────────────────────────────────────────────────────────────
export interface SplashScreenConfig {
  enabled?: boolean
  template?: 'framer-preload' | 'load-screen'
  tagline?: string
  frequency?: 'always' | 'session'
}

interface SplashProps {
  splash?: SplashScreenConfig
  profile?: { title?: string; avatar?: string; handle?: string }
  onFinish?: () => void
  isPreview?: boolean
}

// ─── Template 1: Framer Preload ───────────────────────────────────────────────
// White bg · per-character stagger entry · cyan+lime blobs · curtain slide-up exit
function FramerPreloadSplash({
  profile,
  tagline,
  rootRef,
  blobCRef,
  blobLRef,
  charsRef,
  subRef,
}: {
  profile: SplashProps['profile']
  tagline: string
  rootRef: React.RefObject<HTMLDivElement>
  blobCRef: React.RefObject<HTMLDivElement>
  blobLRef: React.RefObject<HTMLDivElement>
  charsRef: React.MutableRefObject<HTMLSpanElement[]>
  subRef: React.RefObject<HTMLParagraphElement>
}) {
  const rawTitle = profile?.title || profile?.handle || 'Welcome'
  const title    = rawTitle.toUpperCase()
  const subtitle = tagline || (profile?.handle ? `@${profile.handle}` : '')
  const chars    = title.split('')

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        overflow: 'hidden', backgroundColor: '#ffffff',
        pointerEvents: 'auto', touchAction: 'none', userSelect: 'none',
      }}
    >
      {/* Cyan blob — bottom-left */}
      <div ref={blobCRef} style={{
        position: 'absolute', bottom: '-300px', left: '-300px',
        width: '640px', height: '640px',
        background: 'radial-gradient(60% 91% at 49.6% 52.3%, rgb(89,187,213) 0%, rgba(10,10,10,0) 100%)',
        filter: 'blur(57px)', WebkitFilter: 'blur(57px)', pointerEvents: 'none',
      }} />

      {/* Lime blob — top-right */}
      <div ref={blobLRef} style={{
        position: 'absolute', top: '-300px', right: '-300px',
        width: '640px', height: '640px',
        background: 'radial-gradient(60% 91% at 49.6% 52.3%, rgb(206,255,113) 0%, rgba(10,10,10,0) 100%)',
        filter: 'blur(57px)', WebkitFilter: 'blur(57px)', pointerEvents: 'none',
      }} />

      {/* Text block — centred at 48% */}
      <div style={{
        position: 'absolute', top: '48%', left: 0, right: 0,
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <h1 style={{
          fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
          fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 700,
          color: 'rgb(23,23,23)', letterSpacing: '-0.02em', lineHeight: 1,
          margin: 0, textAlign: 'center',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => { if (el) charsRef.current[i] = el }}
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
                willChange: 'transform, opacity, filter',
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {subtitle && (
          <p ref={subRef} style={{
            fontFamily: '"Geist Mono", "Courier New", monospace',
            fontSize: '16px', fontWeight: 500,
            letterSpacing: '-0.7px', lineHeight: '1.2em',
            color: 'rgb(23,23,23)', margin: 0, textAlign: 'center',
            willChange: 'transform, opacity',
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Template 2: Load Screen ──────────────────────────────────────────────────
// 5 full-height vertical strips (default color: rgb(255,47,0))
// Collapse from center outward in staggered waves, revealing the page beneath
function LoadScreenSplash({
  rootRef,
  stripsRef,
}: {
  rootRef: React.RefObject<HTMLDivElement>
  stripsRef: React.MutableRefObject<HTMLDivElement[]>
}) {
  // 5 strips at 10%, 30%, 50%, 70%, 90% from left — each 20% wide
  const POSITIONS = ['10%', '30%', '50%', '70%', '90%']
  const COLOR = 'rgb(255, 47, 0)'

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        overflow: 'hidden', pointerEvents: 'auto',
        touchAction: 'none', userSelect: 'none',
      }}
    >
      {POSITIONS.map((left, i) => (
        <div
          key={i}
          ref={(el) => { if (el) stripsRef.current[i] = el }}
          style={{
            position: 'absolute',
            top: '-20px',
            bottom: 0,
            left: `calc(${left} - 10%)`,  // each strip is 20% wide, centred on position
            width: '20%',
            backgroundColor: COLOR,
            // Left-edge divider line matching Framer's border spec
            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.2)',
            transformOrigin: 'top center',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WelcomeSplashScreen({
  splash,
  profile,
  onFinish,
  isPreview = false,
}: SplashProps) {
  const enabled   = splash?.enabled   ?? false
  const template  = splash?.template  ?? 'framer-preload'
  const tagline   = splash?.tagline   ?? ''
  const frequency = splash?.frequency ?? 'always'

  // Refs for Framer Preload
  const fpRootRef  = useRef<HTMLDivElement>(null)
  const blobCRef   = useRef<HTMLDivElement>(null)
  const blobLRef   = useRef<HTMLDivElement>(null)
  const charsRef   = useRef<HTMLSpanElement[]>([])
  const subRef     = useRef<HTMLParagraphElement>(null)

  // Refs for Load Screen
  const lsRootRef  = useRef<HTMLDivElement>(null)
  const stripsRef  = useRef<HTMLDivElement[]>([])

  const tlRef = useRef<gsap.core.Timeline | null>(null)

  const onFinishRef = useRef(onFinish)
  useEffect(() => { onFinishRef.current = onFinish }, [onFinish])

  // SSR-safe portal target
  const [portalTarget] = useState<HTMLElement | null>(() => typeof window !== 'undefined' ? document.body : null)

  // Session gate
  const shouldShow = enabled && (isPreview || frequency !== 'session' || (() => {
    if (typeof window === 'undefined') return true
    const key = `splash_seen_${profile?.handle || 'bio'}`
    if (sessionStorage.getItem(key)) {
      onFinishRef.current?.()
      return false
    }
    sessionStorage.setItem(key, 'true')
    return true
  })())

  const mounted = Boolean(shouldShow)

  // ── GSAP timeline — fires after DOM is ready ──────────────────────────────
  useEffect(() => {
    if (!mounted) return

    tlRef.current?.kill()
    charsRef.current = charsRef.current.filter(Boolean)

    // ── Template 1: Framer Preload ──────────────────────────────────────
    if (template === 'framer-preload') {
      const root   = fpRootRef.current
      const blobC  = blobCRef.current
      const blobL  = blobLRef.current
      const chars  = charsRef.current
      if (!root || !blobC || !blobL) return

      const tl = gsap.timeline({
        onComplete: () => {
          if (root) root.style.pointerEvents = 'none'
          onFinishRef.current?.()
        },
      })
      tlRef.current = tl

      // ── Timing budget: 4.4s total (matches load-screen) ──────────────
      // Entry:  0.0 – 1.5s  (chars + blobs)
      // Hold:   1.5 – 3.3s  (1.8s visible)
      // Exit:   3.3 – 4.4s  (1.1s curtain slide-up)

      // Initial states
      gsap.set(root,  { yPercent: 0 })
      gsap.set(blobC, { x: 1200, opacity: 0 })
      gsap.set(blobL, { x: -1200, opacity: 0 })
      gsap.set(chars, { opacity: 0, filter: 'blur(10px)', scaleX: 3, scaleY: 3, skewY: 3, x: 200 })
      if (subRef.current) gsap.set(subRef.current, { opacity: 0, y: 40, scale: 0.95 })

      // Blobs enter from opposite sides
      tl.to(blobC, { x: 0, opacity: 1, duration: 2.2, ease: 'elastic.out(1, 0.75)' }, 0)
      tl.to(blobL, { x: 0, opacity: 1, duration: 2.2, ease: 'elastic.out(1, 0.75)' }, 0)

      // Chars stagger entry — blur+scale+skew+x spring
      tl.to(chars, {
        opacity: 1, filter: 'blur(0px)', scaleX: 1, scaleY: 1, skewY: 0, x: 0,
        duration: 0.7, ease: 'power3.out', stagger: 0.04,
      }, 0.05)

      // Subtitle springs in
      if (subRef.current) {
        tl.to(subRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'back.out(1.4)' }, 0.55)
      }

      // Hold — 1.8s so total entry+hold = 3.3s
      tl.to({}, { duration: 1.8 })

      // Exit: whole screen slides up — 1.1s to reach 4.4s total
      tl.to(root, { yPercent: -100, duration: 1.1, ease: 'power3.inOut' })
    }

    // ── Template 2: Load Screen ─────────────────────────────────────────
    if (template === 'load-screen') {
      const root   = lsRootRef.current
      const strips = stripsRef.current.filter(Boolean)
      if (!root || strips.length === 0) return

      const tl = gsap.timeline({
        onComplete: () => {
          if (root) root.style.pointerEvents = 'none'
          onFinishRef.current?.()
        },
      })
      tlRef.current = tl

      // ── Timing budget: 4.4s total (matches framer-preload) ──────────────
      // Framer source: 1s hold → centre 2s → inner pair 200ms later 1s → outer 200ms later 1s
      // Total: 1.0 + 2.0 + 0.2 + (1.0 overlapping) + 0.2 + (1.0 overlapping) ≈ 4.4s

      // Initial state: all strips at full height
      gsap.set(strips, { scaleY: 1, transformOrigin: 'top center' })

      // Hold 1.0s — screen fully covered, matches Framer's 1000ms delay
      tl.to({}, { duration: 1.0 })

      // Wave 1 — centre strip collapses, 2s ease [1,0,0.56,1] → custom-power
      tl.to(strips[2], {
        scaleY: 0.01, duration: 2.0,
        ease: 'power4.inOut',
      })

      // Wave 2 — inner neighbours, 200ms after wave 1 starts, 1s duration
      tl.to([strips[1], strips[3]], {
        scaleY: 0.01, duration: 1.0,
        ease: 'power4.inOut',
      }, '-=1.8')   // starts 200ms after wave 1 (2.0 - 1.8 = 0.2s offset)

      // Wave 3 — outer strips, 200ms after wave 2 starts, 1s duration
      tl.to([strips[0], strips[4]], {
        scaleY: 0.01, duration: 1.0,
        ease: 'power4.inOut',
      }, '-=0.8')   // starts 200ms after wave 2 (1.0 - 0.8 = 0.2s offset)

      // Tiny hold so onComplete fires at same wall-clock as preload (~4.4s)
      tl.to({}, { duration: 0.2 })
    }

    return () => { tlRef.current?.kill() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, template])

  if (!enabled || !portalTarget || !mounted) return null

  return createPortal(
    <>
      {template === 'framer-preload' && (
        <FramerPreloadSplash
          profile={profile}
          tagline={tagline}
          rootRef={fpRootRef}
          blobCRef={blobCRef}
          blobLRef={blobLRef}
          charsRef={charsRef}
          subRef={subRef}
        />
      )}
      {template === 'load-screen' && (
        <LoadScreenSplash
          rootRef={lsRootRef}
          stripsRef={stripsRef}
        />
      )}
    </>,
    portalTarget
  )
}
