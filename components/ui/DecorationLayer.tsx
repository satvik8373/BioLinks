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
    </div>
  )
}

export default DecorationLayer
