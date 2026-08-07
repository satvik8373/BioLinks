'use client'

import React from 'react'
import Avatar from '@/components/ui/Avatar'
import { Zap, ChevronRight, Sticker, Asterisk } from 'lucide-react'

interface Props {
  config: any
  bgSummary: string
  fontSummary: string
  buttonSummary: string
  themeSummary: string
  onNavigate: (tab: string) => void
}

interface DesignRowProps {
  id: string
  label: string
  summary?: string
  thumbnail: React.ReactNode
  showZap?: boolean
  onNavigate: (tab: string) => void
}

// Hoisted outside the parent to prevent remounting on every render
function DesignRow({ id, label, summary, thumbnail, showZap = false, onNavigate }: DesignRowProps) {
  return (
    <button
      onClick={() => onNavigate(id)}
      className="w-full clay-design-row px-4 py-3.5 flex items-center gap-3.5 text-left group"
    >
      {/* Left thumbnail squircle */}
      <div className="w-[48px] h-[48px] rounded-[16px] overflow-hidden flex-shrink-0 flex items-center justify-center"
        style={{ boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.8), inset 0 -1.5px 0 rgba(148,163,184,0.12), 0 2px 0 rgba(148,163,184,0.18), 0 3px 8px rgba(15,23,42,0.07)', border: '1.5px solid rgba(148,163,184,0.2)' }}>
        {thumbnail}
      </div>

      {/* Label */}
      <span className="flex-1 text-[13px] font-extrabold text-slate-800 tracking-tight">{label}</span>

      {/* Right side controls (Zap badge, Summary text, Chevron) */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {showZap && (
          <div className="w-6 h-6 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #6366F1)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 0 #4F46E5, 0 3px 8px rgba(124,58,237,0.30)' }}>
            <Zap className="w-3 h-3 fill-white text-white" />
          </div>
        )}
        {summary && (
          <span className="text-[11px] font-bold text-slate-400">{summary}</span>
        )}
        <div className="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:translate-x-0.5"
          style={{ background: 'rgba(148,163,184,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
          <ChevronRight className="w-3 h-3 text-slate-400 stroke-[2.5]" />
        </div>
      </div>
    </button>
  )
}

export default function DesignIndexPanel({
  config,
  bgSummary,
  fontSummary,
  buttonSummary,
  themeSummary,
  onNavigate,
}: Props) {
  const c = config.theme.colors

  // Background style for wallpaper/theme thumbnail
  const bgType = c.backgroundType || (c.backgroundImage ? 'image' : 'fill')

  let cardBgStyle: React.CSSProperties = {}
  if (bgType === 'image' && c.backgroundImage) {
    cardBgStyle = {
      backgroundImage: `url(${c.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  } else if (c.backgroundMesh) {
    cardBgStyle = { background: c.backgroundMesh }
  } else if (c.backgroundGradient) {
    cardBgStyle = { background: `linear-gradient(135deg, ${c.backgroundGradient.from}, ${c.backgroundGradient.to})` }
  } else {
    cardBgStyle = { backgroundColor: c.background || '#FFFFFF' }
  }

  return (
    <div className="space-y-3">
      {/* ── Theme (standalone top card) ── */}
      <DesignRow
        id="themes"
        label="Theme"
        summary={themeSummary}
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full" style={cardBgStyle}>
            <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-4 h-4 rounded-full opacity-60" style={{ backgroundColor: c.profileText || '#fff' }} />
              <div className="w-6 h-1 rounded-full opacity-80" style={{ backgroundColor: c.buttonDefault || '#fff' }} />
              <div className="w-4 h-1 rounded-full opacity-50" style={{ backgroundColor: c.buttonDefault || '#fff' }} />
            </div>
          </div>
        }
      />

      {/* ── Section Title ── */}
      <div className="pt-2 pb-1">
        <h2 className="text-base font-bold text-slate-900 px-1">Customize</h2>
      </div>

      {/* ── 1. Header ── */}
      <DesignRow
        id="profile"
        label="Header"
        summary={(config.profile.headerLayout || 'classic').charAt(0).toUpperCase() + (config.profile.headerLayout || 'classic').slice(1)}
        showZap={true}
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full bg-slate-950 flex items-center justify-center p-0.5">
            <Avatar src={config.profile.avatar} size="sm" fallback="user" />
          </div>
        }
      />

      {/* ── 2. Wallpaper ── */}
      <DesignRow
        id="background"
        label="Wallpaper"
        summary={bgSummary}
        showZap={true}
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full rounded-xl" style={cardBgStyle} />
        }
      />

      {/* ── 3. Buttons ── */}
      <DesignRow
        id="buttons"
        label="Buttons"
        summary={buttonSummary}
        showZap={true}
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <div
              className="w-7 h-7 rounded-xl border border-slate-200/90 bg-white shadow-xs"
              style={{
                backgroundColor: c.buttonDefault || '#ffffff',
                borderRadius: `${Math.min((config.theme.buttonStyle?.borderRadius ?? 12) / 2, 12)}px`,
              }}
            />
          </div>
        }
      />

      {/* ── 4. Text ── */}
      <DesignRow
        id="fonts"
        label="Text"
        summary={fontSummary}
        showZap={true}
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full bg-slate-100/70 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-800" style={{ fontFamily: config.theme.fonts?.body }}>Aa</span>
          </div>
        }
      />

      {/* ── 5. Colors ── */}
      <DesignRow
        id="colors"
        label="Colors"
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-[34px] h-[34px] rounded-xl border border-slate-200 bg-white shadow-xs" />
        }
      />

      {/* ── 6. Stickers ── */}
      <DesignRow
        id="stickers"
        label="Stickers"
        summary="Decorate your page"
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Sticker className="w-5 h-5" />
          </div>
        }
      />

      {/* ── 7. Footer ── */}
      <DesignRow
        id="footer"
        label="Footer"
        onNavigate={onNavigate}
        thumbnail={
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-700">
            <Asterisk className="w-5 h-5" />
          </div>
        }
      />
    </div>
  )
}
