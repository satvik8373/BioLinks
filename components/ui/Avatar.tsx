import React from 'react'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm', 
  lg: 'w-12 h-12 text-lg',
  xl: 'w-20 h-20 text-2xl'
}

export default function Avatar({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  fallback = 'user',
  className = ''
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  // Reset error state when src changes
  React.useEffect(() => {
    setImageError(false)
    setImageLoaded(false)
  }, [src])

  const isDataUrl = src && src.startsWith('data:')
  const isValidImageUrl = src && (src.startsWith('http') || isDataUrl)
  const shouldShowImage = isValidImageUrl && !imageError

  return (
    <div className={`
      ${sizeClasses[size]} 
      bg-neo-pink 
      border-2 
      border-neo-black 
      rounded-full 
      flex 
      items-center 
      justify-center 
      overflow-hidden 
      ${className}
    `}>
      {shouldShowImage ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageError ? 'none' : 'block' }}
        />
      ) : null}
      
      {(!shouldShowImage || imageError) && (
        <>
          {src && !isValidImageUrl ? (
            <span className="font-bold">{src}</span>
          ) : (
            <User className="w-full h-full p-1" />
          )}
        </>
      )}
    </div>
  )
}