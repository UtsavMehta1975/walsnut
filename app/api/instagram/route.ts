import { NextRequest, NextResponse } from 'next/server'

// Instagram Basic Display API configuration
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID

interface InstagramPost {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
  thumbnail_url?: string
}

export async function GET(request: NextRequest) {
  try {
    // Check if Instagram credentials are configured
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      return NextResponse.json({
        success: false,
        message: 'Instagram integration not configured',
        posts: []
      })
    }

    // Fetch Instagram posts using Basic Display API
    const response = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,media_type,media_url,permalink,caption,timestamp,thumbnail_url&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=12`
    )

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform the data to our format
    const posts: InstagramPost[] = data.data?.map((post: any) => ({
      id: post.id,
      media_type: post.media_type,
      media_url: post.media_url,
      permalink: post.permalink,
      caption: post.caption || '',
      timestamp: post.timestamp,
      thumbnail_url: post.thumbnail_url
    })) || []

    return NextResponse.json({
      success: true,
      posts: posts.slice(0, 6) // Limit to 6 posts for the grid
    })

  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    
    // Return mock data for development/fallback
    const mockPosts: InstagramPost[] = [
      {
        id: 'mock1',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: '#',
        caption: 'Discover our latest collection of premium timepieces',
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock2',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: '#',
        caption: 'Timeless elegance meets modern craftsmanship',
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock3',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: '#',
        caption: 'Spotted with Walnut - Customer showcase',
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock4',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: '#',
        caption: 'Behind the scenes of our watchmaking process',
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock5',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: '#',
        caption: 'New arrivals in our boutique',
        timestamp: new Date().toISOString()
      },
      {
        id: 'mock6',
        media_type: 'IMAGE',
        media_url: '/web-banner.png',
        permalink: '#',
        caption: 'Customer stories and testimonials',
        timestamp: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: false,
      message: 'Using fallback data',
      posts: mockPosts
    })
  }
}
