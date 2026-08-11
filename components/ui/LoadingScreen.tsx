'use client'

import React from 'react'

interface LoadingScreenProps {
  title?: string
  subtitle?: string
}

export default function LoadingScreen({
  title = 'Loading...',
}: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-0.5">
          <span className="font-black text-3xl tracking-tight text-slate-900">
            BioLinks
          </span>
          <span className="font-black text-2xl text-slate-900 leading-none select-none animate-pulse">*</span>
        </div>

        {/* Ultra-Minimal Aesthetic Loading Spinner */}
        <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    </div>
  )
}
