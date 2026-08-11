import React, { useState } from 'react'
import Image from 'next/image'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  style?: React.CSSProperties
  fallback?: string
}

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  className = '',
  style,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false)

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  }

  const isValidImageUrl = src && (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    src.startsWith('/')
  )

  const shouldShowImage = isValidImageUrl && !imageError

  return (
    <div
      style={style}
      className={`
        ${sizes[size]}
        rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 relative
        bg-slate-800 text-white font-extrabold shadow-sm
        ${className}
      `}
    >
      {shouldShowImage ? (
        <Image
          src={src}
          alt={alt}
          unoptimized
          fill
          sizes="96px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : src && !isValidImageUrl ? (
        <span className="font-bold">{src}</span>
      ) : (
        <User className="w-[55%] h-[55%]" />
      )}
    </div>
  )
}