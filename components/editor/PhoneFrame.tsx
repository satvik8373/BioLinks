'use client'

import React from 'react'
import { Wifi, Battery, Signal } from 'lucide-react'

interface PhoneFrameProps {
  children: React.ReactNode
  className?: string
  width?: number
  height?: number
}

/**
 * 🏆 PhoneFrame — Responsive Device Viewport Frame
 * 
 * Simulates a sleek mobile device bezel with status bar indicators for visual editor previews.
 */
export default function PhoneFrame({
  children,
  className = '',
  width = 300,
  height = 660,
}: PhoneFrameProps) {
  return (
    <div
      className={`relative flex flex-col flex-shrink-0 overflow-hidden clay-preview-shell shadow-2xl transition-all duration-300 ${className}`}
      style={{
        width,
        height,
        maxHeight: 'calc(100vh - 130px)',
        borderRadius: 28,
        border: '6px solid rgba(15, 23, 42, 0.9)',
      }}
    >
      {/* Device Status Bar */}
      <div className="w-full bg-black/90 text-white text-[10px] font-semibold px-4 py-1.5 flex items-center justify-between z-20 flex-shrink-0 select-none">
        <span>9:41</span>
        {/* Speaker / Camera pill notch */}
        <div className="w-16 h-3 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800" />
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Signal className="w-2.5 h-2.5" />
          <Wifi className="w-2.5 h-2.5" />
          <Battery className="w-3 h-3" />
        </div>
      </div>

      {/* Viewport Content */}
      <div className="flex-1 w-full overflow-y-auto no-scrollbar relative">
        {children}
      </div>
    </div>
  )
}
