'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react'

interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
  thumbnail_url?: string
}

export function InstagramPosts() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/instagram')
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.posts)
        } else {
          setError(data.message)
          setPosts(data.posts || []) // Use fallback posts if available
        }
      } catch (err) {
        console.error('Error fetching Instagram posts:', err)
        setError('Failed to load Instagram posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [])

  const formatCaption = (caption: string) => {
    if (!caption) return ''
    // Truncate caption to first 100 characters
    return caption.length > 100 ? caption.substring(0, 100) + '...' : caption
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-none flex items-center justify-center">
            <Instagram className="h-8 w-8 text-gray-400" />
          </div>
        ))}
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-8">
        <Instagram className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Unable to load Instagram posts</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group cursor-pointer"
        >
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={post.thumbnail_url || post.media_url}
              alt={post.caption || 'Instagram post'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Instagram className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">View on Instagram</span>
              </div>
            </div>

            {/* Media type indicator */}
            {post.media_type !== 'IMAGE' && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded">
                {post.media_type === 'VIDEO' ? (
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                  </div>
                ) : (
                  <div className="w-4 h-4 flex items-center justify-center text-xs">📷</div>
                )}
              </div>
            )}
          </div>
          
          {/* Post info */}
          <div className="mt-3">
            {post.caption && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                {formatCaption(post.caption)}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {formatDate(post.timestamp)}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
