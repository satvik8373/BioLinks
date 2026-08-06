import React from 'react'

export interface BaseAvatarProps {
  src?: string
  alt?: string
  size?: number
  fallbackSvg?: React.ReactNode
  className?: string
}

export const CircleAvatar: React.FC<BaseAvatarProps> = ({ src, alt = 'Avatar', size = 150, fallbackSvg, className = '' }) => (
  <div className={`clay-avatar ${className}`} style={{ width: size, height: size }}>
    <div className="clay-avatar-inner">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
      ) : fallbackSvg ? (
        fallbackSvg
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      )}
    </div>
  </div>
)

export const RoundedAvatar: React.FC<BaseAvatarProps> = ({ src, alt = 'Avatar', size = 150, fallbackSvg, className = '' }) => (
  <div className={`rounded-3xl p-1 bg-white shadow-md overflow-hidden ${className}`} style={{ width: size, height: size }}>
    <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-gray-800 text-gray-300">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : fallbackSvg ? (
        fallbackSvg
      ) : (
        <svg className="w-2/3 h-2/3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      )}
    </div>
  </div>
)

export const BlobAvatar: React.FC<BaseAvatarProps> = ({ src, alt = 'Avatar', size = 150, fallbackSvg, className = '' }) => (
  <div
    className={`p-1 bg-white shadow-lg overflow-hidden ${className}`}
    style={{ width: size, height: size, borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%' }}
  >
    <div
      className="w-full h-full overflow-hidden flex items-center justify-center bg-gray-900 text-white"
      style={{ borderRadius: '45% 55% 60% 40% / 50% 45% 55% 50%' }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : fallbackSvg ? (
        fallbackSvg
      ) : (
        <svg className="w-2/3 h-2/3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      )}
    </div>
  </div>
)

export const HexagonAvatar: React.FC<BaseAvatarProps> = ({ src, alt = 'Avatar', size = 150, fallbackSvg, className = '' }) => (
  <div
    className={`p-1 bg-white shadow-lg ${className}`}
    style={{ width: size, height: size, clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
  >
    <div
      className="w-full h-full flex items-center justify-center bg-gray-900 text-white"
      style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : fallbackSvg ? (
        fallbackSvg
      ) : (
        <svg className="w-2/3 h-2/3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z"/></svg>
      )}
    </div>
  </div>
)
