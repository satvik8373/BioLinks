import React from 'react'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

export default function Avatar({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback = 'user',
  className = '',
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  React.useEffect(() => {
    setImageError(false)
  }, [src])

  const isValidImageUrl = src && (src.startsWith('http') || src.startsWith('data:'))
  const shouldShowImage = isValidImageUrl && !imageError

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full flex items-center justify-center overflow-hidden flex-shrink-0
        bg-slate-800 text-white font-extrabold shadow-sm
        ${className}
      `}
    >
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
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