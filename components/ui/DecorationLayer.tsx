import React from 'react'

export interface DecorationLayerProps {
  decorations?: Array<'blobs' | 'noise' | 'glass-spheres' | 'particles' | 'mesh' | 'stars' | 'aurora' | string>
  blobColorLeft?: string
  blobColorRight?: string
  className?: string
}

export const DecorationLayer: React.FC<DecorationLayerProps> = ({
  decorations = [],
  blobColorLeft = '#ffffff',
  blobColorRight = '#ffffff',
  className = ''
}) => {
  if (!decorations || decorations.length === 0) return null

  const hasBlobs = decorations.includes('blobs')
  const hasNoise = decorations.includes('noise')
  const hasGlassSpheres = decorations.includes('glass-spheres')
  const hasMesh = decorations.includes('mesh')
  const hasStars = decorations.includes('stars')

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* 1. Organic Corner Blobs */}
      {hasBlobs && (
        <>
          <div
            className="absolute -top-[40px] -left-[60px] w-[200px] h-[220px] opacity-90 transition-all duration-700"
            style={{
              backgroundColor: blobColorLeft,
              borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%',
              animation: 'blobFloat 12s ease-in-out infinite alternate'
            }}
          />
          <div
            className="absolute -top-[30px] -right-[50px] w-[170px] h-[150px] opacity-85 transition-all duration-700"
            style={{
              backgroundColor: blobColorRight,
              borderRadius: '40% 60% 55% 45% / 55% 40% 60% 45%',
              animation: 'blobFloat 14s ease-in-out infinite alternate-reverse'
            }}
          />
        </>
      )}

      {/* 2. Floating Glass Spheres */}
      {hasGlassSpheres && (
        <>
          <div className="absolute top-1/4 -left-12 w-36 h-36 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl animate-pulse" />
          <div className="absolute bottom-1/3 -right-10 w-28 h-28 rounded-full bg-white/15 backdrop-blur-lg border border-white/25 shadow-lg" />
        </>
      )}

      {/* 3. Ambient Mesh Backdrop */}
      {hasMesh && (
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.25) 0%, transparent 50%)'
          }}
        />
      )}

      {/* 4. Film Grain Noise Overlay */}
      {hasNoise && (
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* 5. Ambient Stars */}
      {hasStars && (
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      )}

      {/* 6. Carved Leaf Twig Decoration */}
      {decorations.includes('leaf') && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-10 flex items-center justify-center opacity-25 mix-blend-multiply pointer-events-none select-none">
          <svg viewBox="0 0 120 40" className="w-full h-full" style={{ filter: 'drop-shadow(0 1px 0.5px rgba(255,255,255,0.6))' }}>
            {/* Stem */}
            <path d="M15 20 Q60 16 105 20" stroke="#2B1F16" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Top Leaves */}
            <path d="M35 18 C40 8, 50 10, 52 17 C42 19, 37 20, 35 18 Z" fill="#2B1F16" />
            <path d="M55 17 C60 7, 70 9, 72 16 C62 18, 57 19, 55 17 Z" fill="#2B1F16" />
            <path d="M75 17 C80 7, 90 9, 92 16 C82 18, 77 19, 75 17 Z" fill="#2B1F16" />
            {/* Bottom Leaves */}
            <path d="M30 22 C35 32, 45 30, 47 23 C37 21, 32 20, 30 22 Z" fill="#2B1F16" />
            <path d="M50 21 C55 31, 65 29, 67 22 C57 20, 52 19, 50 21 Z" fill="#2B1F16" />
            <path d="M70 21 C75 31, 85 29, 87 22 C77 20, 72 19, 70 21 Z" fill="#2B1F16" />
            {/* Tip Leaves */}
            <path d="M92 19 C97 13, 105 16, 107 20 C101 22, 96 22, 92 19 Z" fill="#2B1F16" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default DecorationLayer
