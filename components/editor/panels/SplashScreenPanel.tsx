'use client'

import React, { useEffect, useRef } from 'react'
import { ArrowLeft, RotateCw, Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import type { SplashScreenConfig } from '@/components/ui/WelcomeSplashScreen'

interface SplashScreenPanelProps {
  config: any
  updateConfig: (path: string | any[], value?: any) => void
  onBack?: () => void
}

// ─── Animated preview: Framer Preload ────────────────────────────────────────
function PreviewFramerPreload() {
  const cyanRef  = useRef<HTMLDivElement>(null)
  const limeRef  = useRef<HTMLDivElement>(null)
  const textRef  = useRef<HTMLDivElement>(null)
  const subRef   = useRef<HTMLParagraphElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    let start: number | null = null
    const ENTER = 1500, HOLD = 1800, EXIT = 1100
    const TOTAL = ENTER + HOLD + EXIT   // 4400ms — same as real animation

    const eio = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    function tick(ts: number) {
      if (!start) start = ts
      const e = (ts - start) % TOTAL
      const cyan = cyanRef.current, lime = limeRef.current
      const text = textRef.current, sub = subRef.current
      const inner = innerRef.current
      if (!cyan || !lime || !text || !inner) { raf = requestAnimationFrame(tick); return }

      if (e < 40) inner.style.transform = 'translateY(0%)'

      if (e < ENTER) {
        const p = eio(e / ENTER)
        cyan.style.transform  = `translateX(${(1 - p) * 120}px)`
        lime.style.transform  = `translateX(${(p - 1) * 120}px)`
        cyan.style.opacity    = String(p)
        lime.style.opacity    = String(p)
        text.style.opacity    = String(p)
        text.style.transform  = `translateY(${(1 - p) * 8}px)`
        if (sub) sub.style.opacity = String(p > 0.6 ? (p - 0.6) / 0.4 : 0)
      } else if (e < ENTER + HOLD) {
        cyan.style.transform = lime.style.transform = 'translateX(0px)'
        cyan.style.opacity = lime.style.opacity = text.style.opacity = '1'
        text.style.transform = 'translateY(0px)'
        if (sub) sub.style.opacity = '1'
        inner.style.transform = 'translateY(0%)'
      } else {
        inner.style.transform = `translateY(${-eio((e - ENTER - HOLD) / EXIT) * 100}%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
      <div ref={innerRef} className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div ref={cyanRef} style={{ position: 'absolute', bottom: '-24px', left: '-24px', width: '90px', height: '90px', background: 'radial-gradient(circle, rgb(89,187,213) 0%, transparent 70%)', filter: 'blur(18px)', opacity: 0 }} />
        <div ref={limeRef} style={{ position: 'absolute', top: '-24px', right: '-24px', width: '90px', height: '90px', background: 'radial-gradient(circle, rgb(206,255,113) 0%, transparent 70%)', filter: 'blur(18px)', opacity: 0 }} />
        <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none" style={{ opacity: 0 }}>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', fontWeight: 700, color: 'rgb(23,23,23)', letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>YOUR NAME</p>
          <p ref={subRef} style={{ fontFamily: 'monospace', fontSize: '8px', color: 'rgba(23,23,23,0.4)', margin: 0, opacity: 0 }}>We Craft Digital Experiences</p>
        </div>
      </div>
    </div>
  )
}

// ─── Animated preview: Load Screen ───────────────────────────────────────────
function PreviewLoadScreen() {
  const stripsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let raf: number
    let start: number | null = null
    // Timing mirrors the real GSAP animation exactly: 4400ms total
    // Hold 1000ms → Wave1 2000ms → Wave2 starts 200ms in → Wave3 starts 200ms in → 200ms tail
    const HOLD   = 1000  // full cover hold
    const W1     = 2000  // centre strip collapses
    const GAP    = 200   // delay between waves
    const W2     = 1000  // inner pair
    const W3     = 1000  // outer pair
    const TAIL   = 200   // matches the 0.2s hold at end of real timeline
    const TOTAL  = HOLD + W1 + TAIL + 600  // 4400ms total + 600ms pause before loop reset

    const eio = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    const clamp = (v: number) => Math.max(0, Math.min(1, v))

    function tick(ts: number) {
      if (!start) start = ts
      const e = (ts - start) % TOTAL
      const strips = stripsRef.current

      // Reset at loop start
      if (e < 40) {
        strips.forEach(s => { if (s) s.style.transform = 'scaleY(1)' })
      }

      // Wave 1: centre strip — starts after HOLD, runs for W1 (2000ms)
      const p1 = clamp((e - HOLD) / W1)
      if (strips[2]) strips[2].style.transform = `scaleY(${1 - eio(p1) * 0.99})`

      // Wave 2: inner neighbours — start GAP(200ms) after wave 1, run W2(1000ms)
      const p2 = clamp((e - HOLD - GAP) / W2)
      ;[1, 3].forEach(i => { if (strips[i]) strips[i].style.transform = `scaleY(${1 - eio(p2) * 0.99})` })

      // Wave 3: outer strips — start GAP after wave 2, run W3(1000ms)
      const p3 = clamp((e - HOLD - GAP - GAP) / W3)
      ;[0, 4].forEach(i => { if (strips[i]) strips[i].style.transform = `scaleY(${1 - eio(p3) * 0.99})` })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const POSITIONS = ['0%', '20%', '40%', '60%', '80%']

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
      {POSITIONS.map((left, i) => (
        <div
          key={i}
          ref={el => { stripsRef.current[i] = el }}
          style={{
            position: 'absolute', top: 0, bottom: 0,
            left, width: '20%',
            backgroundColor: 'rgb(255,47,0)',
            boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.15)',
            transformOrigin: 'top center',
          }}
        />
      ))}
    </div>
  )
}

// ─── Template card ────────────────────────────────────────────────────────────
const TEMPLATES: Array<{
  id: NonNullable<SplashScreenConfig['template']>
  label: string
  sub: string
  Preview: React.FC
}> = [
  {
    id: 'framer-preload',
    label: 'Framer Preload',
    sub: 'Chars · orbs · curtain exit',
    Preview: PreviewFramerPreload,
  },
  {
    id: 'load-screen',
    label: 'Load Screen',
    sub: '5 strips · center-out wipe',
    Preview: PreviewLoadScreen,
  },
]

function TemplateCard({
  item,
  selected,
  onClick,
}: {
  item: typeof TEMPLATES[number]
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 transition-all cursor-pointer text-left ${
        selected
          ? 'border-slate-900 bg-slate-50 shadow-xs'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Square animated preview — fixed aspect ratio like corner/shadow cards */}
      <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: '1 / 1' }}>
        <item.Preview />
      </div>

      {/* Label */}
      <div className="px-2.5 py-2 bg-white">
        <p className="text-[11px] font-extrabold text-slate-900 leading-tight">{item.label}</p>
        <p className="text-[9px] text-slate-500 font-medium mt-0.5 leading-tight">{item.sub}</p>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

// ─── Panel ────────────────────────────────────────────────────────────────────
export default function SplashScreenPanel({ config, updateConfig, onBack }: SplashScreenPanelProps) {
  const splash: SplashScreenConfig = config.splashScreen || {}
  const enabled   = splash.enabled   ?? false
  const template  = splash.template  ?? 'framer-preload'
  const tagline   = splash.tagline   ?? ''
  const frequency = splash.frequency ?? 'always'

  function selectTemplate(id: SplashScreenConfig['template']) {
    updateConfig('splashScreen.template', id)
  }

  function replay() {
    updateConfig('splashScreen.enabled', false)
    setTimeout(() => updateConfig('splashScreen.enabled', true), 50)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        {onBack && (
          <Button type="button" variant="ghost" size="icon" onClick={onBack} title="Back to Appearance">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Splash Screen</h2>
          <p className="text-xs text-slate-500 font-medium">Animated intro shown when visitors open your page.</p>
        </div>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/90 rounded-2xl">
        <div className="space-y-0.5">
          <label className="text-sm font-bold text-slate-900 block">Enable Splash Screen</label>
          <p className="text-xs text-slate-500 font-medium">Show animated intro when visitors open your link.</p>
        </div>
        <Toggle
          checked={enabled}
          onChange={(v) => updateConfig('splashScreen.enabled', v)}
          variant="dark"
          size="md"
        />
      </div>

      {enabled && (
        <div className="space-y-6">

          {/* Animation style */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Animation Style
              </label>
              <button
                type="button"
                onClick={replay}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3 h-3" /> Replay
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES.map(t => (
                <TemplateCard
                  key={t.id}
                  item={t}
                  selected={template === t.id}
                  onClick={() => selectTemplate(t.id)}
                />
              ))}
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Input
              label="Tagline (optional)"
              type="text"
              value={tagline}
              onChange={(e) => updateConfig('splashScreen.tagline', e.target.value)}
              placeholder="e.g. Welcome to my official page ✨"
            />
            <p className="text-xs text-slate-500 font-medium">Appears below your name during the intro.</p>
          </div>

          {/* Frequency */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Show Frequency
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { id: 'always',  label: 'Every Visit',    sub: 'Always plays on load' },
                { id: 'session', label: 'Once / Session', sub: 'Skipped after first view' },
              ] as const).map(({ id, label, sub }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => updateConfig('splashScreen.frequency', id)}
                  className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                    frequency === id
                      ? 'border-slate-900 bg-slate-50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {frequency === id && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                  <p className="text-xs font-extrabold text-slate-900 leading-tight pr-5">{label}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">{sub}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
