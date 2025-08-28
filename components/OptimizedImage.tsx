'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getOptimizedImageUrl } from '@/lib/image-utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  sizes?: string
  fill?: boolean
  style?: React.CSSProperties
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  sizes,
  fill = false,
  style,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(getOptimizedImageUrl(src))

  useEffect(() => {
    const optimizedUrl = getOptimizedImageUrl(src)
    setCurrentSrc(optimizedUrl)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }

  // Fallback image for errors
  const fallbackSrc = '/placeholder-watch.jpg'

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height, ...style }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={style}>
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        />
      )}
    </div>
  )
}

